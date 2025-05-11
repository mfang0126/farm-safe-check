
import { WorkerProfile, Certification, TrainingRecord, TrainingSession, DepartmentCompliance } from './types';

// Mock data for Worker Profiles
export const mockWorkers: WorkerProfile[] = [
  {
    id: '1',
    employeeId: 'EMP-2024-001',
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
    },
    employment: {
      position: 'Equipment Operator',
      department: 'Field Operations',
      startDate: new Date('2023-01-15'),
      status: 'active',
    },
    certifications: [
      {
        id: '101',
        type: 'forklift_operator',
        name: 'Forklift Operator',
        issuer: 'SafeTrain Corp',
        issueDate: new Date('2023-12-10'),
        expiryDate: new Date('2025-12-10'),
        status: 'valid',
        documents: [
          {
            id: 'd101',
            title: 'Forklift Certificate',
            fileUrl: '/certificates/forklift_john.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-12-10'),
          }
        ],
      },
      {
        id: '102',
        type: 'first_aid_cpr',
        name: 'First Aid/CPR',
        issuer: 'Red Cross',
        issueDate: new Date('2023-01-20'),
        expiryDate: new Date('2025-01-20'),
        status: 'pending_renewal',
        documents: [
          {
            id: 'd102',
            title: 'First Aid Certificate',
            fileUrl: '/certificates/firstaid_john.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-01-20'),
          }
        ],
      },
      {
        id: '103',
        type: 'chemical_handling',
        name: 'Chemical Handling',
        issuer: 'SafeChem Institute',
        issueDate: new Date('2022-06-05'),
        expiryDate: new Date('2023-06-05'),
        status: 'expired',
        documents: [
          {
            id: 'd103',
            title: 'Chemical Safety Certificate',
            fileUrl: '/certificates/chemical_john.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2022-06-05'),
          }
        ],
      },
    ],
    trainingHistory: [
      {
        id: 't101',
        training: {
          id: 'course101',
          title: 'Equipment Safety Basics',
          type: 'classroom',
        },
        completionDate: new Date('2023-02-15'),
        status: 'completed',
        instructor: 'Mary Johnson',
        location: 'Training Center A',
      },
      {
        id: 't102',
        training: {
          id: 'course102',
          title: 'Emergency Response Protocol',
          type: 'online',
        },
        completionDate: new Date('2023-09-10'),
        status: 'completed',
        score: 95,
      },
      {
        id: 't103',
        training: {
          id: 'course103',
          title: 'Advanced Machinery Operation',
          type: 'hands_on',
        },
        completionDate: new Date('2022-11-30'),
        expiryDate: new Date('2024-11-30'),
        status: 'completed',
        instructor: 'Robert Phillips',
        location: 'Field Training Area',
      },
    ],
    healthInfo: {
      restrictions: ['No heavy lifting over 50 lbs'],
      allergies: ['Latex'],
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        phone: '555-987-6543',
      },
    },
  },
  {
    id: '2',
    employeeId: 'EMP-2024-002',
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '555-234-5678',
    },
    employment: {
      position: 'Safety Coordinator',
      department: 'Health & Safety',
      startDate: new Date('2022-03-10'),
      status: 'active',
    },
    certifications: [
      {
        id: '201',
        type: 'first_aid_cpr',
        name: 'First Aid/CPR',
        issuer: 'Red Cross',
        issueDate: new Date('2023-05-15'),
        expiryDate: new Date('2025-05-15'),
        status: 'valid',
        documents: [
          {
            id: 'd201',
            title: 'First Aid Certificate',
            fileUrl: '/certificates/firstaid_sarah.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-05-15'),
          }
        ],
      },
      {
        id: '202',
        type: 'fire_safety',
        name: 'Fire Safety',
        issuer: 'State Fire Department',
        issueDate: new Date('2022-07-22'),
        expiryDate: new Date('2024-07-22'),
        status: 'valid',
        documents: [
          {
            id: 'd202',
            title: 'Fire Safety Certificate',
            fileUrl: '/certificates/fire_sarah.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2022-07-22'),
          }
        ],
      },
    ],
    trainingHistory: [
      {
        id: 't201',
        training: {
          id: 'course201',
          title: 'Workplace Safety Management',
          type: 'classroom',
        },
        completionDate: new Date('2022-04-20'),
        status: 'completed',
        instructor: 'David Wilson',
        location: 'Training Center B',
      },
      {
        id: 't202',
        training: {
          id: 'course202',
          title: 'OSHA Compliance',
          type: 'online',
        },
        completionDate: new Date('2023-02-10'),
        status: 'completed',
        score: 92,
      },
    ],
    healthInfo: {
      emergencyContact: {
        name: 'Michael Johnson',
        relationship: 'Brother',
        phone: '555-876-5432',
      },
    },
  },
  {
    id: '3',
    employeeId: 'EMP-2024-003',
    personalInfo: {
      firstName: 'Robert',
      lastName: 'Davis',
      email: 'robert.davis@example.com',
      phone: '555-345-6789',
    },
    employment: {
      position: 'Maintenance Technician',
      department: 'Maintenance',
      startDate: new Date('2023-06-01'),
      status: 'active',
    },
    certifications: [
      {
        id: '301',
        type: 'electrical_safety',
        name: 'Electrical Safety',
        issuer: 'Technical Institute',
        issueDate: new Date('2023-06-15'),
        expiryDate: new Date('2025-06-15'),
        status: 'valid',
        documents: [
          {
            id: 'd301',
            title: 'Electrical Safety Certificate',
            fileUrl: '/certificates/electrical_robert.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-06-15'),
          }
        ],
      },
    ],
    trainingHistory: [
      {
        id: 't301',
        training: {
          id: 'course301',
          title: 'Equipment Maintenance Fundamentals',
          type: 'hands_on',
        },
        completionDate: new Date('2023-07-10'),
        status: 'completed',
        instructor: 'Thomas Black',
        location: 'Maintenance Workshop',
      },
    ],
    healthInfo: {
      emergencyContact: {
        name: 'Emily Davis',
        relationship: 'Spouse',
        phone: '555-765-4321',
      },
    },
  },
  {
    id: '4',
    employeeId: 'EMP-2024-004',
    personalInfo: {
      firstName: 'Emily',
      lastName: 'Wilson',
      email: 'emily.wilson@example.com',
      phone: '555-456-7890',
    },
    employment: {
      position: 'Field Supervisor',
      department: 'Field Operations',
      startDate: new Date('2021-11-15'),
      status: 'active',
    },
    certifications: [
      {
        id: '401',
        type: 'forklift_operator',
        name: 'Forklift Operator',
        issuer: 'SafeTrain Corp',
        issueDate: new Date('2022-02-10'),
        expiryDate: new Date('2024-02-10'),
        status: 'pending_renewal',
        documents: [
          {
            id: 'd401',
            title: 'Forklift Certificate',
            fileUrl: '/certificates/forklift_emily.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2022-02-10'),
          }
        ],
      },
      {
        id: '402',
        type: 'first_aid_cpr',
        name: 'First Aid/CPR',
        issuer: 'Red Cross',
        issueDate: new Date('2022-05-22'),
        expiryDate: new Date('2024-05-22'),
        status: 'valid',
        documents: [
          {
            id: 'd402',
            title: 'First Aid Certificate',
            fileUrl: '/certificates/firstaid_emily.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2022-05-22'),
          }
        ],
      },
      {
        id: '403',
        type: 'ppe_basic',
        name: 'PPE Usage & Safety',
        issuer: 'SafetyFirst Inc',
        issueDate: new Date('2021-12-05'),
        expiryDate: new Date('2023-12-05'),
        status: 'pending_renewal',
        documents: [
          {
            id: 'd403',
            title: 'PPE Usage Certificate',
            fileUrl: '/certificates/ppe_emily.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2021-12-05'),
          }
        ],
      },
    ],
    trainingHistory: [
      {
        id: 't401',
        training: {
          id: 'course401',
          title: 'Leadership & Supervision',
          type: 'classroom',
        },
        completionDate: new Date('2022-01-15'),
        status: 'completed',
        instructor: 'Jessica Brown',
        location: 'Training Center A',
      },
      {
        id: 't402',
        training: {
          id: 'course402',
          title: 'Safety Inspection Protocols',
          type: 'hands_on',
        },
        completionDate: new Date('2022-08-10'),
        status: 'completed',
        instructor: 'Mark Thompson',
        location: 'Field Operations Area',
      },
    ],
    healthInfo: {
      emergencyContact: {
        name: 'James Wilson',
        relationship: 'Spouse',
        phone: '555-654-3210',
      },
    },
  },
  {
    id: '5',
    employeeId: 'EMP-2024-005',
    personalInfo: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phone: '555-567-8901',
    },
    employment: {
      position: 'Machine Operator',
      department: 'Production',
      startDate: new Date('2023-03-20'),
      status: 'leave',
    },
    certifications: [
      {
        id: '501',
        type: 'machine_operation',
        name: 'Industrial Machine Operation',
        issuer: 'Technical College',
        issueDate: new Date('2023-04-10'),
        expiryDate: new Date('2025-04-10'),
        status: 'valid',
        documents: [
          {
            id: 'd501',
            title: 'Machine Operation Certificate',
            fileUrl: '/certificates/machine_michael.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-04-10'),
          }
        ],
      },
      {
        id: '502',
        type: 'ppe_basic',
        name: 'PPE Usage & Safety',
        issuer: 'SafetyFirst Inc',
        issueDate: new Date('2023-04-15'),
        expiryDate: new Date('2025-04-15'),
        status: 'valid',
        documents: [
          {
            id: 'd502',
            title: 'PPE Usage Certificate',
            fileUrl: '/certificates/ppe_michael.pdf',
            fileType: 'pdf',
            uploadDate: new Date('2023-04-15'),
          }
        ],
      },
    ],
    trainingHistory: [
      {
        id: 't501',
        training: {
          id: 'course501',
          title: 'Machine Safety Protocols',
          type: 'classroom',
        },
        completionDate: new Date('2023-05-05'),
        status: 'completed',
        instructor: 'Robert Phillips',
        location: 'Training Center B',
      },
    ],
    healthInfo: {
      restrictions: ['Currently on medical leave'],
      emergencyContact: {
        name: 'Laura Brown',
        relationship: 'Spouse',
        phone: '555-543-2109',
      },
    },
  },
];

