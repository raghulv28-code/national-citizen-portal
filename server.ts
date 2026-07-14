import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import { Token, Counter, Appointment, Feedback, AuditLog, QueueState, PriorityLevel, TokenStatus } from './src/types';
import { DEPARTMENTS, SERVICES, ANNOUNCEMENTS } from './src/data';

const OFFICE_TIMINGS = {
  workingDays: 'Monday - Saturday',
  hours: '09:00 AM - 06:00 PM',
  lunchBreak: '01:30 PM - 02:00 PM'
};

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini API:', err);
  }
} else {
  console.log('Gemini API key is not configured. Running in fallback mode.');
}

app.use(express.json());

// Persistent State File Path
const DB_FILE = path.join(process.cwd(), 'db.json');

// Default initial state
const defaultState: QueueState = {
  tokens: [
    {
      id: 'tok-1',
      tokenNumber: 'REV-021',
      sequence: 21,
      citizenName: 'Amit Shah',
      mobile: '9876543210',
      email: 'amit@example.com',
      aadhaar: '123456789012',
      status: 'COMPLETED',
      priority: 'REGULAR',
      departmentId: 'dept-revenue',
      serviceId: 'srv-patta',
      serviceName: 'Patta Chitta Transfer',
      counterId: 'counter-rev-1',
      counterNumber: 1,
      estimatedWaitMinutes: 0,
      queuePosition: 0,
      slot: 'MORNING',
      isOnlineBooked: false,
      calledAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 2400000).toISOString(),
      createdAt: new Date(Date.now() - 4000000).toISOString()
    },
    {
      id: 'tok-2',
      tokenNumber: 'REV-022',
      sequence: 22,
      citizenName: 'Priya Dharshini',
      mobile: '9123456789',
      status: 'COMPLETED',
      priority: 'SENIOR_CITIZEN',
      departmentId: 'dept-revenue',
      serviceId: 'srv-community',
      serviceName: 'Community Certificate',
      counterId: 'counter-rev-1',
      counterNumber: 1,
      estimatedWaitMinutes: 0,
      queuePosition: 0,
      slot: 'MORNING',
      isOnlineBooked: false,
      calledAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 600000).toISOString(),
      createdAt: new Date(Date.now() - 2500000).toISOString()
    },
    {
      id: 'tok-3',
      tokenNumber: 'REV-023',
      sequence: 23,
      citizenName: 'Raghul Vasanth',
      mobile: '9444123456',
      status: 'CALLING',
      priority: 'REGULAR',
      departmentId: 'dept-revenue',
      serviceId: 'srv-income',
      serviceName: 'Income Certificate',
      counterId: 'counter-rev-1',
      counterNumber: 1,
      estimatedWaitMinutes: 0,
      queuePosition: 0,
      slot: 'MORNING',
      isOnlineBooked: false,
      calledAt: new Date(Date.now() - 120000).toISOString(),
      createdAt: new Date(Date.now() - 1200000).toISOString()
    },
    {
      id: 'tok-4',
      tokenNumber: 'AAD-118',
      sequence: 118,
      citizenName: 'Satish Kumar',
      mobile: '9555123456',
      status: 'CALLING',
      priority: 'REGULAR',
      departmentId: 'dept-aadhaar',
      serviceId: 'srv-aadhaar-bio',
      serviceName: 'Biometric Update (10 finger + Iris)',
      counterId: 'counter-aad-1',
      counterNumber: 2,
      estimatedWaitMinutes: 0,
      queuePosition: 0,
      slot: 'MORNING',
      isOnlineBooked: true,
      calledAt: new Date(Date.now() - 60000).toISOString(),
      createdAt: new Date(Date.now() - 1500000).toISOString()
    },
    {
      id: 'tok-5',
      tokenNumber: 'DL-056',
      sequence: 56,
      citizenName: 'Arjun Das',
      mobile: '9777123456',
      status: 'CALLING',
      priority: 'DISABLED',
      departmentId: 'dept-licence',
      serviceId: 'srv-dl-new',
      serviceName: 'New Driving Licence (LLR/DL)',
      counterId: 'counter-lic-1',
      counterNumber: 3,
      estimatedWaitMinutes: 0,
      queuePosition: 0,
      slot: 'MORNING',
      isOnlineBooked: false,
      calledAt: new Date(Date.now() - 200000).toISOString(),
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    // Pending Queue Tokens
    {
      id: 'tok-6',
      tokenNumber: 'REV-024',
      sequence: 24,
      citizenName: 'Manish Singh',
      mobile: '9000112233',
      status: 'PENDING',
      priority: 'REGULAR',
      departmentId: 'dept-revenue',
      serviceId: 'srv-nativity',
      serviceName: 'Nativity Certificate',
      counterId: null,
      counterNumber: null,
      estimatedWaitMinutes: 15,
      queuePosition: 1,
      slot: 'MORNING',
      isOnlineBooked: false,
      createdAt: new Date(Date.now() - 500000).toISOString()
    },
    {
      id: 'tok-7',
      tokenNumber: 'REV-025',
      sequence: 25,
      citizenName: 'Savitha Devi',
      mobile: '9111223344',
      status: 'PENDING',
      priority: 'EMERGENCY', // Priority should bump this up
      departmentId: 'dept-revenue',
      serviceId: 'srv-patta',
      serviceName: 'Patta Chitta Transfer',
      counterId: null,
      counterNumber: null,
      estimatedWaitMinutes: 8,
      queuePosition: 2,
      slot: 'MORNING',
      isOnlineBooked: false,
      createdAt: new Date(Date.now() - 400000).toISOString()
    },
    {
      id: 'tok-8',
      tokenNumber: 'AAD-119',
      sequence: 119,
      citizenName: 'Vikram Seth',
      mobile: '9222334455',
      status: 'PENDING',
      priority: 'SENIOR_CITIZEN', // Priority bump
      departmentId: 'dept-aadhaar',
      serviceId: 'srv-aadhaar-new',
      serviceName: 'New Aadhaar Enrollment',
      counterId: null,
      counterNumber: null,
      estimatedWaitMinutes: 10,
      queuePosition: 1,
      slot: 'MORNING',
      isOnlineBooked: false,
      createdAt: new Date(Date.now() - 300000).toISOString()
    }
  ],
  counters: [
    {
      id: 'counter-rev-1',
      counterNumber: 1,
      departmentId: 'dept-revenue',
      officerId: 'off-rev-1',
      officerName: 'Officer Shanthi (Revenue)',
      status: 'OPEN',
      currentTokenId: 'tok-3',
      currentTokenNumber: 'REV-023'
    },
    {
      id: 'counter-aad-1',
      counterNumber: 2,
      departmentId: 'dept-aadhaar',
      officerId: 'off-aad-1',
      officerName: 'Officer Rajesh (Aadhaar)',
      status: 'OPEN',
      currentTokenId: 'tok-4',
      currentTokenNumber: 'AAD-118'
    },
    {
      id: 'counter-lic-1',
      counterNumber: 3,
      departmentId: 'dept-licence',
      officerId: 'off-lic-1',
      officerName: 'Officer Anand (Licence)',
      status: 'OPEN',
      currentTokenId: 'tok-5',
      currentTokenNumber: 'DL-056'
    },
    {
      id: 'counter-emp-1',
      counterNumber: 4,
      departmentId: 'dept-employment',
      officerId: null,
      officerName: null,
      status: 'CLOSED',
      currentTokenId: null,
      currentTokenNumber: null
    },
    {
      id: 'counter-mun-1',
      counterNumber: 5,
      departmentId: 'dept-municipality',
      officerId: null,
      officerName: null,
      status: 'CLOSED',
      currentTokenId: null,
      currentTokenNumber: null
    }
  ],
  appointments: [
    {
      id: 'apt-1',
      citizenName: 'Rajesh Khanna',
      mobile: '9840123456',
      email: 'rajesh@example.com',
      departmentId: 'dept-revenue',
      serviceId: 'srv-patta',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      slot: '10:00 AM - 10:30 AM',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    },
    {
      id: 'apt-2',
      citizenName: 'Meena kumari',
      mobile: '9840987654',
      email: 'meena@example.com',
      departmentId: 'dept-aadhaar',
      serviceId: 'srv-aadhaar-dem',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      slot: '11:30 AM - 12:00 PM',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
  ],
  feedbacks: [
    {
      id: 'feed-1',
      tokenNumber: 'REV-021',
      citizenName: 'Amit Shah',
      rating: 5,
      comments: 'Very quick service. No waiting time at all, counter officer was helpful and professional.',
      sentiment: 'positive',
      createdAt: new Date(Date.now() - 2400000).toISOString()
    },
    {
      id: 'feed-2',
      tokenNumber: 'REV-022',
      citizenName: 'Priya Dharshini',
      rating: 4,
      comments: 'Satisfied. Senior citizen support was fast and helpful.',
      sentiment: 'positive',
      createdAt: new Date(Date.now() - 60000).toISOString()
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      userId: 'system',
      userName: 'System Init',
      role: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOT',
      details: 'Smart Queue Management System booted successfully.',
      createdAt: new Date().toISOString()
    }
  ]
};

