import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <div className="about-content">
        <h1>Acerca de Pettinder</h1>
        <p>
          Pettinder es una aplicación creada con pasión para ayudar a que las mascotas encuentren
          compañeros de juego, amigos o incluso ¡el amor de su vida perruna o gatuna!
        </p>
        <h2>El Creador</h2>
        <p>
          Mi nombre es <strong>[Tu Nombre Aquí]</strong>, y soy un desarrollador de software
          apasionado por la tecnología y los animales.
        </p>
        <p>
          Puedes encontrar más sobre mi trabajo en mi <a href="[Tu-URL-de-LinkedIn]" target="_blank" rel="noopener noreferrer">perfil de LinkedIn</a> o
          en mi <a href="[Tu-URL-de-GitHub]" target="_blank" rel="noopener noreferrer">repositorio de GitHub</a>.
        </p>
        <Link to="/" className="back-home-button">Volver al Inicio</Link>
      </div>
    </div>
  );
};

export default AboutPage;
