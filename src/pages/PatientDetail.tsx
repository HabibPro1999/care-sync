
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentCard } from '@/components/AppointmentCard';
import { format } from 'date-fns';
import { ChevronLeft, CalendarPlus, PencilLine, Phone, Mail, Calendar, FileText, Clipboard, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock patient data
const PATIENT = {
  id: "123",
  firstName: "Sophie",
  lastName: "Martin",
  dateOfBirth: new Date(1990, 4, 15),
  gender: "female",
  email: "sophie.martin@example.com",
  phone: "+33 6 12 34 56 78",
  address: "15 Rue des Lilas, 75020 Paris",
  emergencyContact: "Jean Martin (Époux) - +33 6 98 76 54 32",
  medicalHistory: "Allergie aux arachides",
  createdAt: new Date(2022, 2, 10)
};

// Mock appointments data
const APPOINTMENTS = [
  {
    id: "1",
    patientName: "Sophie Martin",
    patientId: "123",
    doctorName: "Dr. Dubois",
    doctorId: "d1",
    date: new Date(2023, 6, 15, 10, 30),
    status: "Confirmed"
  },
  {
    id: "2",
    patientName: "Sophie Martin",
    patientId: "123",
    doctorName: "Dr. Petit",
    doctorId: "d2",
    date: new Date(2023, 5, 20, 14, 0),
    status: "Done"
  },
  {
    id: "3",
    patientName: "Sophie Martin",
    patientId: "123",
    doctorName: "Dr. Dubois",
    doctorId: "d1",
    date: new Date(2023, 4, 5, 9, 0),
    status: "Done"
  }
];

// Mock medical notes
const MEDICAL_NOTES = [
  {
    id: "1",
    date: new Date(2023, 5, 20, 14, 30),
    doctorName: "Dr. Petit",
    note: "La patiente se plaint de maux de tête fréquents. Prescription d'analgésiques et recommandation de suivi dans 2 semaines.",
  },
  {
    id: "2",
    date: new Date(2023, 4, 5, 9, 30),
    doctorName: "Dr. Dubois",
    note: "Examen de routine. Tous les indicateurs sont normaux. Rappel sur l'importance de l'activité physique régulière.",
  }
];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();
  
  // In a real app, we would fetch patient data based on the ID
  const patient = PATIENT;
  const patientAppointments = APPOINTMENTS;
  const medicalNotes = MEDICAL_NOTES;
  
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Note vide",
        description: "Veuillez saisir une note avant de l'ajouter",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would send this to an API
    toast({
      title: "Note ajoutée",
      description: "La note médicale a été ajoutée avec succès",
    });
    
    setNewNote('');
    setIsAddingNote(false);
  };
  
  return (
    <DashboardLayout title="Détails du patient">
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="outline">
          <Link to="/patients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux patients
          </Link>
        </Button>
        
        {/* Patient info card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">
                {patient.firstName} {patient.lastName}
              </CardTitle>
              <CardDescription>
                Patient depuis {format(patient.createdAt, 'MMMM yyyy')} • ID: {patient.id}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Link to={`/patients/${patient.id}/edit`}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              
              <Button>
                <Link to={`/appointments/new?patientId=${patient.id}`}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Nouveau rendez-vous
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Date de naissance</dt>
                    <dd>{format(patient.dateOfBirth, 'dd/MM/yyyy')} ({new Date().getFullYear() - patient.dateOfBirth.getFullYear()} ans)</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Genre</dt>
                    <dd>{patient.gender === 'female' ? 'Femme' : 'Homme'}</dd>
                  </div>
                  <div className="flex items-center">
                    <dt className="text-sm font-medium text-muted-foreground mr-2">Téléphone</dt>
                    <dd className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                      {patient.phone}
                    </dd>
                  </div>
                  <div className="flex items-center">
                    <dt className="text-sm font-medium text-muted-foreground mr-2">Email</dt>
                    <dd className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                      {patient.email}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
                    <dd>{patient.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Contact d'urgence</dt>
                    <dd>{patient.emergencyContact}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Historique médical</dt>
                    <dd>{patient.medicalHistory || "Aucun historique médical enregistré"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for appointments and notes */}
        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Notes médicales
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center">
              <Clipboard className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Historique des rendez-vous</CardTitle>
                    <CardDescription>{patientAppointments.length} rendez-vous au total</CardDescription>
                  </div>
                  <Button>
                    <Link to={`/appointments/new?patientId=${patient.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        href={`/appointments/${appointment.id}`}
                        showPatient={false}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucun rendez-vous enregistré</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notes médicales</CardTitle>
                    <CardDescription>Historique des consultations</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddingNote(!isAddingNote)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une note
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingNote && (
                  <div className="mb-6 p-4 border rounded-md">
                    <label className="block text-sm font-medium mb-2">Nouvelle note médicale</label>
                    <textarea 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Saisir une nouvelle note médicale..."
                      className="w-full p-2 border rounded-md mb-2 min-h-[100px]"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingNote(false)}>Annuler</Button>
                      <Button onClick={handleAddNote}>Enregistrer</Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {medicalNotes.length > 0 ? (
                    medicalNotes.map(note => (
                      <div key={note.id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{format(note.date, 'dd/MM/yyyy HH:mm')}</div>
                          <div className="text-sm text-muted-foreground">{note.doctorName}</div>
                        </div>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune note médicale enregistrée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Ordonnances et documents médicaux</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun document disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;
