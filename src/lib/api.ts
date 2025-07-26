import axios from 'axios';
import { Resident, DashboardData } from './types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const mockDashboardData: DashboardData = {
    current_duty: { name: 'John Doe (Mock)' },
    next_in_rotation: { name: 'Jane Smith (Mock)' },
    system_status: { last_reminder_run: '2025-07-26 10:00:00 (Mock)' },
};

const mockResidents: Resident[] = [
    { id: '1', name: 'John Doe (Mock)', contact: { whatsapp: '123', email: 'john@mock.com', sms: '123'}},
    { id: '2', name: 'Jane Smith (Mock)', contact: { whatsapp: '456', email: 'jane@mock.com', sms: '456'}},
];

// Dashboard
export const getDashboardInfo = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error("API call to /dashboard failed, returning mock data.", error);
    return mockDashboardData;
  }
};

export const triggerReminder = async (message?: string) => {
  try {
    await apiClient.post('/reminders', { message });
  } catch (error) {
    console.error("API call to /reminders failed.", error);
    // In a real app, you might want to throw an error here
    // for the UI to catch and display a message to the user.
  }
};

export const skipTurn = async () => {
  try {
    await apiClient.post('/skip');
  } catch (error) {
    console.error("API call to /skip failed.", error);
  }
};


// Residents
export const getResidents = async (): Promise<Resident[]> => {
  try {
    const response = await apiClient.get('/residents');
    return response.data;
  } catch (error) {
    console.error("API call to /residents failed, returning mock data.", error);
    return mockResidents;
  }
};

export const addResident = async (resident: Omit<Resident, 'id'>) => {
  try {
    const response = await apiClient.post('/residents', resident);
    return response.data;
  } catch (error) {
    console.error("API call to add resident failed.", error);
  }
};

export const updateResident = async (id: string, resident: Partial<Omit<Resident, 'id'>>) => {
  try {
    await apiClient.put(`/residents/${id}`, resident);
  } catch (error) {
    console.error(`API call to update resident ${id} failed.`, error);
  }
};

export const deleteResident = async (id: string) => {
    try {
        await apiClient.delete(`/residents/${id}`);
    } catch (error) {
        console.error(`API call to delete resident ${id} failed.`, error);
    }
};

export const setCurrentTurn = async (id: string) => {
    try {
        await apiClient.post(`/residents/${id}/set-current`);
    } catch (error) {
        console.error(`API call to set current turn for resident ${id} failed.`, error);
    }
};

// Announcements
export const sendAnnouncement = async (subject: string, message: string) => {
  try {
    await apiClient.post('/announcements', { subject, message });
  } catch (error) {
    console.error("API call to send announcement failed.", error);
  }
};

// Logs
export const getLogs = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/logs');
    return response.data;
  } catch (error) {
    console.error("API call to /logs failed, returning mock data.", error);
    return ["Log fetching failed. Displaying mock log entry."];
  }
};
