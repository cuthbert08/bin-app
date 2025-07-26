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
  const response = await apiClient.get('/dashboard');
  return response.data;
};

export const triggerReminder = async (message?: string) => {
  await apiClient.post('/reminders', { message });
};

export const skipTurn = async () => {
  await apiClient.post('/skip');
};


// Residents
export const getResidents = async (): Promise<Resident[]> => {
  const response = await apiClient.get('/residents');
  return response.data;
};

export const addResident = async (resident: Omit<Resident, 'id'>) => {
  const response = await apiClient.post('/residents', resident);
  return response.data;
};

export const updateResident = async (id: string, resident: Partial<Omit<Resident, 'id'>>) => {
  await apiClient.put(`/residents/${id}`, resident);
};

export const deleteResident = async (id: string) => {
    await apiClient.delete(`/residents/${id}`);
};

export const setCurrentTurn = async (id: string) => {
    await apiClient.post(`/residents/${id}/set-current`);
};

// Announcements
export const sendAnnouncement = async (subject: string, message: string) => {
  await apiClient.post('/announcements', { subject, message });
};

// Logs
export const getLogs = async (): Promise<string[]> => {
  const response = await apiClient.get('/logs');
  return response.data;
};
