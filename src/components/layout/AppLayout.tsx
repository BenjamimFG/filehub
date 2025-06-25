import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="w-64" />
      
      <div className="flex flex-col flex-1 md:pl-64">
        <Header />
        
        <main className={cn(
          "flex-1 overflow-auto p-6"
        )}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;