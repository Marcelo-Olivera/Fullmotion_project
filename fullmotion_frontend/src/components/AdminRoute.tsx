// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe seu hook de autenticação

// Se UserRole não estiver no frontend, você pode definir um enum similar aqui:

enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}


const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth(); // Obtenha o estado de autenticação e o objeto user

  // Se o estado de autenticação ainda está carregando, não renderize nada (ou um loader)
  if (isAuthenticated === null) {
    return null; // Ou um componente de carregamento <CircularProgress />
  }

  // Se não está autenticado, redirecione para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, mas a role não é 'admin', redirecione para o dashboard
  // (ou para uma página de "acesso negado" se preferir)
  if (user?.role !== UserRole.ADMIN) { // Verifique se a role do usuário é 'admin'
    return <Navigate to="/dashboard" replace />;
  }

  // Se está autenticado e é admin, renderize os componentes filhos
  return children;
};

export default AdminRoute;