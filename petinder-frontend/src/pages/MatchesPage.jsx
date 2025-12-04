import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!token) return;
      try {
        // Asumimos que tienes un endpoint /api/matches que devuelve los matches del usuario autenticado
        const response = await fetch('/api/matches', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Error al cargar los matches');
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token]);

  if (loading) {
    return <p>Cargando tus matches...</p>;
  }

  return (
    <div className="matches-container">
      <h2>Tus Matches</h2>
      <Link to="/">Volver a swippear</Link>
      {matches.length > 0 ? (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              {/* Idealmente, el backend devolvería los detalles de las mascotas del match */}
              <p>Match con Mascota ID: {match.petB}</p>
              {/* <img src={match.petB.photoUrl} alt={match.petB.name} />
              <p>{match.petB.name}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <p>Aún no tienes matches. ¡Sigue swippeando!</p>
      )}
    </div>
  );
};

export default MatchesPage;
