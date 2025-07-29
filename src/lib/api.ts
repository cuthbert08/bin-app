import axios from 'axios';
import { Resident, DashboardData, User, LoginResponse, Issue, ReportIssueData } from './types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['x-access-token'] = token;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auth
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
}

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

export const updateResident = async (id: string, residentUpdate: Partial<Resident>) => {
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

// Issues
export const getIssues = async (): Promise<Issue[]> => {
    const response = await apiClient.get('/issues');
    return response.data;
};

export const reportIssue = async (data: ReportIssueData) => {
    const response = await apiClient.post('/issues', data);
    return response.data;
}

export const updateIssueStatus = async (id: string, status: string) => {
    // This endpoint doesn't exist yet in the backend spec,
    // so this is a placeholder for when it does.
    // For now, we simulate success.
    console.log(`Updating issue ${id} to ${status}`);
    // In a real app, you would have:
    // await apiClient.put(`/issues/${id}/status`, { status });
    return Promise.resolve();
}
