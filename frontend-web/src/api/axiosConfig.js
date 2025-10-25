
import axios from "axios";

// --- CONFIGURACIÓN DE AXIOS ---

// 1. Desarrollo: Para pruebas en local
//const API_URL_LOCAL = "http://localhost:4000/api";

// 2. Producción: URL del backend desplegado en Render
const API_URL_PRODUCTION = "https://prevensap-backend.onrender.com/api";


const api = axios.create({
  // ✅ USA LA URL DE PRODUCCIÓN
  baseURL: API_URL_PRODUCTION,
  
  // Para volver a desarrollo, comenta la línea de arriba y descomenta la siguiente:
  // baseURL: API_URL_LOCAL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor de solicitud: agregar token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (!config.url.includes("/auth/login")) {
        console.warn("🔒 No se encontró token en localStorage");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta: manejar expiración del token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o no autorizado.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
