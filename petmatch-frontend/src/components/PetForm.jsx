import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogBreeds } from '../constants/breeds';
import { uploadPetPhoto } from '../services/api';
import toast from 'react-hot-toast';
import './PetForm.css';

const PetForm = ({ pet, onClose, onSaveSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', type: 'Perro', breed: '', age: '', description: '',
    photoUrls: [], size: '', gender: '', energyLevel: '', temperament: '',
    compatibleWithDogs: false, compatibleWithCats: false, compatibleWithChildren: false,
    specialNeeds: '', trainingLevel: '', vaccinated: false, dewormed: false,
    sterilized: false, history: '', ownerId: user?.id || '',
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
      setFilePreviews(pet.photoUrls || []);
    } else {
      setFormData(prev => ({ ...prev, ownerId: user?.id || '' }));
    }
  }, [pet, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
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

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la mascota');
      }

      const savedPet = await response.json();
      let finalPet = savedPet;

      if (selectedFiles.length > 0) {
        toast.loading('Subiendo fotos...', { id: 'uploading-photos' });
        for (const file of selectedFiles) {
          try {
            finalPet = await uploadPetPhoto(savedPet.id, file);
            setFormData(prev => ({ ...prev, photoUrls: finalPet.photoUrls }));
          } catch (uploadError) {
            toast.error(`Error al subir una foto: ${file.name}`);
          }
        }
        toast.success('Fotos subidas correctamente!', { id: 'uploading-photos' });
      }

      toast.success(pet ? 'Mascota actualizada con éxito!' : 'Mascota creada con éxito!');
      onSaveSuccess(finalPet);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  const renderBreedField = () => {
    if (formData.type === 'Perro') {
      return (
        <div className="input-group">
          <label>Raza</label>
          <select name="breed" value={formData.breed} onChange={handleChange} required>
            <option value="">Selecciona una raza</option>
            {dogBreeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
            <option value="Otra">Otra (especificar)</option>
          </select>
        </div>
      );
    }
    return (
      <div className="input-group">
        <label>Raza/Tipo</label>
        <input type="text" name="breed" value={formData.breed} onChange={handleChange} required />
      </div>
    );
  };

  return (
    <div className="form-card pet-form"> {/* Usar la clase genérica */}
      <h3>{pet ? 'Editar Mascota' : 'Añadir Nueva Mascota'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Especie</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {renderBreedField()}
          <div className="input-group">
            <label>Edad</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Género</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecciona</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div className="input-group">
            <label>Tamaño</label>
              <select name="size" value={formData.size} onChange={handleChange}>
                  <option value="">Selecciona</option>
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
              </select>
          </div>
          <div className="input-group">
            <label>Nivel de Energía</label>
              <select name="energyLevel" value={formData.energyLevel} onChange={handleChange}>
                  <option value="">Selecciona</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
              </select>
          </div>
        </div>
        
        <div className="input-group full-width">
          <label>Fotos de la Mascota</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="image-previews">
            {filePreviews.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>

        <div className="input-group full-width">
          <label>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        
        <div className="checkbox-group full-width">
            <label><input type="checkbox" name="compatibleWithDogs" checked={formData.compatibleWithDogs} onChange={handleChange} /> Compatible con perros</label>
            <label><input type="checkbox" name="compatibleWithCats" checked={formData.compatibleWithCats} onChange={handleChange} /> Compatible con gatos</label>
            <label><input type="checkbox" name="compatibleWithChildren" checked={formData.compatibleWithChildren} onChange={handleChange} /> Compatible con niños</label>
        </div>
        <div className="checkbox-group full-width">
            <label><input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} /> Vacunado</label>
            <label><input type="checkbox" name="dewormed" checked={formData.dewormed} onChange={handleChange} /> Desparasitado</label>
            <label><input type="checkbox" name="sterilized" checked={formData.sterilized} onChange={handleChange} /> Esterilizado</label>
        </div>

        <div className="form-actions full-width">
            <button type="button" onClick={onClose} className="cancel-button" disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="main-button" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (pet ? 'Guardar Cambios' : 'Añadir Mascota')}</button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
