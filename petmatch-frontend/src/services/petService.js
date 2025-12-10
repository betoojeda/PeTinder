import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8080/api';

const createPet = async (petData) => {
  const token = localStorage.getItem('token'); // Asumiendo que el token se guarda en localStorage
  const response = await axios.post(`${API_URL}/pets`, petData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Puedes añadir más funciones aquí para obtener, actualizar o eliminar mascotas

export {
  createPet,
};
