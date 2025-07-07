import { SafetyIncident } from "@/types/incidents";

export const mockIncidents: SafetyIncident[] = [
  {
    id: 'inc-1',
    title: 'Minor slip near loading bay ramp',
    date: '2024-01-15T09:30:00Z',
    type: 'near-miss',
    severity: 'low',
    status: 'resolved',
    location: 'Loading Bay Alpha',
    reportedBy: 'John Doe',
    description: 'A worker slipped on a wet patch on the ramp. No injury sustained. Area was cordoned off and dried.',
    resolutionSteps: 'Applied anti-slip coating to the ramp surface.'
  },
  {
    id: 'inc-2',
    title: 'Forklift collision with barrier',
    date: '2024-03-22T14:00:00Z',
    type: 'property-damage',
    severity: 'medium',
    status: 'investigating',
    location: 'Loading Bay Alpha',
    reportedBy: 'Jane Smith',
    description: 'Forklift operator misjudged a turn and collided with a safety barrier, causing minor damage to both.',
    affectedEquipment: ['forklift-03']
  },
  {
    id: 'inc-3',
    title: 'Fall from height',
    date: '2024-05-10T11:00:00Z',
    type: 'injury',
    severity: 'high',
    status: 'mitigated',
    location: 'Loading Bay Alpha',
    reportedBy: 'Supervisor',
    description: 'Contractor fell from a truck bed, sustaining a sprained ankle. First aid was administered immediately.',
    resolutionSteps: 'Review of safe unloading procedures and mandatory use of step-ladders.'
  },
  {
    id: 'inc-4',
    title: 'Unlabeled chemical spill',
    date: '2024-02-05T16:20:00Z',
    type: 'chemical',
    severity: 'medium',
    status: 'resolved',
    location: 'Chemical Storage Area',
    reportedBy: 'Alex Johnson',
    description: 'A small amount of an unidentified liquid was found leaking from a container. The spill was contained using the spill kit.',
    resolutionSteps: 'Disposed of leaking container according to regulations. All containers were checked for proper labeling.'
  },
  {
    id: 'inc-5',
    title: 'Cattle broke through fence',
    date: '2024-04-18T08:00:00Z',
    type: 'near-miss',
    severity: 'low',
    status: 'resolved',
    location: 'Livestock Handling Yards',
    reportedBy: 'Maria Garcia',
    description: 'A section of fencing failed, and three cows entered a restricted pathway. They were safely herded back.',
    resolutionSteps: 'The entire fence line was inspected and the weak section was replaced with reinforced materials.'
  },
  {
    id: 'inc-6',
    title: 'Worker kicked by cow',
    date: '2024-05-29T13:45:00Z',
    type: 'injury',
    severity: 'medium',
    status: 'resolved',
    location: 'Livestock Handling Yards',
    reportedBy: 'David Lee',
    description: 'During sorting, a worker was kicked by a stressed cow, resulting in severe bruising. Worker was sent for medical evaluation.',
    resolutionSteps: 'Refresher training on low-stress livestock handling techniques was conducted for the team.'
  }
]; 