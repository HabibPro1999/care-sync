
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AppointmentCard } from '@/components/AppointmentCard';
import { Grid, Search, Plus, CalendarDays, ListFilter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Sample appointment data
const APPOINTMENTS = [
  {
    id: "1",
    patientName: "Sophie Martin",
    patientId: "p1",
    doctorName: "Dr. Dubois",
    doctorId: "d1",
    date: new Date(2023, 6, 15, 10, 30),
    status: "Confirmed"
  },
  {
    id: "2",
    patientName: "Lucas Bernard",
    patientId: "p2",
    doctorName: "Dr. Petit",
    doctorId: "d2",
    date: new Date(2023, 6, 15, 14, 0),
    status: "Pending"
  },
  {
    id: "3",
    patientName: "Camille Dupont",
    patientId: "p3",
    doctorName: "Dr. Dubois",
    doctorId: "d1",
    date: new Date(2023, 6, 17, 9, 0),
    status: "Confirmed"
  },
  {
    id: "4",
    patientName: "Thomas Martin",
    patientId: "p4",
    doctorName: "Dr. Petit",
    doctorId: "d2",
    date: new Date(2023, 6, 18, 11, 15),
    status: "Canceled"
  },
  {
    id: "5",
    patientName: "Emma Leroy",
    patientId: "p5",
    doctorName: "Dr. Dubois",
    doctorId: "d1",
    date: new Date(2023, 6, 20, 15, 30),
    status: "Done"
  }
];

const Appointments = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter appointments based on criteria
  const filteredAppointments = APPOINTMENTS.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In list view, we don't filter by date
    if (view === 'list') {
      return matchesStatus && matchesSearch;
    }
    
    // In calendar view, filter by selected date
    return (
      matchesStatus && 
      matchesSearch && 
      date && 
      appointment.date.toDateString() === date.toDateString()
    );
  });

  return (
    <DashboardLayout title="Rendez-vous">
      <div className="space-y-4">
        {/* Header with view toggle and actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <ListFilter className="mr-2 h-4 w-4" />
              Liste
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendrier
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link to="/appointments/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau rendez-vous
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient ou médecin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
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
          </CardContent>
        </Card>
        
        {/* Content based on view */}
        {view === 'list' ? (
          // List view
          <Card>
            <CardHeader>
              <CardTitle>Tous les rendez-vous</CardTitle>
              <CardDescription>
                {filteredAppointments.length} rendez-vous trouvés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      href={`/appointments/${appointment.id}`}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Aucun rendez-vous trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Calendar view
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Sélectionnez une date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md border"
                />
                <div className="mt-4 text-sm font-medium">
                  {date && `${format(date, 'EEEE dd MMMM yyyy', { locale: fr })}`}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  Rendez-vous {date ? `du ${format(date, 'dd/MM/yyyy')}` : ''}
                </CardTitle>
                <CardDescription>
                  {filteredAppointments.length} rendez-vous trouvés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        href={`/appointments/${appointment.id}`}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Aucun rendez-vous pour cette date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
