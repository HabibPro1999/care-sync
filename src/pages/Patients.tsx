
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, User, ChevronRight } from 'lucide-react';
import { Patient } from '@/types';
import { formatDate } from '@/lib/utils';

const Patients = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock patient data - in a real app, this would come from Firestore
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      fullName: 'Marie Dupont',
      parentName: 'Pierre Dupont',
      parentPhone: '+33123456789',
      illness: 'Asthme',
      additionalNotes: 'Allergique aux arachides',
      createdAt: '2023-05-10'
    },
    {
      id: '2',
      fullName: 'Thomas Martin',
      parentName: 'Sophie Martin',
      parentPhone: '+33234567890',
      illness: 'Diabète de type 1',
      createdAt: '2023-06-15'
    },
    {
      id: '3',
      fullName: 'Emma Bernard',
      parentName: 'Julie Bernard',
      parentPhone: '+33345678901',
      illness: 'Eczéma',
      additionalNotes: 'Peau sensible',
      createdAt: '2023-07-20'
    },
    {
      id: '4',
      fullName: 'Lucas Petit',
      parentName: 'Marc Petit',
      parentPhone: '+33456789012',
      illness: 'Allergie saisonnière',
      createdAt: '2023-08-25'
    },
    {
      id: '5',
      fullName: 'Chloé Dubois',
      parentName: 'Anne Dubois',
      parentPhone: '+33567890123',
      illness: 'Migraines',
      additionalNotes: 'Antécédents familiaux de migraines',
      createdAt: '2023-09-05'
    }
  ]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.illness.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user can add new patients (only MainDoctor and Assistant roles)
  const canAddPatients = user?.role === 'MainDoctor' || user?.role === 'Assistant';

  return (
    <DashboardLayout title="Patients">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-semibold">Liste des patients</h1>
        
        <div className="flex gap-3">
          {canAddPatients && (
            <Button as={Link} to="/patients/new" className="shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau patient
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Rechercher un patient par nom, parent ou maladie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun patient trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Aucun patient ne correspond à votre recherche.
            </p>
            <Button onClick={() => setSearchTerm('')}>Effacer la recherche</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Link to={`/patients/${patient.id}`} key={patient.id}>
              <Card className="transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {patient.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{patient.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Parent: {patient.parentName} • {patient.illness}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mr-4 text-right hidden sm:block">
                      <p>Ajouté le</p>
                      <p>{formatDate(new Date(patient.createdAt), 'dd MMM yyyy')}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Patients;
