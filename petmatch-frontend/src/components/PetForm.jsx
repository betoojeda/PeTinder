import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogBreeds } from '../constants/breeds'; // Importar la lista de razas

const PetForm = ({ pet, onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '', type: 'Perro', breed: '', age: '', description: '',
    photoUrl: '', size: '', gender: '', energyLevel: '', temperament: '',
    compatibleWithDogs: false, compatibleWithCats: false, compatibleWithChildren: false,
    specialNeeds: '', trainingLevel: '', vaccinated: false, dewormed: false,
    sterilized: false, history: '', ownerId: '',
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '', type: pet.type || 'Perro', breed: pet.breed || '',
        age: pet.age || '', description: pet.description || '', photoUrl: pet.photoUrl || '',
        size: pet.size || '', gender: pet.gender || '', energyLevel: pet.energyLevel || '',
        temperament: pet.temperament || '', compatibleWithDogs: pet.compatibleWithDogs || false,
        compatibleWithCats: pet.compatibleWithCats || false, compatibleWithChildren: pet.compatibleWithChildren || false,
        specialNeeds: pet.specialNeeds || '', trainingLevel: pet.trainingLevel || '',
        vaccinated: pet.vaccinated || false, dewormed: pet.dewormed || false,
        sterilized: pet.sterilized || false, history: pet.history || '',
        ownerId: pet.ownerId || '',
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = pet ? `/api/pets/${pet.id}` : '/api/pets';
    const method = pet ? 'PUT' : 'POST';

    try {
      // Usar apiClient en lugar de fetch para consistencia
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar la mascota');
      onClose();
    } catch (error) {
      console.error(error);
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
        <label>URL de la Foto: <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} /></label>
        <label>Dueño ID: <input type="number" name="ownerId" value={formData.ownerId} onChange={handleChange} disabled={!!pet} required={!pet} /></label>
        
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
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
            <button type="submit" className="submit-button">{pet ? 'Guardar Cambios' : 'Añadir Mascota'}</button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
