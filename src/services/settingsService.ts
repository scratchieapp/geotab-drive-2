import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Settings {
  weeklyAwardLimit: number;
  autoAwardEnabled: boolean;
  autoAwardDay: string;
  notificationsEnabled: boolean;
}

export const getSettings = async (): Promise<Settings> => {
  try {
    const response = await axios.get<Settings>(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
  try {
    const response = await axios.put<Settings>(`${API_URL}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}; 