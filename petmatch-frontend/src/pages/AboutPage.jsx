import React from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../assets/FotoPerfil.jpg';
import '../App.css';

const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="form-card">
        <img src={profilePic} alt="Humberto Ojeda" className="profile-picture" />
        <h1>Acerca del Proyecto</h1>
        <p>
          Esta aplicación es el resultado de una pasión por la tecnología y el amor por las mascotas. 
          El objetivo es crear un ecosistema completo donde los dueños de mascotas puedan conectar, 
          ayudarse mutuamente y encontrar nuevos miembros para su familia.
        </p>
        <h2>El Creador</h2>
        <p>
          Mi nombre es <strong>Humberto Ojeda</strong>. Soy un desarrollador de software, 
          fanático de los videojuegos, la ciencia ficción y, sobre todo, me encanta crear cosas nuevas 
          que puedan tener un impacto positivo.
        </p>
        <p>
          Puedes encontrar más sobre mi trabajo en mi <a href="[Tu-URL-de-LinkedIn]" target="_blank" rel="noopener noreferrer">perfil de LinkedIn</a> o
          en mi <a href="[Tu-URL-de-GitHub]" target="_blank" rel="noopener noreferrer">repositorio de GitHub</a>.
        </p>
        <Link to="/" className="back-button">Volver al Hub</Link>
      </div>
    </div>
  );
};

export default AboutPage;
