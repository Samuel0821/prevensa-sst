
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CONFIGURACIÓN DE AXIOS PARA PRODUCCIÓN ---
// La baseURL apunta directamente al servidor de producción en Render.
const api = axios.create({
  baseURL: 'https://prevensap-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json', // Corregido de 'jetson' a 'json'
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
      // Limpiar storage y navegar a la pantalla de login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Aquí necesitarías acceso al sistema de navegación para redirigir
      // Por ejemplo: navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
