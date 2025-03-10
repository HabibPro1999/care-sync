
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentForm } from '@/components/AppointmentForm';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Rendez-vous créé",
      description: "Le rendez-vous a été créé avec succès.",
    });
    
    setIsSubmitting(false);
    
    // In a real app, we would redirect to the appointment detail page
    // or back to the appointments list
  };

  return (
    <DashboardLayout title="Nouveau rendez-vous">
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="outline">
          <Link to="/appointments">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux rendez-vous
          </Link>
        </Button>
        
        {/* Appointment form */}
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau rendez-vous</CardTitle>
            <CardDescription>
              Complétez le formulaire ci-dessous pour créer un nouveau rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
