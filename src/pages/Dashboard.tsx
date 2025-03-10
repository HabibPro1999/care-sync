
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, Users, Clock, CheckCircle, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    patients: 35,
    appointments: {
      today: 8,
      tomorrow: 12,
      pending: 4,
      completed: 3
    },
    todaysAppointments: [
      { id: '1', patientName: 'John Doe', time: '09:30', status: 'Confirmed' },
      { id: '2', patientName: 'Emma Wilson', time: '10:30', status: 'Confirmed' },
      { id: '3', patientName: 'Michael Brown', time: '11:30', status: 'Done' },
      { id: '4', patientName: 'Sophia Lee', time: '14:00', status: 'Confirmed' },
      { id: '5', patientName: 'James Johnson', time: '15:30', status: 'Cancelled' }
    ],
    recentPatients: [
      { id: '101', name: 'Alice Miller', lastVisit: '2023-06-15' },
      { id: '102', name: 'Robert Wilson', lastVisit: '2023-06-14' },
      { id: '103', name: 'Linda Harris', lastVisit: '2023-06-13' }
    ]
  });

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = 'Bonjour';
    } else if (hour < 18) {
      newGreeting = 'Bon après-midi';
    } else {
      newGreeting = 'Bonsoir';
    }
    
    setGreeting(`${newGreeting}, ${user?.displayName.split(' ')[0] || 'Docteur'}`);
  }, [user]);

  // In a real app, you would fetch this data from your backend
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     // Fetch data from Firebase
  //   };
  //   fetchDashboardData();
  // }, []);

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{greeting}</h1>
            <p className="text-muted-foreground mt-1">
              Voici ce qui se passe dans votre cabinet aujourd'hui, {formatDate(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glassmorphism animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patients</p>
                <h3 className="text-2xl font-semibold">{stats.patients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism animate-fade-in [animation-delay:100ms]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rendez-vous aujourd'hui</p>
                <h3 className="text-2xl font-semibold">{stats.appointments.today}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism animate-fade-in [animation-delay:200ms]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programme de demain</p>
                <h3 className="text-2xl font-semibold">{stats.appointments.tomorrow}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism animate-fade-in [animation-delay:300ms]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terminés aujourd'hui</p>
                <h3 className="text-2xl font-semibold">{stats.appointments.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="glassmorphism h-full">
            <CardHeader>
              <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
              <CardDescription>
                Vous avez {stats.appointments.today} rendez-vous programmés pour aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.todaysAppointments.map((appointment) => (
                  <Link 
                    key={appointment.id} 
                    to={`/appointments/${appointment.id}`}
                    className="block"
                  >
                    <div 
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        </div>
                      </div>
                      <div>
                        <span 
                          className={`px-3 py-1 text-xs rounded-full ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : appointment.status === 'Done' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          {appointment.status === 'Confirmed' ? 'Confirmé' : 
                           appointment.status === 'Done' ? 'Terminé' : 'Annulé'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glassmorphism h-full">
            <CardHeader>
              <CardTitle>Patients récents</CardTitle>
              <CardDescription>
                Derniers patients qui ont visité votre cabinet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/patients/${patient.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Dernière visite: {formatDate(new Date(patient.lastVisit), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">Voir</Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
