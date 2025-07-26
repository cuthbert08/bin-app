import axios from 'axios';
import { Resident, DashboardData } from './types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const getDashboardInfo = async (): Promise<DashboardData> => {
  console.log("Using mock dashboard data");
  return {
    current_duty: { name: 'Mock Resident A' },
    next_in_rotation: { name: 'Mock Resident B' },
    system_status: { last_reminder_run: 'Never' },
  };
};

export const triggerReminder = async (message?: string) => {
  console.log("Mock triggering reminder with message:", message);
  return Promise.resolve();
};

export const skipTurn = async () => {
  console.log("Mock skipping turn");
  return Promise.resolve();
};


// Residents
export const getResidents = async (): Promise<Resident[]> => {
  console.log("Using mock residents data");
  return [
    { id: '1', name: 'Mock Resident A', contact: { whatsapp: '123', sms: '123', email: 'a@mock.com' } },
    { id: '2', name: 'Mock Resident B', contact: { whatsapp: '456', sms: '456', email: 'b@mock.com' } },
    { id: '3', name: 'Mock Resident C', contact: { whatsapp: '789', sms: '789', email: 'c@mock.com' } },
  ];
};

export const addResident = async (resident: Omit<Resident, 'id'>) => {
  console.log("Mock adding resident:", resident);
  return Promise.resolve({ id: new Date().toISOString(), ...resident });
};

export const updateResident = async (id: string, resident: Partial<Omit<Resident, 'id'>>) => {
  console.log("Mock updating resident:", id, resident);
  return Promise.resolve();
};

export const deleteResident = async (id: string) => {
  console.log("Mock deleting resident:", id);
  return Promise.resolve();
};

export const setCurrentTurn = async (id: string) => {
    console.log("Mock setting current turn for resident:", id);
    return Promise.resolve();
};

// Announcements
export const sendAnnouncement = async (subject: string, message: string) => {
  console.log("Mock sending announcement:", subject, message);
  return Promise.resolve();
};

// Logs
export const getLogs = async (): Promise<string[]> => {
    console.log("Using mock logs");
    return [
        '[INFO] 2025-07-26 12:00:00 - Mock log entry 1: System started.',
        '[INFO] 2025-07-26 12:01:00 - Mock log entry 2: Reminder sent to Mock Resident A.',
        '[WARN] 2025-07-26 12:02:00 - Mock log entry 3: Could not reach external API.',
    ];
};
