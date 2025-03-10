
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PatientCard } from '@/components/PatientCard';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';

// Mock patients data
const PATIENTS = [
  {
    id: "1",
    firstName: "Sophie",
    lastName: "Martin",
    dateOfBirth: new Date(1990, 4, 15),
    phone: "+33 6 12 34 56 78",
    email: "sophie.martin@example.com",
    lastVisit: new Date(2023, 5, 20),
  },
  {
    id: "2",
    firstName: "Lucas",
    lastName: "Bernard",
    dateOfBirth: new Date(1985, 10, 8),
    phone: "+33 6 23 45 67 89",
    email: "lucas.bernard@example.com",
    lastVisit: new Date(2023, 6, 5),
  },
  {
    id: "3",
    firstName: "Camille",
    lastName: "Dupont",
    dateOfBirth: new Date(1978, 2, 22),
    phone: "+33 6 34 56 78 90",
    email: "camille.dupont@example.com",
    lastVisit: new Date(2023, 4, 15),
  },
  {
    id: "4",
    firstName: "Thomas",
    lastName: "Petit",
    dateOfBirth: new Date(1995, 7, 30),
    phone: "+33 6 45 67 89 01",
    email: "thomas.petit@example.com",
    lastVisit: new Date(2023, 3, 10),
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Leroy",
    dateOfBirth: new Date(1988, 11, 12),
    phone: "+33 6 56 78 90 12",
    email: "emma.leroy@example.com",
    lastVisit: new Date(2023, 6, 1),
  }
];

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter patients based on search query
  const filteredPatients = PATIENTS.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    );
  });

  return (
    <DashboardLayout title="Patients">
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtres
            </Button>
            
            <Button className="whitespace-nowrap">
              <Link to="/patients/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau patient
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filters panel (simplified for demo) */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="text-sm">Filtres à implémenter (par âge, date de dernière visite, etc.)</div>
            </CardContent>
          </Card>
        )}
        
        {/* Patients list */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des patients</CardTitle>
            <CardDescription>{filteredPatients.length} patients trouvés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <PatientCard 
                    key={patient.id}
                    patient={patient}
                    href={`/patients/${patient.id}`}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucun patient trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
