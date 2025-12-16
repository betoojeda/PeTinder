import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLostPets } from '../services/lostPetsService';
import LostPetCard from '../components/LostPetCard';
import LostPetForm from '../components/LostPetForm';
import LoadingModal from '../components/LoadingModal';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import './LostPetsPage.css';

// Estilos para el modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    width: 'auto',
    maxWidth: '600px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

Modal.setAppElement('#root');

const LostPetsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    try {
      const data = await getLostPets(page);
      setPosts(prev => [...prev, ...data.content]);
      setPage(prev => prev + 1);
      setHasMore(!data.last);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuccess = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="lost-pets-page-container">
      <div className="lost-pets-header">
        <Link to="/" className="back-to-home-link">← Volver al Inicio</Link>
        <h1>Mascotas Perdidas y Encontradas</h1>
        <p>Ayuda a un amigo a volver a casa. Publica un aviso o comenta si tienes información.</p>
        <button onClick={() => setIsFormOpen(true)} className="button-primary">Reportar Mascota</button>
      </div>

      <div className="lost-pets-list">
        {posts.map(post => (
          <LostPetCard key={post.id} post={post} />
        ))}
      </div>

      {isLoading && <LoadingModal message="Cargando avisos..." />}
      
      {hasMore && !isLoading && (
        <div className="load-more-container">
          <button onClick={fetchPosts} className="button-secondary">Cargar más</button>
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onRequestClose={() => setIsFormOpen(false)}
        style={customModalStyles}
        contentLabel="Reportar Mascota Perdida"
      >
        <LostPetForm 
          onClose={() => setIsFormOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      </Modal>
    </div>
  );
};

export default LostPetsPage;
