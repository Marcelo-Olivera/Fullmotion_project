// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Certifique-se de ter 'jwt-decode' instalado: npm install jwt-decode

// Interface para o payload do token JWT decodificado
interface UserPayload {
  userId: string;
  email: string;
  role: string; // A propriedade 'role' é essencial para as permissões
  // Adicione outras propriedades do payload que você possa precisar, como 'iat', 'exp', 'sub'
}

// Interface para o tipo do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean | null; // Indica se o usuário está autenticado
  user: UserPayload | null;       // Objeto do usuário autenticado (com userId, email, role)
  login: (token: string) => void; // Função para fazer login e salvar o token
  logout: () => void;             // Função para fazer logout
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de autenticação que envolve a sua aplicação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null); // Estado para armazenar as informações do usuário

  // Função para decodificar o token JWT
  const decodeToken = useCallback((token: string): UserPayload | null => {
    try {
      const decoded: any = jwtDecode(token);
      // Garante que o payload decodificado tenha as propriedades esperadas
      if (decoded && decoded.sub && decoded.email && decoded.role) {
        return {
          userId: decoded.sub, // 'sub' é geralmente o ID do usuário no payload
          email: decoded.email,
          role: decoded.role,
        };
      }
      return null;
    } catch (error) {
      console.error("Falha ao decodificar token:", error);
      return null;
    }
  }, []);

  // Efeito que roda uma vez no carregamento para verificar o token no localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      } else {
        // Token inválido ou expirado, remove e desautentica
        localStorage.removeItem('access_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // Nenhum token encontrado
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [decodeToken]); // Dependência para useCallback

  // Função de login: salva o token e atualiza o estado de autenticação
  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setUser(decodedUser);
      setIsAuthenticated(true);
    } else {
      // Se o token não puder ser decodificado, desautentica
      localStorage.removeItem('access_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Função de logout: remove o token e limpa o estado de autenticação
  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // O valor fornecido pelo contexto
  const contextValue = { isAuthenticated, user, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};