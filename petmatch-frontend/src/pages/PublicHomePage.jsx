import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroImageCarousel from '../components/HeroImageCarousel';
import StatsCounter from '../components/StatsCounter';
import logo from '../assets/LogoSinFondo.png';
import apiClient from '../services/api';
import './PublicHomePage.css';

const PublicHomePage = () => {
  const [stats, setStats] = useState({ totalMatches: 0, totalUsers: 0, totalPets: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats/public');
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar las estadísticas públicas:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="landing-page"> 
      <header className="landing-header">
        <img src={logo} alt="PetMatch Logo" className="landing-logo-img" />
        <nav className="landing-nav">
          <div className="desktop-nav">
            <Link to="/about" className="landing-nav-btn">Acerca de</Link>
            <Link to="/login" className="landing-nav-btn">Iniciar Sesión</Link>
            <Link to="/register" className="landing-nav-btn primary">Regístrate</Link>
          </div>
          <div className="mobile-nav">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hamburger-btn">
              ☰
            </button>
            {isMenuOpen && (
              <div className="mobile-menu">
                <Link to="/lost-pets" className="menu-item">Mascotas Perdidas</Link>
                <Link to="/about" className="menu-item">Acerca de</Link>
                <Link to="/login" className="menu-item">Iniciar Sesión</Link>
                <Link to="/register" className="menu-item primary">Regístrate</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <div className="hero-text-box">
          <h1 className="hero-title">Conexiones Reales para Amigos Peludos.</h1>
          <p className="hero-subtitle">La app para encontrar compañeros de juego, amigos y hasta el alma gemela de tu mascota.</p>
        </div>
        
        <div className="hero-image-container">
          <HeroImageCarousel />
        </div>

        <Link to="/register" className="hero-cta-btn">Únete a la Comunidad</Link>
      </main>

      <section className="lost-pets-promo-section">
        <div className="promo-content">
          <h2>¿Has perdido o encontrado una mascota?</h2>
          <p>Nuestra comunidad está aquí para ayudar. Publica un aviso o revisa las publicaciones para ayudar a un amigo a volver a casa.</p>
          <Link to="/lost-pets" className="button-primary">Ir a Mascotas Perdidas</Link>
        </div>
      </section>

      <footer className="landing-stats">
        {/* ... (stats) ... */}
      </footer>
    </div>
  );
};

export default PublicHomePage;
