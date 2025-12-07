import React, { useState, useEffect } from 'react';
import './HeroImageCarousel.css'; // Crearemos este CSS

const carouselImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1932&auto=format&fit=crop', // Golden Retriever
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop', // Pug
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1964&auto=format&fit=crop', // French Bulldog
  'https://images.unsplash.com/photo-1592194991134-93349f4a79de?q=80&w=1887&auto=format&fit=crop', // Labrador
  'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1862&auto=format&fit=crop', // Beagle
  'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1974&auto=format&fit=crop', // Cat
  'https://images.unsplash.com/photo-1574144611937-017e6015e0b1?q=80&w=1974&auto=format&fit=crop', // Cat
];

const HeroImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000); // Cambia de imagen cada 4 segundos
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
