import axios from 'axios';
import { Resident, DashboardData, Issue, ReportIssueData, AdminUser, SystemSettings } from './types';

const apiClient = axios.create({
  baseURL: '/api',
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
  return Array.isArray(response.data) ? response.data : [];
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
    await apiClient.put(`/issues/${id}`, { status });
}

// File Upload
export const uploadDocument = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


// Settings
export const getSettings = async (): Promise<SystemSettings> => {
    const response = await apiClient.get('/settings');
    return response.data;
};

export const updateSettings = async (settings: SystemSettings) => {
    await apiClient.put('/settings', settings);
};

// Admins
export const getAdmins = async (): Promise<AdminUser[]> => {
    const response = await apiClient.get('/admins');
    return response.data;
};

export const addAdmin = async (adminData: Partial<AdminUser> & { password?: string }) => {
    await apiClient.post('/admins', adminData);
};

export const updateAdmin = async (id: string, adminData: Partial<AdminUser>) => {
    await apiClient.put(`/admins/${id}`, adminData);
};

export const deleteAdmin = async (id: string) => {
    await apiClient.delete(`/admins/${id}`);
};

    