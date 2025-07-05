import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableCell, 
  TableBody, 
  Table 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, X as XIcon, ChevronsUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, usersApi, Projeto, Usuario, CreateProjectDto } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

// Componente reutilizável para seleção de múltiplos usuários
const MultiUserSelect: React.FC<{
    allUsers: Usuario[];
    selectedUsers: Usuario[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<Usuario[]>>;
    placeholder: string;
}> = ({ allUsers, selectedUsers, setSelectedUsers, placeholder }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (user: Usuario) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setOpen(false);
    };

    const handleRemove = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar usuário..." />
                        <CommandList>
                            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                            <CommandGroup>
                                {allUsers.map((user) => (
                                    <CommandItem key={user.id} onSelect={() => handleSelect(user)}>
                                        {user.nome} ({user.email})
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 min-h-[24px]">
                {selectedUsers.map(user => (
                    <Badge key={user.id} variant="secondary">
                        {user.nome}
                        <button onClick={() => handleRemove(user.id)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
};

const ProjectsPage: React.FC = () => {
  const { user: loggedInUser, hasPermission } = useAuth();
  
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [allUsers, setAllUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);

  const [projectName, setProjectName] = useState('');
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);
  const [selectedAprovadores, setSelectedAprovadores] = useState<Usuario[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const [projectsData, usersData] = await Promise.all([
        projectsApi.getProjects(),
        usersApi.getUsers(),
      ]);
      setProjects(projectsData);
      setAllUsers(usersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(intervalId);
  }, []);

  const resetFormState = () => {
    setProjectName('');
    setSelectedUsuarios([]);
    setSelectedAprovadores([]);
    setSelectedProject(null);
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUser) return alert("Erro: Usuário não está logado.");

    const payload: CreateProjectDto = {
        nome: projectName,
        criadorId: loggedInUser.id,
        usuariosIds: selectedUsuarios.map(u => u.id),
        aprovadoresIds: selectedAprovadores.map(u => u.id),
    };

    try {
        await projectsApi.createProject(payload);
        setIsCreateModalOpen(false);
        resetFormState();
        fetchData(true);
    } catch (e: any) {
        alert(`Erro ao criar projeto: ${e.message}`);
    }
  };

  const handleOpenEditModal = (project: Projeto) => {
    setSelectedProject(project);
    setProjectName(project.nome);
    // Para edição, precisamos encontrar os objetos de usuário completos a partir dos IDs
    setSelectedUsuarios(allUsers.filter(u => project.usuariosIds.includes(u.id)));
    setSelectedAprovadores(allUsers.filter(u => project.aprovadoresIds.includes(u.id)));
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProject) return;

    const payload = {
        nome: projectName,
        usuariosIds: selectedUsuarios.map(u => u.id),
        aprovadoresIds: selectedAprovadores.map(u => u.id),
    };

    try {
        await projectsApi.updateProject(selectedProject.id.toString(), payload);
        setIsEditModalOpen(false);
        resetFormState();
        fetchData(true);
    } catch (e: any) {
        alert(`Erro ao atualizar projeto: ${e.message}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
        await projectsApi.deleteProject(selectedProject.id.toString());
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
        fetchData(true);
    } catch (e: any) {
        alert(`Erro ao excluir projeto: ${e.message}`);
    }
  };

  const getUserNameById = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.nome || 'N/A';
  };

  const filteredProjects = projects.filter(project =>
    project.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <AppLayout><div>A carregar...</div></AppLayout>;
  if (error) return <AppLayout><div className="text-red-500">Erro: {error}</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar projetos..."
                className="w-full pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {hasPermission('manage_projects') && (
              <Dialog open={isCreateModalOpen} onOpenChange={(isOpen) => { setIsCreateModalOpen(isOpen); if (!isOpen) resetFormState(); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" />Novo Projeto</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <form onSubmit={handleCreateProject}>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Projeto</DialogTitle>
                      <DialogDescription>
                        Preencha as informações para criar um novo projeto.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Projeto</Label>
                        <Input 
                            id="name" 
                            placeholder="Ex: Lançamento do Produto X" 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Usuários (Opcional)</Label>
                        <MultiUserSelect
                            allUsers={allUsers}
                            selectedUsers={selectedUsuarios}
                            setSelectedUsers={setSelectedUsuarios}
                            placeholder="Selecione os usuários..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Aprovadores (Opcional)</Label>
                         <MultiUserSelect
                            allUsers={allUsers}
                            selectedUsers={selectedAprovadores}
                            setSelectedUsers={setSelectedAprovadores}
                            placeholder="Selecione os aprovadores..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar Projeto</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Criado Por</TableHead>

                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link to={`/projects/${project.id}`} className="hover:underline">{project.nome}</Link>
                    </TableCell>
                    <TableCell>{getUserNameById(project.criadorId)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link to={`/projects/${project.id}`} className="flex w-full"><Eye className="mr-2 h-4 w-4" />Visualizar</Link></DropdownMenuItem>
                                {hasPermission('manage_projects') && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleOpenEditModal(project)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedProject(project); setIsDeleteModalOpen(true); }}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Edição */}
        <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => { setIsEditModalOpen(isOpen); if (!isOpen) resetFormState(); }}>
            <DialogContent className="sm:max-w-[625px]">
                <form onSubmit={handleUpdateProject}>
                    <DialogHeader><DialogTitle>Editar Projeto: {selectedProject?.nome}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome do Projeto</Label>
                            <Input id="edit-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Usuários (Opcional)</Label>
                            <MultiUserSelect allUsers={allUsers} selectedUsers={selectedUsuarios} setSelectedUsers={setSelectedUsuarios} placeholder="Selecione usuários..."/>
                        </div>
                        <div className="space-y-2">
                            <Label>Aprovadores (Opcional)</Label>
                            <MultiUserSelect allUsers={allUsers} selectedUsers={selectedAprovadores} setSelectedUsers={setSelectedAprovadores} placeholder="Selecione aprovadores..."/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Modal de Exclusão */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>Tem certeza que deseja excluir o projeto "{selectedProject?.nome}"? Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDeleteProject}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
