import React, { useState, useEffect } from 'react';
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
  Pencil,
  Plus,
  Upload,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, documentsApi, Projeto, Documento } from '@/lib/api'; // Importando da API

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { hasPermission } = useAuth();
  
  // Estados para os dados da API
  const [project, setProject] = useState<Projeto | null>(null);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para controle da UI
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
        // Busca os dados do projeto e dos documentos em paralelo
        const [projectData, documentsData] = await Promise.all([
          projectsApi.getProjectById(projectId),
          documentsApi.getDocumentsByProjectId(projectId)
        ]);
        setProject(projectData);
        setDocuments(documentsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  // Renderiza o estado de carregamento
  if (isLoading) {
    return <AppLayout><div>Carregando detalhes do projeto...</div></AppLayout>;
  }

  // Renderiza o estado de erro ou se o projeto não for encontrado
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

  const { criador, usuarios, aprovadores } = project;

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
            {/* O campo 'status' foi removido pois não existe no schema da API */}
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
                        {/* O campo 'description' e as datas foram removidos pois não existem no schema da API */}
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
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            {/* Tabela de Documentos */}
          </TabsContent>

          <TabsContent value="team">
            <Card>
                <CardHeader>
                    <CardTitle>Equipe do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Perfil</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Renderiza a lista de usuários e aprovadores */}
                            {[...usuarios, ...aprovadores].map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.nome}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{member.perfil}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
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