// State loading & saving
let state: QueueState = { ...defaultState };

function loadState() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const fileData = fs.readFileSync(DB_FILE, 'utf8');
      state = JSON.parse(fileData);
      console.log('Database loaded from persistent file db.json.');
    } catch (e) {
      console.error('Error loading db.json, using default state:', e);
      state = { ...defaultState };
    }
  } else {
    saveState();
  }
}

function saveState() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write db.json:', e);
  }
}

loadState();

// SSE SSE Event Stream for Live updates
let clients: Response[] = [];
function sendToAll(data: any) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

app.get('/api/queue/stream', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  clients.push(res);
  
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Logs audit
function addAuditLog(userName: string, role: string, action: string, details: string) {
  const newLog: AuditLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    userId: userName.toLowerCase().replace(/\s+/g, '-'),
    userName,
    role: role as any,
    action,
    details,
    createdAt: new Date().toISOString()
  };
  state.auditLogs.unshift(newLog);
  saveState();
  sendToAll({ type: 'AUDIT_LOG_ADDED', log: newLog });
}

// REST APIs

// 1. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Pre-seed matching login
  let matchedUser = {
    email,
    name: email.split('@')[0].toUpperCase(),
    role: role || 'CITIZEN',
    departmentId: undefined as string | undefined,
    counterId: undefined as string | undefined
  };

  if (email === 'citizen@gov.in') {
    matchedUser = { email, name: 'Ramesh Kumar', role: 'CITIZEN', departmentId: undefined, counterId: undefined };
  } else if (email === 'officer.rev@gov.in') {
    matchedUser = { email, name: 'Officer Shanthi (Revenue)', role: 'OFFICER', departmentId: 'dept-revenue', counterId: 'counter-rev-1' };
  } else if (email === 'officer.aad@gov.in') {
    matchedUser = { email, name: 'Officer Rajesh (Aadhaar)', role: 'OFFICER', departmentId: 'dept-aadhaar', counterId: 'counter-aad-1' };
  } else if (email === 'officer.lic@gov.in') {
    matchedUser = { email, name: 'Officer Anand (Licence)', role: 'OFFICER', departmentId: 'dept-licence', counterId: 'counter-lic-1' };
  } else if (email === 'admin@gov.in') {
    matchedUser = { email, name: 'Admin Desk (Director)', role: 'ADMIN', departmentId: undefined, counterId: undefined };
  } else if (email === 'superadmin@gov.in') {
    matchedUser = { email, name: 'State Super Admin IT Cell', role: 'SUPER_ADMIN', departmentId: undefined, counterId: undefined };
  }

  addAuditLog(matchedUser.name, matchedUser.role, 'USER_LOGIN', `Logged in via professional gov theme portal.`);
  
  // Return successful session details
  return res.json({
    success: true,
    user: matchedUser,
    token: `gov-jwt-token-stub-${matchedUser.role.toLowerCase()}-${Date.now()}`
  });
});

