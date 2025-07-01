// src/data/mockProjects.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Ativo' | 'Concluído' | 'Em Espera';
  startDate: string;
  endDate: string;
  responsibleId: string;
  createdAt: string;
  updatedAt: string;
}

export const mockProjects: Project[] = [
  { 
    id: 'proj1', 
    name: 'Website Institucional', 
    description: 'Criação do novo website da empresa com foco em design moderno e responsivo.', 
    status: 'Ativo', 
    startDate: '2025-01-15', 
    endDate: '2025-06-30', 
    responsibleId: 'user1',
    createdAt: '2024-12-20',
    updatedAt: '2025-01-10'
  },
  { 
    id: 'proj2', 
    name: 'Aplicativo Mobile MVP', 
    description: 'Desenvolvimento da versão inicial do aplicativo para Android e iOS.', 
    status: 'Em Espera', 
    startDate: '2025-03-01', 
    endDate: '2025-09-30', 
    responsibleId: 'user2',
    createdAt: '2025-01-05',
    updatedAt: '2025-02-15'
  },
  { 
    id: 'proj3', 
    name: 'Sistema de CRM', 
    description: 'Implementação de um sistema de gerenciamento de relacionamento com o cliente.', 
    status: 'Ativo', 
    startDate: '2024-11-10', 
    endDate: '2025-04-15', 
    responsibleId: 'user1',
    createdAt: '2024-10-25',
    updatedAt: '2024-11-05'
  },
  { 
    id: 'proj4', 
    name: 'Automação de Marketing', 
    description: 'Desenvolvimento de ferramentas de automação para campanhas de marketing.', 
    status: 'Concluído', 
    startDate: '2024-08-01', 
    endDate: '2025-01-31', 
    responsibleId: 'user3',
    createdAt: '2024-07-15',
    updatedAt: '2025-02-01'
  },
  { 
    id: 'proj5', 
    name: 'Portal de E-learning', 
    description: 'Plataforma online para cursos e treinamentos corporativos.', 
    status: 'Ativo', 
    startDate: '2025-02-01', 
    endDate: '2025-08-31', 
    responsibleId: 'user2',
    createdAt: '2025-01-20',
    updatedAt: '2025-01-28'
  }
];