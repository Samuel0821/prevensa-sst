// backend/src/config/db.js
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// 📁 Crear carpeta para la base de datos si no existe
const dbDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// 📦 Ruta del archivo SQLite
const dbPath = path.join(dbDir, "prevensa.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

// ------------------------------
// 🧍 USERS
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// ------------------------------
// 🏢 COMPANIES
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  nit TEXT,
  address TEXT,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// ------------------------------
// 🚨 INCIDENTS
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  title TEXT,
  description TEXT,
  photo TEXT,
  location TEXT,
  status TEXT DEFAULT 'open',
  reported_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (reported_by) REFERENCES users(id)
)
`).run();

// ✅ Verificar si existe la columna 'photo' (por compatibilidad con versiones anteriores)
try {
  const columns = db.prepare("PRAGMA table_info(incidents)").all();
  const hasPhotoColumn = columns.some((col) => col.name === "photo");

  if (!hasPhotoColumn) {
    console.log("🛠️ Agregando columna 'photo' a la tabla incidents...");
    db.prepare("ALTER TABLE incidents ADD COLUMN photo TEXT").run();
    console.log("✅ Columna 'photo' agregada correctamente.");
  }
} catch (err) {
  console.error("⚠️ Error verificando/creando columna 'photo':", err.message);
}

// ------------------------------
// 🎓 TRAININGS
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS trainings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  topic TEXT,
  trainer TEXT,
  date TEXT,
  participants INTEGER,
  status TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
)
`).run();

// ------------------------------
// 🔍 INSPECTIONS
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS inspections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  inspector TEXT,
  area TEXT,
  findings TEXT,
  recommendations TEXT,
  date TEXT,
  status TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
)
`).run();

// ------------------------------
// 📄 DOCUMENTS
// ------------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  title TEXT,
  filename TEXT,
  uploaded_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id)
)
`).run();

console.log("🟢 Base de datos inicializada correctamente.");
module.exports = db;
