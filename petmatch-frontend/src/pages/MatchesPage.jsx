import React, { useState, useEffect } from 'react';
import { getMatches } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import './MatchesPage.css'; // Importaremos los nuevos estilos

const MatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const fetchedMatches = await getMatches();
        setMatches(fetchedMatches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p className="matches-loading">Cargando tus matches...</p>;
  }

  return (
    <div className="matches-page-container">
      <aside className="matches-list-sidebar">
        <header>
          <h2>Tus Matches</h2>
        </header>
        {matches.length > 0 ? (
          <ul>
            {matches.map((match) => {
              // Determinar cuál es la otra mascota en el match
              const otherPet = match.petA.ownerId === user.id ? match.petB : match.petA;
              return (
                <li 
                  key={match.id} 
                  onClick={() => setSelectedMatch(match)}
                  className={selectedMatch?.id === match.id ? 'selected' : ''}
                >
                  <img src={otherPet.photoUrl || '/placeholder.jpg'} alt={otherPet.name} />
                  <div className="match-info">
                    <h4>{otherPet.name}</h4>
                    <p>Último mensaje...</p> {/* Placeholder */}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-matches">Aún no tienes matches. ¡Sigue deslizando!</p>
        )}
      </aside>
      <main className="chat-area">
        <ChatWindow match={selectedMatch} />
      </main>
    </div>
  );
};

export default MatchesPage;
