import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import toast from 'react-hot-toast';

import { getFeed, swipe as apiSwipe } from '../services/api';
import SkeletonCard from './SkeletonCard';
import PetProfileModal from './PetProfileModal'; // Importar el modal

const TinderStack = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPets = await getFeed();
        setPets(fetchedPets);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSwipe = async (direction, petId) => {
    try {
      const result = await apiSwipe(petId, direction === 'right' ? 'LIKE' : 'DISLIKE');
      if (result.matched) {
        toast.success('¡Es un Match! 🎉');
      }
    } catch (err) {
      toast.error('Error al deslizar. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  const childRefs = useMemo(() =>
    Array(pets.length).fill(0).map(() => React.createRef()),
    [pets]
  );

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

  if (!pets.length) {
    return <p className="info-text">No hay más mascotas por ahora. ¡Vuelve más tarde!</p>;
  }

  return (
    <div className='cardContainer'>
      {pets.map((pet, index) => (
        <TinderCard
          ref={childRefs[index]}
          className='swipe'
          key={pet.id}
          onSwipe={(dir) => handleSwipe(dir, pet.id)}
          preventSwipe={['up', 'down']}
        >
          <div
            style={{ backgroundImage: 'url(' + (pet.photoUrls && pet.photoUrls.length > 0 ? pet.photoUrls[0] : '/placeholder.jpg') + ')' }}
            className='card'
            onClick={() => handleCardClick(pet)} // Hacer la tarjeta clickeable
          >
            <div className="card-info">
              <h3>{pet.name}, {pet.age}</h3>
              <p>{pet.breed || 'Raza no especificada'}</p>
            </div>
          </div>
        </TinderCard>
      ))}

      {showModal && <PetProfileModal pet={selectedPet} onClose={handleCloseModal} />}
    </div>
  );
};

export default TinderStack;
