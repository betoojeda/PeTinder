import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png';
import '../App.css';
import toast from 'react-hot-toast';
import LoadingModal from '../components/LoadingModal'; // Importar el modal de carga

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', lastName: '', email: '', password: '',
    gender: '', numberOfPets: 0, profileDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('¡Registro exitoso! Bienvenido a PetMatch.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal message="Creando tu cuenta..." />}
      <div className="page-container">
        <div className="form-card">
          <img src={logo} alt="petmatch Logo" className="form-logo" />
          <form onSubmit={handleSubmit}>
            <h2>Crear Cuenta</h2>
            <div className="input-group">
              <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="input-group">
              <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="input-group">
              <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="input-group">
              <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="input-group">
              <select name="gender" value={formData.gender} onChange={handleChange} disabled={isLoading}>
                <option value="">Selecciona tu género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="numberOfPets">¿Cuántas mascotas tienes?</label>
              <input type="number" id="numberOfPets" name="numberOfPets" value={formData.numberOfPets} onChange={handleChange} min="0" disabled={isLoading} />
            </div>
            <div className="input-group">
              <textarea name="profileDescription" placeholder="Cuéntanos un poco sobre ti..." value={formData.profileDescription} onChange={handleChange} disabled={isLoading}></textarea>
            </div>
            <button type="submit" className="main-button" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <p className="form-switch">
              ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
            </p>
            <Link to="/" className="back-button">Volver a la Página Principal</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
