
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const NewPatient = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    parentPhone: '',
    illness: '',
    additionalNotes: ''
  });

  // Check if user can add patients (only MainDoctor and Assistant roles)
  if (user?.role !== 'MainDoctor' && user?.role !== 'Assistant') {
    return (
      <DashboardLayout title="Nouveau patient">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
          <p className="text-muted-foreground mb-4">Vous n'avez pas les permissions nécessaires pour ajouter des patients.</p>
          <Button as={Link} to="/patients">Retour à la liste des patients</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.parentName || !formData.parentPhone || !formData.illness) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs obligatoires.",
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
        title: "Patient ajouté",
        description: `Le patient ${formData.fullName} a été ajouté avec succès.`
      });
      
      navigate('/patients');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du patient. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Nouveau patient">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/patients')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux patients
      </Button>
      
      <h1 className="text-3xl font-semibold mb-6">Ajouter un nouveau patient</h1>
      
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Informations du patient</CardTitle>
          <CardDescription>Entrez les informations du nouveau patient. Les champs marqués d'un * sont obligatoires.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet du patient *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nom complet"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="Informations supplémentaires, allergies, etc."
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/patients')}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer le patient
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default NewPatient;
