import React from 'react';
import { Link } from 'react-router-dom';
import HeroImageCarousel from '../components/HeroImageCarousel';
import StatsCounter from '../components/StatsCounter';
import './PublicHomePage.css';

const PublicHomePage = () => {
  return (
    <div className="public-homepage-container">
      <header className="header">
        <div className="logo">PetMatch</div>
        <nav className="nav-links">
          <Link to="/about" className="btn-login">Acerca de</Link>
          <Link to="/login" className="btn-login">Iniciar Sesión</Link>
          <Link to="/register" className="btn-register">Regístrate</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="hero-text-box"> {/* Nuevo contenedor para el texto */}
          <h1 className="main-title">Conexiones Reales para Amigos Peludos.</h1>
          <p className="subtitle">La app para encontrar compañeros de juego, amigos y hasta el alma gemela de tu mascota.</p>
        </div>
        
        <div className="image-container">
          <HeroImageCarousel />
        </div>

        <Link to="/register" className="btn-community">Únete a la Comunidad</Link>
      </main>

      <footer className="stats-container">
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#e55' }}>+<StatsCounter end={1200} /></div>
          <div className="stat-label">Matches Hoy</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#5cde5c' }}>+<StatsCounter end={5000} /></div>
          <div className="stat-label">Miembros Activos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#f7b733' }}>+<StatsCounter end={800} /></div>
          <div className="stat-label">Citas Organizadas</div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;
