
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, Phone, FileText, Edit, Trash } from 'lucide-react';
import { Patient } from '@/types';
import { getInitials } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PatientCardProps {
  patient: Patient;
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(patient.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg truncate">{patient.fullName}</h3>
                <Badge variant="outline" className="ml-2">
                  {patient.illness}
                </Badge>
              </div>
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  <span className="truncate">{patient.parentPhone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="truncate">Parent: {patient.parentName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-secondary/50 border-t flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onView?.(patient)}>
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{patient.fullName}</DialogTitle>
              <DialogDescription>Patient Information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Parent Name</p>
                  <p className="text-sm text-muted-foreground">{patient.parentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{patient.parentPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Illness</p>
                  <p className="text-sm text-muted-foreground">{patient.illness}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {patient.additionalNotes && (
                <div>
                  <p className="text-sm font-medium">Additional Notes</p>
                  <p className="text-sm text-muted-foreground">{patient.additionalNotes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit?.(patient)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete?.(patient)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
