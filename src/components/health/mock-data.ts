
import { HealthProfile, MedicalCondition, Medication, Allergy, Restriction, EmergencyContact, MedicalDocument, Assessment } from '@/types/health';

const mockConditions: MedicalCondition[] = [
  {
    id: '1',
    name: 'Asthma',
    diagnosedDate: new Date('2018-04-15'),
    severity: 'moderate',
    triggers: ['Dust', 'Pollen'],
    treatment: 'Daily Inhaler',
    lastEpisode: new Date('2023-11-12'),
    workImpact: 'Limited exposure to dusty environments',
    managementPlan: 'Asthma Management Plan'
  },
  {
    id: '2',
    name: 'Lower Back Injury',
    diagnosedDate: new Date('2022-06-20'),
    severity: 'moderate',
    treatment: 'Physical Therapy',
    workImpact: 'Lifting Restriction',
    managementPlan: 'Back Care Plan'
  }
];

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Albuterol (Inhaler)',
    dosage: '2 puffs',
    frequency: 'As needed',
    purpose: 'Asthma relief',
    sideEffects: ['Mild tremors', 'Increased heart rate'],
    isCritical: true
  },
  {
    id: '2',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'Occasional',
    purpose: 'Back pain',
    isCritical: false
  }
];

const mockAllergies: Allergy[] = [
  {
    id: '1',
    allergen: 'Peanuts',
    severity: 'severe',
    reaction: 'Anaphylaxis',
    managementPlan: 'EpiPen Injection, Call Emergency Services'
  },
  {
    id: '2',
    allergen: 'Penicillin',
    severity: 'moderate',
    reaction: 'Rash, Hives',
    managementPlan: 'Avoid medication, notify medical providers'
  }
];

const mockRestrictions: Restriction[] = [
  {
    id: '1',
    type: 'Chemical',
    description: 'Avoid pesticide application',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-06-10')
  },
  {
    id: '2',
    type: 'Physical',
    description: '10kg lifting limit',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-12-03')
  }
];

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Mary Smith',
    relationship: 'Wife',
    phone: '555-123-4567'
  },
  {
    id: '2',
    name: 'Dr. Wilson',
    relationship: 'Physician',
    phone: '555-987-6543',
    isDoctor: true
  }
];

const mockDocuments: MedicalDocument[] = [
  {
    id: '1',
    title: "Doctor's Note - Jan 2024",
    date: new Date('2024-01-15'),
    fileUrl: '/documents/doctors-note-jan.pdf',
    type: 'doctors-note'
  },
  {
    id: '2',
    title: 'Back Assessment - Nov 2023',
    date: new Date('2023-11-20'),
    fileUrl: '/documents/back-assessment.pdf',
    type: 'assessment-report'
  }
];

const mockAssessments: Assessment[] = [
  {
    id: '1',
    type: 'Periodic Health Assessment',
    date: new Date('2024-01-15'),
    result: 'fit_with_restrictions',
    notes: 'Fit for work with some restrictions on lifting and chemical exposure',
    provider: 'Dr. Wilson',
    nextAssessmentDate: new Date('2024-06-15')
  },
  {
    id: '2',
    type: 'Return to Work Assessment',
    date: new Date('2023-07-10'),
    result: 'temporarily_unfit',
    notes: 'Temporarily unfit due to back injury, reassess in 4 weeks',
    provider: 'Dr. Green',
    nextAssessmentDate: new Date('2023-08-07')
  }
];

export const mockHealthProfiles: HealthProfile[] = [
  {
    id: '1',
    workerId: '1',
    fitnessStatus: 'fit_with_restrictions',
    lastAssessmentDate: new Date('2024-01-15'),
    nextAssessmentDate: new Date('2024-06-15'),
    medicalConditions: mockConditions,
    medications: mockMedications,
    allergies: mockAllergies,
    restrictions: mockRestrictions,
    emergencyContacts: mockEmergencyContacts,
    bloodType: 'O+',
    weight: 82,
    assessmentHistory: mockAssessments,
    medicalDocuments: mockDocuments
  }
];

export const getWorkerHealthProfile = (workerId: string): HealthProfile | undefined => {
  return mockHealthProfiles.find(profile => profile.workerId === workerId);
};
