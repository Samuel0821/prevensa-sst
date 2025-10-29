
// frontend-web/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Proveedores de Contexto
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { NotificationProvider } from "./context/NotificationContext";
import { IncidentProvider } from "./context/IncidentContext"; // 1. Importar el nuevo proveedor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <IncidentProvider> { /* 2. Envolver la App con el IncidentProvider */ }
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </IncidentProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
