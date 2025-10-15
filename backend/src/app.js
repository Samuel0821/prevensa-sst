// backend/src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const companyRoutes = require("./routes/company.routes");
const incidentRoutes = require("./routes/incident.routes");
const trainingRoutes = require("./routes/training.routes");
const documentRoutes = require("./routes/document.routes");
const inspectionRoutes = require("./routes/inspection.routes");

const app = express();

// -------------------------
// 🔧 Middlewares
// -------------------------
app.use(
  cors({
    origin: [
      "http://localhost:8081", // Expo Web
      "http://localhost:19006", // Expo DevTools
      "http://localhost:3000", // En caso de tener web react
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// -------------------------
// 🚀 Rutas principales
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// -------------------------
// Ruta base
// -------------------------
app.get("/", (req, res) => {
  res.json({ message: "API Prevensa SST activa 🚀" });
});

module.exports = app;
