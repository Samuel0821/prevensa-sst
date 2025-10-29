
// backend/src/socket.js
const { Server } = require("socket.io");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // En producción, deberías restringir esto a tu dominio del frontend
      methods: ["GET", "POST"]
    }
  });

  console.log("🔌 Servidor de WebSockets inicializado y escuchando.");

  io.on("connection", (socket) => {
    console.log(`✨ Nuevo cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`💨 Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado!");
  }
  return io;
}

module.exports = { initSocket, getIO };
