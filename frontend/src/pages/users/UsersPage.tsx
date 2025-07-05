import React, { useState, useEffect } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Check,
  X,
  UserCog,
  Trash2,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi, rolesApi, Usuario, Role } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const UsersPage: React.FC = () => {
  const { hasPermission } = useAuth();
  
  const [users, setUsers] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

  // Função para recarregar os dados
  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        usersApi.getUsers(),
        rolesApi.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasPermission('manage_users')) {
      setError('Você não tem permissão para acessar esta página.');
      setIsLoading(false);
      return;
    }
    
    fetchData(true); // Carga inicial
    const intervalId = setInterval(() => fetchData(false), 30000); // Atualiza a cada 30s

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, [hasPermission]);

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const updatedData = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        perfil: formData.get('perfil') as 'ADMIN' | 'USUARIO',
    };
    
    try {
      await usersApi.updateUser(selectedUser.id, updatedData);
      setIsEditModalOpen(false);
      fetchData(true); // Recarrega a lista com loading
    } catch (updateError: any) {
      alert(`Erro ao atualizar: ${updateError.message}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
        await usersApi.deleteUser(selectedUser.id);
        setIsDeleteModalOpen(false);
        fetchData(true); // Recarrega a lista com loading
    } catch (deleteError: any) {
        alert(`Erro ao excluir: ${deleteError.message}`);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        await usersApi.resetPassword(selectedUser.id, newPassword);
        setIsResetPassModalOpen(false);
        alert("Senha redefinida com sucesso!");
    } catch (resetError: any) {
        alert(`Erro ao redefinir senha: ${resetError.message}`);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.perfil === roleFilter)
  );

  if (isLoading) return <AppLayout><div>A carregar...</div></AppLayout>;
  if (error) return <AppLayout><div className="text-red-500">Erro: {error}</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header e Filtros */}
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por perfil" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Perfis</SelectItem>
                    {roles.map(role => (
                        <SelectItem key={role.id} value={role.nome}>{role.nome}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8"><AvatarFallback>{user.nome.charAt(0)}</AvatarFallback></Avatar>
                            <span>{user.nome}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.perfil}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}>
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Gerenciar Usuário</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsResetPassModalOpen(true); }}>
                            <Lock className="mr-2 h-4 w-4" />
                            <span>Reset de Senha</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir Usuário</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Edição de Usuário */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Usuário</DialogTitle>
              <DialogDescription>Altere o nome, e-mail e perfil do usuário.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name="nome" defaultValue={selectedUser?.nome} required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={selectedUser?.email} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil</Label>
                    <Select name="perfil" defaultValue={selectedUser?.perfil}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {roles.map(role => <SelectItem key={role.id} value={role.nome}>{role.nome}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Modal de Reset de Senha */}
        <Dialog open={isResetPassModalOpen} onOpenChange={setIsResetPassModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset de Senha</DialogTitle>
                    <DialogDescription>Digite a nova senha para {selectedUser?.nome}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleResetPassword}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input id="newPassword" name="newPassword" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsResetPassModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Redefinir Senha</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Modal de Exclusão */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o usuário {selectedUser?.nome}? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDeleteUser}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
};

export default UsersPage;
