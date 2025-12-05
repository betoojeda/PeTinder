import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// --- Funciones de Autenticación ---
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error en el registro');
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Error al cerrar sesión en el servidor:', error);
  }
};

/**
 * Obtiene los datos del usuario actual si hay una sesión activa (cookie válida).
 */
export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    // Si devuelve 401, es normal (no hay sesión), no es un error de aplicación.
    if (error.response && error.response.status === 401) {
      return null;
    }
    throw new Error('Error al verificar la sesión');
  }
};


// --- Funciones de la Aplicación ---

export const getFeed = async () => {
  try {
    const response = await apiClient.get('/feed');
    return response.data.content || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cargar el feed');
  }
};

export const swipe = async (petId, type) => {
  try {
    const response = await apiClient.post('/swipes', { petId, type });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al procesar el swipe');
  }
};

export default apiClient;
