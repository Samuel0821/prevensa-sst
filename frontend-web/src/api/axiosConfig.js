//frontend-web/src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
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
      // Si no hay token, evitar continuar hacia rutas protegidas
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

      // Evitar bucles infinitos si ya estamos en login
      if (window.location.pathname !== "/login") {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
