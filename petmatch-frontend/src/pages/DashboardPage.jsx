import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TinderStack from '../components/TinderStack';
import PetForm from '../components/PetForm';
import MyPetsList from '../components/MyPetsList';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

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
    <div className="dashboard-container">
      <header className="dashboard-header">
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
        <h1 className="brand-title">PetMatch</h1> {/* Restaurado el título de texto */}
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
