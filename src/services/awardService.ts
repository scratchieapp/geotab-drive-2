import axios from 'axios';
import { geotabApi } from './geotabApiService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface AwardRequest {
  driverId: number;
  message: string;
  type: 'scratchie' | 'turbo';
}

export interface Award {
  id: number;
  driver_id: number;
  message: string;
  type: 'scratchie' | 'turbo';
  created_at: string;
  simulated?: boolean;
}

export const createAward = async (awardData: AwardRequest): Promise<Award> => {
  try {
    // First try to use Geotab API if authenticated
    if (geotabApi.isAuthenticated()) {
      try {
        // In a real implementation, this would use Geotab's API to record the award
        // For now, we're simulating this with a custom "Add" call
        const geotabResponse = await geotabApi.call<any>('Add', {
          typeName: 'TextMessage', // Using TextMessage as a proxy for awards
          entity: {
            recipient: { id: awardData.driverId.toString() },
            message: `Award: ${awardData.type} - ${awardData.message}`,
            delivered: false
          }
        });
        
        // Map the Geotab response to our Award format
        return {
          id: parseInt(geotabResponse.id, 10) || Math.floor(Math.random() * 10000),
          driver_id: awardData.driverId,
          message: awardData.message,
          type: awardData.type,
          created_at: new Date().toISOString(),
          simulated: false
        };
      } catch (geotabError) {
        console.warn('Could not create award via Geotab, falling back to mock API:', geotabError);
        // Fall back to mock API if Geotab API fails
      }
    }
    
    // Fall back to the original API if not authenticated with Geotab
    const response = await axios.post<Award>(`${API_URL}/awards`, awardData);
    return response.data;
  } catch (error) {
    console.error('Error creating award:', error);
    throw error;
  }
}; 