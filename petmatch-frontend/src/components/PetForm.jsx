import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogBreeds } from '../constants/breeds';
import { uploadPetPhoto } from '../services/api';
import toast from 'react-hot-toast';
import './PetForm.css'; // Aún lo necesitamos para estilos específicos

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

  const renderField = (label, name, type = 'text', options = []) => (
    <div className="form-row">
      <label>{label}</label>
      {type === 'select' ? (
        <select name={name} value={formData[name]} onChange={handleChange} className="form-input">
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={formData[name]} onChange={handleChange} className="form-input"></textarea>
      ) : (
        <input type={type} name={name} value={formData[name]} onChange={handleChange} className="form-input" />
      )}
    </div>
  );

  const renderCheckboxGroup = (title, fields) => (
    <div className="form-row">
      <label>{title}</label>
      <div className="checkbox-group">
        {fields.map(field => (
          <label key={field.name} className="checkbox-label">
            <input type="checkbox" name={field.name} checked={formData[field.name]} onChange={handleChange} />
            {field.label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <h2>{pet ? 'Editar Mascota' : 'Añadir Nueva Mascota'}</h2>
      <form onSubmit={handleSubmit}>
        
        <h3>Información Básica</h3>
        {renderField('Nombre', 'name', 'text')}
        {renderField('Especie', 'type', 'select', [
          { value: 'Perro', label: 'Perro' },
          { value: 'Gato', label: 'Gato' },
          { value: 'Otro', label: 'Otro' },
        ])}
        <div className="form-row">
          <label>Raza</label>
          {formData.type === 'Perro' ? (
            <select name="breed" value={formData.breed} onChange={handleChange} required className="form-input">
              <option value="">Selecciona una raza</option>
              {dogBreeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
              <option value="Otra">Otra (especificar)</option>
            </select>
          ) : (
            <input type="text" name="breed" value={formData.breed} onChange={handleChange} required className="form-input" />
          )}
        </div>
        {renderField('Edad', 'age', 'number')}
        {renderField('Género', 'gender', 'select', [
          { value: '', label: 'Selecciona' },
          { value: 'Macho', label: 'Macho' },
          { value: 'Hembra', label: 'Hembra' },
        ])}
        {renderField('Tamaño', 'size', 'select', [
          { value: '', label: 'Selecciona' },
          { value: 'Pequeño', label: 'Pequeño' },
          { value: 'Mediano', label: 'Mediano' },
          { value: 'Grande', label: 'Grande' },
        ])}

        <h3>Personalidad y Comportamiento</h3>
        {renderField('Nivel de Energía', 'energyLevel', 'select', [
          { value: '', label: 'Selecciona' },
          { value: 'Bajo', label: 'Bajo' },
          { value: 'Medio', label: 'Medio' },
          { value: 'Alto', label: 'Alto' },
        ])}
        {renderCheckboxGroup('Compatibilidad', [
          { name: 'compatibleWithDogs', label: 'Con perros' },
          { name: 'compatibleWithCats', label: 'Con gatos' },
          { name: 'compatibleWithChildren', label: 'Con niños' },
        ])}
        
        <h3>Salud</h3>
        {renderCheckboxGroup('Estado de Salud', [
          { name: 'vaccinated', label: 'Vacunado' },
          { name: 'dewormed', label: 'Desparasitado' },
          { name: 'sterilized', label: 'Esterilizado' },
        ])}

        <h3>Fotos y Descripción</h3>
        <div className="form-row">
          <label>Fotos de la Mascota</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="form-input" />
          <div className="image-previews">
            {filePreviews.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>
        {renderField('Descripción', 'description', 'textarea')}

        <div className="form-actions">
          <button type="button" onClick={onClose} className="button-secondary" disabled={isSubmitting}>Cancelar</button>
          <button type="submit" className="button-primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (pet ? 'Guardar Cambios' : 'Añadir Mascota')}</button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
