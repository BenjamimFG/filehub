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
  Shield,
  Edit,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { mockRoles } from '@/data/mockRoles';
import { mockPermissions } from '@/data/mockPermissions';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const RolesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Filter roles based on search term
  const filteredRoles = mockRoles.filter(role => {
    if (searchTerm === '') return true;
    return (
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group permissions by category for the permission selection UI
  const permissionsByCategory = mockPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof mockPermissions>);

  // Get role permissions
  const getRolePermissions = (permissionIds: string[]) => {
    return permissionIds.map(id => {
      const permission = mockPermissions.find(p => p.id === id);
      return permission ? permission.name : 'Desconhecida';
    });
  };

  // Permission count by category
  const getPermissionCountByCategory = (role: typeof mockRoles[0], category: string) => {
    const categoryPermissions = mockPermissions.filter(p => p.category === category);
    const rolePermissionsInCategory = categoryPermissions.filter(p => role.permissionIds.includes(p.id));
    return `${rolePermissionsInCategory.length}/${categoryPermissions.length}`;
  };

  // Handle opening the edit role dialog
  const handleEditRole = (roleId: string) => {
    setSelectedRole(roleId);
    setEditRoleDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Funções</h2>
          <div className="ml-auto flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar funções..."
                className="w-full pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Função
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Função</DialogTitle>
                  <DialogDescription>
                    Defina o nome, descrição e permissões para a nova função.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="name">Nome da Função</Label>
                    <Input id="name" placeholder="Ex: Gerente de Projeto" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva o propósito e as responsabilidades desta função" 
                      className="resize-none" 
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Permissões</Label>
                    <Tabs defaultValue="Usuários" className="w-full">
                      <TabsList className="mb-4 w-full justify-start overflow-auto">
                        {Object.keys(permissionsByCategory).map((category) => (
                          <TabsTrigger key={category} value={category} className="px-4">
                            {category} <Badge variant="secondary" className="ml-2">{permissionsByCategory[category].length}</Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                        <TabsContent key={category} value={category} className="p-0">
                          <Card>
                            <CardHeader className="p-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{category}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Checkbox id={`select-all-${category}`} />
                                  <Label htmlFor={`select-all-${category}`} className="text-sm">Selecionar todos</Label>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="grid gap-2 p-3">
                              {permissions.map((permission) => (
                                <div className="flex items-center space-x-2" key={permission.id}>
                                  <Checkbox id={`permission-${permission.id}`} />
                                  <div>
                                    <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                                      {permission.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewRoleDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setNewRoleDialogOpen(false)}>
                    Criar Função
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Funções</CardTitle>
            <CardDescription>
              Gerencie as funções do sistema e suas respectivas permissões. Total: {filteredRoles.length} funções.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[200px]">Permissões</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span>{role.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{role.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary">{role.permissionIds.length}</Badge>
                            <span className="text-sm text-muted-foreground">permissões</span>
                            <Button variant="ghost" size="sm" className="h-8 ml-1" onClick={() => handleEditRole(role.id)}>
                              <span className="text-xs">Ver detalhes</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(role.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma função encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            {selectedRole && (() => {
              const role = mockRoles.find(r => r.id === selectedRole);
              if (!role) return null;
              
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Editar Função: {role.name}</DialogTitle>
                    <DialogDescription>
                      Modifique os detalhes e permissões desta função.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="edit-name">Nome da Função</Label>
                      <Input id="edit-name" defaultValue={role.name} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="edit-description">Descrição</Label>
                      <Textarea 
                        id="edit-description" 
                        defaultValue={role.description}
                        className="resize-none" 
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Permissões</Label>
                        <Badge variant="secondary">{role.permissionIds.length} de {mockPermissions.length} permissões</Badge>
                      </div>
                      <Tabs defaultValue="Usuários" className="w-full">
                        <TabsList className="mb-4 w-full justify-start overflow-auto">
                          {Object.keys(permissionsByCategory).map((category) => (
                            <TabsTrigger key={category} value={category} className="px-4">
                              {category} <Badge variant="secondary" className="ml-2">{getPermissionCountByCategory(role, category)}</Badge>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                          <TabsContent key={category} value={category} className="p-0">
                            <Card>
                              <CardHeader className="p-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{category}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id={`edit-select-all-${category}`} />
                                    <Label htmlFor={`edit-select-all-${category}`} className="text-sm">Selecionar todos</Label>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="grid gap-2 p-3">
                                {permissions.map((permission) => (
                                  <div className="flex items-center space-x-2" key={permission.id}>
                                    <Checkbox 
                                      id={`edit-permission-${permission.id}`} 
                                      checked={role.permissionIds.includes(permission.id)}
                                    />
                                    <div>
                                      <Label htmlFor={`edit-permission-${permission.id}`} className="font-medium">
                                        {permission.name}
                                      </Label>
                                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={() => setEditRoleDialogOpen(false)}>
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

export default RolesPage;