import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png';
import '../App.css';
import toast from 'react-hot-toast';
import LoadingModal from '../components/LoadingModal'; // Importar el modal de carga

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
      <div className="page-container">
        <div className="form-card">
          <img src={logo} alt="petmatch Logo" className="form-logo" />
          <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="main-button" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <p className="form-switch">
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
            <p className="form-switch" style={{ marginTop: '1rem' }}>
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </p>
            <Link to="/" className="back-button">Volver a la Página Principal</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
