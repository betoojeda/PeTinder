import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Muestra un loader mientras se verifica la autenticación
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Si está autenticado pero NO es admin, redirige a la página de inicio
    return <Navigate to="/" replace />;
  }

  // Si está autenticado Y es admin, muestra el contenido de la ruta de admin
  return <Outlet />;
};

export default AdminRoute;
