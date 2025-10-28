// app-mobile/api/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL del backend desplegado en Render
const API_URL_PRODUCTION = 'https://prevensap-backend.onrender.com/api';

// --- CREACIÓN DE LA INSTANCIA DE AXIOS ---
const api = axios.create({
  baseURL: API_URL_PRODUCTION,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado o no autorizado en app móvil.');
      await AsyncStorage.multiRemove(['token', 'user']);
      // En una app real, aquí se gestionaría la redirección a la pantalla de Login.
    }
    return Promise.reject(error);
  }
);

export default api;
