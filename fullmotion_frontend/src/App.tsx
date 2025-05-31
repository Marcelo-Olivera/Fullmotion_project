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

// Componente para proteger rotas (sem alterações aqui)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente auxiliar para a rota "/" que redireciona condicionalmente
const HomeConditionalRedirect = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return null; // ou um loader simples, se preferir
  }

  // Se o usuário está autenticado, redireciona para o dashboard
  // Caso contrário, renderiza o componente Inicio
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Inicio />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Rota raiz: Lida com o redirecionamento ou renderiza Inicio */}
          <Route path="/" element={<HomeConditionalRedirect />} />

          {/* A rota /login existe para que o usuário possa ir explicitamente para ela */}
          <Route path="/login" element={<Login />} />

          {/* Rota de Agendamento (pode ser acessível sem login) */}
          <Route path="/agendar" element={<AgendarAvaliacao />} />

          {/* Rota para o Dashboard (protegida - requer login) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App;