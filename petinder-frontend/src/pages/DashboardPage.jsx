import React from 'react';
import { Link } from 'react-router-dom';
import TinderStack from '../components/TinderStack';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const backgroundImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1964&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592194991134-93349f4a79de?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1862&auto=format&fit=crop'
];

const DashboardPage = () => {
  const { logout, isAdmin } = useAuth();

  return (
    <div className="homepage-container">
      <div className="background-carousel">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className="carousel-image"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      <header className="homepage-header">
        <div className="nav-left">
          <Link to="/matches" className="nav-link">Mis Matches</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              Admin
            </Link>
          )}
        </div>
        <h1 className="brand-title">Petinder</h1>
        <div className="nav-right">
          <button onClick={logout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <main className="content-center">
        <div className="main-content-wrapper">
          <div className="page-title-container">
            <h2>Encuentra la Pareja Perfecta</h2>
            <p>Desliza y conecta con otros perritos</p>
          </div>
          <TinderStack />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
