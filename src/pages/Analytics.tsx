
import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const appointmentData = [
  { month: 'Jan', appointments: 40 },
  { month: 'Feb', appointments: 45 },
  { month: 'Mar', appointments: 38 },
  { month: 'Apr', appointments: 50 },
  { month: 'May', appointments: 53 },
  { month: 'Jun', appointments: 42 },
];

const doctorAppointments = [
  { name: 'Dr. Dubois', appointments: 120, color: '#10b981' },
  { name: 'Dr. Petit', appointments: 80, color: '#3b82f6' },
  { name: 'Dr. Laurent', appointments: 65, color: '#6366f1' },
  { name: 'Dr. Martin', appointments: 45, color: '#ec4899' },
];

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 14500 },
  { month: 'Mar', revenue: 13800 },
  { month: 'Apr', revenue: 15000 },
  { month: 'May', revenue: 16300 },
  { month: 'Jun', revenue: 15800 },
];

// Main component
const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <DashboardLayout title="Analytiques">
      <div className="flex flex-col gap-4">
        {/* Filters & Time Range Selection */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Select 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'quarter' | 'year')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard
            title="Rendez-vous"
            value="124"
            description="+12.3% depuis le mois dernier"
            trend="up"
          />
          <AnalyticsCard
            title="Nouveaux patients"
            value="32"
            description="+5.7% depuis le mois dernier"
            trend="up"
          />
          <AnalyticsCard
            title="Revenus"
            value="15 400 €"
            description="-2.1% depuis le mois dernier"
            trend="down"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous par mois</CardTitle>
              <CardDescription>Nombre total de rendez-vous par mois</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous par médecin</CardTitle>
              <CardDescription>Répartition des rendez-vous par médecin</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={doctorAppointments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="appointments"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {doctorAppointments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
              <CardDescription>Revenus mensuels en euro</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} €`, 'Revenu']} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
