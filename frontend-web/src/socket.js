
// frontend-web/src/socket.js
import { io } from "socket.io-client";

// La URL de tu backend. Cambiada para apuntar al servidor de producción.
const URL = "https://prevensap-backend.onrender.com";

const socket = io(URL, {
  autoConnect: false, // La conexión no se iniciará automáticamente
  transports: ['websocket'], // Forzar el uso de WebSockets
});

// Opcional: Escuchar eventos de conexión y desconexión para depuración
socket.on("connect", () => {
  console.log("🔌 Conectado al servidor de WebSockets!");
});

socket.on("disconnect", () => {
  console.log("💨 Desconectado del servidor de WebSockets.");
});

export default socket;
