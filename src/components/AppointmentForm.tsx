
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Appointment, Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import PatientForm from '@/components/PatientForm';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

// Mock function to fetch doctors
const fetchDoctors = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data
  return [
    { id: "d1", displayName: "Dr. Robert" },
    { id: "d2", displayName: "Dr. Sophie" },
  ];
};

// Mock function to fetch patients
const fetchPatients = async (): Promise<Patient[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: "p1",
      fullName: "Emma Martin",
      parentName: "Claire Martin",
      parentPhone: "+33123456789",
      illness: "Asthme",
      createdAt: "2023-07-15T14:30:00Z"
    },
    {
      id: "p2",
      fullName: "Lucas Bernard",
      parentName: "Thomas Bernard",
      parentPhone: "+33198765432",
      illness: "Dermatite",
      createdAt: "2023-08-22T09:45:00Z"
    },
    {
      id: "p3",
      fullName: "Léa Dubois",
      parentName: "Marie Dubois",
      parentPhone: "+33187654321",
      illness: "Rhinite allergique",
      createdAt: "2023-09-05T11:15:00Z"
    }
  ];
};

// Mock function to fetch appointment
const fetchAppointment = async (id: string): Promise<Appointment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    id,
    patientId: "p1",
    assignedDoctorId: "d1",
    dateTime: "2024-03-22T10:00:00Z",
    status: "Confirmed",
    patientName: "Emma Martin",
    doctorName: "Dr. Robert"
  };
};

// Generate time slots for appointments
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMin = min.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMin}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Validation schema
const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: 'Veuillez sélectionner un patient' }),
  assignedDoctorId: z.string().min(1, { message: 'Veuillez sélectionner un docteur' }),
  date: z.date({ required_error: 'Veuillez sélectionner une date' }),
  time: z.string().min(1, { message: 'Veuillez sélectionner une heure' }),
  status: z.enum(['Pending', 'Confirmed', 'Canceled', 'Done']),
  isNewPatient: z.boolean().default(false),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId');
  
  const isEditing = !!initialData;
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  
  // Parse initial date and time
  let initialDate: Date | undefined;
  let initialTime = '';
  
  if (initialData?.dateTime) {
    const dateTime = new Date(initialData.dateTime);
    initialDate = dateTime;
    initialTime = format(dateTime, 'HH:mm');
  }
  
  // Fetch doctors
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });
  
  // Fetch patients
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });
  
  // Default form values
  const defaultValues: Partial<AppointmentFormValues> = {
    patientId: initialData?.patientId || preselectedPatientId || '',
    assignedDoctorId: initialData?.assignedDoctorId || '',
    date: initialDate,
    time: initialTime,
    status: initialData?.status || 'Pending',
    isNewPatient: false,
  };
  
  // Form setup
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });
  
  // Watch isNewPatient value
  const isNewPatient = form.watch('isNewPatient');
  
  // Handle form submission
  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      // Combine date and time into a single datetime
      const { date, time, ...rest } = values;
      const [hours, minutes] = time.split(':').map(Number);
      
      const dateTime = new Date(date);
      dateTime.setHours(hours, minutes);
      
      // Submit data
      await onSubmit({
        ...rest,
        dateTime: dateTime.toISOString(),
      });
      
      toast({
        title: isEditing ? 'Rendez-vous modifié' : 'Rendez-vous ajouté',
        description: `Le rendez-vous a été ${isEditing ? 'modifié' : 'ajouté'} avec succès.`,
      });
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error submitting appointment form:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle new patient submission
  const handleNewPatientSubmit = async (patientData: any) => {
    try {
      // In a real application, this would call an API to save the patient
      console.log('Creating new patient for appointment:', patientData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Patient ajouté',
        description: `${patientData.fullName} a été ajouté avec succès.`,
      });
      
      // Hide the form after submission
      setShowNewPatientForm(false);
      
      // In a real application, you would set the new patient ID here
      // form.setValue('patientId', 'new-patient-id');
    } catch (error) {
      console.error('Error creating new patient:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du patient.',
        variant: 'destructive',
      });
    }
  };
  
  // Toggle new patient form
  React.useEffect(() => {
    if (isNewPatient) {
      setShowNewPatientForm(true);
      form.setValue('patientId', '');
    } else {
      setShowNewPatientForm(false);
    }
  }, [isNewPatient, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="assignedDoctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docteur</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un docteur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Confirmed">Confirmé</SelectItem>
                    <SelectItem value="Canceled">Annulé</SelectItem>
                    <SelectItem value="Done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      locale={fr}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une heure">
                        {field.value ? (
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {field.value}
                          </div>
                        ) : (
                          "Sélectionner une heure"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Patient</h3>
              <FormField
                control={form.control}
                name="isNewPatient"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Nouveau patient
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {!isNewPatient && (
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={isLoading || isNewPatient}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {showNewPatientForm && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-4">Informations du nouveau patient</h4>
                <PatientForm 
                  onSubmit={handleNewPatientSubmit} 
                  isLoading={isLoading}
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/appointments')}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || (isNewPatient && !showNewPatientForm)}>
            {isLoading ? 'Chargement...' : isEditing ? 'Mettre à jour' : 'Ajouter le rendez-vous'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
