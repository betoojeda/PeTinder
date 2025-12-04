import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Necesitaremos esta librería para decodificar el token

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          // Comprobar si el token ha expirado
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
          } else {
            setToken(storedToken);
            // El backend ahora nos da el rol en el token
            setUser({ email: decoded.sub, role: decoded.role });
          }
        } catch (error) {
          console.error("Token inválido o corrupto", error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error en el login');
    }

    const { token: authToken } = await response.json();
    const decoded = jwtDecode(authToken);
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser({ email: decoded.sub, role: decoded.role });
  };

  const register = async (name, email, password) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        throw new Error('Error en el registro');
    }
    // Después del registro, hacemos login para obtener el token y los datos
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  if (loading) {
    return <div>Cargando...</div>;
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
