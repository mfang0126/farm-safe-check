
export interface WorkerProfile {
  id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string;
  };
  employment: {
    position: string;
    department: string;
    startDate: Date;
    status: 'active' | 'inactive' | 'leave';
  };
  certifications: Certification[];
  trainingHistory: TrainingRecord[];
  healthInfo?: {
    restrictions?: string[];
    allergies?: string[];
    emergencyContact: EmergencyContact;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export type CertificationType = 
  | 'forklift_operator' 
  | 'first_aid_cpr' 
  | 'chemical_handling' 
  | 'confined_space' 
  | 'fall_protection'
  | 'electrical_safety'
  | 'ppe_basic'
  | 'fire_safety'
  | 'machine_operation'
  | 'tractor_operation';

export interface Certification {
  id: string;
  type: CertificationType;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'pending_renewal';
  documents: Document[];
  renewalRule?: RenewalRule;
  requirements?: Requirement[];
}

export interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  uploadDate: Date;
}

export interface RenewalRule {
  frequency: number; // in months
  reminderThresholds: number[]; // days before expiry
  requiresAssessment: boolean;
  requiresTraining: boolean;
}

export interface Requirement {
  id: string;
  title: string;
  type: 'training' | 'assessment' | 'document';
  status: 'required' | 'optional';
}

export type TrainingType = 
  | 'classroom' 
  | 'online' 
  | 'hands_on' 
  | 'self_study'
  | 'assessment';

export interface TrainingRecord {
  id: string;
  training: {
    id: string;
    title: string;
    type: TrainingType;
  };
  completionDate: Date;
  expiryDate?: Date;
  score?: number;
  status: 'completed' | 'in_progress' | 'failed' | 'expired';
  instructor?: string;
  location?: string;
  certificate?: Document;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string[];
  qualifications: string[];
  contact: {
    email: string;
    phone?: string;
  };
}

export interface TrainingSession {
  id: string;
  title: string;
  type: TrainingType;
  instructor: Instructor;
  schedule: {
    startDate: Date;
    endDate: Date;
    location: string;
  };
  capacity: {
    max: number;
    current: number;
    waitlist: number;
  };
  participants: Participant[];
  materials: Material[];
  assessment?: Assessment;
}

export interface Participant {
  workerId: string;
  workerName: string;
  status: 'confirmed' | 'waitlist' | 'completed' | 'no_show' | 'cancelled';
  registrationDate: Date;
  completionStatus?: 'passed' | 'failed' | 'incomplete';
}

export interface Material {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'quiz';
  url: string;
  required: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  passingScore: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'practical';
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface DepartmentCompliance {
  name: string;
  total: number;
  compliant: number;
  percentageCompliant: number;
  expiringCertifications: {
    total: number;
    critical: number;
  };
}
