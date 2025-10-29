### **Manual Técnico del Proyecto Prevensap**

Este documento proporciona una descripción técnica detallada de la arquitectura, configuración y funcionalidades clave del proyecto Prevensap. Está destinado a los desarrolladores que necesiten mantener o ampliar la aplicación.

---

### **1. Descripción General de la Arquitectura**

Prevensap es una aplicación full-stack construida con una arquitectura de tres componentes principales:

1.  **Backend (Node.js, Express, PostgreSQL):** Una API RESTful que centraliza toda la lógica de negocio, la gestión de la base de datos, la autenticación y los servicios de comunicación en tiempo real (WebSockets y Notificaciones Push).
2.  **Frontend Web (React, Vite):** Una aplicación de una sola página (SPA) para el rol de `Administrador`. Proporciona una interfaz completa para la gestión de datos y visualización de estadísticas, con actualizaciones en tiempo real.
3.  **Aplicación Móvil (React Native, Expo):** Una aplicación para dispositivos Android, destinada tanto a `Administradores` como a `Usuarios`. Permite la consulta de información y el reporte de incidentes desde el campo, con un sistema de notificaciones push para alertas inmediatas.

---

### **2. Backend (`backend-api`)**

El backend está construido con Node.js y el framework Express. Utiliza Sequelize como ORM para interactuar con una base de datos PostgreSQL.

#### **2.1. Estructura de Carpetas**

*   `/config`: Configuración de la base de datos y Sequelize.
*   `/controllers`: Lógica que maneja las solicitudes (requests) y respuestas (responses).
*   `/middleware`: Funciones que se ejecutan antes de llegar a las rutas (ej. autenticación con JWT).
*   `/migrations`: Archivos para crear y modificar la estructura de la base de datos.
*   `/models`: Definiciones de los modelos de datos de Sequelize (User, Incident, etc.).
*   `/routes`: Definición de los endpoints de la API.
*   `/seeders`: Archivos para poblar la base de datos con datos iniciales.
*   `/services`: Lógica de servicios desacoplada (ej. `firebase.js` para notificaciones push).
*   `/sockets`: Lógica del servidor de WebSockets (`socket.io`).
*   `server.js`: Punto de entrada principal de la aplicación.

#### **2.2. Puesta en Marcha (Local)**

1.  **Instalar dependencias:** `npm install`
2.  **Configurar variables de entorno:**
    *   Crea un archivo `.env` en la raíz del backend.
    *   Define las variables necesarias (ver sección de Variables de Entorno).
3.  **Base de Datos:**
    *   Asegúrate de tener PostgreSQL en ejecución.
    *   Ejecuta las migraciones: `npx sequelize-cli db:migrate`
    *   (Opcional) Ejecuta los seeders: `npx sequelize-cli db:seed:all`
4.  **Iniciar el servidor:** `npm start`

#### **2.3. Funcionalidades Clave**

*   **Autenticación:** Se utiliza JSON Web Tokens (JWT). El middleware `auth.js` protege las rutas que requieren autenticación.
*   **WebSockets (`/sockets/socketManager.js`):**
    *   Se inicializa un servidor de `socket.io` que comparte el servidor HTTP de Express.
    *   Cuando se crea, actualiza o elimina un incidente, el controlador correspondiente emite un evento a todos los clientes conectados (ej. `io.emit('new_incident', newIncident)`).
    *   Esto permite que el frontend web actualice su UI sin necesidad de recargar.
*   **Notificaciones Push (`/services/firebase.js`):**
    *   Utiliza el SDK de `firebase-admin`.
    *   El endpoint `/api/users/update-fcm-token` permite a la app móvil registrar o actualizar el token de un dispositivo para recibir notificaciones.
    *   La función `sendPushNotification` se utiliza para enviar una notificación a un dispositivo específico cuando se crea un nuevo incidente.

---

### **3. Frontend Web (`frontend-web`)**

Construido con React y Vite para un desarrollo y compilación rápidos. TailwindCSS se usa para el estilizado.

#### **3.1. Estructura de Carpetas (`/src`)**

*   `/components`: Componentes reutilizables (Navbar, Sidebar, etc.).
*   `/context`: Proveedores de Contexto de React para la gestión del estado global.
*   `/pages`: Componentes que representan las páginas principales de la aplicación (Dashboard, Incidents, etc.).
*   `/services`: Lógica para interactuar con la API del backend (`api.js`).
*   `main.jsx`: Punto de entrada de la aplicación. Aquí se configuran los providers de contexto.
*   `App.jsx`: Define las rutas de la aplicación usando `react-router-dom` y la lógica de `PrivateRoute`.

