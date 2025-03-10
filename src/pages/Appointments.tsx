
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Clock, ChevronRight, Calendar } from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types';
import { formatDate } from '@/lib/utils';

const Appointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<AppointmentStatus | 'All'>('All');
  
  // Mock appointment data - in a real app, this would come from Firestore
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Marie Dupont',
      assignedDoctorId: 'd1',
      doctorName: 'Dr. Martin',
      dateTime: '2023-12-15T09:30:00',
      status: 'Pending'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Thomas Bernard',
      assignedDoctorId: 'd2',
      doctorName: 'Dr. Petit',
      dateTime: '2023-12-15T10:30:00',
      status: 'Confirmed'
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Sophie Dubois',
      assignedDoctorId: 'd1',
      doctorName: 'Dr. Martin',
      dateTime: '2023-12-15T14:00:00',
      status: 'Confirmed'
    },
    {
      id: '4',
      patientId: 'p4',
      patientName: 'Lucas Morel',
      assignedDoctorId: 'd3',
      doctorName: 'Dr. Durand',
      dateTime: '2023-12-14T11:30:00',
      status: 'Done'
    },
    {
      id: '5',
      patientId: 'p5',
      patientName: 'Emma Leroy',
      assignedDoctorId: 'd2',
      doctorName: 'Dr. Petit',
      dateTime: '2023-12-14T16:00:00',
      status: 'Canceled'
    },
    {
      id: '6',
      patientId: 'p1',
      patientName: 'Marie Dupont',
      assignedDoctorId: 'd1',
      doctorName: 'Dr. Martin',
      dateTime: '2023-12-20T09:30:00',
      status: 'Confirmed'
    }
  ]);

  // Filter appointments based on search term and active tab
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'All' || appointment.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Group appointments by date
  const appointmentsByDate = filteredAppointments.reduce((acc, appointment) => {
    const dateStr = formatDate(new Date(appointment.dateTime), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(appointmentsByDate).sort();

  // Check if user can add appointments (only MainDoctor and Assistant roles)
  const canAddAppointments = user?.role === 'MainDoctor' || user?.role === 'Assistant';

  return (
    <DashboardLayout title="Rendez-vous">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-semibold">Rendez-vous</h1>
        
        <div className="flex gap-3">
          <Button as={Link} to="/calendar" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Vue calendrier
          </Button>
          
          {canAddAppointments && (
            <Button as={Link} to="/appointments/new" className="shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Rechercher un rendez-vous par patient ou docteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="All" onValueChange={(value) => setActiveTab(value as AppointmentStatus | 'All')}>
            <TabsList className="grid grid-cols-5 mb-2">
              <TabsTrigger value="All">Tous</TabsTrigger>
              <TabsTrigger value="Pending">En attente</TabsTrigger>
              <TabsTrigger value="Confirmed">Confirmés</TabsTrigger>
              <TabsTrigger value="Done">Terminés</TabsTrigger>
              <TabsTrigger value="Canceled">Annulés</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun rendez-vous trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Aucun rendez-vous ne correspond à votre recherche.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setActiveTab('All');
            }}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateStr) => (
            <div key={dateStr}>
              <h2 className="text-xl font-medium mb-4">
                {formatDate(new Date(dateStr), 'EEEE d MMMM yyyy')}
              </h2>
              
              <div className="grid gap-4">
                {appointmentsByDate[dateStr].map((appointment) => (
                  <Link to={`/appointments/${appointment.id}`} key={appointment.id}>
                    <Card className="transition-all hover:shadow-md hover:border-primary/20">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(new Date(appointment.dateTime), 'HH:mm')} • {appointment.doctorName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span className={`mr-4 px-3 py-1 text-xs rounded-full ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : appointment.status === 'Done' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : appointment.status === 'Canceled'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {appointment.status === 'Confirmed' ? 'Confirmé' : 
                             appointment.status === 'Done' ? 'Terminé' : 
                             appointment.status === 'Canceled' ? 'Annulé' : 'En attente'}
                          </span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Appointments;
