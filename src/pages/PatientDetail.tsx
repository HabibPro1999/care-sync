
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, Phone, Edit, Trash, FileText } from 'lucide-react';
import { Patient, Note, Appointment } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AppointmentCard from '@/components/AppointmentCard';

// Mock function to fetch a single patient
const fetchPatient = async (id: string): Promise<Patient> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    id,
    fullName: "Emma Martin",
    parentName: "Claire Martin",
    parentPhone: "+33123456789",
    illness: "Asthme",
    additionalNotes: "Allergique aux arachides",
    createdAt: "2023-07-15T14:30:00Z"
  };
};

// Mock function to fetch patient's appointments
const fetchPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data
  return [
    {
      id: "a1",
      patientId,
      assignedDoctorId: "d1",
      dateTime: "2023-11-15T10:00:00Z",
      status: "Done",
      patientName: "Emma Martin",
      doctorName: "Dr. Robert"
    },
    {
      id: "a2",
      patientId,
      assignedDoctorId: "d1",
      dateTime: "2024-01-20T15:30:00Z",
      status: "Confirmed",
      patientName: "Emma Martin",
      doctorName: "Dr. Robert"
    }
  ];
};

// Mock function to fetch patient's notes
const fetchPatientNotes = async (patientId: string): Promise<Note[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return mock data
  return [
    {
      id: "n1",
      text: "La patiente montre des signes d'amélioration. Continuer le traitement actuel.",
      dateTimeCreated: "2023-11-15T10:30:00Z",
      createdBy: "d1",
      createdByName: "Dr. Robert"
    },
    {
      id: "n2",
      text: "L'asthme est bien contrôlé. Réduire progressivement la dose d'inhalateur.",
      voiceMemoTranscription: "Note vocale transcrite automatiquement.",
      dateTimeCreated: "2024-01-20T16:00:00Z",
      createdBy: "d1",
      createdByName: "Dr. Robert"
    }
  ];
};

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Check if user can edit patients
  const canEditPatient = user && (user.role === "MainDoctor" || user.role === "Assistant");
  
  // Fetch patient data
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id || ''),
    enabled: !!id
  });
  
  // Fetch patient appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['patientAppointments', id],
    queryFn: () => fetchPatientAppointments(id || ''),
    enabled: !!id
  });
  
  // Fetch patient notes
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['patientNotes', id],
    queryFn: () => fetchPatientNotes(id || ''),
    enabled: !!id
  });
  
  // Loading state
  if (patientLoading) {
    return (
      <DashboardLayout title="Détails du Patient">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-40 bg-muted rounded-md"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // If no patient is found
  if (!patient) {
    return (
      <DashboardLayout title="Patient non trouvé">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Le patient demandé n'existe pas</p>
          <Button asChild>
            <Link to="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux patients
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title={patient.fullName}>
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tous les patients
          </Link>
        </Button>
        
        {canEditPatient && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/patients/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Informations du patient</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom du parent</p>
                <p className="font-medium">{patient.parentName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Téléphone du parent</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{patient.parentPhone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Maladie</p>
                <p className="font-medium">{patient.illness}</p>
              </div>
              
              {patient.additionalNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes additionnelles</p>
                  <p>{patient.additionalNotes}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p>{formatDate(patient.createdAt, 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Rendez-vous</h3>
              <Button asChild>
                <Link to={`/appointments/new?patientId=${id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nouveau rendez-vous
                </Link>
              </Button>
            </div>
            
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    showPatient={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Aucun rendez-vous trouvé pour ce patient
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h3 className="font-semibold text-lg mt-8 mb-4">Historique des notes</h3>
      
      {notesLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map(note => (
            <Card key={note.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{note.createdByName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(note.dateTimeCreated, 'PP')} à {formatDate(note.dateTimeCreated, 'p')}
                    </span>
                  </div>
                </div>
                
                <p className="mt-2">{note.text}</p>
                
                {note.voiceMemoTranscription && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Transcription audio:</p>
                    <p className="italic">{note.voiceMemoTranscription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          Aucune note trouvée pour ce patient
        </p>
      )}
    </DashboardLayout>
  );
};

export default PatientDetail;
