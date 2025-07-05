import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  Calendar,
  Clock,
  Pencil,
  Upload,
  User,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, documentsApi, usersApi, Projeto, Documento, Usuario } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProjectDetails: React.FC = () => {
   const pathParts = location.pathname.split('/');
  const projectId = pathParts[pathParts.length - 1];
  const { hasPermission } = useAuth();
  
  const [project, setProject] = useState<Projeto | null>(null);
  const [allUsers, setAllUsers] = useState<Usuario[]>([]);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setError("ID do projeto não fornecido.");
      setIsLoading(false);
      return;
    }

    const loadProjectDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Busca os dados do projeto, todos os utilizadores e os documentos em paralelo
        const [projectData, usersData, documentsData] = await Promise.all([
          projectsApi.getProjectById(projectId),
          usersApi.getUsers(),
          documentsApi.getDocumentsByProjectId(projectId)
        ]);
        setProject(projectData);
        setAllUsers(usersData);
        setDocuments(documentsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  // CORREÇÃO: Usa useMemo para derivar os objetos de utilizador a partir dos IDs de forma eficiente.
  const criador = useMemo(() => {
    if (!project) return null;
    return allUsers.find(u => u.id === project.criadorId);
  }, [project, allUsers]);

  const usuarios = useMemo(() => {
    if (!project || !project.usuariosIds) return [];
    return allUsers.filter(u => project.usuariosIds.includes(u.id));
  }, [project, allUsers]);

  const aprovadores = useMemo(() => {
    if (!project || !project.aprovadoresIds) return [];
    return allUsers.filter(u => project.aprovadoresIds.includes(u.id));
  }, [project, allUsers]);


  if (isLoading) {
    return <AppLayout><div>A carregar detalhes do projeto...</div></AppLayout>;
  }

  if (error || !project) {
    return (
      <AppLayout>
        <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Projeto</AlertTitle>
          <AlertDescription>
            {error || "O projeto com o ID especificado não existe ou foi removido."}
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
              <span className="text-sm">{project.nome}</span>
            </div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">{project.nome}</h2>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            {hasPermission('manage_projects') && (
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Editar Projeto
              </Button>
            )}
            {hasPermission('upload_my_documents') && (
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Conteúdo do Modal de Upload */}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
            <TabsTrigger value="team">Equipe ({usuarios.length + aprovadores.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Separator />
                        {criador && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Criador</h4>
                                <div className="mt-2 flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{criador.nome.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{criador.nome}</p>
                                        <p className="text-xs text-muted-foreground">{criador.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            {/* Tabela de Documentos */}
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-blue-500" />Aprovadores</CardTitle>
                    <CardDescription>Utilizadores com permissão para aprovar itens neste projeto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilizador</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aprovadores.length > 0 ? aprovadores.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.nome}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={2} className="text-center h-24">Nenhum aprovador atribuído.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-gray-500" />Usuários</CardTitle>
                    <CardDescription>Membros da equipa com acesso geral ao projeto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilizador</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.length > 0 ? usuarios.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.nome}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={2} className="text-center h-24">Nenhum usuário atribuído.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
