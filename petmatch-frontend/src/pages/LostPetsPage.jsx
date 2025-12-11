import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import { getLostPets } from '../services/lostPetsService';
import LostPetCard from '../components/LostPetCard';
import LostPetForm from '../components/LostPetForm';
import LoadingModal from '../components/LoadingModal';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import './LostPetsPage.css';

// ... (estilos del modal)

const LostPetsPage = () => {
  // ... (estados existentes)

  // ... (useEffect y funciones existentes)

  return (
    <div className="lost-pets-page-container">
      <div className="lost-pets-header">
        <Link to="/" className="back-to-home-link">← Volver al Inicio</Link>
        <h1>Mascotas Perdidas y Encontradas</h1>
        <p>Ayuda a un amigo a volver a casa. Publica un aviso o comenta si tienes información.</p>
        <button onClick={() => setIsFormOpen(true)} className="button-primary">Reportar Mascota</button>
      </div>

      {/* ... (resto del JSX) */}
    </div>
  );
};

export default LostPetsPage;
