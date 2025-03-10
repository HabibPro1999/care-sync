
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, User, UserRound, FileText, AlertOctagon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock appointment data
const mockAppointment = {
  id: "123",
  patientId: "456",
  patientName: "Sophie Martin",
  patientAge: 32,
  doctorId: "789",
  doctorName: "Dr. Dubois",
  date: new Date(2023, 6, 15, 10, 30),
  duration: 30,
  status: "Confirmed", // Pending, Confirmed, Canceled, Done
  reasonForVisit: "Consultation annuelle",
  notes: "La patiente signale des maux de tête occasionnels et des difficultés à dormir.",
  createdAt: new Date(2023, 5, 20),
  updatedAt: new Date(2023, 6, 10),
};

// Mock patient history
const patientHistory = [
  {
    id: "1",
    date: new Date(2023, 2, 10, 9, 0),
    doctorName: "Dr. Petit",
    diagnosis: "Rhinopharyngite",
    notes: "Prescription d'antipyrétiques et repos recommandé."
  },
  {
    id: "2",
    date: new Date(2023, 0, 5, 14, 30),
    doctorName: "Dr. Dubois",
    diagnosis: "Examen annuel",
    notes: "Tous les indicateurs sont normaux. Vaccination à jour."
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Pending: { class: "bg-yellow-100 text-yellow-800", icon: <AlertOctagon className="h-3 w-3 mr-1" /> },
    Confirmed: { class: "bg-blue-100 text-blue-800", icon: <Check className="h-3 w-3 mr-1" /> },
    Canceled: { class: "bg-red-100 text-red-800", icon: <X className="h-3 w-3 mr-1" /> },
    Done: { class: "bg-green-100 text-green-800", icon: <Check className="h-3 w-3 mr-1" /> },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  
  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center", config.class)}>
      {config.icon} {status}
    </span>
  );
};

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState(mockAppointment);
  const [newStatus, setNewStatus] = useState(appointment.status);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  
  // Update status handler
  const handleStatusUpdate = () => {
    setAppointment(prev => ({ ...prev, status: newStatus }));
  };
  
  // Cancel appointment handler
  const handleCancelAppointment = () => {
    setAppointment(prev => ({ ...prev, status: "Canceled" }));
    setDialogOpen(false);
  };
  
  return (
    <DashboardLayout title="Détails du rendez-vous">
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          asChild
        >
          <Link to="/appointments">
            ← Retour aux rendez-vous
          </Link>
        </Button>
        
        {/* Main info card */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Rendez-vous avec {appointment.patientName}</CardTitle>
              <CardDescription>
                ID: {appointment.id} • Créé le {format(appointment.createdAt, 'dd/MM/yyyy')}
              </CardDescription>
            </div>
            <StatusBadge status={appointment.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">Détails du patient</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.patientName}, {appointment.patientAge} ans</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Motif: {appointment.reasonForVisit}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm">Médecin</h3>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.doctorName}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">Date et heure</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(appointment.date, 'EEEE dd MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(appointment.date, 'HH:mm')} - {format(new Date(appointment.date.getTime() + appointment.duration * 60000), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm">Statut</h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">En attente</SelectItem>
                        <SelectItem value="Confirmed">Confirmé</SelectItem>
                        <SelectItem value="Done">Terminé</SelectItem>
                        <SelectItem value="Canceled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleStatusUpdate} disabled={newStatus === appointment.status}>
                      Mettre à jour
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-6">
                <h3 className="font-medium text-sm">Notes</h3>
                <p className="mt-2 text-sm p-4 bg-muted rounded-md">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                    Annuler le rendez-vous
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer l'annulation</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir annuler ce rendez-vous? Cette action ne peut pas être annulée.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">Raison de l'annulation</label>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Veuillez indiquer la raison de l'annulation"
                      className="resize-none"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                    <Button variant="destructive" onClick={handleCancelAppointment}>Confirmer l'annulation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Button variant="default">
              <Link to={`/patients/${appointment.patientId}`}>
                Voir le profil du patient
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Patient history tabs */}
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Historique du patient</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique médical</CardTitle>
                <CardDescription>Consultations précédentes du patient</CardDescription>
              </CardHeader>
              <CardContent>
                {patientHistory.length > 0 ? (
                  <div className="space-y-4">
                    {patientHistory.map(visit => (
                      <div key={visit.id} className="border p-4 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{format(visit.date, 'dd/MM/yyyy')}</div>
                          <div className="text-sm text-muted-foreground">{visit.doctorName}</div>
                        </div>
                        <div className="mt-2 text-sm font-medium">{visit.diagnosis}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{visit.notes}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun historique médical disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents du patient</CardTitle>
                <CardDescription>Documents médicaux et ordonnances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  Aucun document disponible
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
