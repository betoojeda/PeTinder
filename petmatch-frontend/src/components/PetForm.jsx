import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogBreeds } from '../constants/breeds';
import { uploadPetPhoto } from '../services/api'; // Importar la función de subida
import toast from 'react-hot-toast';

const PetForm = ({ pet, onClose, onSaveSuccess }) => { // Añadir onSaveSuccess
  const { user } = useAuth(); // Usar user para obtener el ID del propietario
  const [formData, setFormData] = useState({
    name: '', type: 'Perro', breed: '', age: '', description: '',
    photoUrls: [], // Cambiado a array
    size: '', gender: '', energyLevel: '', temperament: '',
    compatibleWithDogs: false, compatibleWithCats: false, compatibleWithChildren: false,
    specialNeeds: '', trainingLevel: '', vaccinated: false, dewormed: false,
    sterilized: false, history: '', ownerId: user?.id || '', // Asignar ownerId por defecto
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '', type: pet.type || 'Perro', breed: pet.breed || '',
        age: pet.age || '', description: pet.description || '', photoUrls: pet.photoUrls || [],
        size: pet.size || '', gender: pet.gender || '', energyLevel: pet.energyLevel || '',
        temperament: pet.temperament || '', compatibleWithDogs: pet.compatibleWithDogs || false,
        compatibleWithCats: pet.compatibleWithCats || false, compatibleWithChildren: pet.compatibleWithChildren || false,
        specialNeeds: pet.specialNeeds || '', trainingLevel: pet.trainingLevel || '',
        vaccinated: pet.vaccinated || false, dewormed: pet.dewormed || false,
        sterilized: pet.sterilized || false, history: pet.history || '',
        ownerId: pet.ownerId || user?.id || '',
      });
      // Si la mascota ya tiene URLs, las usamos como previews iniciales
      setFilePreviews(pet.photoUrls || []);
    } else {
      // Para nuevas mascotas, asegurar que ownerId esté establecido
      setFormData(prev => ({ ...prev, ownerId: user?.id || '' }));
    }
  }, [pet, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // Generar vistas previas para los archivos seleccionados
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading(pet ? 'Guardando cambios...' : 'Creando mascota...');

    try {
      const url = pet ? `/api/pets/${pet.id}` : '/api/pets';
      const method = pet ? 'PUT' : 'POST';

      // 1. Crear/Actualizar la mascota (sin las nuevas fotos aún)
      const petDataToSave = { ...formData };
      // Si estamos actualizando, las photoUrls existentes ya están en formData.
      // Si es nueva, photoUrls será un array vacío inicialmente.
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petDataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la mascota');
      }

      const savedPet = await response.json();
      let finalPet = savedPet;

      // 2. Subir las nuevas fotos si hay
      if (selectedFiles.length > 0) {
        toast.loading('Subiendo fotos...', { id: 'uploading-photos' });
        for (const file of selectedFiles) {
          try {
            finalPet = await uploadPetPhoto(savedPet.id, file);
            // Actualizar formData con las nuevas URLs después de cada subida
            setFormData(prev => ({ ...prev, photoUrls: finalPet.photoUrls }));
          } catch (uploadError) {
            toast.error(`Error al subir una foto: ${file.name}`);
            console.error(`Error al subir ${file.name}:`, uploadError);
            // Continuar con las otras fotos aunque una falle
          }
        }
        toast.success('Fotos subidas correctamente!', { id: 'uploading-photos' });
      }

      toast.success(pet ? 'Mascota actualizada con éxito!' : 'Mascota creada con éxito!');
      onSaveSuccess(finalPet); // Llamar a la función de éxito con la mascota final
      onClose();
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error inesperado.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      toast.dismiss(); // Cerrar cualquier toast de carga restante
    }
  };

  const renderBreedField = () => {
    if (formData.type === 'Perro') {
      return (
        <label>
          Raza:
          <select name="breed" value={formData.breed} onChange={handleChange} required>
            <option value="">Selecciona una raza</option>
            {dogBreeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
            <option value="Otra">Otra (especificar)</option>
          </select>
        </label>
      );
    }
    return (
      <label>
        Raza/Tipo:
        <input type="text" name="breed" value={formData.breed} onChange={handleChange} required />
      </label>
    );
  };

  return (
    <div className="pet-form-container" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
      <h3>{pet ? 'Editar Mascota' : 'Añadir Nueva Mascota'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <label>Nombre: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Especie:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        {renderBreedField()}
        <label>Edad: <input type="number" name="age" value={formData.age} onChange={handleChange} required /></label>
        <label>Género:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </label>
        <label>Tamaño:
            <select name="size" value={formData.size} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
            </select>
        </label>
        <label>Nivel de Energía:
            <select name="energyLevel" value={formData.energyLevel} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
            </select>
        </label>
        <label>Dueño ID: <input type="number" name="ownerId" value={formData.ownerId} onChange={handleChange} disabled={!!pet} required={!pet} /></label>
        
        {/* Campo de subida de fotos */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Fotos de la Mascota:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {filePreviews.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
            ))}
          </div>
        </div>

        <label style={{ gridColumn: '1 / -1' }}>Descripción: <textarea name="description" value={formData.description} onChange={handleChange}></textarea></label>
        
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px' }}>
            <label><input type="checkbox" name="compatibleWithDogs" checked={formData.compatibleWithDogs} onChange={handleChange} /> Compatible con perros</label>
            <label><input type="checkbox" name="compatibleWithCats" checked={formData.compatibleWithCats} onChange={handleChange} /> Compatible con gatos</label>
            <label><input type="checkbox" name="compatibleWithChildren" checked={formData.compatibleWithChildren} onChange={handleChange} /> Compatible con niños</label>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px' }}>
            <label><input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} /> Vacunado</label>
            <label><input type="checkbox" name="dewormed" checked={formData.dewormed} onChange={handleChange} /> Desparasitado</label>
            <label><input type="checkbox" name="sterilized" checked={formData.sterilized} onChange={handleChange} /> Esterilizado</label>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="cancel-button" disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (pet ? 'Guardar Cambios' : 'Añadir Mascota')}</button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
