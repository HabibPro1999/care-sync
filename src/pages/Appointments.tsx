
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, List, Search, Filter } from 'lucide-react';
import { Appointment } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppointmentCard from '@/components/AppointmentCard';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppointmentStatus } from '@/types';

// Mock function to fetch appointments
const fetchAppointments = async (): Promise<Appointment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: "a1",
      patientId: "p1",
      assignedDoctorId: "d1",
      dateTime: "2023-11-15T10:00:00Z",
      status: "Done",
      patientName: "Emma Martin",
      doctorName: "Dr. Robert"
    },
    {
      id: "a2",
      patientId: "p2",
      assignedDoctorId: "d2",
      dateTime: "2024-03-20T15:30:00Z",
      status: "Confirmed",
      patientName: "Lucas Bernard",
      doctorName: "Dr. Sophie"
    },
    {
      id: "a3",
      patientId: "p3",
      assignedDoctorId: "d1",
      dateTime: "2024-03-22T09:15:00Z",
      status: "Pending",
      patientName: "Léa Dubois",
      doctorName: "Dr. Robert"
    },
    {
      id: "a4",
      patientId: "p1",
      assignedDoctorId: "d2",
      dateTime: "2024-03-25T11:00:00Z",
      status: "Confirmed",
      patientName: "Emma Martin",
      doctorName: "Dr. Sophie"
    }
  ];
};

const Appointments = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  
  // Fetch appointments data
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });
  
  // Check if user can add appointments (only MainDoctor and Assistant)
  const canAddAppointments = user && (user.role === "MainDoctor" || user.role === "Assistant");
  
  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Search filter
    const searchMatches = 
      appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filter
    const dateMatches = selectedDate 
      ? new Date(appointment.dateTime).toDateString() === selectedDate.toDateString()
      : true;
    
    // Status filter
    const statusMatches = statusFilter === 'all' || appointment.status === statusFilter;
    
    // Doctor filter
    const doctorMatches = doctorFilter === 'all' || appointment.assignedDoctorId === doctorFilter;
    
    return searchMatches && dateMatches && statusMatches && doctorMatches;
  });
  
  // Get unique doctor IDs for filter
  const doctors = [
    ...new Set(appointments.map(appointment => appointment.assignedDoctorId)),
  ].map(id => ({
    id,
    name: appointments.find(a => a.assignedDoctorId === id)?.doctorName || id,
  }));
  
  return (
    <DashboardLayout title="Rendez-vous">
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {canAddAppointments && (
          <Button asChild>
            <Link to="/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Rendez-vous
            </Link>
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par patient ou docteur..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-2 pointer-events-auto border rounded-md w-full"
                />
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    className="text-xs h-auto py-1 px-2" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Effacer la date
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AppointmentStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Confirmed">Confirmé</SelectItem>
                    <SelectItem value="Canceled">Annulé</SelectItem>
                    <SelectItem value="Done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Docteur</Label>
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les docteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les docteurs</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <Tabs value={viewMode}>
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <div className="bg-card rounded-lg p-6 text-center">
              <p>La vue calendrier sera implémentée dans une prochaine version</p>
              <p className="text-muted-foreground mt-2">Veuillez utiliser la vue liste pour le moment</p>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun rendez-vous trouvé</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Appointments;
