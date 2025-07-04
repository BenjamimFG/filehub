import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();

  /**
   * Lida com o processo de logout do usuário.
   */
  const handleLogout = () => {
    // 1. Remove o token de autenticação do armazenamento local.
    localStorage.removeItem('authToken');

    // 2. Redireciona o usuário para a página de login.
    // O `replace: true` impede que o usuário volte para a página anterior (protegida) usando o botão "Voltar" do navegador.
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          {/* Você pode colocar o logo ou nome da aplicação aqui */}
          <a className="mr-6 flex items-center space-x-2" href="/dashboard">
            <span className="hidden font-bold sm:inline-block">FileHub</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Idealmente, a imagem viria dos dados do usuário */}
                  <AvatarImage src="/avatars/01.png" alt="Avatar do Usuário" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Usuário</p>
                  {/* Idealmente, o e-mail viria dos dados do usuário */}
                  <p className="text-xs leading-none text-muted-foreground">
                    usuario@exemplo.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* O onSelect é usado em vez de onClick para garantir o comportamento correto do menu */}
              <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
