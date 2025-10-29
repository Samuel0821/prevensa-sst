
const admin = require("firebase-admin");
const path = require('path');
const fs = require('fs'); // Importar el módulo fs

try {
  let serviceAccount;

  // El entorno 'production' se establece en Render
  if (process.env.NODE_ENV === 'production') {
    console.log("[INFO] Entorno de producción detectado.");
    const secretPath = '/etc/secrets/serviceAccountKey.json';
    console.log(`[INFO] Intentando leer el Secret File desde la ruta: ${secretPath}`);
    
    try {
      // Usar fs.readFileSync para leer el archivo directamente
      const fileContent = fs.readFileSync(secretPath, 'utf8');
      console.log("[SUCCESS] Secret File leído como texto.");
      serviceAccount = JSON.parse(fileContent);
      console.log("[SUCCESS] JSON del Secret File parseado correctamente.");
    } catch (readError) {
      console.error(`[ERROR] Fallo al leer o parsear el Secret File.`, readError);
      throw readError; // Propagar el error al catch principal
    }

  } else {
    console.log("[INFO] Entorno de desarrollo detectado. Buscando archivo local...");
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
      console.log("   --> FALLO EN PRODUCCIÓN: Revisa el error anterior. La causa más probable es que el Secret File no fue encontrado o es inválido. Por favor, verifica en Render -> Environment -> Secret Files que el 'Filename' sea EXACTAMENTE 'serviceAccountKey.json' y que el contenido sea el JSON correcto.");
  } else {
      console.log("   --> FALLO EN DESARROLLO: Asegúrate de tener el archivo 'serviceAccountKey.json' en 'backend/src/config'");
  }
}

module.exports = admin;
