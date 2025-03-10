
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Moon, Sun, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const isLight = settings.theme === 'light' || (settings.theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    updateSettings({ theme: isLight ? 'dark' : 'light' });
  };

  const changeLanguage = () => {
    updateSettings({ language: 'fr' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 px-6 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-xl hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isLight ? (
            <Moon className="h-5 w-5 transition-all" />
          ) : (
            <Sun className="h-5 w-5 transition-all" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2 gap-1">
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(user.displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-left hidden lg:block">
                  <div className="font-medium">{user?.displayName}</div>
                  <div className="text-xs text-muted-foreground">{user?.role}</div>
                </div>
              </div>
              <Avatar className="h-8 w-8 md:hidden">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.displayName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-4 py-3 border-b border-border lg:hidden">
              <div className="font-medium">{user?.displayName}</div>
              <div className="text-xs text-muted-foreground">{user?.role}</div>
            </div>
            <div className="px-2 py-1.5 border-b border-border">
              <div className="text-sm px-2 py-1.5 font-medium">Langue</div>
              <div className="flex items-center gap-1 mt-1">
                <Button
                  variant={settings.language === "fr" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={changeLanguage}
                >
                  FR
                </Button>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="/settings">Paramètres</a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="/logout">Déconnexion</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
