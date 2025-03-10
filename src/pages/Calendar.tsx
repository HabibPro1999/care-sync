
import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, List, ViewIcon } from 'lucide-react';

// Sample appointments data for display
const APPOINTMENTS = [
  {
    id: "1",
    patientName: "Sophie Martin",
    doctorName: "Dr. Dubois",
    date: new Date(2023, 6, 15, 10, 30),
    status: "Confirmed"
  },
  {
    id: "2",
    patientName: "Lucas Bernard",
    doctorName: "Dr. Petit",
    date: new Date(2023, 6, 15, 14, 0),
    status: "Pending"
  },
  {
    id: "3",
    patientName: "Camille Dupont",
    doctorName: "Dr. Dubois",
    date: new Date(2023, 6, 17, 9, 0),
    status: "Confirmed"
  }
];

type ViewMode = 'day' | 'week' | 'month';

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  
  // Get appointments for the selected date
  const filteredAppointments = APPOINTMENTS.filter(appointment => {
    if (viewMode === 'day') {
      return appointment.date.toDateString() === date.toDateString();
    }
    return true; // In week/month view, show all appointments for demo
  });

  return (
    <DashboardLayout title="Calendrier">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Date</CardTitle>
            <CardDescription>Sélectionnez une date pour voir les rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Vue</div>
              <div className="flex space-x-2">
                <Button 
                  variant={viewMode === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  Jour
                </Button>
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  <List className="mr-1 h-4 w-4" />
                  Semaine
                </Button>
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  <ViewIcon className="mr-1 h-4 w-4" />
                  Mois
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Rendez-vous {viewMode === 'day' ? `du ${format(date, 'dd/MM/yyyy')}` : ''}
            </CardTitle>
            <CardDescription>
              {viewMode === 'day' 
                ? `${filteredAppointments.length} rendez-vous programmés` 
                : 'Vue d\'ensemble des rendez-vous'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctorName}</p>
                      <p className="text-sm">{format(appointment.date, 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">Aucun rendez-vous pour cette date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
