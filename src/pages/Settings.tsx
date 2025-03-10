
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettings } from '@/context/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { SunIcon, MoonIcon, LaptopIcon } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <DashboardLayout title="Paramètres">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-mode">Thème</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroup 
                    value={settings.theme} 
                    onValueChange={(value) => updateSettings({ theme: value as "light" | "dark" | "system" })}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2 mr-4">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="flex items-center">
                        <SunIcon className="h-4 w-4 mr-1" />
                        Clair
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="flex items-center">
                        <MoonIcon className="h-4 w-4 mr-1" />
                        Sombre
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="flex items-center">
                        <LaptopIcon className="h-4 w-4 mr-1" />
                        Système
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Langue</CardTitle>
            <CardDescription>Paramètres linguistiques de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Langue de l'interface</Label>
                <div className="grid gap-2">
                  <RadioGroup 
                    value={settings.language} 
                    onValueChange={(value) => updateSettings({ language: value as "fr" })}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fr" id="lang-fr" />
                      <Label htmlFor="lang-fr">Français</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
