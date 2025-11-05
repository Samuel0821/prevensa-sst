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

// --- INTERCEPTOR DE RESPUESTAS CORREGIDO ---
// Maneja errores 401, PERO ignora los que provienen de la ruta de login
// para permitir que la pantalla de login muestre su propio mensaje de error.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y NO es de la ruta de login, es un token inválido/expirado.
    if (error.response?.status === 401 && !originalRequest.url.endsWith('/auth/login')) {
      console.warn('⚠️ Token expirado o no autorizado. Limpiando sesión...');
      // Eliminar el token y los datos del usuario para forzar un nuevo login.
      await AsyncStorage.multiRemove(['token', 'user']);
      // En una app más compleja, aquí se podría redirigir al usuario a la pantalla de login.
    }

    // Para todos los demás errores (incluido el 401 del login), simplemente se rechaza
    // la promesa para que el código que hizo la llamada (ej. la función de login) lo maneje.
    return Promise.reject(error);
  }
);

export default api;
