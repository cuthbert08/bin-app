export interface Resident {
  id: string;
  name: string;
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
