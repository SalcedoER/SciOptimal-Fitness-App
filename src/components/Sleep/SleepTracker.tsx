import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControlLabel,
  Switch
} from '@mui/material';
import { 
  Bedtime, 
  WbSunny, 
  TrendingUp, 
  Add as AddIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import { useUserProfile, useCurrentPhase, useAddSleepEntry, useSleepLog } from '../../store/useAppStore';
import { SleepEntry } from '../../types';

const SleepTracker: React.FC = () => {
  const userProfile = useUserProfile();
  const currentPhase = useCurrentPhase();
  const addSleepEntry = useAddSleepEntry();
  const sleepEntries = useSleepLog();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<SleepEntry>>({
    bedTime: userProfile?.sleepSchedule.bedTime || '22:00',
    wakeUpTime: userProfile?.sleepSchedule.wakeUpTime || '06:00',
    sleepHours: userProfile?.sleepSchedule.targetSleepHours || 8,
    sleepQuality: 7,
    stressLevel: 5,
    caffeineIntake: 6
  });

  const calculateSleepEfficiency = (entry: SleepEntry) => {
    const targetHours = userProfile?.sleepSchedule.targetSleepHours || 8;
    return Math.min(100, (entry.sleepHours / targetHours) * 100);
  };

  const getSleepQualityColor = (quality: number) => {
    if (quality >= 8) return 'success';
    if (quality >= 6) return 'warning';
    return 'error';
  };

  const getSleepQualityLabel = (quality: number) => {
    if (quality >= 8) return 'Excellent';
    if (quality >= 6) return 'Good';
    if (quality >= 4) return 'Fair';
    return 'Poor';
  };

  const handleSaveEntry = () => {
    if (currentEntry.bedTime && currentEntry.wakeUpTime && currentEntry.sleepHours) {
      const newEntry: SleepEntry = {
        id: `sleep_${Date.now()}`,
        date: new Date(),
        bedTime: currentEntry.bedTime,
        wakeUpTime: currentEntry.wakeUpTime,
        sleepHours: currentEntry.sleepHours,
        sleepQuality: currentEntry.sleepQuality || 7,
        stressLevel: currentEntry.stressLevel || 5,
        caffeineIntake: currentEntry.caffeineIntake || 6,
        notes: currentEntry.notes
      };

      // Add to global store instead of local state
      addSleepEntry(newEntry);
      setShowAddDialog(false);
      setCurrentEntry({
        bedTime: userProfile?.sleepSchedule.bedTime || '22:00',
        wakeUpTime: userProfile?.sleepSchedule.wakeUpTime || '06:00',
        sleepHours: userProfile?.sleepSchedule.targetSleepHours || 8,
        sleepQuality: 7,
        stressLevel: 5,
        caffeineIntake: 6
      });
    }
  };

  const averageSleepQuality = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleepQuality, 0) / sleepEntries.length 
    : 0;

  const averageSleepHours = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length 
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Bedtime />
        Sleep Tracker
      </Typography>

      {/* Sleep Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Average Sleep Quality</Typography>
              <Typography variant="h3" sx={{ color: getSleepQualityColor(averageSleepQuality) }}>
                {averageSleepQuality.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getSleepQualityLabel(averageSleepQuality)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Average Sleep Hours</Typography>
              <Typography variant="h3">
                {averageSleepHours.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: {userProfile?.sleepSchedule.targetSleepHours || 8}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Sleep Efficiency</Typography>
              <Typography variant="h3">
                {sleepEntries.length > 0 
                  ? (sleepEntries.reduce((sum, entry) => sum + calculateSleepEfficiency(entry), 0) / sleepEntries.length).toFixed(0)
                  : 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={sleepEntries.length > 0 
                  ? sleepEntries.reduce((sum, entry) => sum + calculateSleepEfficiency(entry), 0) / sleepEntries.length 
                  : 0} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Sleep Entry Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddDialog(true)}
          sx={{ mb: 2 }}
        >
          Log Sleep Entry
        </Button>
      </Box>

      {/* Sleep Entries */}
      <Grid container spacing={2}>
        {sleepEntries.map((entry) => (
          <Grid item xs={12} key={entry.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">
                      {entry.date.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.bedTime} - {entry.wakeUpTime} ({entry.sleepHours.toFixed(1)}h)
                    </Typography>
                  </Box>
                  <Chip 
                    label={getSleepQualityLabel(entry.sleepQuality)}
                    color={getSleepQualityColor(entry.sleepQuality)}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<TrendingUp />} 
                    label={`Quality: ${entry.sleepQuality}/10`} 
                    size="small" 
                  />
                  {entry.stressLevel && (
                    <Chip 
                      label={`Stress: ${entry.stressLevel}/10`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                  {entry.caffeineIntake && (
                    <Chip 
                      label={`Caffeine: ${entry.caffeineIntake}h before bed`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}

                </Box>

                {entry.notes && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {entry.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Sleep Entry Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Sleep Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Bed Time"
                value={currentEntry.bedTime}
                onChange={(e) => setCurrentEntry({ ...currentEntry, bedTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Wake Up Time"
                value={currentEntry.wakeUpTime}
                onChange={(e) => setCurrentEntry({ ...currentEntry, wakeUpTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Sleep Hours"
                value={currentEntry.sleepHours}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sleepHours: Number(e.target.value) })}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Sleep Quality (1-10)</Typography>
              <Rating
                value={currentEntry.sleepQuality || 7}
                onChange={(_, value) => setCurrentEntry({ ...currentEntry, sleepQuality: value || 7 })}
                max={10}
                size="large"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Stress Level (1-10)</Typography>
              <Slider
                value={currentEntry.stressLevel || 5}
                onChange={(_, value) => setCurrentEntry({ ...currentEntry, stressLevel: value as number })}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Caffeine Intake (hours before bed)</Typography>
              <Slider
                value={currentEntry.caffeineIntake || 6}
                onChange={(_, value) => setCurrentEntry({ ...currentEntry, caffeineIntake: value as number })}
                min={0}
                max={12}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={currentEntry.notes || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
                placeholder="How did you sleep? Any issues or observations?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEntry} variant="contained">Save Entry</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SleepTracker;
