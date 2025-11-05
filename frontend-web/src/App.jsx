
// frontend-web/src/App.jsx
import { Routes, Route, Navigate, useLocation, BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { IncidentProvider } from "./context/IncidentContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Incidents from "./pages/Incidents";
import Trainings from "./pages/Trainings";
import Users from "./pages/Users";
import Companies from "./pages/Companies";
import Login from "./pages/Login";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-gray-50">
      {!isLoginPage && <Sidebar />}
      <div className="flex flex-col flex-1">
        {!isLoginPage && <Navbar />}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
            <Route path="/incidents" element={<PrivateRoute><Incidents /></PrivateRoute>} />
            <Route path="/trainings" element={<PrivateRoute><Trainings /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --- CORRECCIÓN FINAL DE ARQUITECTURA ---
// Se elimina el <Router> duplicado de este archivo.
// El <BrowserRouter> principal ya está en `main.jsx`, que es la práctica estándar.
// Esto asegura un único contexto de navegación y estado para toda la app.
export default function App() {
  return (
    <AuthProvider>
      <IncidentProvider>
        <AppLayout />
      </IncidentProvider>
    </AuthProvider>
  );
}