// 2. Fetch full system state
app.get('/api/state', (req: Request, res: Response) => {
  res.json({
    success: true,
    state: {
      tokens: state.tokens,
      counters: state.counters,
      appointments: state.appointments,
      feedbacks: state.feedbacks,
      auditLogs: state.auditLogs
    },
    departments: DEPARTMENTS,
    services: SERVICES,
    announcements: ANNOUNCEMENTS
  });
});

// 3. Citizen Token Generation (Includes priority FIFO calculation)
app.post('/api/tokens', (req: Request, res: Response) => {
  const { citizenName, mobile, email, aadhaar, departmentId, serviceId, priority, slot } = req.body;

  if (!citizenName || !mobile || !departmentId || !serviceId) {
    return res.status(400).json({ success: false, message: 'Missing required token details.' });
  }

  const dept = DEPARTMENTS.find(d => d.id === departmentId);
  const srv = SERVICES.find(s => s.id === serviceId);

  if (!dept || !srv) {
    return res.status(404).json({ success: false, message: 'Department or Service not found' });
  }

  // Calculate unique sequence for the department code today
  const todayPrefix = dept.code;
  const deptTokensToday = state.tokens.filter(t => t.departmentId === departmentId);
  const nextSeq = deptTokensToday.length + 1;
  const tokenNumber = `${todayPrefix}-${String(nextSeq).padStart(3, '0')}`;

  // Calculate waiting details
  const activeCounters = state.counters.filter(c => c.departmentId === departmentId && c.status === 'OPEN');
  const pendingCount = state.tokens.filter(t => t.departmentId === departmentId && t.status === 'PENDING').length;
  
  const estimatedWait = activeCounters.length > 0 
    ? Math.ceil((pendingCount * srv.avgMinutes) / activeCounters.length) 
    : pendingCount * srv.avgMinutes;

  const newToken: Token = {
    id: `tok-${Date.now()}`,
    tokenNumber,
    sequence: nextSeq,
    citizenName,
    mobile,
    email: email || '',
    aadhaar: aadhaar || '',
    status: 'PENDING',
    priority: (priority || 'REGULAR') as PriorityLevel,
    departmentId,
    serviceId,
    serviceName: srv.name,
    counterId: null,
    counterNumber: null,
    estimatedWaitMinutes: estimatedWait === 0 ? srv.avgMinutes : estimatedWait,
    queuePosition: pendingCount + 1,
    slot: slot || 'MORNING',
    isOnlineBooked: false,
    createdAt: new Date().toISOString()
  };

  state.tokens.push(newToken);
  saveState();

  addAuditLog(citizenName, 'CITIZEN', 'TOKEN_GENERATED', `Generated token ${tokenNumber} for ${srv.name}. Priority: ${newToken.priority}`);
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, token: newToken });
});

