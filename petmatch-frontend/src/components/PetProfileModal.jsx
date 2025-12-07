import React from 'react';
import PetImageGallery from './PetImageGallery';
import './PetProfileModal.css'; // Crearemos este CSS

const PetProfileModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2>{pet.name}, {pet.age}</h2>
          <p>{pet.breed} - {pet.type}</p>
        </div>

        <div className="modal-body">
          <PetImageGallery images={pet.photoUrls} />

          <div className="pet-details-grid">
            <div className="detail-item"><strong>Género:</strong> {pet.gender}</div>
            <div className="detail-item"><strong>Tamaño:</strong> {pet.size}</div>
            <div className="detail-item"><strong>Nivel de Energía:</strong> {pet.energyLevel}</div>
            <div className="detail-item"><strong>Temperamento:</strong> {pet.temperament}</div>
            <div className="detail-item"><strong>Nivel de Entrenamiento:</strong> {pet.trainingLevel}</div>
            <div className="detail-item"><strong>Necesidades Especiales:</strong> {pet.specialNeeds || 'Ninguna'}</div>
            
            <div className="detail-item full-width"><strong>Descripción:</strong> {pet.description}</div>
            <div className="detail-item full-width"><strong>Historia:</strong> {pet.history || 'No disponible'}</div>

            <div className="detail-item">
              <strong>Compatible con Perros:</strong> {pet.compatibleWithDogs ? 'Sí' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Compatible con Gatos:</strong> {pet.compatibleWithCats ? 'Sí' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Compatible con Niños:</strong> {pet.compatibleWithChildren ? 'Sí' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Vacunado:</strong> {pet.vaccinated ? 'Sí' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Desparasitado:</strong> {pet.dewormed ? 'Sí' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Esterilizado:</strong> {pet.sterilized ? 'Sí' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileModal;
