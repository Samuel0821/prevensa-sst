
// frontend-web/src/socket.js
import { io } from "socket.io-client";

// La URL de tu backend. Asegúrate de que esta sea la correcta para tu entorno.
// En desarrollo, probablemente será http://localhost:4000
const URL = "http://localhost:4000";

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