// 4. Appointments booking
app.post('/api/appointments', (req: Request, res: Response) => {
  const { citizenName, mobile, email, departmentId, serviceId, date, slot } = req.body;
  if (!citizenName || !mobile || !departmentId || !serviceId || !date || !slot) {
    return res.status(400).json({ success: false, message: 'All booking fields are required.' });
  }

  // Prevent overbooking (limit 5 per slot)
  const existingCount = state.appointments.filter(a => a.date === date && a.slot === slot && a.serviceId === serviceId).length;
  if (existingCount >= 5) {
    return res.status(400).json({ success: false, message: 'This timeslot is fully booked. Please select another slot.' });
  }

  const newApt: Appointment = {
    id: `apt-${Date.now()}`,
    citizenName,
    mobile,
    email: email || '',
    departmentId,
    serviceId,
    date,
    slot,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };

  state.appointments.push(newApt);
  saveState();

  addAuditLog(citizenName, 'CITIZEN', 'APPOINTMENT_BOOKED', `Booked appointment for service on ${date} at ${slot}.`);
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, appointment: newApt });
});

// 5. Officer Dashboard Queue Engine: Call Next Token (Prioritized FIFO)
app.post('/api/counters/call-next', (req: Request, res: Response) => {
  const { counterId, officerId } = req.body;
  
  const counter = state.counters.find(c => c.id === counterId);
  if (!counter) {
    return res.status(404).json({ success: false, message: 'Counter not found' });
  }

  // Complete any currently serving token first
  if (counter.currentTokenId) {
    const curToken = state.tokens.find(t => t.id === counter.currentTokenId);
    if (curToken && curToken.status === 'CALLING') {
      curToken.status = 'COMPLETED';
      curToken.completedAt = new Date().toISOString();
    }
  }

  // PRIORITIZED FIFO ALGORITHM:
  // 1. EMERGENCY
  // 2. DISABLED
  // 3. SENIOR_CITIZEN
  // 4. REGULAR
  // Sorting order: priority order, then oldest creation time first (FIFO within priority)
  const priorityOrder: Record<PriorityLevel, number> = {
    'EMERGENCY': 4,
    'DISABLED': 3,
    'SENIOR_CITIZEN': 2,
    'REGULAR': 1
  };

  const pendingTokensForDept = state.tokens
    .filter(t => t.departmentId === counter.departmentId && t.status === 'PENDING')
    .sort((a, b) => {
      const pA = priorityOrder[a.priority] || 1;
      const pB = priorityOrder[b.priority] || 1;
      if (pA !== pB) return pB - pA; // Higher priority number comes first
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // FIFO
    });

  const nextToken = pendingTokensForDept[0];

  if (!nextToken) {
    counter.currentTokenId = null;
    counter.currentTokenNumber = null;
    saveState();
    sendToAll({ type: 'STATE_CHANGED', state });
    return res.json({ success: true, message: 'No more citizens waiting in queue.', token: null });
  }

  // Assign token to this counter
  nextToken.status = 'CALLING';
  nextToken.counterId = counter.id;
  nextToken.counterNumber = counter.counterNumber;
  nextToken.calledAt = new Date().toISOString();

  counter.currentTokenId = nextToken.id;
  counter.currentTokenNumber = nextToken.tokenNumber;

  // Recalculate remaining pending positions
  const remainingPending = state.tokens.filter(t => t.departmentId === counter.departmentId && t.status === 'PENDING');
  remainingPending.forEach((tok, index) => {
    tok.queuePosition = index + 1;
  });

  saveState();

  addAuditLog(counter.officerName || 'Officer', 'OFFICER', 'CALL_NEXT', `Called token ${nextToken.tokenNumber} to Counter ${counter.counterNumber}.`);
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, token: nextToken });
});

