import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- Páginas Públicas ---
import PublicHomePage from './pages/PublicHomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- Páginas Protegidas ---
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';

// --- Páginas de Admin (carga perezosa) ---
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const UsersListPage = React.lazy(() => import('./pages/admin/UsersListPage'));
const PetManagementPage = React.lazy(() => import('./pages/admin/PetManagementPage'));
const StatsPage = React.lazy(() => import('./pages/admin/StatsPage')); // Nueva página

// --- Componentes de Ruta ---
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Cargando...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Rutas Protegidas para Usuarios */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<MatchesPage />} />
        </Route>

        {/* Rutas Protegidas para Administradores */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="pets" element={<PetManagementPage />} />
          <Route path="stats" element={<StatsPage />} /> {/* Nueva ruta */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
