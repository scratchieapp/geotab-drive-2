import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Typography, 
  Chip,
  Box
} from '@geotab/zenith';
import { Driver } from '../../services/driverService';

interface LeaderboardProps {
  drivers: Driver[];
  onReward: (driver: Driver) => void;
  title?: string;
  isDispatchView?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  drivers, 
  onReward, 
  title = 'Driver Leaderboard', 
  isDispatchView = false 
}) => {
  // Sort drivers by performance score (highest first)
  const sortedDrivers = [...drivers].sort((a, b) => b.performanceScore - a.performanceScore);

  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  // Function to determine color based on collision risk
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="5%">Rank</TableCell>
              <TableCell width="25%">Driver</TableCell>
              <TableCell align="center" width="15%">Performance</TableCell>
              <TableCell align="center" width="15%">Safety</TableCell>
              <TableCell align="center" width="15%">Fuel Efficiency</TableCell>
              <TableCell align="center" width="15%">Risk</TableCell>
              {!isDispatchView && <TableCell align="center" width="10%">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDrivers.map((driver, index) => (
              <TableRow key={driver.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{driver.name}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={driver.performanceScore}
                    color={getScoreColor(driver.performanceScore)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={driver.safetyScore}
                    color={getScoreColor(driver.safetyScore)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={driver.fuelEfficiency}
                    color={getScoreColor(driver.fuelEfficiency)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={driver.collisionRisk}
                    color={getRiskColor(driver.collisionRisk)}
                    size="small"
                  />
                </TableCell>
                {!isDispatchView && (
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => onReward(driver)}
                    >
                      Reward
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard; 