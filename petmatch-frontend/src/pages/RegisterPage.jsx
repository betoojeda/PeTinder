import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png';
import '../App.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    numberOfPets: 0,
    profileDescription: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="auth-container light-theme">
      <div className="auth-form-wrapper">
        <img src={logo} alt="petmatch Logo" className="auth-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Crear Cuenta</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecciona tu género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="numberOfPets">¿Cuántas mascotas tienes?</label>
            <input
              type="number"
              id="numberOfPets"
              name="numberOfPets"
              value={formData.numberOfPets}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="input-group">
            <textarea
              name="profileDescription"
              placeholder="Cuéntanos un poco sobre ti..."
              value={formData.profileDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="auth-button">Registrarse</button>
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
          <Link to="/" className="back-to-home-button">Volver a la Página Principal</Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
