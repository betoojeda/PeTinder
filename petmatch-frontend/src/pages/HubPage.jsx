import React from 'react';
import { Link } from 'react-router-dom';
import './HubPage.css';

const HubPage = () => {
  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1>Bienvenido a PetMatch</h1>
        <p>El lugar donde todas las mascotas encuentran lo que buscan.</p>
      </div>

      <div className="hub-grid">
        {/* Sección PetMatch (Pareja) */}
        <Link to="/petmatch" className="hub-card card-match">
          <div className="card-content">
            <h2>PetMatch</h2>
            <p>Encuentra la pareja ideal o nuevos amigos para tu mascota.</p>
            <span className="card-action">Buscar Pareja &rarr;</span>
          </div>
          <div className="card-overlay"></div>
        </Link>

        {/* Sección PetLoss (Perdidos) */}
        <Link to="/lost-pets" className="hub-card card-loss">
          <div className="card-content">
            <h2>PetLoss</h2>
            <p>Ayuda a mascotas perdidas a volver a casa o reporta una.</p>
            <span className="card-action">Reportar / Buscar &rarr;</span>
          </div>
          <div className="card-overlay"></div>
        </Link>

        {/* Sección PetAdopt (Adopción - Futuro) */}
        <div className="hub-card card-adopt disabled">
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
