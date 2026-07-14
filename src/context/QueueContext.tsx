import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QueueState, Token, Counter, Appointment, Feedback, AuditLog, Department, Service, PriorityLevel } from '../types';

interface QueueContextType {
  state: QueueState;
  departments: Department[];
  services: Service[];
  announcements: any[];
  user: { email: string; name: string; role: string; departmentId?: string; counterId?: string } | null;
  language: 'en' | 'hi' | 'ta';
  darkMode: boolean;
  loading: boolean;
  setLanguage: (lang: 'en' | 'hi' | 'ta') => void;
  setDarkMode: (val: boolean) => void;
  login: (email: string, role: string) => Promise<boolean>;
  logout: () => void;
  generateToken: (formData: any) => Promise<Token | null>;
  bookAppointment: (formData: any) => Promise<Appointment | null>;
  callNextToken: (counterId: string) => Promise<Token | null>;
  updateTokenStatus: (tokenId: string, status: string, counterId?: string, targetDepartmentId?: string) => Promise<boolean>;
  updateCounterStatus: (counterId: string, status: string) => Promise<boolean>;
  submitFeedback: (formData: any) => Promise<boolean>;
  triggerBackup: () => Promise<string>;
  triggerRestore: () => Promise<boolean>;
  askAI: (message: string, departmentId?: string, serviceId?: string) => Promise<{ reply: string; classification: string }>;
  refreshState: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QueueState>({
    tokens: [],
    counters: [],
    appointments: [],
    feedbacks: [],
    auditLogs: []
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  const [user, setUser] = useState<{ email: string; name: string; role: string; departmentId?: string; counterId?: string } | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Core pull state from Express
  const refreshState = useCallback(async () => {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setState(data.state);
          setDepartments(data.departments);
          setServices(data.services);
          setAnnouncements(data.announcements);
        }
      }
    } catch (e) {
      console.error('Failed to sync queue state with Express server:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for real-time queue updates
  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 3000);
    return () => clearInterval(interval);
  }, [refreshState]);

  // Handle local user session
  useEffect(() => {
    const savedUser = localStorage.getItem('gov_user_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedTheme = localStorage.getItem('gov_theme_dark');
    if (savedTheme === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gov_theme_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = async (email: string, role: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'secure_password_mock', role })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('gov_user_session', JSON.stringify(data.user));
          refreshState();
          return true;
        }
      }
    } catch (e) {
      console.error('Login request failed:', e);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gov_user_session');
    refreshState();
  };

  const generateToken = async (formData: any) => {
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return data.token;
        }
      }
    } catch (e) {
      console.error('Failed to generate token:', e);
    }
    return null;
  };

  const bookAppointment = async (formData: any) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return data.appointment;
        }
      }
    } catch (e) {
      console.error('Failed to book appointment:', e);
    }
    return null;
  };

  const callNextToken = async (counterId: string) => {
    try {
      const res = await fetch('/api/counters/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterId, officerId: user?.name })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return data.token;
        }
      }
    } catch (e) {
      console.error('Failed to call next token:', e);
    }
    return null;
  };

  const updateTokenStatus = async (tokenId: string, status: string, counterId?: string, targetDepartmentId?: string) => {
    try {
      const res = await fetch('/api/tokens/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId, status, counterId, targetDepartmentId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to update token status:', e);
    }
    return false;
  };

  const updateCounterStatus = async (counterId: string, status: string) => {
    try {
      const res = await fetch('/api/counters/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterId, status })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to update counter status:', e);
    }
    return false;
  };

  const submitFeedback = async (formData: any) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to submit feedback:', e);
    }
    return false;
  };

  const triggerBackup = async () => {
    try {
      const res = await fetch('/api/db/backup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return data.filename;
        }
      }
    } catch (e) {
      console.error('Database backup failed:', e);
    }
    return '';
  };

  const triggerRestore = async () => {
    try {
      const res = await fetch('/api/db/restore', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          refreshState();
          return true;
        }
      }
    } catch (e) {
      console.error('Database restore failed:', e);
    }
    return false;
  };

  const askAI = async (message: string, departmentId?: string, serviceId?: string) => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, departmentId, serviceId })
      });
      if (res.ok) {
        const data = await res.json();
        return { reply: data.reply, classification: data.classification };
      }
    } catch (e) {
      console.error('AI assistant query failed:', e);
    }
    return { 
      reply: 'Sorry, I am having trouble connecting to my central servers. Please check your internet or try again later.', 
      classification: 'GENERAL_QUERY' 
    };
  };

  return (
    <QueueContext.Provider
      value={{
        state,
        departments,
        services,
        announcements,
        user,
        language,
        darkMode,
        loading,
        setLanguage,
        setDarkMode,
        login,
        logout,
        generateToken,
        bookAppointment,
        callNextToken,
        updateTokenStatus,
        updateCounterStatus,
        submitFeedback,
        triggerBackup,
        triggerRestore,
        askAI,
        refreshState
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
