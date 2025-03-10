
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, Users, Clock, CheckCircle, Activity, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
      newGreeting = 'Good morning';
    } else if (hour < 18) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }
    
    setGreeting(`${newGreeting}, ${user?.displayName.split(' ')[0] || 'Doctor'}`);
  }, [user]);

  // In a real app, you would fetch this data from your backend
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     // Fetch data from Firebase
  //   };
  //   fetchDashboardData();
  // }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{greeting}</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening in your clinic today, {formatDate(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
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
                <p className="text-sm text-muted-foreground">Total Patients</p>
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
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
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
                <p className="text-sm text-muted-foreground">Tomorrow's Schedule</p>
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
                <p className="text-sm text-muted-foreground">Completed Today</p>
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
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                You have {stats.appointments.today} appointments scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.todaysAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary"
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
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glassmorphism h-full">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Latest patients that visited your clinic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentPatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last visit: {formatDate(new Date(patient.lastVisit), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
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
