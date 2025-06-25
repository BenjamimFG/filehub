import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { mockProjects } from '@/data/mockProjects';
import { mockDocuments } from '@/data/mockDocuments';
import { mockUsers } from '@/data/mockUsers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Eye,
  FileIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
  User,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Get project details
  const project = mockProjects.find(p => p.id === projectId);

  // If project not found
  if (!project) {
    return (
      <AppLayout>
        <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Projeto não encontrado</AlertTitle>
          <AlertDescription>
            O projeto com o ID especificado não existe ou foi removido.
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link to="/projects">Voltar para a lista de projetos</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  // Get project documents
  const projectDocuments = mockDocuments.filter(doc => doc.projectId === projectId);

  // Get responsible user
  const responsibleUser = mockUsers.find(user => user.id === project.responsibleId);

  // Calculate project progress (placeholder calculation - in a real app, this would be based on tasks/milestones)
  const today = new Date();
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = today.getTime() - startDate.getTime();
  const rawProgress = Math.min(Math.max(elapsedDuration / totalDuration, 0), 1);
  const progress = Math.round(rawProgress * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/projects" className="text-sm text-muted-foreground hover:underline">
                Projetos
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm">{project.name}</span>
            </div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">{project.name}</h2>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Badge variant={project.status === 'Ativo' ? 'default' : project.status === 'Concluído' ? 'outline' : 'secondary'}>
              {project.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Editar Projeto
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar Documento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Documento</DialogTitle>
                  <DialogDescription>
                    Faça upload de um documento para este projeto.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                      <p className="mb-2 text-sm font-medium">Clique para selecionar ou arraste arquivos</p>
                      <p className="text-xs text-muted-foreground">Tamanho máximo: 10MB</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setUploadDialogOpen(false)}>Fazer Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Descrição</h4>
                      <p className="mt-1">{project.description}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Data de Início</h4>
                        <div className="mt-1 flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(project.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Data de Término</h4>
                        <div className="mt-1 flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(project.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Responsável</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={responsibleUser?.avatar} alt={responsibleUser?.name} />
                          <AvatarFallback>{responsibleUser?.name.charAt(0)}{responsibleUser?.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{responsibleUser?.name}</p>
                          <p className="text-xs text-muted-foreground">{responsibleUser?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status e Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">Progresso</h4>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Data de Criação</h4>
                        <div className="mt-1 flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(project.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Última Atualização</h4>
                        <div className="mt-1 flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(project.updatedAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Documentos</h4>
                      <div className="mt-1 flex items-center">
                        <FileIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{projectDocuments.length} documentos</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas atividades realizadas neste projeto.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Placeholder activity log items */}
                  <div className="flex gap-4 items-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">Maria Souza</span> adicionou um novo documento <span className="font-medium">Layout App Mobile.png</span></p>
                      <p className="text-xs text-muted-foreground">2 horas atrás</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">João Silva</span> atualizou o status do projeto para <Badge variant="default">Ativo</Badge></p>
                      <p className="text-xs text-muted-foreground">1 dia atrás</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>CP</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">Carlos Pereira</span> adicionou um comentário ao documento <span className="font-medium">Requisitos do Projeto Website.pdf</span></p>
                      <p className="text-xs text-muted-foreground">3 dias atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Ver todas as atividades
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Documentos do Projeto</CardTitle>
                  <CardDescription>Total: {projectDocuments.length} documentos</CardDescription>
                </div>
                <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Documento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Upload por</TableHead>
                        <TableHead>Data de Upload</TableHead>
                        <TableHead>Versão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectDocuments.length > 0 ? (
                        projectDocuments.map((doc) => {
                          const uploader = mockUsers.find(u => u.id === doc.uploadedBy);
                          return (
                            <TableRow key={doc.id}>
                              <TableCell className="font-medium">{doc.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.type}</Badge>
                              </TableCell>
                              <TableCell>{doc.size}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={uploader?.avatar} alt={uploader?.name} />
                                    <AvatarFallback>{uploader?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{uploader?.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{format(new Date(doc.uploadDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                              <TableCell>v{doc.version}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Abrir menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>Visualizar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>Download</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Editar metadados</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Excluir</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Nenhum documento encontrado para este projeto.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Equipe do Projeto</CardTitle>
                  <CardDescription>Membros atribuídos a este projeto</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Adicionado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Placeholder for team members */}
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={responsibleUser?.avatar} alt={responsibleUser?.name} />
                              <AvatarFallback>{responsibleUser?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{responsibleUser?.name}</p>
                              <p className="text-xs text-muted-foreground">{responsibleUser?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Responsável</TableCell>
                        <TableCell>{responsibleUser?.department}</TableCell>
                        <TableCell>{format(new Date(project.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Ver perfil</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Alterar função</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remover do projeto</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {/* Additional team members would be listed here */}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;