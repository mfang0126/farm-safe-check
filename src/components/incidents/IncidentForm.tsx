
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';
import { IncidentType, SafetyIncident, IncidentSeverity, IncidentStatus } from '@/types/incidents';
import { useToast } from '@/hooks/use-toast';

// Import our form steps
import IncidentTypeStep from './form-steps/IncidentTypeStep';
import LocationDetailsStep from './form-steps/LocationDetailsStep';
import EvidenceStep from './form-steps/EvidenceStep';
import PeopleInvolvedStep from './form-steps/PeopleInvolvedStep';

// Form schema
const incidentFormSchema = z.object({
  type: z.enum(['injury', 'near-miss', 'property-damage', 'environmental', 'other']),
  isEmergency: z.boolean().default(false),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().max(280, { message: "Description cannot exceed 280 characters" }),
  date: z.date(),
  location: z.string().min(3, { message: "Please provide a location" }),
  isInjury: z.boolean().default(false),
  evidence: z.array(z.object({
    id: z.string(),
    type: z.enum(['photo', 'document']),
    url: z.string(),
    thumbnail: z.string().optional(),
    name: z.string()
  })).optional().default([]),
  injured: z.array(z.object({
    id: z.string(),
    name: z.string(),
    contact: z.string().optional(),
  })).optional().default([]),
  witnesses: z.array(z.object({
    id: z.string(),
    name: z.string(),
    contact: z.string().optional(),
  })).optional().default([]),
  supervisor: z.object({
    name: z.string().min(1, "Supervisor name is required"),
    contact: z.string().optional()
  }).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

type IncidentFormData = z.infer<typeof incidentFormSchema>;

interface IncidentFormProps {
  onSubmitSuccess: () => void;
}

const IncidentForm = ({ onSubmitSuccess }: IncidentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOffline, setIsOffline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 4;
  const { toast } = useToast();

  const methods = useForm<IncidentFormData>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      isEmergency: false,
      date: new Date(),
      evidence: [],
      injured: [],
      witnesses: [],
      isInjury: false,
      severity: 'medium'
    }
  });
  
  const { watch, handleSubmit, setValue, formState: { errors, isDirty } } = methods;
  const isEmergency = watch('isEmergency');

  // Check online status and restore form data from localStorage
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    setIsOffline(!navigator.onLine);
    
    // Try to load saved form data
    const savedForm = localStorage.getItem('incident-form-draft');
    if (savedForm) {
      try {
        const formData = JSON.parse(savedForm);
        // Need to convert date string back to Date object
        if (formData.date) {
          formData.date = new Date(formData.date);
        }
        Object.entries(formData).forEach(([key, value]) => {
          // @ts-ignore - dynamically setting form values
          setValue(key, value);
        });
        toast({
          title: "Draft restored",
          description: "Your previous incident report draft has been restored.",
        });
      } catch (error) {
        console.error("Error restoring form data:", error);
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [setValue, toast]);

  // Auto-save form data
  useEffect(() => {
    const subscription = methods.watch((data) => {
      if (isDirty) {
        const saveData = {...data};
        
        // Convert Date to string for storage
        if (saveData.date instanceof Date) {
          // @ts-ignore - we know date exists
          saveData.date = saveData.date.toISOString();
        }
        
        localStorage.setItem('incident-form-draft', JSON.stringify(saveData));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [methods, isDirty]);

  // Navigate between form steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your incident report has been saved as a draft.",
    });
  };

  const onSubmit = (data: IncidentFormData) => {
    setIsSaving(true);
    
    try {
      // Create incident object
      const newIncident: SafetyIncident = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        location: data.location,
        type: data.type as IncidentType,
        severity: data.severity as IncidentSeverity,
        status: 'reported' as IncidentStatus,
        reportedBy: 'Current User', // In a real app, get from auth context
        affectedEquipment: [],
      };
      
      // In a real application, we would send this to an API
      // For now, we'll store in localStorage as an example
      const existingIncidents = JSON.parse(localStorage.getItem('safety-incidents') || '[]');
      localStorage.setItem('safety-incidents', JSON.stringify([...existingIncidents, newIncident]));
      
      // Clear the form draft
      localStorage.removeItem('incident-form-draft');
      
      // Reset the form
      methods.reset();
      
      // Call success callback
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your incident report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
        
        {/* Emergency alert banner when relevant */}
        {isEmergency && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Incident</AlertTitle>
            <AlertDescription>
              This incident has been marked as an emergency. It will be processed with priority.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Offline alert when necessary */}
        {isOffline && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>
              Your report will be saved locally and submitted when you're back online.
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Incident Type Selection */}
            {currentStep === 1 && <IncidentTypeStep />}
            
            {/* Step 2: Location & Details */}
            {currentStep === 2 && <LocationDetailsStep />}
            
            {/* Step 3: Evidence Capture */}
            {currentStep === 3 && <EvidenceStep />}
            
            {/* Step 4: People Involved */}
            {currentStep === 4 && <PeopleInvolvedStep />}
          </CardContent>
        </Card>
        
        {/* Form Navigation */}
        <div className="flex justify-between">
          <div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={saveDraft}
              disabled={isSaving}
            >
              Save as Draft
            </Button>
          </div>
          
          <div className="space-x-2">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={isSaving}
              >
                Back
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit Report"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default IncidentForm;
