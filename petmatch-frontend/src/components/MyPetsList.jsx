import React, { useState, useEffect } from 'react';
import { getPetsByOwner } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyPetsList.css'; // Crearemos este CSS

const MyPetsList = ({ onEditPet }) => {
  const { user } = useAuth();
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMyPets = async () => {
      try {
        const pets = await getPetsByOwner(user.id);
        setMyPets(pets);
      } catch (error) {
        console.error("Error al cargar mis mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, [user]);

  if (loading) {
    return <div className="my-pets-loading">Cargando tus mascotas...</div>;
  }

  if (myPets.length === 0) {
    return <div className="my-pets-empty">No has añadido ninguna mascota todavía.</div>;
  }

  return (
    <div className="my-pets-container">
      <h3>Mis Mascotas</h3>
      <div className="my-pets-list">
        {myPets.map(pet => (
          <div key={pet.id} className="my-pet-card" onClick={() => onEditPet(pet)}>
            <img 
              src={pet.photoUrls && pet.photoUrls.length > 0 ? pet.photoUrls[0] : '/placeholder.jpg'} 
              alt={pet.name} 
            />
            <div className="my-pet-card-info">
              <h4>{pet.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPetsList;
