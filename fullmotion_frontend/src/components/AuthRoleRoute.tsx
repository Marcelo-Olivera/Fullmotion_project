// src/components/AuthRoleRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe seu hook de autenticação


// Se UserRole não estiver no frontend em um arquivo compartilhado, defina-o aqui:

enum UserRole {
  ADMIN = 'admin',
  PHYSIOTHERAPIST = 'physiotherapist',
  PATIENT = 'patient',
}


interface AuthRoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[]; // Lista de roles permitidas para esta rota
}

const AuthRoleRoute: React.FC<AuthRoleRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Se o estado de autenticação ainda está carregando, não renderize nada (ou um loader)
  if (isAuthenticated === null) {
    return null; // Ou um componente de carregamento <CircularProgress />
  }

  // Se não está autenticado, redirecione para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, mas o usuário não tem nenhuma das roles permitidas, redirecione
  // para o dashboard (ou para uma página de "acesso negado")
  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/dashboard" replace />; // Ou /acesso-negado
  }

  // Se está autenticado e tem uma das roles permitidas, renderize os componentes filhos
  return children;
};

export default AuthRoleRoute;