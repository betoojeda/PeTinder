import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verifica si ya hay una sesión activa
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const userData = await getMe();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        // No hacemos nada, el usuario simplemente no estará logueado
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await apiLogin({ email, password });
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const userData = await apiRegister(formData);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading: loading,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
