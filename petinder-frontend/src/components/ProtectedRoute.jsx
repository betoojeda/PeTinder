import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el contenido de la ruta (HomePage en nuestro caso)
  return <Outlet />;
};

export default ProtectedRoute;
