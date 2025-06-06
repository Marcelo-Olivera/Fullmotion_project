// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Header from "./components/Header";
import Inicio from "./pages/Inicio";
import AgendarAvaliacao from "./pages/AgendarAvaliacao";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminRoute from './components/AdminRoute'; // Continua para rotas EXCLUSIVAS de Admin
import AuthRoleRoute from './components/AuthRoleRoute'; // NOVO: Para rotas com roles específicas
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadVideoPage from './pages/UploadVideo';
import VideoManagementPage from './pages/VideoManagement';

enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}

// --- DEFINIÇÃO DO TEMA PERSONALIZADO DO MATERIAL-UI ---
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#49c5b6',
    },
  },
});

// --- COMPONENTES DE ROTA PROTEGIDA ---
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const HomeConditionalRedirect = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Inicio />;
};

// --- COMPONENTE PRINCIPAL DO APP ---
function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomeConditionalRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agendar" element={<AgendarAvaliacao />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Rota para Upload de Vídeos: Continua sendo EXCLUSIVA de Admin */}
            <Route
              path="/admin/upload-video"
              element={
                <AdminRoute>
                  <UploadVideoPage />
                </AdminRoute>
              }
            />

            {/* NOVO: Rota para Gerenciamento de Vídeos: Acessível por ADMIN e FISIOTERAPEUTA */}
            <Route
              path="/admin/manage-videos"
              element={
                <AuthRoleRoute allowedRoles={[UserRole.ADMIN, UserRole.PHYSIOTHERAPIST]}> {/* <--- MUDANÇA AQUI */}
                  <VideoManagementPage />
                </AuthRoleRoute>
              }
            />

            <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
