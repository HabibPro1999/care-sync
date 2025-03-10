
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date in a consistent way
export function formatDate(date: Date | string, formatString: string = "PPP"): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatString);
}

// Format a time in a consistent way
export function formatTime(date: Date | string, formatString: string = "p"): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatString);
}

// Get initials from a name
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Generate a random color from a string (e.g., for avatar backgrounds)
export function stringToColor(str: string): string {
  if (!str) return "#4F46E5"; // Default color
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  
  return color;
}

// Format currency
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}

// Group appointments by date for calendar view
export function groupAppointmentsByDate(appointments: any[]): Record<string, any[]> {
  return appointments.reduce((acc, appointment) => {
    const dateStr = formatDate(appointment.dateTime, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(appointment);
    return acc;
  }, {} as Record<string, any[]>);
}

// Check if user has permission for a certain action
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  if (!userRole || !requiredRoles.length) return false;
  return requiredRoles.includes(userRole);
}

// Generate timeSlots for appointment booking
export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 18,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  let currentHour = startHour;
  let currentMinute = 0;
  
  while (currentHour < endHour) {
    const formattedHour = currentHour.toString().padStart(2, "0");
    const formattedMinute = currentMinute.toString().padStart(2, "0");
    slots.push(`${formattedHour}:${formattedMinute}`);
    
    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour++;
      currentMinute = 0;
    }
  }
  
  return slots;
}
