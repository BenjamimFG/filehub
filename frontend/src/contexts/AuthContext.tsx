import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface para os dados do usuário que serão armazenados
interface User {
  id: number;
  nome: string;
  perfil: 'ADMIN' | 'APROVADOR' | 'USUARIO';
  // Em um app real, a API poderia retornar uma lista de permissões explícitas.
  // Por agora, vamos derivá-las do perfil.
  permissions: string[];
}

// Interface que define o formato do nosso contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
  hasPermission: (permissionKey: string) => boolean; // CORREÇÃO: Adicionada a assinatura da função
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função auxiliar para determinar as permissões com base no perfil
const getPermissionsForProfile = (profile: string): string[] => {
  switch (profile) {
    case 'ADMIN':
      // ADMIN tem acesso a tudo
      return ['manage_users', 'manage_roles', 'manage_projects', 'manage_documents', 'approve_document'];
    case 'APROVADOR':
      return ['view_assigned_projects', 'upload_my_documents', 'approve_document'];
    case 'USUARIO':
      return ['view_assigned_projects', 'upload_my_documents', 'approve_document'];
    default:
      return [];
  }
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Recalcula as permissões ao carregar para garantir consistência
        const permissions = getPermissionsForProfile(parsedData.perfil);
        setUser({ ...parsedData, permissions });
      } catch (e) {
        console.error("Falha ao ler dados do usuário, limpando...", e);
        localStorage.clear();
      }
    }
  }, []);

  const login = (userData: any) => {
    const permissions = getPermissionsForProfile(userData.perfil);
    const fullUserData = { ...userData, permissions };
    setUser(fullUserData);
    localStorage.setItem('userData', JSON.stringify(fullUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
  };

  /**
   * Verifica se o usuário logado tem uma determinada permissão.
   */
  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    // O perfil ADMIN sempre tem permissão para tudo.
    if (user.perfil === 'ADMIN') return true;
    return user.permissions.includes(permissionKey);
  };

  // Objeto de valor que será fornecido pelo contexto
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission, // CORREÇÃO: Adicionada a função ao objeto de valor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook customizado para facilitar o uso do AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
