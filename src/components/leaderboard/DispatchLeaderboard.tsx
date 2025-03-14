import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Container,
  Paper
} from '@geotab/zenith';
import { Driver, getDrivers } from '../../services/driverService';
import Leaderboard from './Leaderboard';

const DispatchLeaderboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getDrivers();
        setDrivers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch drivers. Please try again later.');
        console.error('Error fetching drivers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();

    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchDrivers, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Dummy function for onReward since we don't need it in dispatch view
  const handleReward = () => {};

  return (
    <Container maxWidth="xl">
      <Box className="dispatch-leaderboard" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>Dispatch Center Leaderboard</Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Leaderboard 
              drivers={drivers} 
              onReward={handleReward} 
              title="Driver Performance Leaderboard" 
              isDispatchView={true}
            />
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="caption" color="textSecondary">
                Last updated: {new Date().toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DispatchLeaderboard; 