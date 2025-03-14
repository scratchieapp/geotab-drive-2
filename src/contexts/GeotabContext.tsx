import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { geotabApi } from '../services/geotabApiService';

interface GeotabContextType {
  isAuthenticated: boolean;
  login: (database: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  userGroup: string | null;
  isLoading: boolean;
  error: string | null;
  userPreferences: {
    isMetric: boolean;
    timeZoneId: string;
  } | null;
}

const GeotabContext = createContext<GeotabContextType | undefined>(undefined);

export const useGeotab = (): GeotabContextType => {
  const context = useContext(GeotabContext);
  if (!context) {
    throw new Error('useGeotab must be used within a GeotabProvider');
  }
  return context;
};

interface GeotabProviderProps {
  children: ReactNode;
}

export const GeotabProvider: React.FC<GeotabProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(geotabApi.isAuthenticated());
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<{
    isMetric: boolean;
    timeZoneId: string;
  } | null>(null);

  // Check if there's an existing session on mount
  useEffect(() => {
    const initSession = async () => {
      if (geotabApi.isAuthenticated()) {
        setIsAuthenticated(true);
        try {
          // Load user's group and preferences
          const group = await geotabApi.getUserGroup();
          setUserGroup(group);
          
          const prefs = await geotabApi.getUserPreferences();
          setUserPreferences(prefs);
        } catch (err) {
          console.error('Error initializing Geotab session:', err);
          // If there's an error loading user context, the session might be invalid
          // so we logout
          logout();
        }
      }
    };

    initSession();
  }, []);

  const login = async (database: string, username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await geotabApi.authenticate({ database, username, password });
      setIsAuthenticated(true);
      
      // Load user's group and preferences
      const group = await geotabApi.getUserGroup();
      setUserGroup(group);
      
      const prefs = await geotabApi.getUserPreferences();
      setUserPreferences(prefs);
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    geotabApi.logout();
    setIsAuthenticated(false);
    setUserGroup(null);
    setUserPreferences(null);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    userGroup,
    isLoading,
    error,
    userPreferences
  };

  return (
    <GeotabContext.Provider value={value}>
      {children}
    </GeotabContext.Provider>
  );
}; 