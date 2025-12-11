import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroImageCarousel from '../components/HeroImageCarousel';
import StatsCounter from '../components/StatsCounter';
import logo from '../assets/LogoSinFondo.png'; // Importar el logo
import './PublicHomePage.css';

const PublicHomePage = () => {
  const [stats, setStats] = useState({ totalMatches: 0, totalUsers: 0, totalPets: 0 });

  useEffect(() => {
    // Cargar las estadísticas desde el nuevo endpoint
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/public');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error al cargar las estadísticas públicas:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="landing-page"> 
      <header className="landing-header">
        <img src={logo} alt="PetMatch Logo" className="landing-logo-img" /> {/* Reemplazar div por img */}
        <nav className="landing-nav">
          <Link to="/lost-pets" className="landing-nav-btn">Mascotas Perdidas</Link>
          <Link to="/about" className="landing-nav-btn">Acerca de</Link>
          <Link to="/login" className="landing-nav-btn">Iniciar Sesión</Link>
          <Link to="/register" className="landing-nav-btn primary">Regístrate</Link>
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
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#e55' }}>+<StatsCounter end={stats.totalMatches} /></div>
          <div className="stat-label">Matches Creados</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#5cde5c' }}>+<StatsCounter end={stats.totalUsers} /></div>
          <div className="stat-label">Miembros Activos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ color: '#f7b733' }}>+<StatsCounter end={stats.totalPets} /></div>
          <div className="stat-label">Mascotas Registradas</div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;
