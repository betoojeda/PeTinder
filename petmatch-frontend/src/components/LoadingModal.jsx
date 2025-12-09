import React from 'react';
import './LoadingModal.css'; // Crearemos este CSS

const LoadingModal = ({ message = 'Cargando...' }) => {
  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
