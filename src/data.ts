import { Department, Service, Announcement, User } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-revenue',
    name: 'Revenue Department',
    code: 'REV',
    icon: 'Landmark',
    description: 'Land records, Patta transfer, community certificates, and income verification.'
  },
  {
    id: 'dept-aadhaar',
    name: 'Aadhaar Services',
    code: 'AAD',
    icon: 'Fingerprint',
    description: 'New enrollment, biometric updates, demographics update, and phone linking.'
  },
  {
    id: 'dept-licence',
    name: 'Driving Licence Services',
    code: 'DL',
    icon: 'FileText',
    description: 'Learner licences, permanent driving licences, duplicate licences, and renewals.'
  },
  {
    id: 'dept-employment',
    name: 'Employment Office',
    code: 'EMP',
    icon: 'Briefcase',
    description: 'Job registrations, renewals, skill training bookings, and government job updates.'
  },
  {
    id: 'dept-municipality',
    name: 'Municipal Corporation',
    code: 'MUN',
    icon: 'Building2',
    description: 'Birth/death certificate issuance, property tax payments, and trade licence renewals.'
  },
  {
    id: 'dept-passport',
    name: 'Passport Verification',
    code: 'PSP',
    icon: 'Shield',
    description: 'Official police verification requests, background screening, and passport status clearance.'
  },
  {
    id: 'dept-electricity',
    name: 'Electricity Board',
    code: 'ELE',
    icon: 'Zap',
    description: 'New service connections, meter complaints, power outages, and bill collections.'
  }
];

