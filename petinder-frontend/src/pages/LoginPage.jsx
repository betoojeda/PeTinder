import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png'; // Usando el logo sin fondo
import logoWatermark from '../assets/LogoSinFondo.png';
import '../App.css';

const dogImages = [
  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=1932&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=1885&auto=format&fit=crop'
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión. Revisa tus credenciales.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <img src={logoWatermark} className="auth-bg-logo" alt="Watermark" />
        <div className="background-carousel-login">
          {dogImages.map((img, index) => (
            <div
              key={index}
              className="carousel-image-login"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
      </div>

      <div className="auth-form-wrapper">
        <img src={logo} alt="Petinder Logo" className="auth-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Iniciar Sesión</h2>
          {error && <p className="error-message">{error}</p>}
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
          <button type="submit" className="auth-button">Entrar</button>
          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
