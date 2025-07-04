import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

// Login
import Login from './pages/login/login';

// Project pages
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetails from './pages/projects/ProjectDetails';

// Document pages
import DocumentsPage from './pages/documents/DocumentsPage';

// User management pages
import UsersPage from './pages/users/UsersPage';
import RolesPage from './pages/roles/RolesPage';
import PermissionsPage from './pages/permissions/PermissionsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Project routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Project routes */}
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Project routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          
          {/* Document routes */}
          <Route path="/documents" element={<DocumentsPage />} />
          
          {/* User management routes */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          
          {/* Landing page (for reference) */}
          <Route path="/welcome" element={<Index />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
