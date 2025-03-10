
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { CalendarIcon, Users, Clock, BarChart, Settings, LogOut, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMobile } from '@/hooks/use-mobile';

type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
};

// Define navigation links with role-based access
const links: SidebarLink[] = [
  {
    href: '/dashboard',
    label: 'Tableau de bord',
    icon: ClipboardList,
    roles: ['MainDoctor', 'Doctor', 'Assistant'],
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: Users,
    roles: ['MainDoctor', 'Doctor', 'Assistant'],
  },
  {
    href: '/appointments',
    label: 'Rendez-vous',
    icon: Clock,
    roles: ['MainDoctor', 'Doctor', 'Assistant'],
  },
  {
    href: '/calendar',
    label: 'Calendrier',
    icon: CalendarIcon,
    roles: ['MainDoctor', 'Doctor', 'Assistant'],
  },
  {
    href: '/analytics',
    label: 'Analytique',
    icon: BarChart,
    roles: ['MainDoctor', 'Doctor'],
  },
  {
    href: '/settings',
    label: 'Paramètres',
    icon: Settings,
    roles: ['MainDoctor', 'Doctor', 'Assistant'],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  
  // Filter links based on user role
  const filteredLinks = links.filter((link) => 
    user && link.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "h-screen fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out",
        "bg-sidebar border-r border-sidebar-border flex flex-col",
        collapsed ? "w-16" : "w-64",
        isMobile && collapsed && "-translate-x-full",
        isMobile && !collapsed && "translate-x-0 shadow-xl"
      )}
    >
      <div className="py-6 px-4 border-b border-sidebar-border flex items-center justify-center">
        {collapsed ? (
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="font-semibold text-lg">MediSync</span>
          </div>
        )}
      </div>
      
      {/* Sidebar toggle button */}
      <Button 
        onClick={onToggle}
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-6 transform translate-x-1/2 rounded-full bg-sidebar-accent text-sidebar-accent-foreground shadow-md md:flex hidden"
      >
        {collapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronLeft className="h-4 w-4" />
        }
      </Button>

      <div className="flex-1 py-6 overflow-y-auto hide-scrollbar">
        <nav className="px-2 space-y-1">
          <TooltipProvider>
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Tooltip key={link.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center p-3 rounded-lg mb-1 transition-all duration-200 group",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <link.icon
                        className={cn(
                          "flex-shrink-0 transition-all duration-200",
                          collapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3"
                        )}
                      />
                      {!collapsed && <span className="font-medium">{link.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {link.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost" 
                className={cn(
                  "w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground", 
                  "justify-start"
                )}
                onClick={logout}
              >
                <LogOut className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} size={18} />
                {!collapsed && <span>Déconnexion</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Déconnexion
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default Sidebar;
