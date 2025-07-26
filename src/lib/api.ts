'use client';

import axios from 'axios';
import { Resident, DashboardData } from './types';

const apiClient = axios.create({
  baseURL: '/api', // Use relative path for local API routes
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
  await apiClient.post('/reminders/trigger', { message });
};

export const skipTurn = async () => {
    await apiClient.post('/residents/skip');
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

export const updateResident = async (id: string, residentUpdate: Partial<Omit<Resident, 'id'>>) => {
  await apiClient.put(`/residents/${id}`, residentUpdate);
};

export const deleteResident = async (id: string) => {
    await apiClient.delete(`/residents/${id}`);
};

export const setCurrentTurn = async (id: string) => {
    await apiClient.post('/residents/set-current', { id });
};

// Announcements
export const sendAnnouncement = async (subject: string, message: string) => {
  await apiClient.post('/announcements', { subject, message });
};

// Logs
export const getLogs = async (): Promise<string[]> => {
  const response = await apiClient.get('/logs');
  // The original API returns { logs: [...] }, so we might need to adjust this
  // depending on what the proxy returns. Assuming proxy forwards the whole object.
  if (response.data && Array.isArray(response.data.logs)) {
      return response.data.logs;
  }
  // If the proxy just returns the array:
  if(Array.isArray(response.data)) {
      return response.data;
  }
  return [];
};
