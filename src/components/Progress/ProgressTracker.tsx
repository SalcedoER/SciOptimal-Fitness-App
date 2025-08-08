import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  Add,
  Assessment,
  CheckCircle,
  FitnessCenter,
  Scale,
  Straighten
} from '@mui/icons-material';
import { useCurrentPhase, useLatestProgress, useProgressTrends, useStrengthProgress, useAppStore } from '../../store/useAppStore';
import { ProgressEntry, BodyMeasurements, StrengthLifts } from '../../types';

interface ProgressDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: ProgressEntry) => void;
}

const ProgressDialog: React.FC<ProgressDialogProps> = ({ open, onClose, onSave }) => {
  const [progressData, setProgressData] = useState<Partial<ProgressEntry>>({
    weight: 0,
    bodyFatPercentage: 0,
    measurements: {
      waist: 0,
      chest: 0,
      arms: 0,
      shoulders: 0,
      thighs: 0,
      calves: 0,
      forearms: 0
    },
    strengthLifts: {
      benchPress: 0,
      squat: 0,
      deadlift: 0,
      overheadPress: 0,
      rows: 0
    },
    sleepHours: 8,
    stressLevel: 5,
    notes: ''
  });

  const handleSave = () => {
    if (progressData.weight && progressData.measurements) {
      const entry: ProgressEntry = {
        id: `progress_${Date.now()}`,
        date: new Date(),
        weight: progressData.weight,
        bodyFatPercentage: progressData.bodyFatPercentage,
        measurements: progressData.measurements as BodyMeasurements,
        strengthLifts: progressData.strengthLifts as StrengthLifts,
        sleepHours: progressData.sleepHours,
        stressLevel: progressData.stressLevel,
        notes: progressData.notes
      };
      onSave(entry);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Progress</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (lbs)"
              type="number"
              value={progressData.weight || ''}
              onChange={(e) => setProgressData({ ...progressData, weight: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Body Fat %"
              type="number"
              value={progressData.bodyFatPercentage || ''}
              onChange={(e) => setProgressData({ ...progressData, bodyFatPercentage: Number(e.target.value) })}
              size="small"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Body Measurements (inches)</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Waist"
              type="number"
              value={progressData.measurements?.waist || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, waist: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Chest"
              type="number"
              value={progressData.measurements?.chest || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, chest: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Arms"
              type="number"
              value={progressData.measurements?.arms || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, arms: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Shoulders"
              type="number"
              value={progressData.measurements?.shoulders || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, shoulders: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Thighs"
              type="number"
              value={progressData.measurements?.thighs || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, thighs: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Calves"
              type="number"
              value={progressData.measurements?.calves || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                measurements: { ...progressData.measurements!, calves: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Strength Lifts (lbs)</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Bench Press"
              type="number"
              value={progressData.strengthLifts?.benchPress || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                strengthLifts: { ...progressData.strengthLifts!, benchPress: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Squat"
              type="number"
              value={progressData.strengthLifts?.squat || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                strengthLifts: { ...progressData.strengthLifts!, squat: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Deadlift"
              type="number"
              value={progressData.strengthLifts?.deadlift || ''}
              onChange={(e) => setProgressData({
                ...progressData,
                strengthLifts: { ...progressData.strengthLifts!, deadlift: Number(e.target.value) }
              })}
              size="small"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Sleep Hours"
              type="number"
              value={progressData.sleepHours || ''}
              onChange={(e) => setProgressData({ ...progressData, sleepHours: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Stress Level</InputLabel>
              <Select
                value={progressData.stressLevel || 5}
                onChange={(e) => setProgressData({ ...progressData, stressLevel: Number(e.target.value) })}
                label="Stress Level"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level} - {level <= 3 ? 'Low' : level <= 6 ? 'Moderate' : 'High'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={3}
          value={progressData.notes || ''}
          onChange={(e) => setProgressData({ ...progressData, notes: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!progressData.weight}>
          Save Progress
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProgressTracker: React.FC = () => {
  const currentPhase = useCurrentPhase();
  const latestProgress = useLatestProgress();
  const progressTrends = useProgressTrends();
  const strengthProgress = useStrengthProgress();
  const { addProgressEntry } = useAppStore();

  const [showProgressDialog, setShowProgressDialog] = useState(false);

  const handleSaveProgress = (entry: ProgressEntry) => {
    addProgressEntry(entry);
  };

  const getWeightChange = () => {
    if (!progressTrends?.weightTrend || progressTrends.weightTrend.length < 2) return 0;
    const recent = progressTrends.weightTrend.slice(-2);
    return recent[1].weight - recent[0].weight;
  };

  const weightChange = getWeightChange();
  const isWeightGaining = weightChange > 0;
  const isWeightLosing = weightChange < 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Progress Tracker
      </Typography>

      {!currentPhase && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No training phase found. Please set up your profile first.
        </Alert>
      )}

      {/* Current Progress Summary */}
      <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Current Progress
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowProgressDialog(true)}
            >
              Update Progress
            </Button>
          </Box>

          {latestProgress ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Scale color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestProgress.weight} lbs
                  </Typography>
                  {weightChange !== 0 && (
                    <Chip
                      label={`${isWeightGaining ? '+' : ''}${weightChange.toFixed(1)} lbs`}
                      color={isWeightGaining ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Current Weight
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Straighten color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestProgress.bodyFatPercentage || 'N/A'}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Body Fat %
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              No progress data yet. Start by logging your first progress entry!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Body Measurements */}
      {latestProgress && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Body Measurements
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Waist</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.waist} in
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Chest</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.chest} in
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Arms</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.arms} in
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Shoulders</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.shoulders} in
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Thighs</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.thighs} in
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Calves</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {latestProgress.measurements.calves} in
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Strength Progress */}
      {latestProgress && latestProgress.strengthLifts && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Strength Lifts
            </Typography>
            <Grid container spacing={2}>
              {latestProgress.strengthLifts.benchPress && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Bench Press</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {latestProgress.strengthLifts.benchPress} lbs
                  </Typography>
                </Grid>
              )}
              {latestProgress.strengthLifts.squat && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Squat</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {latestProgress.strengthLifts.squat} lbs
                  </Typography>
                </Grid>
              )}
              {latestProgress.strengthLifts.deadlift && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Deadlift</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {latestProgress.strengthLifts.deadlift} lbs
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Progress Analytics */}
      <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Progress Analytics
          </Typography>
          
          {progressTrends ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Weight Trend</Typography>
                <Typography variant="body2" color="text.secondary">
                  {progressTrends.weightTrend.length > 0 ? 
                    `${progressTrends.weightTrend.length} data points` : 
                    'No weight data yet'
                  }
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Body Fat Trend</Typography>
                <Typography variant="body2" color="text.secondary">
                  {progressTrends.bodyFatTrend.length > 0 ? 
                    `${progressTrends.bodyFatTrend.length} data points` : 
                    'No body fat data yet'
                  }
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              Start logging progress to see analytics and trends!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Progress Dialog */}
      <ProgressDialog
        open={showProgressDialog}
        onClose={() => setShowProgressDialog(false)}
        onSave={handleSaveProgress}
      />
    </Box>
  );
};

export default ProgressTracker;
