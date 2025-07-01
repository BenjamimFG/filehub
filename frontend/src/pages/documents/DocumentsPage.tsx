import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Download,
  Eye,
  Trash2,
  Upload,
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import { mockDocuments } from '@/data/mockDocuments';
import { mockProjects } from '@/data/mockProjects';
import { mockUsers } from '@/data/mockUsers';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const PAGE_SIZE = 10;

// File type icon mapping
const getFileIcon = (type: string) => {
  const fileType = type.toLowerCase();
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-4 w-4" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <FileImage className="h-4 w-4" />;
    case 'zip':
    case 'rar':
      return <FileArchive className="h-4 w-4" />;
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Get unique document types
  const documentTypes = useMemo(() => {
    const types = new Set(mockDocuments.map(doc => doc.type));
    return Array.from(types);
  }, []);

  // Filter documents based on search term and filters
  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(document => {
      const matchesSearchTerm = 
        document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = projectFilter === 'all' || document.projectId === projectFilter;
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      
      if (activeTab === 'all') {
        return matchesSearchTerm && matchesProject && matchesType;
      } else if (activeTab === 'recent') {
        // Recent documents - uploaded in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const uploadDate = new Date(document.uploadDate);
        return matchesSearchTerm && matchesProject && matchesType && uploadDate >= thirtyDaysAgo;
      } else if (activeTab === 'favorites') {
        // In a real app, this would check if document is favorited by user
        // For mock, just use documents with tags containing 'important'
        return matchesSearchTerm && matchesProject && matchesType && document.tags.includes('requisitos');
      }
      
      return false;
    });
  }, [searchTerm, projectFilter, typeFilter, activeTab]);
  
  // Paginate results
  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectFilter, typeFilter, activeTab]);

  // Get project name by ID
  const getProjectNameById = (projectId: string) => {
    const project = mockProjects.find(project => project.id === projectId);
    return project ? project.name : 'Desconhecido';
  };

  // Get user name by ID
  const getUserNameById = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    return user ? user.name : 'Desconhecido';
  };

  // Handle checkbox selection
  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDocuments.length === paginatedDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
        </div>

        <div className="flex flex-col gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="recent">Recentes</TabsTrigger>
                <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar documentos..."
                    className="w-full pl-8 sm:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload de Documento</DialogTitle>
                      <DialogDescription>
                        Faça upload de um novo documento ao sistema
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
                      <div className="grid gap-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um projeto" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProjects.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={() => setUploadDialogOpen(false)}>Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1" />

            {selectedDocuments.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">{selectedDocuments.length} selecionados</span>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            )}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Total: {filteredDocuments.length} documentos encontrados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={
                            paginatedDocuments.length > 0 && 
                            selectedDocuments.length === paginatedDocuments.length
                          } 
                          onCheckedChange={handleSelectAll} 
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Versão</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Data de Upload</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((document) => {
                        const uploader = mockUsers.find(user => user.id === document.uploadedBy);
                        return (
                          <TableRow key={document.id}>
                            <TableCell className="w-12">
                              <Checkbox 
                                checked={selectedDocuments.includes(document.id)} 
                                onCheckedChange={() => handleSelectDocument(document.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                  {getFileIcon(document.type)}
                                </div>
                                <div className="flex flex-col">
                                  <span>{document.name}</span>
                                  <span className="text-xs text-muted-foreground">{document.description.substring(0, 30)}...</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link to={`/projects/${document.projectId}`} className="hover:underline">
                                {getProjectNameById(document.projectId)}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{document.type}</Badge>
                            </TableCell>
                            <TableCell>{document.size}</TableCell>
                            <TableCell>v{document.version}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={uploader?.avatar} alt={uploader?.name} />
                                  <AvatarFallback>{uploader?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{getUserNameById(document.uploadedBy)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(document.uploadDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
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
                                  <DropdownMenuItem className="text-red-600">
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
                        <TableCell colSpan={9} className="h-24 text-center">
                          Nenhum documento encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredDocuments.length > PAGE_SIZE && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        // Show the first page, the last page, and 1-2 pages around the current page
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === currentPage}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return <PaginationEllipsis key={pageNumber} />;
                        }
                        return null;
                      })}
                      
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
      </div>
    </AppLayout>
  );
};

export default DocumentsPage;