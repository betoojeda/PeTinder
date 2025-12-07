import React from 'react';
import { Link } from 'react-router-dom';
import HeroImageCarousel from '../components/HeroImageCarousel';
import StatsCounter from '../components/StatsCounter';
import './PublicHomePage.css'; // Usaremos el nuevo CSS

const PublicHomePage = () => {
  return (
    <div className="public-homepage-container">
      {/* --- Video de Fondo (se mantiene) --- */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="https://videos.pexels.com/video-files/3209329/3209329-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* --- Header con las nuevas clases --- */}
      <header className="header">
        <div className="logo">PetMatch</div>
        <nav className="nav-links">
          <Link to="/about" className="btn-login">Acerca de</Link>
          <Link to="/login" className="btn-login">Iniciar Sesión</Link>
          <Link to="/register" className="btn-register">Regístrate</Link>
        </nav>
      </header>

      {/* --- Contenido Principal con las nuevas clases --- */}
      <main className="main-content">
        <h1 className="main-title">Conexiones Reales para Amigos Peludos.</h1>
        <p className="subtitle">La app para encontrar compañeros de juego, amigos y hasta el alma gemela de tu mascota.</p>
        
        {/* El carrusel se integra aquí */}
        <div className="image-container">
          <HeroImageCarousel />
        </div>

        <Link to="/register" className="btn-community">Únete a la Comunidad</Link>
      </main>

      {/* --- Sección de Estadísticas con las nuevas clases --- */}
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
