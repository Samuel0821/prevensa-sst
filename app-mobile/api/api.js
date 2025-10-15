//app-mobile/api/api.js
import axios from "axios";

const isWeb = typeof window !== "undefined";

// ✅ Usa localhost para navegador y la IP de tu PC para móvil físico
const baseURL = isWeb
  ? "http://localhost:4000/api"
  : "http://10.123.156.232:4000/api";

console.log("🌐 API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;
