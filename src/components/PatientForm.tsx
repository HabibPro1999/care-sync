
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

// Validation schema
const patientSchema = z.object({
  fullName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  parentName: z.string().min(2, { message: 'Le nom du parent doit contenir au moins 2 caractères' }),
  parentPhone: z.string().min(8, { message: 'Le numéro de téléphone doit être valide' }),
  illness: z.string().min(2, { message: 'La maladie doit être spécifiée' }),
  additionalNotes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: PatientFormValues) => Promise<void>;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;
  
  // Default form values
  const defaultValues: Partial<PatientFormValues> = {
    fullName: initialData?.fullName || '',
    parentName: initialData?.parentName || '',
    parentPhone: initialData?.parentPhone || '',
    illness: initialData?.illness || '',
    additionalNotes: initialData?.additionalNotes || '',
  };
  
  // Form setup
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });
  
  // Handle form submission
  const handleSubmit = async (values: PatientFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: isEditing ? 'Patient modifié' : 'Patient ajouté',
        description: `${values.fullName} a été ${isEditing ? 'modifié' : 'ajouté'} avec succès.`,
      });
      navigate('/patients');
    } catch (error) {
      console.error('Error submitting patient form:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet du patient</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Emma Martin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="illness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maladie</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Asthme, allergie, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du parent</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Claire Martin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="parentPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone du parent</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+33123456789" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes additionnelles</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Informations supplémentaires comme les allergies, l'historique médical, etc."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/patients')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Chargement...' : isEditing ? 'Mettre à jour' : 'Ajouter le patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
