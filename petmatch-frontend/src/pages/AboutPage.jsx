import React from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../assets/FotoPerfil.jpg';
import '../App.css';

const AboutPage = () => {
  return (
    <div className="page-container"> {/* Usar el contenedor de página genérico */}
      <div className="form-card"> {/* Reutilizar el estilo de tarjeta */}
        <img src={profilePic} alt="Humberto Ojeda" className="profile-picture" />
        <h1>Acerca de PetMatch</h1>
        <p>
          PetMatch es una aplicación creada con pasión para ayudar a que las mascotas encuentren
          compañeros de juego, amigos o incluso ¡el amor de su vida perruna o gatuna!
        </p>
        <h2>El Creador</h2>
        <p>
          Mi nombre es <strong>Humberto Ojeda</strong>, un apasionado por la tecnología y crear nuevas apps 
          que puedan unir a las personas y a sus mascotas ¡por el bien de la humanidad!
        </p>
        <p>
          Puedes encontrar más sobre mi trabajo en mi <a href="[Tu-URL-de-LinkedIn]" target="_blank" rel="noopener noreferrer">perfil de LinkedIn</a> o
          en mi <a href="[Tu-URL-de-GitHub]" target="_blank" rel="noopener noreferrer">repositorio de GitHub</a>.
        </p>
        <Link to="/" className="back-button">Volver al Inicio</Link>
      </div>
    </div>
  );
};

export default AboutPage;
