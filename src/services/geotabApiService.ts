import axios from 'axios';

interface GeotabCredentials {
  database: string;
  username: string;
  password: string;
}

interface GeotabSession {
  sessionId: string;
  database: string;
  userName: string;
  server: string;
}

interface DriverPerformance {
  safetyScore: number;
  speedingEvents: number;
  harshBrakingEvents: number;
  seatbeltCompliance: number;
  drivingTime: number;
}

export interface GeotabDriver {
  id: string;
  name: string;
  isDriver: boolean;
  firstName?: string;
  lastName?: string;
  performanceData?: DriverPerformance;
}

// Local storage keys
const SESSION_STORAGE_KEY = 'scratchie-geotab-session';

/**
 * Geotab API Service
 * 
 * Implements Geotab API integration patterns as recommended in the Geotab API Integration Guide.
 * - Authentication to my.geotab.com
 * - Session management (tokens valid for up to 2 weeks)
 * - Proper API call patterns (Get, MultiCall)
 */
class GeotabApiService {
  private session: GeotabSession | null = null;
  
  constructor() {
    // Try to restore session from localStorage on init
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      this.session = JSON.parse(savedSession);
    }
  }

  /**
   * Authenticate with Geotab API
   * 
   * Session tokens are valid for up to 2 weeks, so we don't need to
   * authenticate on every page load.
   */
  async authenticate(credentials: GeotabCredentials): Promise<GeotabSession> {
    try {
      const response = await axios.post('https://my.geotab.com/apiv1', {
        method: 'Authenticate',
        params: {
          database: credentials.database,
          userName: credentials.username,
          password: credentials.password
        }
      });
      
      if (response.data.result) {
        this.session = response.data.result;
        // Store session in localStorage
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.session));
        return this.session;
      } else {
        throw new Error('Authentication failed: No session returned');
      }
    } catch (error) {
      console.error('Geotab authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get current session or throw error if not authenticated
   */
  getSession(): GeotabSession {
    if (!this.session) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }
    return this.session;
  }

  /**
   * Check if there's an active session
   */
  isAuthenticated(): boolean {
    return !!this.session;
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.session = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /**
   * Make a call to the Geotab API
   */
  async call<T>(method: string, params: any): Promise<T> {
    if (!this.session) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    try {
      const response = await axios.post(`https://${this.session.server}/apiv1`, {
        method,
        params: {
          ...params,
          credentials: {
            sessionId: this.session.sessionId,
            database: this.session.database
          }
        }
      });
      
      return response.data.result;
    } catch (error) {
      // Handle session expiration
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logout();
        throw new Error('Session expired. Please authenticate again.');
      }
      
      console.error(`Geotab API call failed (${method}):`, error);
      throw error;
    }
  }

  /**
   * Use MultiCall for batching multiple API calls in a single request
   */
  async multiCall<T>(calls: [string, any][]): Promise<T[]> {
    if (!this.session) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    try {
      const response = await axios.post(`https://${this.session.server}/apiv1`, {
        method: 'ExecuteMultiCall',
        params: {
          calls: calls.map(([method, params]) => ({
            method,
            params: {
              ...params,
              credentials: {
                sessionId: this.session!.sessionId,
                database: this.session!.database
              }
            }
          })),
          credentials: {
            sessionId: this.session.sessionId,
            database: this.session.database
          }
        }
      });
      
      return response.data.result;
    } catch (error) {
      // Handle session expiration
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logout();
        throw new Error('Session expired. Please authenticate again.');
      }
      
      console.error('Geotab multiCall failed:', error);
      throw error;
    }
  }

  /**
   * Get drivers from Geotab
   * 
   * Follows the pattern from the API guide to fetch Users with isDriver=true
   */
  async getDrivers(): Promise<GeotabDriver[]> {
    try {
      const drivers = await this.call<GeotabDriver[]>('Get', {
        typeName: 'User',
        search: { isDriver: true }
      });
      
      // For each driver, get their performance data
      const driversWithPerformance = await Promise.all(
        drivers.map(async (driver) => {
          const performanceData = await this.getDriverPerformance(driver.id);
          return {
            ...driver,
            performanceData
          };
        })
      );
      
      return driversWithPerformance;
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      throw error;
    }
  }

  /**
   * Get driver performance data
   * 
   * In a real implementation, this would call Geotab APIs to fetch
   * actual driver metrics. For development purposes, we're using
   * simulated data as mentioned in the API guide.
   */
  async getDriverPerformance(driverId: string): Promise<DriverPerformance> {
    // This would be replaced with actual Geotab API calls in production
    return {
      safetyScore: Math.floor(Math.random() * 30) + 70,
      speedingEvents: Math.floor(Math.random() * 5),
      harshBrakingEvents: Math.floor(Math.random() * 3),
      seatbeltCompliance: Math.floor(Math.random() * 20) + 80,
      drivingTime: Math.floor(Math.random() * 40) + 20
    };
  }

  /**
   * Get user's group context
   * 
   * Respects user's group and permissions as recommended in the API guide
   */
  async getUserGroup(): Promise<string> {
    try {
      // This simulates the getGroupFilter() call from the API guide
      // In a real implementation, this would use the Geotab state object
      const groupId = await this.call<string>('GetGroupFilter', {});
      return groupId;
    } catch (error) {
      console.error('Failed to get user group:', error);
      throw error;
    }
  }

  /**
   * Get user preferences (metric/imperial, timezone, etc.)
   */
  async getUserPreferences(): Promise<any> {
    try {
      const users = await this.call<any[]>('Get', {
        typeName: 'User',
        search: { name: this.session?.userName }
      });
      
      if (users && users.length > 0) {
        const user = users[0];
        return {
          isMetric: user.isMetric,
          timeZoneId: user.timeZoneId
        };
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }
}

// Export as a singleton
export const geotabApi = new GeotabApiService(); 