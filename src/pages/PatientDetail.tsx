
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Patient, Appointment, Note } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Calendar, Clock, User, Phone, FileText, Plus } from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for patient data and related information
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user can edit patients (only MainDoctor and Assistant roles)
  const canEditPatient = user?.role === 'MainDoctor' || user?.role === 'Assistant';
  
  // Check if user can add appointments (only MainDoctor and Assistant roles)
  const canAddAppointment = user?.role === 'MainDoctor' || user?.role === 'Assistant';

  useEffect(() => {
    // In a real app, you'd fetch this data from Firebase
    // For now, we'll use mock data
    setTimeout(() => {
      setPatient({
        id: id || '1',
        fullName: 'Marie Dupont',
        parentName: 'Pierre Dupont',
        parentPhone: '+33123456789',
        illness: 'Asthme',
        additionalNotes: 'Allergique aux arachides. Prend régulièrement des médicaments pour l\'asthme. Doit éviter l\'exercice intense par temps froid. Antécédents familiaux d\'asthme et d\'allergies.',
        createdAt: '2023-05-10'
      });

      setAppointments([
        {
          id: 'a1',
          patientId: id || '1',
          assignedDoctorId: 'doc1',
          dateTime: '2023-09-15T10:30:00',
          status: 'Done',
          patientName: 'Marie Dupont',
          doctorName: 'Dr. Martin'
        },
        {
          id: 'a2',
          patientId: id || '1',
          assignedDoctorId: 'doc2',
          dateTime: '2023-10-20T14:00:00',
          status: 'Done',
          patientName: 'Marie Dupont',
          doctorName: 'Dr. Bernard'
        },
        {
          id: 'a3',
          patientId: id || '1',
          assignedDoctorId: 'doc1',
          dateTime: '2023-12-05T09:15:00',
          status: 'Confirmed',
          patientName: 'Marie Dupont',
          doctorName: 'Dr. Martin'
        }
      ]);

      setNotes([
        {
          id: 'n1',
          text: 'Le patient présente des symptômes légers. Prescription de ventoline à prendre en cas de crise.',
          dateTimeCreated: '2023-09-15T11:00:00',
          createdBy: 'doc1',
          createdByName: 'Dr. Martin'
        },
        {
          id: 'n2',
          text: 'Amélioration notable des symptômes. Continuer le traitement actuel et revoir dans un mois.',
          dateTimeCreated: '2023-10-20T14:30:00',
          createdBy: 'doc2',
          createdByName: 'Dr. Bernard'
        },
        {
          id: 'n3',
          voiceMemoTranscription: 'Patient très coopératif, l\'asthme semble bien contrôlé. Parents satisfaits des progrès.',
          text: '',
          dateTimeCreated: '2023-10-20T14:35:00',
          createdBy: 'doc2',
          createdByName: 'Dr. Bernard'
        }
      ]);

      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Détails du patient">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-primary">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout title="Détails du patient">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-2">Patient non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le patient que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button as={Link} to="/patients">Retour à la liste des patients</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Détails du patient">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux patients
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold">{patient.fullName}</h1>
          
          <div className="flex gap-3">
            {canEditPatient && (
              <Button as={Link} to={`/patients/${patient.id}/edit`} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
            
            {canAddAppointment && (
              <Button as={Link} to={`/appointments/new?patientId=${patient.id}`}>
                <Calendar className="mr-2 h-4 w-4" />
                Nouveau rendez-vous
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informations patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom complet</h3>
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {patient.fullName}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom du parent</h3>
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {patient.parentName}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Téléphone du parent</h3>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                {patient.parentPhone}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Maladie</h3>
              <p className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                {patient.illness}
              </p>
            </div>
            
            {patient.additionalNotes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes additionnelles</h3>
                <p className="text-sm">{patient.additionalNotes}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Date d'ajout</h3>
              <p className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(new Date(patient.createdAt), 'dd MMMM yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="appointments">
            <TabsList className="mb-4">
              <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              <TabsTrigger value="notes">Notes médicales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Historique des rendez-vous</CardTitle>
                  <CardDescription>
                    {appointments.length > 0 
                      ? `${appointments.length} rendez-vous enregistrés`
                      : 'Aucun rendez-vous enregistré'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="py-8 text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun rendez-vous</h3>
                      <p className="text-muted-foreground mb-6">
                        Ce patient n'a pas encore de rendez-vous enregistré.
                      </p>
                      {canAddAppointment && (
                        <Button as={Link} to={`/appointments/new?patientId=${patient.id}`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Planifier un rendez-vous
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <Link 
                          key={appointment.id} 
                          to={`/appointments/${appointment.id}`}
                          className="block"
                        >
                          <div className="flex flex-col sm:flex-row justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{formatDate(new Date(appointment.dateTime), 'EEEE d MMMM yyyy')}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(new Date(appointment.dateTime), 'HH:mm')} • {appointment.doctorName}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className={`px-3 py-1 text-xs rounded-full ${
                                appointment.status === 'Confirmed' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : appointment.status === 'Done' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : appointment.status === 'Canceled'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {appointment.status === 'Confirmed' ? 'Confirmé' : 
                                appointment.status === 'Done' ? 'Terminé' : 
                                appointment.status === 'Canceled' ? 'Annulé' : 'En attente'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Notes médicales</CardTitle>
                  <CardDescription>
                    {notes.length > 0 
                      ? `${notes.length} notes enregistrées`
                      : 'Aucune note enregistrée'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucune note</h3>
                      <p className="text-muted-foreground">
                        Aucune note médicale n'a été ajoutée pour ce patient.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {notes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{note.createdByName}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(new Date(note.dateTimeCreated), 'dd MMM yyyy')} à {formatDate(new Date(note.dateTimeCreated), 'HH:mm')}
                            </span>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          {note.text && (
                            <p className="text-sm leading-relaxed whitespace-pre-line">{note.text}</p>
                          )}
                          
                          {note.voiceMemoTranscription && (
                            <div className="mt-2 bg-secondary/50 p-3 rounded-md">
                              <p className="text-sm text-muted-foreground mb-1">Transcription audio:</p>
                              <p className="text-sm italic">{note.voiceMemoTranscription}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;
