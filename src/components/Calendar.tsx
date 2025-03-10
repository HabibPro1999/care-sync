
import React, { useState } from 'react';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Appointment } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarProps {
  appointments: Appointment[];
  onDayClick?: (date: Date) => void;
  onAddAppointment?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  appointments,
  onDayClick,
  onAddAppointment,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  // Filter appointments for the selected date
  const selectedDateStr = selectedDate ? formatDate(selectedDate, 'yyyy-MM-dd') : '';
  const appointmentsForDay = appointments.filter(appointment => {
    const appointmentDate = formatDate(appointment.dateTime, 'yyyy-MM-dd');
    return appointmentDate === selectedDateStr;
  });

  // Sort appointments by time
  const sortedAppointments = [...appointmentsForDay].sort((a, b) => {
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDayClick?.(date);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 glassmorphism">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            {selectedDate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddAppointment?.(selectedDate)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CalendarPrimitive
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="pointer-events-auto"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 glassmorphism">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>
                {selectedDate
                  ? formatDate(selectedDate, 'MMMM d, yyyy')
                  : 'Select a date'}
              </CardTitle>
              <span className="text-muted-foreground text-sm">
                {selectedDate
                  ? formatDate(selectedDate, 'EEEE')
                  : ''}
              </span>
            </div>

            <Tabs defaultValue="day" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day" onClick={() => setView('day')}>Day</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setView('week')}>Week</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setView('month')}>Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <ScrollArea className="h-[calc(100vh-350px)] hide-scrollbar">
            {sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 bg-secondary rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {appointment.patientName || 'Patient Name'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(appointment.dateTime)}
                        </div>
                      </div>
                      <div>
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : appointment.status === 'Done' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : appointment.status === 'Canceled'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Dr. {appointment.doctorName || 'Doctor'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-350px)]">
                <p className="text-muted-foreground">No appointments for this day</p>
                <Button 
                  variant="link" 
                  onClick={() => onAddAppointment?.(selectedDate || new Date())}
                >
                  Add an appointment
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
