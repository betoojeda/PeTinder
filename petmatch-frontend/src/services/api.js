import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
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

export const uploadPetPhoto = async (entityId, file, basePath = '/pets') => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(`${basePath}/${entityId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al subir la foto');
  }
};

export const getPetsByOwner = async (ownerId) => {
  try {
    const response = await apiClient.get(`/pets/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cargar tus mascotas');
  }
};

// --- Funciones de Chat y Matches ---

export const getMatches = async () => {
  try {
    const response = await apiClient.get('/matches'); 
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cargar los matches');
  }
};

export const getMessagesForMatch = async (matchId) => {
  try {
    const response = await apiClient.get(`/messages/match/${matchId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cargar los mensajes');
  }
};

export const sendMessage = async (matchId, senderUserId, text) => {
  try {
    const response = await apiClient.post('/messages', { matchId, senderUserId, text });
    return response.data;
  } catch (error)
    {
    throw new Error(error.response?.data?.message || 'Error al enviar el mensaje');
  }
};

export default apiClient;
