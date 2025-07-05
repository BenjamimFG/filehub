import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Search,
  Plus,
  MoreHorizontal,
  CalendarIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, usersApi, Projeto, Usuario } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const PAGE_SIZE = 10;

const ProjectsPage: React.FC = () => {
  const { hasPermission } = useAuth();

  const [projects, setProjects] = useState<Projeto[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    const loadData = async (isInitialLoad = false) => {
      // Só mostra o indicador de "carregando" na primeira vez
      if (isInitialLoad) {
        setIsLoading(true);
      }
      try {
        setError(null);
        const [projectsData, usersData] = await Promise.all([
          projectsApi.getProjects(),
          hasPermission('manage_projects') ? usersApi.getUsers() : Promise.resolve([]),
        ]);
        setProjects(projectsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
        }
      }
    };

    // 1. Carrega os dados imediatamente quando o componente monta
    loadData(true);

    // 2. Configura um intervalo para chamar a função loadData a cada 30 segundos
    const intervalId = setInterval(() => loadData(false), 30000);

    // 3. Função de limpeza: remove o intervalo quando o componente é desmontado para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, [hasPermission]);

  const filteredProjects = projects.filter(project => {
    const matchesSearchTerm = project.nome.toLowerCase().includes(searchTerm.toLowerCase());
     
    return matchesSearchTerm  ;
  });

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <AppLayout><div>A carregar projetos...</div></AppLayout>;
  }

  if (error) {
    return <AppLayout><div className="text-red-500">Erro: {error}</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
          <div className="ml-auto flex flex-col gap-2 sm:flex-row sm:items-center">
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
              <Dialog open={projectFormOpen} onOpenChange={setProjectFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Projeto</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do projeto.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Campos do formulário aqui */}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProjectFormOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={() => setProjectFormOpen(false)}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Projetos</CardTitle>
            <CardDescription>
              Total: {filteredProjects.length} projetos encontrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Criador</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Link to={`/projects/${project.id}`} className="hover:underline">
                            {project.nome}
                          </Link>
                        </TableCell>
                        <TableCell>{project.criador.nome}</TableCell>
                        <TableCell>{new Date(project.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/projects/${project.id}`} className="flex w-full">Ver detalhes</Link>
                              </DropdownMenuItem>
                              {hasPermission('manage_projects') && <DropdownMenuItem>Editar</DropdownMenuItem>}
                              {hasPermission('manage_projects') && <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum projeto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {/* Lógica de renderização da paginação aqui */}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
