
import { SadPathData, UserPreferences } from '../types';

const STORAGE_KEY = 'voice_analytics_user_data';

// Initial dummy data
export const INITIAL_SAD_PATH_DATA: SadPathData[] = [
  { name: 'Verbal Agression', value: 15, color: '#ec4899' },
  { name: 'Customer Hostility', value: 20, color: '#f43f5e' },
  { name: 'Assistant did not speak French', value: 10, color: '#8b5cf6' },
  { name: 'Unsupported Language', value: 12, color: '#6366f1' },
  { name: 'Assistant did not speak Spanish', value: 8, color: '#3b82f6' },
  { name: 'Incorrect caller identity', value: 10, color: '#0ea5e9' },
  { name: 'Caller Identification', value: 15, color: '#10b981' },
  { name: 'User refused to confirm identity', value: 10, color: '#84cc16' },
];

export const INITIAL_DURATION_DATA = [
  { time: '09:00', duration: 45 },
  { time: '10:00', duration: 52 },
  { time: '11:00', duration: 80 },
  { time: '12:00', duration: 65 },
  { time: '13:00', duration: 110 },
  { time: '14:00', duration: 145 },
  { time: '15:00', duration: 120 },
  { time: '16:00', duration: 95 },
  { time: '17:00', duration: 70 },
  { time: '18:00', duration: 40 },
];

export const dataService = {
  saveUserData: async (email: string, data: SadPathData[]): Promise<void> => {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    // Store a deep clone to be safe
    allData[email] = structuredClone(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 800));
  },

  getUserData: async (email: string): Promise<SadPathData[] | null> => {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const data = allData[email];
    return data ? structuredClone(data) : null;
  }
};
