
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CONFIGURACIÓN DE URLs DE API ---

// 1. Desarrollo: Para probar en el CELULAR (Expo Go), usa la IP de tu computadora.
//const API_URL_DEVICE = 'http://10.199.111.232:4000/api';

// 2. Desarrollo: Para probar en la WEB LOCAL, usa localhost.
//const API_URL_LOCAL = 'http://localhost:4000/api';

// 3. Producción: URL del backend desplegado en Render.
const API_URL_PRODUCTION = 'https://prevensap-backend.onrender.com/api';


// --- CREACIÓN DE LA INSTANCIA DE AXIOS ---
const api = axios.create({
  // ✅ USA LA URL DE PRODUCCIÓN
  baseURL: API_URL_PRODUCTION,
  
  // Si necesitas volver a desarrollo, comenta la línea de arriba y descomenta una de las siguientes:
  // baseURL: API_URL_DEVICE, 
  // baseURL: API_URL_LOCAL,

  headers: {
    'Content-Type': 'application/json',
  },
});


// ✅ Interceptor de solicitud: agregar token en cada request
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

// ✅ Interceptor de respuesta: manejar errores (opcional, pero recomendado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado o no autorizado en app móvil.');
      await AsyncStorage.multiRemove(['token', 'user']);
      // Idealmente, aquí se implementaría una redirección a la pantalla de Login.
    }
    return Promise.reject(error);
  }
);

export default api;
