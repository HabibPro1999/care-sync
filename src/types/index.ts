
// User Roles
export type UserRole = "MainDoctor" | "Assistant" | "Doctor";

// User interface
export interface User {
  id: string;
  role: UserRole;
  displayName: string;
  email: string;
  phone?: string;
}

// Patient interface
export interface Patient {
  id: string;
  fullName: string;
  parentName: string;
  parentPhone: string;
  illness: string;
  additionalNotes?: string;
  createdAt: Date | string;
}

// Appointment status
export type AppointmentStatus = "Pending" | "Confirmed" | "Canceled" | "Done";

// Appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  assignedDoctorId: string;
  dateTime: Date | string;
  status: AppointmentStatus;
  patientName?: string; // For convenience when joined with patient data
  doctorName?: string; // For convenience when joined with user data
}

// Note interface
export interface Note {
  id: string;
  text: string;
  voiceMemoTranscription?: string;
  dateTimeCreated: Date | string;
  createdBy: string;
  createdByName?: string; // For convenience when joined with user data
}

// Analytics interface
export interface Analytics {
  id: string; // Typically in format YYYY-MM
  totalAppointments: number;
  totalCompleted: number;
  totalIncome: number;
  perDoctorStats?: Record<string, {
    doctorId: string;
    doctorName: string;
    totalAppointments: number;
    completedAppointments: number;
    income: number;
  }>;
}

// Inventory item interface
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  category: string;
  lastRestocked?: Date | string;
}

// Theme type
export type Theme = "light" | "dark" | "system";

// Language type
export type Language = "en" | "fr" | "ar";

// Direction type
export type Direction = "ltr" | "rtl";

// AppSettings interface
export interface AppSettings {
  theme: Theme;
  language: Language;
  direction: Direction;
}

// Context return types for type checking
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  clinic: string;
  login: (email: string, password: string, clinic: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}
