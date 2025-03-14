import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
  Alert,
  Chip,
  Box
} from '@geotab/zenith';
import { Driver } from '../../services/driverService';
import { AwardRequest, createAward } from '../../services/awardService';

interface RewardModalProps {
  driver: Driver | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ driver, onClose, onSuccess }) => {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<'scratchie' | 'turbo'>('scratchie');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Suggested messages for the admin to choose from
  const suggestedMessages = [
    'Great job on your performance this month!',
    'Your safety record is impressive!',
    'Thank you for your fuel-efficient driving!',
    'Your dedication to safe driving is appreciated!',
    'Congratulations on your excellent performance!'
  ];

  const handleSubmit = async () => {
    if (!driver) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const awardData: AwardRequest = {
        driverId: driver.id,
        message,
        type
      };

      await createAward(awardData);
      onSuccess();
    } catch (err) {
      setError('Failed to create award. Please try again.');
      console.error('Error creating award:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!driver) return null;

  return (
    <Dialog 
      open={!!driver} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText' 
        }}
      >
        Reward {driver.name}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message for the driver..."
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          Suggested Messages:
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {suggestedMessages.map((msg, index) => (
            <Chip
              key={index}
              label={msg}
              onClick={() => setMessage(msg)}
              clickable
            />
          ))}
        </Box>
        
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Reward Type</FormLabel>
          <RadioGroup 
            row 
            value={type} 
            onChange={(e) => setType(e.target.value as 'scratchie' | 'turbo')}
          >
            <FormControlLabel 
              value="scratchie" 
              control={<Radio />} 
              label="Scratchie (Points)" 
            />
            <FormControlLabel 
              value="turbo" 
              control={<Radio />} 
              label="Turbo Scratchie (Points + Cash)" 
            />
          </RadioGroup>
        </FormControl>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          variant="contained"
          color="primary"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Reward'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardModal; 