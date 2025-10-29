
const admin = require("firebase-admin");
const path = require('path');

try {
  let serviceAccount;

  // El entorno 'production' se establece automáticamente en Render.
  if (process.env.NODE_ENV === 'production') {
    console.log("[INFO] Entorno de producción detectado. Buscando Secret File...");
    // En Render, los Secret Files se montan en /etc/secrets/
    const secretPath = '/etc/secrets/serviceAccountKey.json';
    serviceAccount = require(secretPath);
    console.log("[INFO] Secret File cargado correctamente.");
  } else {
    console.log("[INFO] Entorno de desarrollo detectado. Buscando archivo local...");
    // En desarrollo, usamos la ruta local como antes
    const localPath = path.join(__dirname, 'serviceAccountKey.json');
    serviceAccount = require(localPath);
    console.log("[INFO] Archivo local cargado correctamente.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("✅ Firebase Admin SDK inicializado correctamente.");

} catch (error) {
  console.error("❌ Error CRÍTICO al inicializar Firebase Admin SDK:", error.message);
  if (process.env.NODE_ENV === 'production') {
      console.log("   FALLO EN PRODUCCIÓN: Asegúrate de haber creado el Secret File en Render con el nombre 'serviceAccountKey.json' y el contenido correcto.");
  } else {
      console.log("   FALLO EN DESARROLLO: Asegúrate de tener el archivo 'serviceAccountKey.json' en la carpeta 'backend/src/config'");
  }
}

module.exports = admin;
