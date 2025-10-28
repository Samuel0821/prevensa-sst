// frontend-web/src/services/api.js
import axios from "axios";

// URL del backend desplegado en Render
const API_URL_PRODUCTION = "https://prevensap-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL_PRODUCTION,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o no autorizado. Redirigiendo a login.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Si no estamos ya en la página de login, redirigir
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
