
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientForm } from '@/components/PatientForm';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewPatient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Patient créé",
      description: "Le patient a été créé avec succès.",
    });
    
    setIsSubmitting(false);
    
    // In a real app, we would redirect to the patient detail page
  };

  return (
    <DashboardLayout title="Nouveau patient">
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="outline">
          <Link to="/patients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux patients
          </Link>
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau patient</CardTitle>
            <CardDescription>Complétez le formulaire pour ajouter un nouveau patient</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewPatient;
