export interface Resident {
  id: string;
  name: string;
  flat_number: string;
  notes?: string;
  contact: {
    whatsapp?: string;
    sms?: string;
    email?: string;
  };
}

export interface DashboardData {
  current_duty: { name: string };
  next_in_rotation: { name: string };
  system_status: { last_reminder_run: string };
}

export interface User {
  email: string;
  role: 'superuser' | 'editor' | 'viewer';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Issue {
    id: string;
    reported_by: string;
    flat_number: string;
    description: string;
    image_url?: string;
    status: 'Reported' | 'In Progress' | 'Resolved';
    timestamp: string;
}

export interface ReportIssueData {
    name: string;
    flat_number: string;
    description: string;
    image_url?: string;
}
