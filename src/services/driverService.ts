import axios from 'axios';
import { geotabApi, GeotabDriver } from './geotabApiService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Driver {
  id: number;
  name: string;
  performanceScore: number;
  safetyScore: number;
  fuelEfficiency: number;
  collisionRisk: 'Low' | 'Medium' | 'High';
}

// Maps Geotab driver data to our application's driver format
const mapGeotabDriverToAppDriver = (geotabDriver: GeotabDriver): Driver => {
  return {
    id: parseInt(geotabDriver.id, 10) || Math.floor(Math.random() * 10000), // Fallback for demo
    name: geotabDriver.name || `${geotabDriver.firstName || ''} ${geotabDriver.lastName || ''}`.trim(),
    performanceScore: Math.floor(Math.random() * 30) + 70, // Demo data
    safetyScore: geotabDriver.performanceData?.safetyScore || Math.floor(Math.random() * 30) + 70,
    fuelEfficiency: Math.floor(Math.random() * 30) + 70, // Demo data
    collisionRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High' // Demo data
  };
};

export const getDrivers = async (): Promise<Driver[]> => {
  try {
    // First try to get drivers from Geotab API if authenticated
    if (geotabApi.isAuthenticated()) {
      try {
        const geotabDrivers = await geotabApi.getDrivers();
        return geotabDrivers.map(mapGeotabDriverToAppDriver);
      } catch (geotabError) {
        console.warn('Could not fetch drivers from Geotab, falling back to mock API:', geotabError);
        // Fall back to mock API if Geotab API fails
      }
    }
    
    // Fall back to the original API if not authenticated with Geotab
    const response = await axios.get<Driver[]>(`${API_URL}/drivers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
}; 