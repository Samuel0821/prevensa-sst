//backend/src/config/firebase.js
const admin = require("firebase-admin");
const path = require('path');

// --- INICIO DE LOGS DE DIAGNÓSTICO ---
console.log(`[DIAGNÓSTICO] Entorno NODE_ENV: ${process.env.NODE_ENV}`);
const firebaseVarSet = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
console.log(`[DIAGNÓSTICO] Variable FIREBASE_SERVICE_ACCOUNT_JSON está presente: ${firebaseVarSet}`);
if (firebaseVarSet) {
    console.log(`[DIAGNÓSTICO] Primeros 50 caracteres de la variable: ${process.env.FIREBASE_SERVICE_ACCOUNT_JSON.substring(0, 50)}`);
}
// --- FIN DE LOGS DE DIAGNÓSTICO ---

try {
  // Comprueba si está en producción y si la variable de entorno existe
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.log("[INFO] Intentando inicializar Firebase desde variable de entorno...");
    // Parsea las credenciales desde la variable de entorno
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK inicializado desde la variable de entorno.");
  } else {
    console.log("[INFO] Intentando inicializar Firebase desde archivo local (modo desarrollo)...");
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
      console.log("   Error crítico: No se pudo inicializar Firebase en producción. Verifica las variables de entorno en Render.");
  } else {
      console.log("   Error crítico: No se pudo inicializar Firebase en desarrollo. Verifica tu archivo serviceAccountKey.json");
  }
}

module.exports = admin;
