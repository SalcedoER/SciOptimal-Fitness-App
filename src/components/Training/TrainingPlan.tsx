import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import { Schedule, FitnessCenter, TrendingUp } from '@mui/icons-material';
import { useCurrentPhase } from '../../store/useAppStore';

const TrainingPlan: React.FC = () => {
  const currentPhase = useCurrentPhase();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Training Plan
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Training plan visualization is coming soon! This will include detailed workout schedules, 
        exercise libraries, and phase progression tracking.
      </Alert>

      {currentPhase && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Current Phase
                </Typography>
                <Chip 
                  label={currentPhase.name} 
                  color="primary" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Duration: {currentPhase.duration} weeks
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Focus: {currentPhase.focus.replace('_', ' ')}
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Schedule />}
                  fullWidth
                >
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<FitnessCenter />}
                    fullWidth
                  >
                    View Exercises
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<TrendingUp />}
                    fullWidth
                  >
                    Phase Progress
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TrainingPlan;
