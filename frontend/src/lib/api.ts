import CryptoJS from 'crypto-js';

// --- CONFIGURAÇÃO E AUTENTICAÇÃO (BASE) ---

const API_BASE_URL = 'http://localhost:8080'; // A URL base da sua API Java
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-super-secret-key-for-dev';

// --- INTERFACES ATUALIZADAS (BASEADO NOS SEUS SCHEMAS) ---

// Interface para o objeto de Usuário aninhado
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  username: string;
  perfil: 'ADMIN' | 'USUARIO';
  // Adicione outros campos de usuário se necessário
}


export interface Role {
  id: string;
  nome: string;
}

// Interface para o objeto Projeto, agora com a estrutura correta
export interface Projeto {
  id: number;
  nome: string;
  criador: Usuario; // Objeto aninhado
  usuarios: Usuario[]; // Array de objetos
  aprovadores: Usuario[]; // Array de objetos
  dataCriacao: string;
  // Adicione outros campos do projeto que a API retorna
}

// Outras interfaces que você possa precisar
export interface Documento { 
    id: string;
    nome: string;
    // ... adicione outros campos do documento aqui
}


// Função de fetch autenticado (sem alterações)
async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const encryptedToken = localStorage.getItem('authToken');
    if (!encryptedToken) {
        window.location.href = '/login';
        throw new Error('Token de autenticação não encontrado.');
    }
    const token = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    // Não definir Content-Type para FormData, o navegador faz isso com o boundary correto.
    if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Sessão expirada ou não autorizada.');
    }

    return response;
}


// --- SERVIÇOS DA API ---

export const projectsApi = {
  getProjects: async (): Promise<Projeto[]> => {
    const response = await authenticatedFetch('/projetos');
    if (!response.ok) throw new Error('Falha ao buscar projetos');
    return response.json();
  },
  getProjectById: async (id: string): Promise<Projeto> => {
    const response = await authenticatedFetch(`/projetos/${id}`);
    if (!response.ok) throw new Error(`Falha ao buscar projeto com ID ${id}`);
    return response.json();
  },
  createProject: async (projectData: Omit<Projeto, 'id' | 'criador' | 'usuarios' | 'aprovadores'>): Promise<Projeto> => {
    const response = await authenticatedFetch('/projetos', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Falha ao criar projeto');
    return response.json();
  },
  updateProject: async (id: string, projectData: Partial<Projeto>): Promise<Projeto> => {
    const response = await authenticatedFetch(`/projetos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Falha ao atualizar projeto');
    return response.json();
  },
  deleteProject: async (id: string): Promise<void> => {
    const response = await authenticatedFetch(`/projetos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao excluir projeto');
  },
};

export const documentsApi = {
  submitDocument: async (formData: FormData): Promise<Documento> => {
    const response = await authenticatedFetch('/documentos/submeter', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Falha ao submeter documento');
    return response.json();
  },
  approveDocument: async (documentId: string): Promise<Documento> => {
    const response = await authenticatedFetch(`/documentos/aprovar`, {
      method: 'POST',
      body: JSON.stringify({ id: documentId }) // Verifique se a API espera um objeto
    });
    if (!response.ok) throw new Error('Falha ao aprovar documento');
    return response.json();
  },
  getDocumentsByProjectId: async (projectId: string): Promise<Documento[]> => {
    const response = await authenticatedFetch(`/documentos/projeto/${projectId}`);
    if (!response.ok) throw new Error('Falha ao buscar documentos do projeto');
    return response.json();
  },
};

export const usersApi = {
    getUsers: async (): Promise<Usuario[]> => {
        const response = await authenticatedFetch('/usuarios');
        if (!response.ok) throw new Error('Falha ao buscar usuários');
        return response.json();
    },
    updateUser: async (id: number, userData: Partial<Pick<Usuario, 'nome' | 'email' | 'perfil'>>): Promise<Usuario> => {
        const response = await authenticatedFetch(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Falha ao atualizar usuário');
        return response.json();
    },
    deleteUser: async (id: number): Promise<void> => {
        const response = await authenticatedFetch(`/usuarios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Falha ao excluir usuário');
    },
    resetPassword: async (id: number, newPassword: string): Promise<void> => {
        // A API precisa de um endpoint para isso, ex: PUT /usuarios/{id}/reset-password
        const response = await authenticatedFetch(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ novaSenha: newPassword }),
        });
        if (!response.ok) throw new Error('Falha ao redefinir a senha');
    }
};



// rolesApi agora é um objeto com um método getRoles
export const rolesApi = {
    getRoles: async (): Promise<Role[]> => {
        // Supondo que você tenha um endpoint para buscar as funções/perfis.
        // Se não tiver, você pode retornar uma lista estática aqui por enquanto.
        // Ex: return Promise.resolve([{ id: 'ADMIN', name: 'ADMIN' }, ...]);
        const mockRoles: Role[] = [
            { id: 'ADMIN', nome: 'ADMIN' },
            { id: 'USUARIO', nome: 'USUARIO' },
        ];
        return Promise.resolve(mockRoles);
    }
};