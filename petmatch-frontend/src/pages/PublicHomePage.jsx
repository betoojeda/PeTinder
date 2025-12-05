import React from 'react';
import { Link } from 'react-router-dom';
import PublicTinderStack from '../components/PublicTinderStack';
import StatsCounter from '../components/StatsCounter'; // Importar el contador
import './PublicHomePage.css';

const featuredPets = [
  { name: 'Max', breed: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400' },
  { name: 'Luna', breed: 'Gato Siamés', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400' },
  { name: 'Rocky', breed: 'Bulldog Francés', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400' },
  { name: 'Bella', breed: 'Beagle', img: 'https://images.unsplash.com/photo-1592194991134-93349f4a79de?q=80&w=400' },
];

const PublicHomePage = () => {
  return (
    <div className="public-homepage-container">
      {/* --- Video de Fondo --- */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="https://videos.pexels.com/video-files/3209329/3209329-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <header className="public-header">
        <div className="public-brand"><span>PetMatch</span></div>
        <nav className="public-nav">
          <Link to="/about" className="public-nav-link">Acerca de</Link>
          <Link to="/login" className="public-nav-button">Iniciar Sesión</Link>
          <Link to="/register" className="public-nav-button primary">Regístrate Gratis</Link>
        </nav>
      </header>

      <main className="public-main-content">
        {/* --- Sección Hero --- */}
        <div className="hero-section">
          <h1 className="hero-title">Conexiones Reales para Amigos Peludos.</h1>
          <p className="hero-subtitle">La app para encontrar compañeros de juego, amigos y hasta el alma gemela de tu mascota.</p>
          <Link to="/register" className="hero-cta-button">Únete a la Comunidad</Link>
        </div>

        {/* --- Sección de Estadísticas --- */}
        <section className="stats-section">
          <div className="stat-item">
            <h3>+<StatsCounter end={1200} /></h3>
            <p>Matches Hoy</p>
          </div>
          <div className="stat-item">
            <h3>+<StatsCounter end={5000} /></h3>
            <p>Miembros Activos</p>
          </div>
          <div className="stat-item">
            <h3>+<StatsCounter end={800} /></h3>
            <p>Citas Organizadas</p>
          </div>
        </section>

        {/* --- Sección "Cómo Funciona" --- */}
        <section className="how-it-works-section">
          <h2>¿Cómo Funciona?</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">👤</div>
              <h3>1. Crea un Perfil Único</h3>
              <p>Detalla la personalidad, energía y gustos de tu mascota.</p>
            </div>
            <div className="step">
              <div className="step-icon">🐾</div>
              <h3>2. Desliza y Descubre</h3>
              <p>Explora perfiles de otras mascotas en tu zona de una forma divertida.</p>
            </div>
            <div className="step">
              <div className="step-icon">💬</div>
              <h3>3. Conecta y Socializa</h3>
              <p>Si ambos se gustan, ¡es un Match! Chatea y organicen un encuentro.</p>
            </div>
          </div>
        </section>

        {/* --- Sección Demo Interactiva --- */}
        <section className="interactive-demo-section">
            <h2>Prueba la Magia</h2>
            <PublicTinderStack />
        </section>

        {/* --- Sección Galería de Mascotas --- */}
        <section className="featured-pets-section">
          <h2>Conoce a Nuestros Miembros</h2>
          <div className="gallery-container">
            {featuredPets.map((pet, index) => (
              <div key={index} className="pet-gallery-card">
                <img src={pet.img} alt={pet.name} />
                <div className="pet-gallery-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default PublicHomePage;
