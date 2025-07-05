import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  File,
  Users,
  UserCog,
  Shield,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // 1. Importar o hook de autenticação

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth(); // 2. Obter os dados do usuário logado
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Lista completa de todos os possíveis itens do menu
  const allNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard', // Corrigido para apontar para /dashboard
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Projetos',
      href: '/projects',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Documentos',
      href: '/documents',
      icon: <File className="h-5 w-5" />
    },
    {
      name: 'Usuários',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
      adminOnly: true // 3. Adicionar uma flag para itens de admin
    }
  ];

  // 4. Filtrar os itens do menu com base no perfil do usuário
  const navItems = allNavItems.filter(item => {
    // Se o item não for exclusivo para admin, mostra sempre
    if (!item.adminOnly) {
      return true;
    }
    // Se for exclusivo para admin, verifica o perfil do usuário
    return user?.perfil === 'ADMIN';
  });

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col border-r bg-background transition-all duration-300",
          expanded ? "w-64" : "w-20",
          className
        )}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className={cn("font-semibold transition-opacity whitespace-nowrap", 
            expanded ? "opacity-100" : "opacity-0")}>
            FileHub - GED
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn("absolute right-3", expanded ? "" : "right-auto left-1/2 -translate-x-1/2")}
          >
            <ChevronRight className={cn("h-5 w-5 transition-transform", expanded ? "" : "rotate-180")} />
          </Button>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* 5. Mapeia sobre a lista já filtrada */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md py-2.5 px-3 text-sm font-medium hover:bg-muted/50 transition-colors",
                location.pathname === item.href ? "bg-muted" : "",
                expanded ? "" : "justify-center"
              )}
            >
              <span className="flex items-center justify-center">{item.icon}</span>
              <span className={cn("ml-3 whitespace-nowrap transition-all", 
                expanded ? "opacity-100" : "w-0 opacity-0 overflow-hidden")}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20" 
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r p-4 overflow-y-auto">
            <div className="h-12 flex items-center justify-between border-b mb-4">
              <h2 className="font-semibold">FileHub</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="space-y-1">
              {/* 6. Mapeia sobre a lista filtrada também no menu mobile */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-md py-2.5 px-3 text-sm font-medium hover:bg-muted/50 transition-colors",
                    location.pathname === item.href ? "bg-muted" : ""
                  )}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;