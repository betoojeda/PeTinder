import React, { useState, useEffect, useMemo, createRef } from 'react';
import TinderCard from 'react-tinder-card';
import toast from 'react-hot-toast';

import { getFeed, swipe as apiSwipe } from '../services/api';
import SkeletonCard from './SkeletonCard';
import PetProfileModal from './PetProfileModal';
import './TinderStack.css';

const TinderStack = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs para controlar las tarjetas programáticamente
  const childRefs = useMemo(() => 
    Array(pets.length).fill(0).map(() => createRef()), 
    [pets]
  );

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPets = await getFeed();
        setPets(fetchedPets);
        setCurrentIndex(fetchedPets.length - 1); // Empezar por la última tarjeta (la de arriba)
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, []);

  const swiped = (direction, petId, index) => {
    // Actualizar el índice actual
    setCurrentIndex(index - 1);
    
    // Llamar a la API
    try {
      const result = apiSwipe(petId, direction === 'right' ? 'LIKE' : 'DISLIKE');
      if (result.matched) {
        toast.success('¡Es un Match! 🎉');
      }
    } catch (err) {
      toast.error('Error al deslizar. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  // Función para disparar el swipe desde los botones
  const swipe = async (dir) => {
    if (currentIndex >= 0 && childRefs[currentIndex]) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleCardClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  if (isLoading) {
    return (
      <div className='cardContainer'>
        <SkeletonCard />
      </div>
    );
  }

  if (error && !pets.length) {
    return <p className="info-text error-text">{error}</p>;
  }

  if (!pets.length || currentIndex < 0) {
    return <p className="info-text">No hay más mascotas por ahora. ¡Vuelve más tarde!</p>;
  }

  return (
    <>
      <div className='cardContainer'>
        {pets.map((pet, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={pet.id}
            onSwipe={(dir) => swiped(dir, pet.id, index)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: 'url(' + (pet.photoUrls && pet.photoUrls.length > 0 ? pet.photoUrls[0] : '/placeholder.jpg') + ')' }}
              className='card'
              onClick={() => handleCardClick(pet)}
            >
              <div className="card-info">
                <h3><span className="label">Nombre:</span> {pet.name}</h3>
                <h3><span className="label">Edad:</span> {pet.age} años</h3>
                <p>{pet.breed || 'Raza no especificada'}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="swipe-buttons">
        <button className="dislike-button" onClick={() => swipe('left')}>❌</button>
        <button className="like-button" onClick={() => swipe('right')}>❤️</button>
      </div>

      {showModal && <PetProfileModal pet={selectedPet} onClose={handleCloseModal} />}
    </>
  );
};

export default TinderStack;
