
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/DashboardLayout';
import PatientForm from '@/components/PatientForm';

const NewPatient = () => {
  // Mock function to handle form submission
  const handleSubmit = async (data: any) => {
    // In a real application, this would call an API to save the patient
    console.log('Creating new patient:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return success
    return Promise.resolve();
  };
  
  return (
    <DashboardLayout title="Nouveau Patient">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PatientForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default NewPatient;