// 6. Token status updates (skip, complete, recall, transfer, cancel)
app.post('/api/tokens/update', (req: Request, res: Response) => {
  const { tokenId, status, counterId, targetDepartmentId } = req.body;
  const token = state.tokens.find(t => t.id === tokenId);
  
  if (!token) {
    return res.status(404).json({ success: false, message: 'Token not found' });
  }

  const oldStatus = token.status;
  token.status = status as TokenStatus;

  const counter = counterId ? state.counters.find(c => c.id === counterId) : null;

  if (status === 'COMPLETED') {
    token.completedAt = new Date().toISOString();
    if (counter && counter.currentTokenId === tokenId) {
      counter.currentTokenId = null;
      counter.currentTokenNumber = null;
    }
  } else if (status === 'SKIPPED') {
    if (counter && counter.currentTokenId === tokenId) {
      counter.currentTokenId = null;
      counter.currentTokenNumber = null;
    }
  } else if (status === 'CANCELLED') {
    if (token.counterId) {
      const assocCounter = state.counters.find(c => c.id === token.counterId);
      if (assocCounter && assocCounter.currentTokenId === tokenId) {
        assocCounter.currentTokenId = null;
        assocCounter.currentTokenNumber = null;
      }
    }
  }

  // Token transfer to another department (Queue Re-arrangement)
  if (status === 'PENDING' && targetDepartmentId && targetDepartmentId !== token.departmentId) {
    const targetDept = DEPARTMENTS.find(d => d.id === targetDepartmentId);
    if (targetDept) {
      // Release from previous counter
      if (counter && counter.currentTokenId === tokenId) {
        counter.currentTokenId = null;
        counter.currentTokenNumber = null;
      }
      
      const prevCode = DEPARTMENTS.find(d => d.id === token.departmentId)?.code || 'PREV';
      token.departmentId = targetDepartmentId;
      token.counterId = null;
      token.counterNumber = null;
      token.calledAt = undefined;
      
      // Calculate sequence in target department
      const deptTokensToday = state.tokens.filter(t => t.departmentId === targetDepartmentId);
      token.sequence = deptTokensToday.length + 1;
      token.tokenNumber = `${targetDept.code}-${String(token.sequence).padStart(3, '0')}`;
      token.createdAt = new Date().toISOString(); // Reset queue order for this target dept
      token.status = 'PENDING';
      
      addAuditLog(counter?.officerName || 'Officer', 'OFFICER', 'TOKEN_TRANSFER', `Transferred token from ${prevCode} department to ${targetDept.name} as ${token.tokenNumber}.`);
    }
  } else {
    addAuditLog(counter?.officerName || 'User', counter ? 'OFFICER' : 'CITIZEN', `TOKEN_${status}`, `Updated ${token.tokenNumber} from ${oldStatus} to ${status}`);
  }

  // Recalculate positions
  DEPARTMENTS.forEach(dept => {
    const remaining = state.tokens.filter(t => t.departmentId === dept.id && t.status === 'PENDING');
    remaining.forEach((tok, index) => {
      tok.queuePosition = index + 1;
    });
  });

  saveState();
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, token });
});

