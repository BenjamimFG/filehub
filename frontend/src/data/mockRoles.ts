// src/data/mockRoles.ts
export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  description: string;
  createdAt: string;
}

export const mockRoles: Role[] = [
  { 
    id: 'admin', 
    name: 'Administrador', 
    permissionIds: ['manage_users', 'manage_roles', 'manage_projects', 'manage_documents', 'delete_any_document', 'delete_any_project'],
    description: 'Acesso completo ao sistema, incluindo gerenciamento de usuários e funções.',
    createdAt: '2024-11-01'
  },
  { 
    id: 'project_manager', 
    name: 'Gerente de Projeto', 
    permissionIds: ['manage_projects', 'view_all_documents', 'upload_documents', 'edit_project_details', 'assign_users'],
    description: 'Pode criar e gerenciar projetos, visualizar documentos e atribuir usuários.',
    createdAt: '2024-11-01'
  },
  { 
    id: 'document_manager', 
    name: 'Gerente de Documentos', 
    permissionIds: ['manage_documents', 'view_all_documents', 'upload_documents', 'create_document_version'],
    description: 'Responsável pelo gerenciamento de documentos e controle de versões.',
    createdAt: '2024-11-05'
  },
  { 
    id: 'common_user', 
    name: 'Usuário Comum', 
    permissionIds: ['view_assigned_projects', 'view_my_documents', 'upload_my_documents'],
    description: 'Acesso limitado aos projetos atribuídos e seus próprios documentos.',
    createdAt: '2024-11-05'
  },
  { 
    id: 'guest', 
    name: 'Visitante', 
    permissionIds: ['view_public_projects', 'view_public_documents'],
    description: 'Pode visualizar apenas projetos e documentos públicos.',
    createdAt: '2024-12-10'
  }
];