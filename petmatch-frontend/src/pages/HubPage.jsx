import React from 'react';
import { Link } from 'react-router-dom';
import './HubPage.css';

// Importar las imágenes locales
import matchBg from '../assets/PerroAdmin.png';
import lossBg from '../assets/LostDog.jpg';
import adoptBg from '../assets/Adopta.jpg';

const HubPage = () => {
  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1>El Universo de tu Mascota Empieza Aquí</h1>
        <p>Conecta, encuentra y dale un hogar a tu mejor amigo.</p>
      </div>

      <div className="hub-grid">
        {/* Sección PetMatch (Pareja) */}
        <Link 
          to="/petmatch" 
          className="hub-card card-match" 
          style={{ backgroundImage: `url(${matchBg})` }}
        >
          <div className="card-content">
            <h2>PetMatch</h2>
            <p>Encuentra la pareja ideal o nuevos amigos para tu mascota.</p>
            <span className="card-action">Buscar Pareja &rarr;</span>
          </div>
          <div className="card-overlay"></div>
        </Link>

        {/* Sección PetLoss (Perdidos) */}
        <Link 
          to="/lost-pets" 
          className="hub-card card-loss" 
          style={{ backgroundImage: `url(${lossBg})` }}
        >
          <div className="card-content">
            <h2>PetLoss</h2>
            <p>Ayuda a mascotas perdidas a volver a casa o reporta una.</p>
            <span className="card-action">Reportar / Buscar &rarr;</span>
          </div>
          <div className="card-overlay"></div>
        </Link>

        {/* Sección PetAdopt (Adopción - Futuro) */}
        <div 
          className="hub-card card-adopt disabled" 
          style={{ backgroundImage: `url(${adoptBg})` }}
        >
          <div className="card-content">
            <h2>PetAdopt</h2>
            <p>Dale un hogar a una mascota que lo necesita.</p>
            <span className="card-action">Próximamente</span>
          </div>
          <div className="card-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default HubPage;
