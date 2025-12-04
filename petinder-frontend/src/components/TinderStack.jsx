import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import { useAuth } from '../context/AuthContext';

const TinderStack = () => {
  const [pets, setPets] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPets = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/feed', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al cargar mascotas');
        
        const data = await response.json();
        setPets(data.content || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPets();
  }, [token]);

  const swiped = async (direction, petId) => {
    try {
      const response = await fetch('/api/swipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId: petId,
          type: direction === 'right' ? 'LIKE' : 'DISLIKE',
        }),
      });
      const result = await response.json();
      if (result.matched) {
        alert("¡Es un Match! 🎉");
      }
    } catch (error) {
      console.error('Error en el swipe:', error);
    }
  };

  const childRefs = useMemo(() =>
    Array(pets.length).fill(0).map(() => React.createRef()),
    [pets]
  );

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
          onSwipe={(dir) => swiped(dir, pet.id)}
          preventSwipe={['up', 'down']}
        >
          <div
            style={{ backgroundImage: 'url(' + (pet.photoUrl || '/placeholder.jpg') + ')' }}
            className='card'
          >
            <div className="card-info">
              <h3>{pet.name}, {pet.age}</h3>
              <p>{pet.breed || 'Raza no especificada'}</p>
              {/* <p className="description">{pet.description || 'No hay descripción disponible.'}</p> */}
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default TinderStack;
