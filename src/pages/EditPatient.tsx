
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/DashboardLayout';
import PatientForm from '@/components/PatientForm';

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

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch patient data
  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id || ''),
    enabled: !!id
  });
  
  // Mock function to handle form submission
  const handleSubmit = async (data: any) => {
    // In a real application, this would call an API to update the patient
    console.log('Updating patient:', id, data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return success
    return Promise.resolve();
  };
  
  return (
    <DashboardLayout title="Modifier Patient">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to={`/patients/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded-md w-1/2"></div>
            <div className="h-24 bg-muted rounded-md"></div>
            <div className="h-24 bg-muted rounded-md"></div>
          </div>
        ) : patient ? (
          <PatientForm initialData={patient} onSubmit={handleSubmit} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Le patient demandé n'existe pas</p>
            <Button asChild>
              <Link to="/patients">
                Retour aux patients
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditPatient;
