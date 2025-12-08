import React, { useState, useEffect } from 'react';
import './HeroImageCarousel.css';

// --- NUEVAS IMÁGENES, MÁS ADECUADAS PARA CAROUSEL ---
const carouselImages = [
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1932&auto=format&fit=crop', // Golden sonriendo
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=1935&auto=format&fit=crop', // Gato curioso
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=1885&auto=format&fit=crop', // Perro con gafas
  'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=1936&auto=format&fit=crop', // Gato con ojos azules
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop'  // Dos perritos
];

const HeroImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel-container">
      {carouselImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Mascota ${index + 1}`}
          className={`hero-carousel-image ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default HeroImageCarousel;
