const admin = require("firebase-admin");
const path = require('path');
const fs = require('fs');

// Bandera para saber si Firebase Admin se inicializó
let firebaseAdminInitialized = false;

try {
  let serviceAccount;

  if (process.env.NODE_ENV === 'production') {
    // --- LÓGICA DE PRODUCCIÓN (RENDER) ---
    console.log("[INFO] Entorno de producción detectado.");
    const secretPath = '/etc/secrets/serviceAccountKey.json';
    
    // Verificamos si el archivo existe ANTES de intentar leerlo
    if (fs.existsSync(secretPath)) {
      const fileContent = fs.readFileSync(secretPath, 'utf8');
      serviceAccount = JSON.parse(fileContent);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseAdminInitialized = true;
      console.log("✅ Firebase Admin SDK inicializado correctamente.");

    } else {
      // Si el archivo no existe, no detenemos la app, solo advertimos.
      throw new Error("El Secret File 'serviceAccountKey.json' no fue encontrado en Render.");
    }

  } else {
    // --- LÓGICA DE DESARROLLO (LOCAL) ---
    console.log("[INFO] Entorno de desarrollo detectado.");
    const localPath = path.join(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(localPath)) {
      serviceAccount = require(localPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseAdminInitialized = true;
      console.log("✅ Firebase Admin SDK inicializado correctamente desde archivo local.");
    } else {
      throw new Error("El archivo 'serviceAccountKey.json' no fue encontrado localmente.");
    }
  }
} catch (error) {
  // --- CAPTURA DE ERRORES (NO DETIENE LA APP) ---
  console.error("🔥 ALERTA CRÍTICA: Firebase Admin SDK NO se pudo inicializar.");
  console.warn(`   -> Causa: ${error.message}`);
  console.warn("   -> Consecuencia: Las notificaciones push NO funcionarán.");
  console.warn("   -> Para solucionarlo en producción, asegúrate de que el Secret File exista y sea correcto en Render.");
}

// Exportamos el objeto admin y la bandera de estado
module.exports = {
  admin,
  isFirebaseInitialized: () => firebaseAdminInitialized
};
