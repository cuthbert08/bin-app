'use client';

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

// System Actions
export const triggerReminder = async (message?: string) => {
  await apiClient.post('/trigger-reminder', { message });
};

export const sendAnnouncement = async (subject: string, message: string) => {
  await apiClient.post('/announcements', { subject, message });
};

export const setCurrentTurn = async (id: string) => {
    await apiClient.post(`/set-current-turn/${id}`);
};

export const skipTurn = async () => {
    await apiClient.post('/skip-turn');
};

// Logs
export const getLogs = async (): Promise<string[]> => {
  const response = await apiClient.get('/logs');
  if (response.data && Array.isArray(response.data.logs)) {
      return response.data.logs;
  }
  if(Array.isArray(response.data)) {
      return response.data;
  }
  return [];
};
