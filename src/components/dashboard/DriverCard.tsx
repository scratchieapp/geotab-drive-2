import React from 'react';
import { Paper, Card, CardHeader, CardContent, Typography, Button, Grid, Chip } from '@geotab/zenith';
import { Driver } from '../../services/driverService';

interface DriverCardProps {
  driver: Driver;
  onReward: (driver: Driver) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onReward }) => {
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
    <Card elevation={2}>
      <CardHeader
        title={driver.name}
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => onReward(driver)}
            size="small"
          >
            Reward
          </Button>
        }
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiCardHeader-title': {
            color: 'white'
          }
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Performance:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip 
              label={driver.performanceScore} 
              color={getScoreColor(driver.performanceScore)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Safety:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip 
              label={driver.safetyScore} 
              color={getScoreColor(driver.safetyScore)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Fuel Efficiency:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip 
              label={driver.fuelEfficiency} 
              color={getScoreColor(driver.fuelEfficiency)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Collision Risk:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip 
              label={driver.collisionRisk} 
              color={getRiskColor(driver.collisionRisk)}
              size="small"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DriverCard; 