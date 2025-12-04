import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas Públicas
import PublicHomePage from './pages/PublicHomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas Protegidas (App Principal)
import DashboardPage from './pages/DashboardPage'; // Renombramos HomePage a DashboardPage
import MatchesPage from './pages/MatchesPage';

// Páginas de Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersListPage from './pages/admin/UsersListPage';

// Componentes de Ruta
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
      
      {/* --- Rutas Protegidas para Usuarios --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/matches" element={<MatchesPage />} />
      </Route>

      {/* --- Rutas Protegidas para Administradores --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UsersListPage />} />
      </Route>

      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
