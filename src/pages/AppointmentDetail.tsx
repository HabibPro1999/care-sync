
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash, Clock, User, Calendar as CalendarIcon, Plus, Save } from 'lucide-react';
import { Appointment, Note } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Mock function to fetch a single appointment
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

// Mock function to fetch appointment notes
const fetchAppointmentNotes = async (appointmentId: string): Promise<Note[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return mock data
  return [
    {
      id: "n1",
      text: "Le patient montre des signes d'amélioration. Continuer le traitement actuel.",
      dateTimeCreated: "2024-03-22T10:30:00Z",
      createdBy: "d1",
      createdByName: "Dr. Robert"
    }
  ];
};

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newNote, setNewNote] = useState('');
  
  // Check if user is a doctor (can add notes)
  const canAddNotes = user && (user.role === "MainDoctor" || user.role === "Doctor");
  // Check if user can edit appointments
  const canEditAppointment = user && (user.role === "MainDoctor" || user.role === "Assistant");
  
  // Fetch appointment data
  const { data: appointment, isLoading: appointmentLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointment(id || ''),
    enabled: !!id
  });
  
  // Fetch appointment notes
  const { data: notes = [], isLoading: notesLoading, refetch: refetchNotes } = useQuery({
    queryKey: ['appointmentNotes', id],
    queryFn: () => fetchAppointmentNotes(id || ''),
    enabled: !!id
  });
  
  // Handle add note
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: 'Erreur',
        description: 'La note ne peut pas être vide.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // In a real application, this would call an API to save the note
      console.log('Adding note:', { appointmentId: id, text: newNote });
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clear the input and refetch notes
      setNewNote('');
      refetchNotes();
      
      toast({
        title: 'Note ajoutée',
        description: 'Votre note a été ajoutée avec succès.',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'ajout de la note.',
        variant: 'destructive',
      });
    }
  };
  
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
  
  // Loading state
  if (appointmentLoading) {
    return (
      <DashboardLayout title="Détails du Rendez-vous">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-40 bg-muted rounded-md"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // If no appointment is found
  if (!appointment) {
    return (
      <DashboardLayout title="Rendez-vous non trouvé">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Le rendez-vous demandé n'existe pas</p>
          <Button asChild>
            <Link to="/appointments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux rendez-vous
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Détails du Rendez-vous">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to="/appointments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tous les rendez-vous
          </Link>
        </Button>
        
        {canEditAppointment && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/appointments/${id}/edit`}>
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
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{appointment.patientName}</CardTitle>
              <div className="text-muted-foreground mt-1">
                <Badge className={cn("font-normal", getStatusColor(appointment.status))}>
                  {appointment.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(appointment.dateTime, 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(appointment.dateTime, 'p')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigné à:</span>
                <span className="font-medium">{appointment.doctorName}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Notes</h3>
              
              {canAddNotes && (
                <div className="mb-4">
                  <Textarea
                    placeholder="Ajouter une nouvelle note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <Button onClick={handleAddNote} className="flex ml-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer la note
                  </Button>
                </div>
              )}
              
              {notesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : notes.length > 0 ? (
                <div className="space-y-4">
                  {notes.map(note => (
                    <Card key={note.id} className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{note.createdByName}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(note.dateTimeCreated, 'PP')} à {formatDate(note.dateTimeCreated, 'p')}
                          </span>
                        </div>
                        <p>{note.text}</p>
                        {note.voiceMemoTranscription && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-1">Transcription audio:</p>
                            <p className="italic">{note.voiceMemoTranscription}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">Aucune note pour ce rendez-vous</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-between">
          <Button variant="outline" asChild>
            <Link to={`/patients/${appointment.patientId}`}>
              Voir le dossier patient
            </Link>
          </Button>
          {appointment.status !== 'Done' && canEditAppointment && (
            <Button>Marquer comme terminé</Button>
          )}
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
