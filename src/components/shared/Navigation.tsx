import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Icon } from '@geotab/zenith';
import { useGeotab } from '../../contexts/GeotabContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userPreferences } = useGeotab();
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <AppBar position="static" className="scratchie-main-navigation">
      <Toolbar>
        <Typography variant="h6" component="div" className="scratchie-logo" sx={{ flexGrow: 1 }}>
          Scratchie Rewards
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color={isActive('/') ? 'primary' : 'inherit'} 
            component={Link} 
            to="/"
          >
            <Icon name="dashboard" size="small" sx={{ mr: 1 }} />
            Dashboard
          </Button>
          <Button 
            color={isActive('/dispatch') ? 'primary' : 'inherit'} 
            component={Link} 
            to="/dispatch"
          >
            <Icon name="list" size="small" sx={{ mr: 1 }} />
            Dispatch View
          </Button>
          <Button 
            color={isActive('/settings') ? 'primary' : 'inherit'} 
            component={Link} 
            to="/settings"
          >
            <Icon name="settings" size="small" sx={{ mr: 1 }} />
            Settings
          </Button>
          <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" component="span" sx={{ mr: 2 }}>
              {userPreferences ? (
                <span className="scratchie-user-info">
                  {userPreferences.isMetric ? '(Metric)' : '(Imperial)'} 
                </span>
              ) : null}
            </Typography>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="small"
              onClick={handleLogout}
              className="scratchie-logout-button"
            >
              <Icon name="log-out" size="small" sx={{ mr: 1 }} />
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 