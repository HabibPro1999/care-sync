
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppSettings, SettingsContextType, Theme, Language, Direction } from "@/types";

// Create the Settings Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Get system theme preference
const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

// Helper to get effective theme
const getEffectiveTheme = (theme: Theme): "light" | "dark" => {
  return theme === "system" ? getSystemTheme() : theme;
};

// Get direction based on language
const getDirectionFromLanguage = (language: Language): Direction => {
  return language === "ar" ? "rtl" : "ltr";
};

// Default settings
const defaultSettings: AppSettings = {
  theme: "system",
  language: "en",
  direction: "ltr"
};

// SettingsProvider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    }
    return defaultSettings;
  });
  
  // Update settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // If language is updated, also update direction
      if (newSettings.language) {
        updated.direction = getDirectionFromLanguage(newSettings.language);
      }
      
      return updated;
    });
  };
  
  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    
    // Apply theme to document
    const effectiveTheme = getEffectiveTheme(settings.theme);
    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply direction to document
    document.documentElement.dir = settings.direction;
    document.documentElement.lang = settings.language;
    
  }, [settings]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (getSystemTheme() === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.theme]);
  
  // Context value
  const value = {
    settings,
    updateSettings
  };
  
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

// Custom hook for using the Settings Context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  
  return context;
};
