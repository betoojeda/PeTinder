import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoSinFondo.png';
import '../styles/auth.css';
import toast from 'react-hot-toast';
import LoadingModal from '../components/LoadingModal';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', lastName: '', email: '', password: '',
    gender: '', numberOfPets: 0, profileDescription: '',
  });
  const [interest, setInterest] = useState('PetMatch'); // Estado para el interés
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
    
    // Añadir el interés a la descripción del perfil
    const finalFormData = {
      ...formData,
      profileDescription: `Interés principal: ${interest}. ${formData.profileDescription}`
    };

    try {
      await register(finalFormData);
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
      <div className="auth-page-container">
        <div className="form-container">
          <img src={logo} alt="petmatch Logo" className="auth-logo" />
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleSubmit}>
            
            <div className="form-row">
              <label>¿Qué te trae por aquí?</label>
              <select 
                name="interest" 
                className="form-input" 
                value={interest} 
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="PetMatch">Buscar pareja/amigos para mi mascota</option>
                <option value="PetLoss">Reportar o buscar una mascota perdida</option>
                <option value="PetAdopt" disabled>Adoptar una mascota (Próximamente)</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="name">Nombre</label>
              <input id="name" type="text" name="name" placeholder="Tu nombre" className="form-input" value={formData.name} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-row">
              <label htmlFor="lastName">Apellido</label>
              <input id="lastName" type="text" name="lastName" placeholder="Tu apellido" className="form-input" value={formData.lastName} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-row">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" name="email" placeholder="tu@email.com" className="form-input" value={formData.email} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-row">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" name="password" placeholder="Crea una contraseña segura" className="form-input" value={formData.password} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-row">
              <label htmlFor="gender">Género</label>
              <select id="gender" name="gender" className="form-input" value={formData.gender} onChange={handleChange} disabled={isLoading}>
                <option value="">Selecciona tu género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="numberOfPets">¿Cuántas mascotas tienes?</label>
              <input id="numberOfPets" type="number" name="numberOfPets" className="form-input" value={formData.numberOfPets} onChange={handleChange} min="0" disabled={isLoading} />
            </div>
            <div className="form-row">
              <label htmlFor="profileDescription">Sobre ti</label>
              <textarea id="profileDescription" name="profileDescription" placeholder="Cuéntanos un poco sobre ti..." className="form-input" value={formData.profileDescription} onChange={handleChange} disabled={isLoading}></textarea>
            </div>
            <button type="submit" className="button-primary auth-button" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <div className="auth-links">
              <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
              <Link to="/" className="back-to-home-button">Volver a la Página Principal</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
