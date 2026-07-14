export type Role = 'CITIZEN' | 'OFFICER' | 'ADMIN' | 'SUPER_ADMIN';

export type TokenStatus = 'PENDING' | 'CALLING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

export type PriorityLevel = 'REGULAR' | 'SENIOR_CITIZEN' | 'DISABLED' | 'EMERGENCY';

export type CounterStatus = 'OPEN' | 'CLOSED' | 'PAUSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  departmentId?: string;
  counterId?: string; // Assigned counter
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  icon: string; // Lucide icon name
  description: string;
}

export interface Service {
  id: string;
  departmentId: string;
  name: string;
  avgMinutes: number;
  description: string;
  requiredDocuments: string[];
}

export interface Counter {
  id: string;
  counterNumber: number;
  departmentId: string;
  officerId: string | null;
  officerName: string | null;
  status: CounterStatus;
  currentTokenId: string | null;
  currentTokenNumber: string | null;
}

export interface Token {
  id: string;
  tokenNumber: string; // e.g. REV-001
  sequence: number;
  citizenName: string;
  mobile: string;
  email?: string;
  aadhaar?: string;
  status: TokenStatus;
  priority: PriorityLevel;
  departmentId: string;
  serviceId: string;
  serviceName: string;
  counterId: string | null;
  counterNumber: number | null;
  estimatedWaitMinutes: number;
  queuePosition: number;
  slot: 'MORNING' | 'AFTERNOON';
  isOnlineBooked: boolean;
  appointmentId?: string;
  calledAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  citizenName: string;
  mobile: string;
  email?: string;
  departmentId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  slot: string; // e.g., "10:00 AM - 10:30 AM"
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'TOKEN_GENERATED';
  createdAt: string;
}

export interface Feedback {
  id: string;
  tokenNumber: string;
  citizenName: string;
  rating: number; // 1-5
  comments: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'EMERGENCY' | 'ANNOUNCEMENT' | 'NOTICE';
  date: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface QueueState {
  tokens: Token[];
  counters: Counter[];
  appointments: Appointment[];
  feedbacks: Feedback[];
  auditLogs: AuditLog[];
}
