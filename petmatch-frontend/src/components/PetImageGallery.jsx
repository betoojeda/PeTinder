import React, { useState } from 'react';
import './PetImageGallery.css'; // Crearemos este CSS

const PetImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : '/placeholder.jpg');

  if (!images || images.length === 0) {
    return (
      <div className="pet-gallery-container">
        <img src="/placeholder.jpg" alt="No hay fotos" className="main-pet-image" />
        <p className="no-images-text">No hay fotos disponibles para esta mascota.</p>
      </div>
    );
  }

  return (
    <div className="pet-gallery-container">
      <div className="main-image-wrapper">
        <img src={mainImage} alt="Mascota principal" className="main-pet-image" />
      </div>
      <div className="thumbnail-gallery">
        {images.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Miniatura ${index + 1}`}
            className={`thumbnail-image ${imgUrl === mainImage ? 'active' : ''}`}
            onClick={() => setMainImage(imgUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default PetImageGallery;
