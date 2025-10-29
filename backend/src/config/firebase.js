
const admin = require("firebase-admin");
const path = require('path');

try {
  // Comprueba si está en producción y si la variable de entorno existe
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Parsea las credenciales desde la variable de entorno
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK inicializado desde la variable de entorno.");
  } else {
    // Usa el archivo local para desarrollo
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    console.log("✅ Firebase Admin SDK inicializado desde el archivo local.");
  }
} catch (error) {
  console.error("❌ Error al inicializar Firebase Admin SDK:", error.message);
  if (process.env.NODE_ENV === 'production') {
      console.log("   Asegúrate de que la variable de entorno 'FIREBASE_SERVICE_ACCOUNT_JSON' esté configurada correctamente en Render.");
  } else {
      console.log("   Asegúrate de tener el archivo 'serviceAccountKey.json' en la carpeta 'backend/src/config'");
  }
}

module.exports = admin;
