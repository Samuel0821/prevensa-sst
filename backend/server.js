
// backend/server.js
const http = require('http');
const app = require("./src/app");
const { initSocket } = require('./src/socket');
const { startTrainingReminderScheduler } = require('./src/services/scheduler.service.js'); // Importar el scheduler

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);

// Inicializar Socket.IO
initSocket(httpServer);

// Iniciar el servicio de tareas programadas
startTrainingReminderScheduler();

// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor HTTP y WebSocket corriendo en http://localhost:${PORT}`);
});
