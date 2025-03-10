
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const isDoctor = user?.role === 'doctor';

  const sidebarLinks = [
    {
      title: 'Tableau de bord',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Rendez-vous',
      href: '/appointments',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Calendrier',
      href: '/calendar',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Analytiques',
      href: '/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Paramètres',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const SidebarContent = (
    <>
      <div className={cn(
        "flex h-16 items-center border-b px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-primary">CareSync</span>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8",
            collapsed && !isMobile && "rotate-180",
            isMobile && "md:hidden"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 pt-4">
        <nav className="grid gap-1 px-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
            
            // Hide certain links for doctor role
            if (isDoctor && (link.href === '/patients/new' || link.href === '/appointments/new')) {
              return null;
            }
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                {link.icon}
                {!collapsed && <span>{link.title}</span>}
                {collapsed && <span className="sr-only">{link.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      {!collapsed && (
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-muted-foreground">{isDoctor ? 'Médecin' : 'Administrateur'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // For mobile: use a Sheet component
  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex h-full flex-col">
              {SidebarContent}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* For desktop: regular sidebar */}
        <aside className={cn(
          "hidden md:flex flex-col border-r bg-card h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}>
          {SidebarContent}
        </aside>
      </>
    );
  }

  // For desktop: regular sidebar
  return (
    <aside className={cn(
      "flex flex-col border-r bg-card h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {SidebarContent}
    </aside>
  );
};

export default Sidebar;
