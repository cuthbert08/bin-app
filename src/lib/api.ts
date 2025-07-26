import { Resident, DashboardData } from './types';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return a default structure
    return { residents: [], logs: [], dashboard: { current_duty_idx: 0 } };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function logEvent(db: any, message: string) {
    const timestamp = new Date().toISOString();
    db.logs.push(`[${timestamp}] ${message}`);
}

// Dashboard
export const getDashboardInfo = async (): Promise<DashboardData> => {
  const db = await readDb();
  const residents = db.residents || [];
  const currentIndex = db.dashboard?.current_duty_idx ?? 0;

  if (residents.length === 0) {
    return {
      current_duty: { name: 'N/A' },
      next_in_rotation: { name: 'N/A' },
      system_status: { last_reminder_run: db.logs[db.logs.length - 1] || 'N/A' },
    };
  }

  const current_duty = residents[currentIndex];
  const next_in_rotation = residents[(currentIndex + 1) % residents.length];

  return {
    current_duty: { name: current_duty.name },
    next_in_rotation: { name: next_in_rotation.name },
    system_status: { last_reminder_run: db.logs[db.logs.length - 1] || 'N/A' },
  };
};

export const triggerReminder = async (message?: string) => {
  const db = await readDb();
  const resident = db.residents[db.dashboard.current_duty_idx];
  const logMessage = message ? `Sent custom reminder to ${resident.name}: "${message}"` : `Sent standard weekly reminder to ${resident.name}.`;
  logEvent(db, logMessage);
  await writeDb(db);
};

export const skipTurn = async () => {
    const db = await readDb();
    if (db.residents.length > 0) {
        db.dashboard.current_duty_idx = (db.dashboard.current_duty_idx + 1) % db.residents.length;
        logEvent(db, 'Turn skipped. Moved to the next resident in rotation.');
        await writeDb(db);
    }
};


// Residents
export const getResidents = async (): Promise<Resident[]> => {
  const db = await readDb();
  return db.residents || [];
};

export const addResident = async (resident: Omit<Resident, 'id'>) => {
  const db = await readDb();
  const newResident = { ...resident, id: new Date().toISOString() };
  db.residents.push(newResident);
  logEvent(db, `Added new resident: ${resident.name}`);
  await writeDb(db);
  return newResident;
};

export const updateResident = async (id: string, residentUpdate: Partial<Omit<Resident, 'id'>>) => {
  const db = await readDb();
  const index = db.residents.findIndex((r: Resident) => r.id === id);
  if (index > -1) {
    db.residents[index] = { ...db.residents[index], ...residentUpdate };
    logEvent(db, `Updated resident details for: ${db.residents[index].name}`);
    await writeDb(db);
  }
};

export const deleteResident = async (id: string) => {
    const db = await readDb();
    const index = db.residents.findIndex((r: Resident) => r.id === id);
    if (index > -1) {
        const residentName = db.residents[index].name;
        db.residents.splice(index, 1);
        if (db.dashboard.current_duty_idx >= db.residents.length) {
            db.dashboard.current_duty_idx = 0;
        }
        logEvent(db, `Deleted resident: ${residentName}`);
        await writeDb(db);
    }
};

export const setCurrentTurn = async (id: string) => {
    const db = await readDb();
    const index = db.residents.findIndex((r: Resident) => r.id === id);
    if (index > -1) {
        db.dashboard.current_duty_idx = index;
        logEvent(db, `Set current turn to: ${db.residents[index].name}`);
        await writeDb(db);
    }
};

// Announcements
export const sendAnnouncement = async (subject: string, message: string) => {
  const db = await readDb();
  logEvent(db, `Sent announcement. Subject: "${subject}", Message: "${message}"`);
  await writeDb(db);
};

// Logs
export const getLogs = async (): Promise<string[]> => {
  const db = await readDb();
  return db.logs || [];
};
