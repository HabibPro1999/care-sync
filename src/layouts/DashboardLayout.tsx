
import React, { useState, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-30",
        sidebarCollapsed ? "hidden" : "md:hidden"
      )} onClick={toggleSidebar} />
      
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Header toggleSidebar={toggleSidebar} title={title} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
