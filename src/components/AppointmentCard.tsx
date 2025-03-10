
import React from 'react';
import { CalendarIcon, Clock, User } from 'lucide-react';
import { Appointment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

export interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, showPatient = true }) => {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Link to={`/appointments/${appointment.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              {showPatient && appointment.patientName && (
                <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
              )}
              <Badge className={getStatusColor(appointment.status)} variant="outline">
                {appointment.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="grid gap-2">
            <div className="flex items-center text-sm">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span>{formatDate(appointment.dateTime, 'PPP')}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 opacity-70" />
              <span>{formatDate(appointment.dateTime, 'p')}</span>
            </div>
            {appointment.doctorName && (
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 opacity-70" />
                <span>Dr. {appointment.doctorName}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AppointmentCard;
