
// frontend-web/src/services/api.js
import axios from "axios";

// --- CONFIGURACIÓN DE AXIOS ---

// 1. Desarrollo: Para pruebas en local
//const API_URL_LOCAL = "http://localhost:4000/api";

// 2. Producción: URL del backend desplegado en Render
const API_URL_PRODUCTION = "https://prevensap-backend.onrender.com/api";

const api = axios.create({
  // ✅ Para PRODUCCIÓN, descomenta esta línea y comenta la de desarrollo:
  baseURL: API_URL_PRODUCTION,

  // --- Configuración para DESARROLLO LOCAL ---
   //baseURL: API_URL_LOCAL,

  headers: { "Content-Type": "application/json" },
});

// request interceptor: agrega token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor: si 401 -> limpiar y mandar a login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o no autorizado.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // si no estamos ya en login, redirigir
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
