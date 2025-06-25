// src/data/mockPermissions.ts
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'Usuários' | 'Projetos' | 'Documentos' | 'Sistema';
}

export const mockPermissions: Permission[] = [
  {
    id: 'manage_users',
    name: 'Gerenciar Usuários',
    description: 'Criar, editar e excluir contas de usuários.',
    category: 'Usuários'
  },
  {
    id: 'manage_roles',
    name: 'Gerenciar Funções',
    description: 'Criar, editar e excluir funções e definir suas permissões.',
    category: 'Usuários'
  },
  {
    id: 'manage_projects',
    name: 'Gerenciar Projetos',
    description: 'Criar, editar e gerenciar projetos.',
    category: 'Projetos'
  },
  {
    id: 'view_all_projects',
    name: 'Visualizar Todos os Projetos',
    description: 'Visualizar todos os projetos do sistema.',
    category: 'Projetos'
  },
  {
    id: 'edit_project_details',
    name: 'Editar Detalhes de Projetos',
    description: 'Editar informações e configurações de projetos.',
    category: 'Projetos'
  },
  {
    id: 'assign_users',
    name: 'Atribuir Usuários',
    description: 'Atribuir usuários a projetos.',
    category: 'Projetos'
  },
  {
    id: 'delete_any_project',
    name: 'Excluir Qualquer Projeto',
    description: 'Permissão para excluir qualquer projeto do sistema.',
    category: 'Projetos'
  },
  {
    id: 'manage_documents',
    name: 'Gerenciar Documentos',
    description: 'Gerenciar todos os documentos do sistema.',
    category: 'Documentos'
  },
  {
    id: 'view_all_documents',
    name: 'Visualizar Todos os Documentos',
    description: 'Visualizar todos os documentos do sistema.',
    category: 'Documentos'
  },
  {
    id: 'upload_documents',
    name: 'Fazer Upload de Documentos',
    description: 'Permissão para fazer upload de documentos em qualquer projeto.',
    category: 'Documentos'
  },
  {
    id: 'create_document_version',
    name: 'Criar Versões de Documentos',
    description: 'Adicionar novas versões aos documentos existentes.',
    category: 'Documentos'
  },
  {
    id: 'delete_any_document',
    name: 'Excluir Qualquer Documento',
    description: 'Permissão para excluir qualquer documento do sistema.',
    category: 'Documentos'
  },
  {
    id: 'view_assigned_projects',
    name: 'Visualizar Projetos Atribuídos',
    description: 'Visualizar apenas projetos aos quais o usuário está atribuído.',
    category: 'Projetos'
  },
  {
    id: 'view_my_documents',
    name: 'Visualizar Meus Documentos',
    description: 'Visualizar documentos criados pelo próprio usuário.',
    category: 'Documentos'
  },
  {
    id: 'upload_my_documents',
    name: 'Fazer Upload de Meus Documentos',
    description: 'Fazer upload de documentos em projetos aos quais o usuário está atribuído.',
    category: 'Documentos'
  },
  {
    id: 'view_public_projects',
    name: 'Visualizar Projetos Públicos',
    description: 'Visualizar apenas projetos marcados como públicos.',
    category: 'Projetos'
  },
  {
    id: 'view_public_documents',
    name: 'Visualizar Documentos Públicos',
    description: 'Visualizar apenas documentos marcados como públicos.',
    category: 'Documentos'
  }
];