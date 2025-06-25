// src/data/mockUsers.ts
export interface User {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  status: 'Ativo' | 'Inativo';
  lastLogin?: string;
  avatar?: string;
  department?: string;
}

export const mockUsers: User[] = [
  { 
    id: 'user1', 
    name: 'João Silva', 
    email: 'joao.silva@filehub.com', 
    roleIds: ['admin'],
    status: 'Ativo',
    lastLogin: '2025-03-19 09:32:45',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Diretoria'
  },
  { 
    id: 'user2', 
    name: 'Maria Souza', 
    email: 'maria.souza@filehub.com', 
    roleIds: ['project_manager'],
    status: 'Ativo',
    lastLogin: '2025-03-18 16:45:12',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Gerência de Projetos'
  },
  { 
    id: 'user3', 
    name: 'Pedro Santos', 
    email: 'pedro.santos@filehub.com', 
    roleIds: ['common_user', 'document_manager'],
    status: 'Ativo',
    lastLogin: '2025-03-17 11:23:09',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Marketing'
  },
  { 
    id: 'user4', 
    name: 'Ana Oliveira', 
    email: 'ana.oliveira@filehub.com', 
    roleIds: ['common_user'],
    status: 'Inativo',
    lastLogin: '2025-02-28 14:12:33',
    avatar: 'https://i.pravatar.cc/150?img=9',
    department: 'Recursos Humanos'
  },
  { 
    id: 'user5', 
    name: 'Carlos Pereira', 
    email: 'carlos.pereira@filehub.com', 
    roleIds: ['project_manager', 'document_manager'],
    status: 'Ativo',
    lastLogin: '2025-03-19 08:05:57',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Tecnologia da Informação'
  }
];