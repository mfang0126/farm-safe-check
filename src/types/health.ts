
export type FitnessStatus = 'fit' | 'fit_with_restrictions' | 'temporarily_unfit' | 'permanently_unfit' | 'assessment_required';

export type ConditionSeverity = 'mild' | 'moderate' | 'severe';
export type MedicalAlertLevel = 'normal' | 'medium' | 'high' | 'critical';

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: Date;
  severity: ConditionSeverity;
  triggers?: string[];
  treatment?: string;
  lastEpisode?: Date;
  workImpact?: string;
  managementPlan?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  sideEffects?: string[];
  isCritical: boolean;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: ConditionSeverity;
  reaction: string;
  managementPlan?: string;
}

export interface Restriction {
  id: string;
  type: string;
  description: string;
  startDate: Date;
  endDate?: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isDoctor?: boolean;
}

export interface MedicalDocument {
  id: string;
  title: string;
  date: Date;
  fileUrl: string;
  type: string;
}

export interface Assessment {
  id: string;
  type: string;
  date: Date;
  result: FitnessStatus;
  notes?: string;
  provider?: string;
  nextAssessmentDate?: Date;
}

export interface HealthProfile {
  id: string;
  workerId: string;
  fitnessStatus: FitnessStatus;
  lastAssessmentDate: Date;
  nextAssessmentDate?: Date;
  medicalConditions: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
  restrictions: Restriction[];
  emergencyContacts: EmergencyContact[];
  bloodType?: string;
  weight?: number;
  assessmentHistory: Assessment[];
  medicalDocuments: MedicalDocument[];
}
