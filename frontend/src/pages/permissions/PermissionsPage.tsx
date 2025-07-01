import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Plus,
  MoreHorizontal,
  Lock,
  Edit,
  Trash2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { mockPermissions } from '@/data/mockPermissions';
import { mockRoles } from '@/data/mockRoles';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PermissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newPermissionDialogOpen, setNewPermissionDialogOpen] = useState(false);
  const [editPermissionDialogOpen, setEditPermissionDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Get unique categories
  const categories = Array.from(new Set(mockPermissions.map(permission => permission.category)));
  
  // Filter permissions based on search term and category
  const filteredPermissions = mockPermissions.filter(permission => {
    const matchesSearchTerm = 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter;
    
    return matchesSearchTerm && matchesCategory;
  });
  
  // Group permissions by category for display
  const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof mockPermissions>);
  
  // Get roles that use a specific permission
  const getRolesWithPermission = (permissionId: string) => {
    return mockRoles.filter(role => role.permissionIds.includes(permissionId));
  };
  
  // Handle edit permission dialog
  const handleEditPermission = (permissionId: string) => {
    setSelectedPermission(permissionId);
    setEditPermissionDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Permissões</h2>
          <div className="ml-auto flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar permissões..."
                className="w-full pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={newPermissionDialogOpen} onOpenChange={setNewPermissionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Permissão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Permissão</DialogTitle>
                  <DialogDescription>
                    Defina o nome, descrição e categoria para a nova permissão.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="name">Nome da Permissão</Label>
                    <Input id="name" placeholder="Ex: Gerenciar Documentos" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        <SelectItem value="nova">Nova Categoria...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva o que esta permissão permite fazer" 
                      className="resize-none" 
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewPermissionDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setNewPermissionDialogOpen(false)}>
                    Criar Permissão
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Lista</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Lista de Permissões</CardTitle>
                <CardDescription>
                  Gerencie todas as permissões do sistema. Total: {filteredPermissions.length} permissões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Usada em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPermissions.length > 0 ? (
                        filteredPermissions.map((permission) => {
                          const rolesWithPermission = getRolesWithPermission(permission.id);
                          
                          return (
                            <TableRow key={permission.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <span>{permission.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{permission.category}</Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{permission.description}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">{rolesWithPermission.length}</Badge>
                                  <span className="text-sm text-muted-foreground">funções</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Abrir menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditPermission(permission.id)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ShieldCheck className="mr-2 h-4 w-4" />
                                      <span>Ver funções</span>
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
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhuma permissão encontrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <ShieldAlert className="mr-2 h-5 w-5" />
                        {category}
                      </CardTitle>
                      <Badge variant="secondary">{permissions.length}</Badge>
                    </div>
                    <CardDescription>
                      Permissões relacionadas a {category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50">
                          <div className="space-y-0.5">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleEditPermission(permission.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Permission Dialog */}
        <Dialog open={editPermissionDialogOpen} onOpenChange={setEditPermissionDialogOpen}>
          <DialogContent>
            {selectedPermission && (() => {
              const permission = mockPermissions.find(p => p.id === selectedPermission);
              if (!permission) return null;
              
              const rolesWithPermission = getRolesWithPermission(permission.id);
              
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Editar Permissão: {permission.name}</DialogTitle>
                    <DialogDescription>
                      Modifique os detalhes desta permissão.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="edit-name">Nome da Permissão</Label>
                      <Input id="edit-name" defaultValue={permission.name} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select defaultValue={permission.category}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="edit-description">Descrição</Label>
                      <Textarea 
                        id="edit-description" 
                        defaultValue={permission.description}
                        className="resize-none" 
                        rows={2}
                      />
                    </div>
                    
                    {rolesWithPermission.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <Label>Funções que usam esta permissão</Label>
                        <div className="max-h-40 overflow-auto rounded-md border p-2">
                          {rolesWithPermission.map(role => (
                            <div key={role.id} className="flex items-center gap-2 py-1">
                              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                              <span>{role.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditPermissionDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={() => setEditPermissionDialogOpen(false)}>
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PermissionsPage;