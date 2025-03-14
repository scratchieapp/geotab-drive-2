import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  Alert,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider
} from '@geotab/zenith';
import { Settings, getSettings, updateSettings } from '../../services/settingsService';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    weeklyAwardLimit: 5,
    autoAwardEnabled: false,
    autoAwardDay: 'Friday',
    notificationsEnabled: true
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch settings. Please try again later.');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name) {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateSettings(settings);
      
      setSuccessMessage('Settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      console.error('Error updating settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="settings-page">
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <TextField
                label="Weekly Award Limit"
                type="number"
                name="weeklyAwardLimit"
                value={settings.weeklyAwardLimit}
                onChange={handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 1, max: 20 } }}
                helperText="Maximum number of awards that can be given per week"
                margin="normal"
              />
            </Box>
            
            <Box mb={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAwardEnabled}
                    onChange={handleChange}
                    name="autoAwardEnabled"
                    color="primary"
                  />
                }
                label="Enable Auto Awards"
              />
              <FormHelperText>Automatically award top performers on a weekly basis</FormHelperText>
            </Box>
            
            {settings.autoAwardEnabled && (
              <Box mb={3}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="autoAwardDay-label">Auto Award Day</InputLabel>
                  <Select
                    labelId="autoAwardDay-label"
                    id="autoAwardDay"
                    name="autoAwardDay"
                    value={settings.autoAwardDay}
                    onChange={handleChange}
                    label="Auto Award Day"
                  >
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                  </Select>
                  <FormHelperText>Day of the week when auto awards are processed</FormHelperText>
                </FormControl>
              </Box>
            )}
            
            <Box mb={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    name="notificationsEnabled"
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
              <FormHelperText>Receive notifications about awards and system updates</FormHelperText>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={saving}
              sx={{ mt: 2 }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default SettingsPage; 