export const SERVICES: Service[] = [
  // Revenue
  {
    id: 'srv-patta',
    departmentId: 'dept-revenue',
    name: 'Patta Chitta Transfer',
    avgMinutes: 20,
    description: 'Transfer of land ownership records.',
    requiredDocuments: ['Sale Deed', 'Previous Patta copy', 'Tax Receipt', 'Identity Proof']
  },
  {
    id: 'srv-community',
    departmentId: 'dept-revenue',
    name: 'Community Certificate',
    avgMinutes: 10,
    description: 'Certificate verifying caste/community.',
    requiredDocuments: ['School TC', 'Parents Community Certificate Copy', 'Ration Card', 'Self-declaration']
  },
  {
    id: 'srv-income',
    departmentId: 'dept-revenue',
    name: 'Income Certificate',
    avgMinutes: 12,
    description: 'Official verification of family income.',
    requiredDocuments: ['Salary Certificate/Form 16', 'Ration Card', 'PAN Card', 'Bank Passbook']
  },
  {
    id: 'srv-nativity',
    departmentId: 'dept-revenue',
    name: 'Nativity Certificate',
    avgMinutes: 10,
    description: 'Certificate certifying residency/nativity.',
    requiredDocuments: ['Ration Card', 'Voter ID', 'Aadhaar Card', 'Birth Certificate']
  },

  // Aadhaar
  {
    id: 'srv-aadhaar-new',
    departmentId: 'dept-aadhaar',
    name: 'New Aadhaar Enrollment',
    avgMinutes: 15,
    description: 'Fresh Aadhaar card registration.',
    requiredDocuments: ['Proof of Identity', 'Proof of Address', 'Birth Certificate']
  },
  {
    id: 'srv-aadhaar-bio',
    departmentId: 'dept-aadhaar',
    name: 'Biometric Update (10 finger + Iris)',
    avgMinutes: 10,
    description: 'Mandatory bio-update or correcting fingerprints/iris scan.',
    requiredDocuments: ['Aadhaar Card copy', 'Identity Proof']
  },
  {
    id: 'srv-aadhaar-dem',
    departmentId: 'dept-aadhaar',
    name: 'Demographic Update (Name/Address/Phone)',
    avgMinutes: 8,
    description: 'Updating spelling mistakes, address, or phone number.',
    requiredDocuments: ['Aadhaar Card copy', 'Proof of Change (e.g. Gazetted Name Change, Passport)']
  },

  // Driving Licence
  {
    id: 'srv-dl-new',
    departmentId: 'dept-licence',
    name: 'New Driving Licence (LLR/DL)',
    avgMinutes: 25,
    description: 'Issuance of Learner licence or permanent test scheduling.',
    requiredDocuments: ['Age Proof (SSLC Book)', 'Address Proof', 'Physical Fitness Form 1A', 'LLR Copy']
  },
  {
    id: 'srv-dl-renew',
    departmentId: 'dept-licence',
    name: 'Driving Licence Renewal',
    avgMinutes: 15,
    description: 'Renew expired licences.',
    requiredDocuments: ['Original DL copy', 'Medical Certificate Form 1A', 'Address Proof']
  },

  // Employment
  {
    id: 'srv-emp-reg',
    departmentId: 'dept-employment',
    name: 'New Employment Registration',
    avgMinutes: 12,
    description: 'Register educational qualification in the state job portal.',
    requiredDocuments: ['Degree Certificate', 'HSC/SSLC Marksheet', 'Aadhaar Card', 'Ration Card']
  },
  {
    id: 'srv-emp-renew',
    departmentId: 'dept-employment',
    name: 'Employment Renewal / Update',
    avgMinutes: 6,
    description: 'Maintain job profile active status.',
    requiredDocuments: ['Employment Card', 'New Educational certificates (if any)']
  },

  // Municipality
  {
    id: 'srv-birth-cert',
    departmentId: 'dept-municipality',
    name: 'Birth Certificate Issuance',
    avgMinutes: 8,
    description: 'Get verified Birth Certificate.',
    requiredDocuments: ['Hospital Discharge Summary', 'Parents Aadhaar Card', 'Application Form']
  },
  {
    id: 'srv-death-cert',
    departmentId: 'dept-municipality',
    name: 'Death Certificate Issuance',
    avgMinutes: 8,
    description: 'Get verified Death Certificate.',
    requiredDocuments: ['Hospital Death Summary', 'Deceased Aadhaar Card copy', 'Cremation/Burial Receipt']
  },
  {
    id: 'srv-property-tax',
    departmentId: 'dept-municipality',
    name: 'Property Tax Payment',
    avgMinutes: 10,
    description: 'Pay yearly municipal property tax.',
    requiredDocuments: ['Previous Tax Challan', 'Assess Number Details', 'Property Title Deeds']
  },

  // Passport Verification
  {
    id: 'srv-passport-police',
    departmentId: 'dept-passport',
    name: 'Police Passport Verification',
    avgMinutes: 15,
    description: 'Verification of physical files for passport applicants.',
    requiredDocuments: ['Passport Application Receipt', 'Two Residence Proofs', 'Two Reference Letters']
  },

  // Electricity
  {
    id: 'srv-elec-new',
    departmentId: 'dept-electricity',
    name: 'New Power Service Connection',
    avgMinutes: 20,
    description: 'Apply for residential or commercial electricity meter.',
    requiredDocuments: ['Ownership Deed or Sale Deed', 'No Objection Certificate', 'Property Tax Bill']
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Senior Citizen Special Counter Activated',
    content: 'Special high-priority Queue Counter 5 is now fully activated in Revenue & Aadhaar wings to expedite service for senior citizens above 60 and disabled individuals.',
    category: 'ANNOUNCEMENT',
    date: '2026-07-13',
    active: true
  },
  {
    id: 'ann-2',
    title: 'Biometric System Maintenance this Sunday',
    content: 'Aadhaar demographic services will be available, but Biometric Fingerprint/Iris registration will experience a 4-hour scheduled upgrade this Sunday (July 19th) from 9:00 AM to 1:00 PM.',
    category: 'NOTICE',
    date: '2026-07-12',
    active: true
  },
  {
    id: 'ann-3',
    title: 'Property Tax Payment Deadline Extended',
    content: 'Due to municipal system upgrades, the deadline for 2026 Property Tax submission with zero penalty has been officially extended to August 15, 2026.',
    category: 'ANNOUNCEMENT',
    date: '2026-07-11',
    active: true
  },
  {
    id: 'ann-4',
    title: 'Emergency Storm Notice - Selected Counter Redirection',
    content: 'Counters in block C (Licencing Services) have been temporarily consolidated into Block A due to localized water lines maintenance. Expected resolution: 24 hours.',
    category: 'EMERGENCY',
    date: '2026-07-14',
    active: true
  }
];

export const TEST_USERS: { email: string; name: string; role: string; departmentId?: string; counterId?: string }[] = [
  {
    email: 'citizen@gov.in',
    name: 'Ramesh Kumar',
    role: 'CITIZEN'
  },
  {
    email: 'officer.rev@gov.in',
    name: 'Officer Shanthi (Revenue)',
    role: 'OFFICER',
    departmentId: 'dept-revenue',
    counterId: 'counter-rev-1'
  },
  {
    email: 'officer.aad@gov.in',
    name: 'Officer Rajesh (Aadhaar)',
    role: 'OFFICER',
    departmentId: 'dept-aadhaar',
    counterId: 'counter-aad-1'
  },
  {
    email: 'officer.lic@gov.in',
    name: 'Officer Anand (Licence)',
    role: 'OFFICER',
    departmentId: 'dept-licence',
    counterId: 'counter-lic-1'
  },
  {
    email: 'admin@gov.in',
    name: 'Admin Desk (Director)',
    role: 'ADMIN'
  },
  {
    email: 'superadmin@gov.in',
    name: 'State Super Admin IT Cell',
    role: 'SUPER_ADMIN'
  }
];

export const OFFICE_TIMINGS = {
  workingDays: 'Monday to Saturday',
  hours: '9:00 AM – 6:00 PM',
  lunchBreak: '1:30 PM – 2:00 PM',
  status: 'Open Now'
};
