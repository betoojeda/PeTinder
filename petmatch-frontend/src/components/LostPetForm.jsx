import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { createLostPetPost } from '../services/lostPetsService';
import { uploadPetPhoto } from '../services/api';
import toast from 'react-hot-toast';
import LoadingModal from './LoadingModal';
import './LostPetForm.css'; // Importar el nuevo CSS

const LocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LostPetForm = ({ onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    petName: '',
    description: '',
    location: '',
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = (latlng) => {
    setFormData(prev => ({ ...prev, location: `${latlng.lat}, ${latlng.lng}` }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor, sube una foto de la mascota.');
      return;
    }
    if (!formData.location) {
      toast.error('Por favor, selecciona una ubicación en el mapa.');
      return;
    }
    setIsSubmitting(true);

    try {
      const newPost = await createLostPetPost(formData);
      const finalPost = await uploadPetPhoto(newPost.id, file, '/lost-pets');
      toast.success('Aviso publicado con éxito.');
      onSaveSuccess(finalPost);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingModal message="Publicando aviso..." />}
      <div className="form-container lost-pet-form-container">
        <h2>Reportar Mascota Perdida</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Nombre de la Mascota</label>
            <input type="text" name="petName" value={formData.petName} onChange={handleChange} className="form-input" required />
          </div>
          
          <div className="form-row">
            <label>Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" placeholder="Describe a la mascota, ropa que llevaba, etc." rows="4" required></textarea>
          </div>
          
          <div className="form-row">
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" required />
          </div>
          
          <div className="form-row map-row">
            <label>Última ubicación conocida (haz clic en el mapa)</label>
            <div className="map-container-wrapper">
              <MapContainer center={[19.4326, -99.1332]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationChange={handleLocationChange} />
              </MapContainer>
            </div>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input location-input" placeholder="Coordenadas seleccionadas" readOnly required />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-secondary" disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>Publicar Aviso</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LostPetForm;