#### **3.2. Puesta en Marcha (Local)**

1.  **Instalar dependencias:** `npm install`
2.  **Iniciar el servidor de desarrollo:** `npm run dev`

#### **3.3. Gestión de Estado (Context API)**

*   **`AuthContext`:** Gestiona el estado de autenticación del usuario (token, datos del usuario, rol).
*   **`IncidentContext`:** Es clave para la funcionalidad en tiempo real.
    *   Establece una conexión con el servidor de WebSockets del backend.
    *   Escucha eventos (`new_incident`, `update_incident`, `delete_incident`).
    *   Cuando recibe un evento, actualiza su propio estado de `incidents`.
    *   Cualquier componente que use el hook `useIncidents` se re-renderizará automáticamente con los datos actualizados.

#### **3.4. Compilación para Producción**

*   Ejecuta `npm run build`.
*   Los archivos estáticos optimizados se generarán en la carpeta `/dist`.

---

### **4. Aplicación Móvil (`app-mobile`)**

Desarrollada con React Native y Expo, utilizando Expo Router para la navegación basada en archivos.

#### **4.1. Estructura de Carpetas**

*   `/api`: Configuración de la instancia de Axios para comunicarse con el backend.
*   `/app`: Contiene la estructura de navegación de la aplicación.
    *   `_layout.js`: Define el layout principal y la lógica de enrutamiento raíz.
    *   `(admin)` y `(user)`: Son grupos de rutas que definen los layouts y pantallas para cada rol.
    *   `index.js`: Es la pantalla de inicio de sesión.
*   `/components`: Componentes reutilizables.
*   `/src/context`: Contextos para gestionar estado (ej. `AuthContext`).
*   `/src/services`: Servicios desacoplados, como `notificationService.js`.

#### **4.2. Puesta en Marcha (Local)**

1.  **Instalar dependencias:** `npm install`
2.  **Iniciar el servidor de Expo:** `npx expo start`
3.  Escanea el código QR con la app de Expo Go en tu teléfono o ejecuta la app en un emulador de Android.

#### **4.3. Flujo de Autenticación y Navegación**

*   **`AuthProvider`:** Envuelve toda la aplicación en `app/_layout.js`.
*   **`InitialLayout` (en `app/_layout.js`):** Este componente utiliza el hook `useAuth` para verificar si un usuario está autenticado.
*   Basado en el estado `user` y `isLoading`, y en el rol del usuario, redirige automáticamente a la pantalla de login (`/`) o a los dashboards correspondientes (`/(admin)/dashboard` o `/(user)/dashboard`) usando `router.replace()`.

#### **4.4. Notificaciones Push (`src/services/notificationService.js`)**

*   **`initializeNotificationService()`:** Esta función se llama después de un login exitoso.
*   **Pasos que sigue:**
    1.  Solicita permisos de notificación al usuario.
    2.  Obtiene el `ExpoPushToken` del dispositivo.
    3.  Envía este token al backend a través del endpoint `/api/users/update-fcm-token`.
    4.  Configura listeners de notificaciones (`addNotificationResponseReceivedListener`).
*   **`handleNotificationRedirection`:** Cuando un usuario toca una notificación, esta función lee los `data` de la notificación y redirige al usuario a la pantalla correspondiente (ej. a la lista de incidentes).

---

### **5. Variables de Entorno (.env)**

#### **Backend (`backend-api/.env`)**

```
# Configuración de la Base de Datos
DB_USER=nombre_de_usuario_postgres
DB_PASSWORD=contraseña_de_postgres
DB_HOST=localhost
DB_NAME=prevensap_db
DB_PORT=5432

# Clave secreta para firmar los JWT
JWT_SECRET=tu_clave_secreta_super_segura

# URL del frontend (para la configuración de CORS)
CLIENT_URL=http://localhost:5173

# Configuración de Firebase (para Notificaciones Push)
# Debes obtener este archivo JSON desde tu consola de Firebase
GOOGLE_APPLICATION_CREDENTIALS=./path/a/tu/firebase-adminsdk.json
```

#### **Frontend Web (`frontend-web/.env.local`)**

```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

#### **Aplicación Móvil (`app-mobile/api/api.js`)**

La URL de la API se configura directamente en el archivo `api.js`. Es importante cambiarla a la URL del servidor de producción cuando se compile la app para distribución.

```javascript
// Ejemplo en app-mobile/api/api.js

const API_URL_DEVELOPMENT = 'http://TU_IP_LOCAL:3000/api';
const API_URL_PRODUCTION = 'https://prevensap-backend.onrender.com/api';

api.defaults.baseURL = API_URL_PRODUCTION; // Cambiar según el entorno
```
