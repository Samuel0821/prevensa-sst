//backend/src/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const companyRoutes = require("./routes/company.routes");
const incidentRoutes = require("./routes/incident.routes");
const trainingRoutes = require("./routes/training.routes");
const documentRoutes = require("./routes/document.routes");
const inspectionRoutes = require("./routes/inspection.routes");
const statsRoutes = require("./routes/stats.routes");
const reportRoutes = require("./routes/report.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

// --- CONFIGURACIÓN DE CORS PARA DESARROLLO ---
// Permite el acceso desde cualquier origen para facilitar el desarrollo con 
// herramientas como Expo Go, que usan URLs de túnel dinámicas.
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Prevensap activa 🚀" });
});

module.exports = app;
