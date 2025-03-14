import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert,
  Container,
  Divider
} from '@geotab/zenith';
import { Driver, getDrivers } from '../../services/driverService';
import DriverCard from './DriverCard';
import Leaderboard from '../leaderboard/Leaderboard';
import RewardModal from '../shared/RewardModal';

const AdminDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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
  }, []);

  const handleReward = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDriver(null);
  };

  const handleRewardSuccess = () => {
    setShowModal(false);
    setSelectedDriver(null);
    // You could refresh the driver data here if needed
  };

  // Get top 3 drivers for featured cards
  const topDrivers = [...drivers]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 3);

  return (
    <Container maxWidth="xl">
      <Box className="admin-dashboard" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>Driver Performance Dashboard</Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>Top Performers</Typography>
              <Grid container spacing={3}>
                {topDrivers.map(driver => (
                  <Grid item xs={12} md={4} key={driver.id}>
                    <DriverCard 
                      driver={driver} 
                      onReward={handleReward} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mt: 4 }}>
              <Leaderboard 
                drivers={drivers} 
                onReward={handleReward} 
                title="30-Day Performance Leaderboard" 
              />
            </Box>
          </>
        )}
        
        {showModal && (
          <RewardModal 
            driver={selectedDriver} 
            onClose={handleCloseModal} 
            onSuccess={handleRewardSuccess} 
          />
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard; 