// Counter Pause/Resume controls
app.post('/api/counters/status', (req: Request, res: Response) => {
  const { counterId, status } = req.body;
  const counter = state.counters.find(c => c.id === counterId);
  if (!counter) {
    return res.status(404).json({ success: false, message: 'Counter not found' });
  }

  const oldStatus = counter.status;
  counter.status = status;

  if (status === 'CLOSED' || status === 'PAUSED') {
    // If closed or paused, push any current calling token back to PENDING
    if (counter.currentTokenId) {
      const curToken = state.tokens.find(t => t.id === counter.currentTokenId);
      if (curToken && curToken.status === 'CALLING') {
        curToken.status = 'PENDING';
        curToken.counterId = null;
        curToken.counterNumber = null;
        curToken.calledAt = undefined;
      }
      counter.currentTokenId = null;
      counter.currentTokenNumber = null;
    }
  }

  saveState();
  addAuditLog(counter.officerName || `Counter ${counter.counterNumber}`, 'OFFICER', 'COUNTER_STATUS', `Counter ${counter.counterNumber} changed state from ${oldStatus} to ${status}.`);
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, counter });
});

// Submit Citizen feedback & Run Sentiment analysis with Gemini API
app.post('/api/feedback', async (req: Request, res: Response) => {
  const { tokenNumber, citizenName, rating, comments } = req.body;
  if (!tokenNumber || !citizenName || !rating) {
    return res.status(400).json({ success: false, message: 'Token number, citizen name, and rating are required.' });
  }

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (rating >= 4) sentiment = 'positive';
  else if (rating <= 2) sentiment = 'negative';

  // AI Sentiment analysis using Gemini
  if (ai && comments && comments.trim().length > 0) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Analyze the sentiment of this feedback comments left by a citizen in a government queue desk. Output ONLY one of the words: "positive", "neutral", or "negative".
Feedback Comments: "${comments}"`,
      });

      const text = response.text?.toLowerCase().trim();
      if (text && ['positive', 'neutral', 'negative'].includes(text)) {
        sentiment = text as any;
        console.log(`Gemini analyzed sentiment: ${sentiment}`);
      }
    } catch (err) {
      console.error('Gemini sentiment analysis failed, falling back to rating-based sentiment:', err);
    }
  }

  const newFeedback: Feedback = {
    id: `feed-${Date.now()}`,
    tokenNumber,
    citizenName,
    rating,
    comments: comments || '',
    sentiment,
    createdAt: new Date().toISOString()
  };

  state.feedbacks.unshift(newFeedback);
  saveState();

  addAuditLog(citizenName, 'CITIZEN', 'SUBMIT_FEEDBACK', `Submitted a ${rating}-star feedback for token ${tokenNumber}.`);
  sendToAll({ type: 'STATE_CHANGED', state });

  res.json({ success: true, feedback: newFeedback });
});

// 7. Gemini AI Assistant endpoint (Document Checklist, FAQs, Predictive Waiting times, Scheme Recommendations, and Classification)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, departmentId, serviceId } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Prompt message is required.' });
  }

  let text = '';
  let classification = 'GENERAL_QUERY';

  if (ai) {
    try {
      // 1. Classification & Prompt Engineering
      const systemPrompt = `You are "Seva Mitra", a highly professional, helpful, and courteous Digital AI Assistant for Indian Government Citizen Service Portals.
You assist citizens with:
1. Finding document checklists for Aadhaar, Revenue, DL, Passports, Municipality.
2. Answering common questions about office timings, holidays, and queue booking.
3. Classifying user issues (e.g. general query, document check, wait-time prediction, scheme info, or complaint).
4. Sentiment analysis of their tone (courteous, frustrated, curious).
5. Explaining eligibility for various government schemes (e.g., Patta transfers, Community status, skill development).

Current system details to ground your answer:
- Office Timings: ${OFFICE_TIMINGS.workingDays}, ${OFFICE_TIMINGS.hours} (Lunch: ${OFFICE_TIMINGS.lunchBreak}).
- Departments: Revenue, Aadhaar, Driving Licence, Employment Office, Municipal Corporation, Passport Verification, Electricity Board.
- Priority desk is available for Seniors over 60, Pregnant women, and Persons with Disabilities.
- Citizens can book future appointments online or generate tokens today.

Format your response in neat, professional, easy-to-read markdown with bold headers and bulleted lists. Be respectful and bureaucratic but highly clear.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      text = response.text || 'Sorry, I generated an empty response.';
      
      // Let's also run a small async check for classification
      try {
        const classResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Classify this citizen message into one of these types: DOCUMENT_CHECKLIST, SCHEME_RECOMMENDATION, TIMINGS_OR_QUEUE, COMPLAINT, GENERAL_QUERY. Output ONLY the code word.
Message: "${message}"`
        });
        classification = classResponse.text?.trim().toUpperCase() || 'GENERAL_QUERY';
      } catch (ce) {
        // Safe skip classification error
      }

    } catch (err: any) {
      console.error('Gemini API call failed:', err);
      text = `Thank you for your inquiry regarding our public service desks. Currently, our AI processing is in offline fallback mode. 

To assist you directly, here are our standard checklists:
- **Aadhaar Enrollment**: Proof of identity (PAN/Passport), Proof of Address (Ration/Voter ID), and Birth certificate.
- **Patta Land Transfer**: Original sale deed, old patta, tax receipts, and identity proofs.
- **Driving Licence**: Age proof (SSLC book), Address proof, Medical Certificate (Form 1A), and Learner Licence.

Office operating hours are **${OFFICE_TIMINGS.workingDays} from ${OFFICE_TIMINGS.hours}**. Please let us know if we can help generate your token!`;
    }
  } else {
    // Elegant offline template responses
    text = `Greetings from the Smart Public Service Desk.

Our AI Engine is currently operating in off-peak server mode. Here is the verified information for your request:

- **Office Hours**: ${OFFICE_TIMINGS.workingDays} (${OFFICE_TIMINGS.hours}).
- **Priority Services**: Senior citizens, disabled persons, and pregnant women can claim high-priority counters (Counter 5) instantly.
- **Required Documents Check**: Please click on the **"Services Info"** tab to view complete document guides verified by the state registry.

*You can generate a live Token on the homepage or book an appointment for upcoming days!*`;
  }

  res.json({
    success: true,
    reply: text,
    classification,
    aiModelUsed: ai ? 'gemini-3.5-flash' : 'Local Rule Engine'
  });
});

// 8. Super Admin DB Management: Backup and Restore Simulation
app.post('/api/db/backup', (req: Request, res: Response) => {
  try {
    const backupData = JSON.stringify(state, null, 2);
    const backupPath = path.join(process.cwd(), `db-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, backupData, 'utf8');
    
    addAuditLog('Admin IT Cell', 'SUPER_ADMIN', 'DATABASE_BACKUP', `Database backup written to ${path.basename(backupPath)}.`);
    res.json({ success: true, filename: path.basename(backupPath), message: 'Database backed up successfully!' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/db/restore', (req: Request, res: Response) => {
  // Restore simply resets DB state back to pristine default for easy testing
  state = {
    ...defaultState,
    tokens: [...defaultState.tokens],
    counters: [...defaultState.counters],
    appointments: [...defaultState.appointments],
    feedbacks: [...defaultState.feedbacks],
    auditLogs: [
      {
        id: `log-restore-${Date.now()}`,
        userId: 'admin',
        userName: 'Admin Desk',
        role: 'SUPER_ADMIN',
        action: 'DATABASE_RESTORE',
        details: 'Database reset and restored to default seed values for demo testing.',
        createdAt: new Date().toISOString()
      },
      ...defaultState.auditLogs
    ]
  };
  saveState();
  sendToAll({ type: 'STATE_CHANGED', state });
  res.json({ success: true, message: 'Database state successfully restored to default seed values!' });
});

// Configure or Add Departments/Services/Counters in Super Admin
app.post('/api/admin/config', (req: Request, res: Response) => {
  const { action, payload } = req.body;
  if (action === 'ADD_COUNTER') {
    const nextNum = state.counters.length + 1;
    const newCounter: Counter = {
      id: `counter-${Date.now()}`,
      counterNumber: nextNum,
      departmentId: payload.departmentId || 'dept-revenue',
      officerId: null,
      officerName: null,
      status: 'CLOSED',
      currentTokenId: null,
      currentTokenNumber: null
    };
    state.counters.push(newCounter);
    saveState();
    addAuditLog('Super Admin', 'SUPER_ADMIN', 'ADD_COUNTER', `Configured new Counter #${nextNum}.`);
    sendToAll({ type: 'STATE_CHANGED', state });
    return res.json({ success: true, counter: newCounter });
  }
  return res.status(400).json({ success: false, message: 'Invalid action.' });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Queue Full-Stack server booted at http://localhost:${PORT}`);
  });
}

startServer();
