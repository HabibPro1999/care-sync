
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, User } from "@/types";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for demo purposes
// In a real application, you would use Firebase Authentication
const mockLogin = async (email: string, password: string, clinic: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo, hard-code some users
  const users: Record<string, User> = {
    "admin@example.com": {
      id: "user1",
      role: "MainDoctor",
      displayName: "Dr. Admin",
      email: "admin@example.com",
      phone: "+1234567890"
    },
    "doctor@example.com": {
      id: "user2",
      role: "Doctor",
      displayName: "Dr. Smith",
      email: "doctor@example.com",
      phone: "+1234567891"
    },
    "assistant@example.com": {
      id: "user3",
      role: "Assistant",
      displayName: "John Doe",
      email: "assistant@example.com",
      phone: "+1234567892"
    }
  };
  
  const user = users[email];
  
  if (!user || password !== "password") {
    throw new Error("Invalid email or password");
  }
  
  // Store in localStorage for session persistence
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("clinic", clinic);
  
  return user;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinic, setClinic] = useState<string>("");
  
  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedClinic = localStorage.getItem("clinic");
    
    if (storedUser && storedClinic) {
      setUser(JSON.parse(storedUser));
      setClinic(storedClinic);
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string, clinicId: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await mockLogin(email, password, clinicId);
      setUser(user);
      setClinic(clinicId);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    }
  };
  
  // Logout function
  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("clinic");
    setUser(null);
    setClinic("");
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    clinic,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
