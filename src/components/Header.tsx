
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Moon, Sun, Menu, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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

  const changeLanguage = (language: 'en' | 'fr' | 'ar') => {
    updateSettings({ language });
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
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-xl hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="px-4 py-3 text-sm">
              <div className="mb-3 last:mb-0">
                <div className="font-medium">New appointment request</div>
                <div className="text-muted-foreground">John Doe - 2 hours ago</div>
              </div>
              <div className="mb-3 last:mb-0">
                <div className="font-medium">Prescription reminder</div>
                <div className="text-muted-foreground">Sarah Smith - 5 hours ago</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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
              <div className="text-sm px-2 py-1.5 font-medium">Language</div>
              <div className="flex items-center gap-1 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1",
                    settings.language === "en" && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => changeLanguage("en")}
                >
                  EN
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1",
                    settings.language === "fr" && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => changeLanguage("fr")}
                >
                  FR
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1",
                    settings.language === "ar" && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => changeLanguage("ar")}
                >
                  AR
                </Button>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="/logout">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
