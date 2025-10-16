// app-mobile/api/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:4000/api"; // ⚙️ Tu backend local

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor de solicitud: agrega token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!config.url.includes("/auth/login")) {
      console.warn("🔒 Token no encontrado (mobile)");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta: manejar expiración del token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o no autorizado (mobile)");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      alert("Sesión expirada. Por favor inicia sesión nuevamente.");
    }
    return Promise.reject(error);
  }
);

export default api;