// Mock data for Training Sessions
export const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'ts1',
    title: 'First Aid/CPR Training',
    type: 'classroom',
    instructor: {
      id: 'i1',
      name: 'Mary Johnson',
      specialty: ['First Aid', 'Emergency Response'],
      qualifications: ['Certified First Aid Instructor', 'CPR Trainer'],
      contact: {
        email: 'mary.johnson@example.com',
        phone: '555-111-2222',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() + 6)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
      location: 'Training Center A',
    },
    capacity: {
      max: 20,
      current: 15,
      waitlist: 0,
    },
    participants: [],
    materials: [
      {
        id: 'm1',
        title: 'First Aid Manual',
        type: 'document',
        url: '/materials/first_aid_manual.pdf',
        required: true,
      },
      {
        id: 'm2',
        title: 'CPR Demonstration Video',
        type: 'video',
        url: '/materials/cpr_demo.mp4',
        required: true,
      },
      {
        id: 'm3',
        title: 'Pre-Training Assessment',
        type: 'quiz',
        url: '/materials/first_aid_assessment.html',
        required: false,
      },
    ],
    assessment: {
      id: 'a1',
      title: 'First Aid Certification Exam',
      passingScore: 80,
      questions: [],
    },
  },
  {
    id: 'ts2',
    title: 'Chemical Handling Safety',
    type: 'hands_on',
    instructor: {
      id: 'i2',
      name: 'Robert Phillips',
      specialty: ['Chemical Safety', 'HAZMAT'],
      qualifications: ['Chemical Safety Specialist', 'OSHA Certified Trainer'],
      contact: {
        email: 'robert.phillips@example.com',
        phone: '555-333-4444',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      location: 'Chemical Storage Facility',
    },
    capacity: {
      max: 12,
      current: 9,
      waitlist: 1,
    },
    participants: [],
    materials: [
      {
        id: 'm4',
        title: 'Chemical Safety Handbook',
        type: 'document',
        url: '/materials/chemical_safety.pdf',
        required: true,
      },
      {
        id: 'm5',
        title: 'PPE Usage Guide',
        type: 'document',
        url: '/materials/ppe_guide.pdf',
        required: true,
      },
    ],
    assessment: {
      id: 'a2',
      title: 'Chemical Handling Practical Assessment',
      passingScore: 90,
      questions: [],
    },
  },
  {
    id: 'ts3',
    title: 'Equipment Safety Basics',
    type: 'classroom',
    instructor: {
      id: 'i3',
      name: 'Thomas Black',
      specialty: ['Equipment Safety', 'Mechanical Operations'],
      qualifications: ['Mechanical Engineer', 'Certified Safety Trainer'],
      contact: {
        email: 'thomas.black@example.com',
        phone: '555-555-6666',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      location: 'Training Center B',
    },
    capacity: {
      max: 15,
      current: 15,
      waitlist: 3,
    },
    participants: [],
    materials: [
      {
        id: 'm6',
        title: 'Equipment Safety Manual',
        type: 'document',
        url: '/materials/equipment_safety.pdf',
        required: true,
      },
      {
        id: 'm7',
        title: 'Maintenance Best Practices',
        type: 'document',
        url: '/materials/maintenance_practices.pdf',
        required: false,
      },
    ],
    assessment: {
      id: 'a3',
      title: 'Equipment Safety Knowledge Check',
      passingScore: 75,
      questions: [],
    },
  },
  {
    id: 'ts4',
    title: 'PPE Basics & Usage',
    type: 'online',
    instructor: {
      id: 'i4',
      name: 'Jessica Brown',
      specialty: ['PPE', 'General Safety'],
      qualifications: ['Safety Specialist', 'Online Learning Developer'],
      contact: {
        email: 'jessica.brown@example.com',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 25)),
      location: 'Online Learning Platform',
    },
    capacity: {
      max: 50,
      current: 28,
      waitlist: 0,
    },
    participants: [],
    materials: [
      {
        id: 'm8',
        title: 'PPE Selection Guide',
        type: 'document',
        url: '/materials/ppe_selection.pdf',
        required: true,
      },
      {
        id: 'm9',
        title: 'PPE Inspection Video',
        type: 'video',
        url: '/materials/ppe_inspection.mp4',
        required: true,
      },
    ],
    assessment: {
      id: 'a4',
      title: 'PPE Knowledge Assessment',
      passingScore: 80,
      questions: [],
    },
  },
  {
    id: 'ts5',
    title: 'Forklift Operation Certification',
    type: 'hands_on',
    instructor: {
      id: 'i5',
      name: 'Mark Thompson',
      specialty: ['Equipment Operation', 'Forklift Safety'],
      qualifications: ['Certified Forklift Instructor', 'Heavy Equipment Specialist'],
      contact: {
        email: 'mark.thompson@example.com',
        phone: '555-777-8888',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() + 12)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 13)),
      location: 'Warehouse Training Area',
    },
    capacity: {
      max: 8,
      current: 5,
      waitlist: 0,
    },
    participants: [],
    materials: [
      {
        id: 'm10',
        title: 'Forklift Operator Manual',
        type: 'document',
        url: '/materials/forklift_manual.pdf',
        required: true,
      },
      {
        id: 'm11',
        title: 'Load Capacity Calculation Guide',
        type: 'document',
        url: '/materials/load_capacity.pdf',
        required: true,
      },
    ],
    assessment: {
      id: 'a5',
      title: 'Forklift Operator Practical Test',
      passingScore: 90,
      questions: [],
    },
  },
  {
    id: 'ts6',
    title: 'OSHA Compliance Training',
    type: 'online',
    instructor: {
      id: 'i6',
      name: 'David Wilson',
      specialty: ['Regulatory Compliance', 'OSHA Standards'],
      qualifications: ['OSHA Certified Instructor', 'Safety Compliance Expert'],
      contact: {
        email: 'david.wilson@example.com',
      },
    },
    schedule: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      location: 'Online Learning Platform',
    },
    capacity: {
      max: 30,
      current: 22,
      waitlist: 0,
    },
    participants: [],
    materials: [
      {
        id: 'm12',
        title: 'OSHA Standards Reference',
        type: 'document',
        url: '/materials/osha_standards.pdf',
        required: true,
      },
      {
        id: 'm13',
        title: 'Compliance Case Studies',
        type: 'document',
        url: '/materials/compliance_cases.pdf',
        required: false,
      },
    ],
    assessment: {
      id: 'a6',
      title: 'OSHA Compliance Assessment',
      passingScore: 85,
      questions: [],
    },
  },
];

// Mock data for Department Compliance
export const mockDepartmentCompliance: DepartmentCompliance[] = [
  {
    name: 'Field Operations',
    total: 45,
    compliant: 35,
    percentageCompliant: 78,
    expiringCertifications: {
      total: 12,
      critical: 8,
    },
  },
  {
    name: 'Maintenance',
    total: 20,
    compliant: 19,
    percentageCompliant: 95,
    expiringCertifications: {
      total: 3,
      critical: 1,
    },
  },
  {
    name: 'Health & Safety',
    total: 10,
    compliant: 10,
    percentageCompliant: 100,
    expiringCertifications: {
      total: 2,
      critical: 0,
    },
  },
  {
    name: 'Production',
    total: 30,
    compliant: 21,
    percentageCompliant: 70,
    expiringCertifications: {
      total: 9,
      critical: 5,
    },
  },
  {
    name: 'Administration',
    total: 15,
    compliant: 12,
    percentageCompliant: 80,
    expiringCertifications: {
      total: 4,
      critical: 1,
    },
  },
];
