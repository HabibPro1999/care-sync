
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save, CalendarIcon, Clock } from 'lucide-react';

const NewAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  
  // Mock data - in a real app, this would come from Firestore
  const [doctors] = useState([
    { id: 'd1', name: 'Dr. Martin' },
    { id: 'd2', name: 'Dr. Petit' },
    { id: 'd3', name: 'Dr. Durand' }
  ]);
  
  const [patients] = useState([
    { id: 'p1', name: 'Marie Dupont' },
    { id: 'p2', name: 'Thomas Bernard' },
    { id: 'p3', name: 'Sophie Dubois' },
    { id: 'p4', name: 'Lucas Morel' },
    { id: 'p5', name: 'Emma Leroy' }
  ]);
  
  // Form state
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: preselectedPatientId || '',
    // New patient fields
    fullName: '',
    parentName: '',
    parentPhone: '',
    illness: ''
  });

  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Check if user can add appointments (only MainDoctor and Assistant roles)
  if (user?.role !== 'MainDoctor' && user?.role !== 'Assistant') {
    return (
      <DashboardLayout title="Nouveau rendez-vous">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
          <p className="text-muted-foreground mb-4">Vous n'avez pas les permissions nécessaires pour ajouter des rendez-vous.</p>
          <Button as={Link} to="/appointments">Retour à la liste des rendez-vous</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Set preselected patient if provided in URL
  useEffect(() => {
    if (preselectedPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: preselectedPatientId
      }));
    }
  }, [preselectedPatientId]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.doctorId || (!formData.patientId && !isNewPatient) || !date || !time) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNewPatient && (!formData.fullName || !formData.parentName || !formData.parentPhone || !formData.illness)) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs du nouveau patient.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, you would save to Firebase here
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Rendez-vous créé",
        description: `Le rendez-vous a été planifié avec succès pour le ${format(date, 'dd/MM/yyyy')} à ${time}.`
      });
      
      navigate('/appointments');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Nouveau rendez-vous">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/appointments')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux rendez-vous
      </Button>
      
      <h1 className="text-3xl font-semibold mb-6">Créer un nouveau rendez-vous</h1>
      
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Détails du rendez-vous</CardTitle>
          <CardDescription>Planifiez un nouveau rendez-vous en remplissant les informations ci-dessous.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorId">Docteur *</Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => handleSelectChange('doctorId', value)}
                >
                  <SelectTrigger id="doctorId">
                    <SelectValue placeholder="Sélectionner un docteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="patientId">Patient *</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNewPatient"
                      checked={isNewPatient}
                      onCheckedChange={(checked) => {
                        setIsNewPatient(checked as boolean);
                        if (checked) {
                          setFormData(prev => ({ ...prev, patientId: '' }));
                        }
                      }}
                    />
                    <label
                      htmlFor="isNewPatient"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nouveau patient
                    </label>
                  </div>
                </div>
                
                {!isNewPatient ? (
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => handleSelectChange('patientId', value)}
                    disabled={isNewPatient}
                  >
                    <SelectTrigger id="patientId">
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
              </div>
              
              {isNewPatient && (
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-medium">Informations du nouveau patient</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Nom complet du patient"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nom du parent *</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      placeholder="Nom du parent"
                      value={formData.parentName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Téléphone du parent *</Label>
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      placeholder="Numéro de téléphone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="illness">Maladie / Condition *</Label>
                    <Input
                      id="illness"
                      name="illness"
                      placeholder="Maladie ou condition"
                      value={formData.illness}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "dd MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Heure *</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une heure">
                        {time ? (
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </div>
                        ) : (
                          <span>Sélectionner une heure</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/appointments')}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer le rendez-vous
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default NewAppointment;
