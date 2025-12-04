import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png'; // Usando el logo sin fondo
import '../App.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container light-theme">
      <div className="auth-form-wrapper">
        <img src={logo} alt="Petinder Logo" className="auth-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Crear Cuenta</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Registrarse</button>
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
