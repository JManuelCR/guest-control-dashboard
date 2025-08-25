import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login/login.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import NotFound from "./pages/notFound/notFound.jsx";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta raíz - redirigir según autenticación */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DataProvider>
              <Dashboard />
            </DataProvider>
          </ProtectedRoute>
        }
      />

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
