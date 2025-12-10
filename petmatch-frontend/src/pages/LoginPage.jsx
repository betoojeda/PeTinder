import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png';
import '../styles/auth.css';
import toast from 'react-hot-toast';
import LoadingModal from '../components/LoadingModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { role } = await login(email, password);
      toast.success('¡Bienvenido de nuevo!');
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal message="Iniciando sesión..." />}
      <div className="auth-page-container">
        <div className="form-container">
          <img src={logo} alt="petmatch Logo" className="auth-logo" />
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="button-primary auth-button" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <div className="auth-links">
              <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
              <p><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></p>
              <Link to="/" className="back-to-home-button">Volver a la Página Principal</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
