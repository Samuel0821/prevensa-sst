
const admin = require("firebase-admin");
const path = require('path');

// Construye la ruta al archivo de credenciales
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  // Intenta inicializar la app de Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
  console.log("✅ Firebase Admin SDK inicializado correctamente.");
} catch (error) {
  console.error("❌ Error al inicializar Firebase Admin SDK:", error.message);
  console.log("   Asegúrate de tener el archivo 'serviceAccountKey.json' en la carpeta 'backend/src/config'");
}

module.exports = admin;
