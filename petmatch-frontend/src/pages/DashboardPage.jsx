import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TinderStack from '../components/TinderStack';
import PetForm from '../components/PetForm';
import MyPetsList from '../components/MyPetsList';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png'; // Importar el logo
import '../App.css';

const backgroundImages = [
  'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1932&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1935&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1964&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1935&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=1935&auto=format&fit=crop'
];

const DashboardPage = () => {
  const { logout, isAdmin } = useAuth();
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [tinderStackKey, setTinderStackKey] = useState(Date.now());

  const handlePetSaveSuccess = () => {
    setTinderStackKey(Date.now());
  };

  const openPetFormForEdit = (pet) => {
    setEditingPet(pet);
    setIsPetFormOpen(true);
  };

  const openPetFormForCreate = () => {
    setEditingPet(null);
    setIsPetFormOpen(true);
  };

  const closePetForm = () => {
    setIsPetFormOpen(false);
    setEditingPet(null);
  };

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
          <button onClick={openPetFormForCreate} className="nav-link">
            Añadir Mascota
          </button>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              Admin
            </Link>
          )}
        </div>
        <img src={logo} alt="PetMatch Logo" className="header-logo" /> {/* Logo en lugar de texto */}
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
          <TinderStack key={tinderStackKey} />
          <MyPetsList key={tinderStackKey + 1} onEditPet={openPetFormForEdit} />
        </div>
      </main>

      {isPetFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PetForm 
              pet={editingPet}
              onClose={closePetForm}
              onSaveSuccess={handlePetSaveSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
