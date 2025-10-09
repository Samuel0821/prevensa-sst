const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const incidentRoutes = require("./routes/incident.routes");
const trainingRoutes = require("./routes/training.routes");
const documentRoutes = require("./routes/document.routes");
const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const inspectionRoutes = require("./routes/inspection.routes");

const app = express();

// 🔹 Middlewares base
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🔹 Rutas con multer (debe ir antes de express.json())
app.use("/api/documents", documentRoutes);

// 🔹 Middleware JSON (solo después de las rutas con multipart/form-data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Rutas generales
app.use("/api/users", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/inspections", inspectionRoutes);

// 🔹 Ruta base
app.get("/", (req, res) => {
  res.json({ message: "API Prevensa SST activa 🚀" });
});

module.exports = app;
