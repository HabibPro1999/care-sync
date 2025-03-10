
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, Edit, CheckCircle, X, Calendar } from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types';
import { formatDate, formatTime, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AppointmentCardProps {
  appointment: Appointment;
  onView?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onUpdateStatus?: (appointment: Appointment, status: AppointmentStatus) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onView,
  onEdit,
  onUpdateStatus
}) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {appointment.patientName ? getInitials(appointment.patientName) : 'P'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-lg truncate">
                  {appointment.patientName || 'Patient Name'}
                </h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{formatDate(appointment.dateTime, 'PPP')}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{formatTime(appointment.dateTime)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dr. {appointment.doctorName || 'Doctor'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-secondary/50 border-t">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(appointment)}
          >
            View Details
          </Button>
          
          <div className="flex items-center gap-2">
            {appointment.status !== 'Done' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-green-600 hover:text-green-700 hover:bg-green-100" 
                onClick={() => onUpdateStatus?.(appointment, 'Done')}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            
            {appointment.status !== 'Canceled' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-600 hover:text-red-700 hover:bg-red-100" 
                onClick={() => onUpdateStatus?.(appointment, 'Canceled')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground" 
              onClick={() => onEdit?.(appointment)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
