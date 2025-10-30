
// backend/server.js
const http = require('http');
const app = require("./src/app");
const { initSocket } = require('./src/socket');
const { startTrainingReminderScheduler } = require('./src/services/scheduler.service.js');

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);

// Inicializar Socket.IO
initSocket(httpServer);

// Iniciar el servidor HTTP PRIMERO para responder a los health checks de Render
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor HTTP y WebSocket corriendo en http://localhost:${PORT}`);
  
  // Una vez que el servidor está corriendo, iniciar las tareas programadas.
  // Esto evita que el scheduler retrase el arranque inicial.
  startTrainingReminderScheduler();
});
