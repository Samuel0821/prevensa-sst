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

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN Y DESARROLLO ---
const allowedOrigins = [
  // Entornos de desarrollo
  "http://localhost:8081", // Móvil (Android Studio)
  "http://localhost:19006",// Móvil (Expo)
  "http://localhost:3000",  // Frontend Web (Create React App)
  "http://localhost:5173",  // Frontend Web (Vite)

  // Entornos de producción
  "https://prevensa-sst-22953878-fc82c.web.app" // ✅ URL CORRECTA de tu frontend en Firebase
];

// --- LÓGICA DE CORS CORREGIDA ---
// Esta nueva configuración permite orígenes de la lista Y peticiones sin origen (como las de la app móvil nativa)
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite peticiones sin 'origin' (como apps móviles o Postman)
      if (!origin) return callback(null, true);

      // Permite peticiones si el 'origin' está en la lista de permitidos
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "La política de CORS para este sitio no permite acceso desde el origen especificado.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
