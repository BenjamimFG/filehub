import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">FileHub Projects User Management</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col flex-1 gap-1">
                    <p className="text-sm font-medium">Novo documento adicionado</p>
                    <p className="text-xs text-muted-foreground">
                      Maria Souza adicionou um novo documento ao projeto Website Institucional.
                    </p>
                    <p className="text-xs text-muted-foreground">2 horas atrás</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col flex-1 gap-1">
                    <p className="text-sm font-medium">Prazo de projeto se aproximando</p>
                    <p className="text-xs text-muted-foreground">
                      O projeto Sistema de CRM vence em 5 dias.
                    </p>
                    <p className="text-xs text-muted-foreground">5 horas atrás</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10" role="combobox">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="@user" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">João Silva</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    joao.silva@filehub.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Meu perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;