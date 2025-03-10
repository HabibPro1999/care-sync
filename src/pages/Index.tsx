
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinic, setClinic] = useState('clinicA');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const isLight = settings.theme === 'light' || (settings.theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    updateSettings({ theme: isLight ? 'dark' : 'light' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !clinic) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password, clinic);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/50">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-10 w-10">
          {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl mb-3 animate-float">
            M
          </div>
          <h1 className="text-2xl font-bold">MediSync</h1>
          <p className="text-muted-foreground mt-1">Doctor's Cabinet Dashboard</p>
        </div>
        
        <Card className="border-t-4 border-t-primary animate-scale-in glassmorphism">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-within:ring-primary/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">For demo: Use "password" for all accounts</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic</Label>
                <Input
                  id="clinic"
                  placeholder="Enter clinic ID"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">For demo: Use "clinicA"</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo accounts:</p>
          <div className="mt-1 space-x-2">
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary" 
              onClick={() => setEmail("admin@example.com")}
            >
              Main Doctor
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary" 
              onClick={() => setEmail("doctor@example.com")}
            >
              Doctor
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary" 
              onClick={() => setEmail("assistant@example.com")}
            >
              Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
