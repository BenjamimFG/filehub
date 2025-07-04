import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Importe todas as suas páginas
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Login from './pages/login/Login';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetails from './pages/projects/ProjectDetails';
import DocumentsPage from './pages/documents/DocumentsPage';
import UsersPage from './pages/users/UsersPage';
import RolesPage from './pages/roles/RolesPage';
import PermissionsPage from './pages/permissions/PermissionsPage';

const queryClient = new QueryClient();

/**
 * Componente que protege uma rota.
 * Ele verifica se o 'authToken' existe no localStorage.
 * Se não existir, redireciona o usuário para a página de login.
 */
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // Redireciona para /login, guardando a página que o usuário tentou acessar
    // para que ele possa ser redirecionado de volta após o login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Componente que agrupa todas as rotas privadas da aplicação.
 * Todas as rotas definidas aqui serão automaticamente protegidas.
 */
const PrivateRoutes = () => (
  // O AppLayout pode envolver todas as rotas privadas se você tiver um.
  // <AppLayout>
  <Routes>
    {/* Rota padrão para redirecionar para o dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    {/* Rotas do Dashboard e outras */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
    <Route path="/documents" element={<DocumentsPage />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="/roles" element={<RolesPage />} />
    <Route path="/permissions" element={<PermissionsPage />} />
    
    {/* Rota 404 para caminhos não encontrados dentro da área privada */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  // </AppLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas: Acessíveis a todos */}
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Index />} />

          {/* Rotas Privadas: Qualquer outro caminho (/*) será protegido pelo PrivateRoute */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <PrivateRoutes />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
