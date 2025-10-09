import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-gray-100">
      {!isLoginPage && <Sidebar />}
      <div className="flex flex-col flex-1">
        {!isLoginPage && <Navbar />}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            {/* Página pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <PrivateRoute>
                  <Companies />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <PrivateRoute>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <Incidents />
                </PrivateRoute>
              }
            />
            <Route
              path="/trainings"
              element={
                <PrivateRoute>
                  <Trainings />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />

            {/* Redirección general */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
