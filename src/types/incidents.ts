
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'mitigated' | 'resolved';
export type IncidentType = 'injury' | 'near-miss' | 'property-damage' | 'environmental' | 'other' | 'machinery' | 'chemical' | 'physical';

export interface SafetyIncident {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  affectedEquipment?: string[];
  resolutionSteps?: string;
}
