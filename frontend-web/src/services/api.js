// frontend-web/src/services/api.js
import axios from 'axios';

const API_URL = 'https://prevensap-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPUESTAS CORREGIDO ---
// Maneja errores 401, PERO ignora los de la ruta de login para que la
// página de Login pueda mostrar su propio mensaje de error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y NO es de la ruta de login, es un token inválido/expirado.
    if (error.response?.status === 401 && !originalRequest.url.endsWith('/auth/login')) {
      console.warn('⚠️ Token expirado o no autorizado. Redirigiendo a login.');
      
      // Limpiar el almacenamiento local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a la página de login
      // Se comprueba que no estemos ya en /login para evitar bucles infinitos.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Para todos los demás errores (incluido el 401 del login), se rechaza
    // la promesa para que el código que hizo la llamada lo maneje (try/catch).
    return Promise.reject(error);
  }
);

export default api;
