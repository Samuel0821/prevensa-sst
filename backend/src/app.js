
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

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:19006", 
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE, OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SOLUCIÓN DUAL PARA WEB Y MÓVIL ---

// 1. Para la Web: Sirve archivos desde /uploads/<archivo>
// Mantiene la compatibilidad con el cliente web existente.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 2. Para la Móvil: Sirve archivos desde /<archivo>
// Añade la nueva ruta para que la app móvil pueda acceder a los archivos directamente.
app.use(express.static(path.join(__dirname, "../uploads")));


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
