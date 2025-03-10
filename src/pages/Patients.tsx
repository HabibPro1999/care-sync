
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Patient } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PatientCard from '@/components/PatientCard';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

// Mock function to fetch patients
const fetchPatients = async (): Promise<Patient[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: "p1",
      fullName: "Emma Martin",
      parentName: "Claire Martin",
      parentPhone: "+33123456789",
      illness: "Asthme",
      additionalNotes: "Allergique aux arachides",
      createdAt: "2023-07-15T14:30:00Z"
    },
    {
      id: "p2",
      fullName: "Lucas Bernard",
      parentName: "Thomas Bernard",
      parentPhone: "+33198765432",
      illness: "Dermatite",
      createdAt: "2023-08-22T09:45:00Z"
    },
    {
      id: "p3",
      fullName: "Léa Dubois",
      parentName: "Marie Dubois",
      parentPhone: "+33187654321",
      illness: "Rhinite allergique",
      additionalNotes: "Prend des antihistaminiques",
      createdAt: "2023-09-05T11:15:00Z"
    }
  ];
};

const Patients = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch patients data
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });
  
  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => 
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.illness.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if user can add patients (only MainDoctor and Assistant)
  const canAddPatients = user && (user.role === "MainDoctor" || user.role === "Assistant");
  
  return (
    <DashboardLayout title="Patients">
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou maladie..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {canAddPatients && (
          <Button asChild>
            <Link to="/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Patient
            </Link>
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 h-48 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun patient trouvé</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Patients;
