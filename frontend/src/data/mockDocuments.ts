// src/data/mockDocuments.ts
export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  projectId: string;
  version: number;
  tags: string[];
  uploadedBy: string;
  description: string;
}

export const mockDocuments: Document[] = [
  { 
    id: 'doc1', 
    name: 'Requisitos do Projeto Website.pdf', 
    type: 'PDF', 
    size: '2.5MB', 
    uploadDate: '2025-01-20', 
    projectId: 'proj1', 
    version: 1, 
    tags: ['requisitos', 'website', 'especificação'],
    uploadedBy: 'user1',
    description: 'Documento contendo todos os requisitos funcionais e não funcionais do website.'
  },
  { 
    id: 'doc2', 
    name: 'Layout App Mobile.png', 
    type: 'PNG', 
    size: '1.2MB', 
    uploadDate: '2025-03-10', 
    projectId: 'proj2', 
    version: 1, 
    tags: ['layout', 'design', 'mobile'],
    uploadedBy: 'user2',
    description: 'Mockup das principais telas do aplicativo.'
  },
  { 
    id: 'doc3', 
    name: 'Plano de Projeto CRM.docx', 
    type: 'DOCX', 
    size: '1.8MB', 
    uploadDate: '2024-11-15', 
    projectId: 'proj3', 
    version: 2, 
    tags: ['planejamento', 'crm'],
    uploadedBy: 'user1',
    description: 'Plano detalhado do projeto, incluindo cronograma e alocação de recursos.'
  },
  { 
    id: 'doc4', 
    name: 'Relatório de Conclusão.pdf', 
    type: 'PDF', 
    size: '3.7MB', 
    uploadDate: '2025-02-05', 
    projectId: 'proj4', 
    version: 1, 
    tags: ['relatório', 'conclusão'],
    uploadedBy: 'user3',
    description: 'Relatório final das atividades realizadas e resultados obtidos.'
  },
  { 
    id: 'doc5', 
    name: 'Base de Dados E-learning.sql', 
    type: 'SQL', 
    size: '0.8MB', 
    uploadDate: '2025-02-12', 
    projectId: 'proj5', 
    version: 1, 
    tags: ['banco de dados', 'e-learning', 'sql'],
    uploadedBy: 'user2',
    description: 'Script de criação do banco de dados para a plataforma de e-learning.'
  },
  { 
    id: 'doc6', 
    name: 'Apresentação Website.pptx', 
    type: 'PPTX', 
    size: '5.1MB', 
    uploadDate: '2025-01-25', 
    projectId: 'proj1', 
    version: 3, 
    tags: ['apresentação', 'website'],
    uploadedBy: 'user1',
    description: 'Apresentação do conceito e funcionalidades do website para a diretoria.'
  },
  { 
    id: 'doc7', 
    name: 'Manual do Usuário App.pdf', 
    type: 'PDF', 
    size: '4.3MB', 
    uploadDate: '2025-03-15', 
    projectId: 'proj2', 
    version: 1, 
    tags: ['manual', 'app', 'usuário'],
    uploadedBy: 'user2',
    description: 'Guia completo de utilização do aplicativo mobile.'
  }
];