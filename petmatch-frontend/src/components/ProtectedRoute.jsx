import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se verifica la autenticación, no renderizar nada para evitar parpadeos
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de inicio pública
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, muestra el contenido de la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
