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
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  Add,
  Assessment,
  CheckCircle,
  FitnessCenter,
  Scale,
  Straighten,
  ShowChart,
  Timeline
} from '@mui/icons-material';
import { useCurrentPhase, useLatestProgress, useProgressTrends, useStrengthProgress, useAddProgressEntry } from '../../store/useAppStore';
import { ProgressEntry, BodyMeasurements, StrengthLifts } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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

// Tab Components
const ProgressOverviewTab: React.FC<{ latestProgress: ProgressEntry | null }> = ({ latestProgress }) => {
  if (!latestProgress) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No progress data yet. Start by logging your first progress entry!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Progress Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
            <Typography variant="body1">
              {latestProgress.notes || 'No notes added'}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
            <Typography variant="body1">
              {new Date(latestProgress.date).toLocaleDateString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const ProgressTrendsTab: React.FC<{ progressTrends: any }> = ({ progressTrends }) => {
  if (!progressTrends) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Need at least 2 progress entries to show trends.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Progress Trends
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Weight Trend ({progressTrends.weightTrend.length} data points)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progressTrends.weightTrend.length > 0 ? 
                `From ${progressTrends.weightTrend[0]?.weight} lbs to ${progressTrends.weightTrend[progressTrends.weightTrend.length - 1]?.weight} lbs` : 
                'No weight data'
              }
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Body Fat Trend ({progressTrends.bodyFatTrend.length} data points)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progressTrends.bodyFatTrend.length > 0 ? 
                `From ${progressTrends.bodyFatTrend[0]?.bodyFat}% to ${progressTrends.bodyFatTrend[progressTrends.bodyFatTrend.length - 1]?.bodyFat}%` : 
                'No body fat data'
              }
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const StrengthProgressTab: React.FC<{ strengthProgress: any }> = ({ strengthProgress }) => {
  if (!strengthProgress) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Need at least 2 progress entries with strength data to show trends.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Strength Progress
      </Typography>
      <Grid container spacing={3}>
        {strengthProgress.benchPress && strengthProgress.benchPress.length > 0 && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Bench Press
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {strengthProgress.benchPress[strengthProgress.benchPress.length - 1]?.weight} lbs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {strengthProgress.benchPress.length} data points
              </Typography>
            </Card>
          </Grid>
        )}
        {strengthProgress.squat && strengthProgress.squat.length > 0 && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Squat
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {strengthProgress.squat[strengthProgress.squat.length - 1]?.weight} lbs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {strengthProgress.squat.length} data points
              </Typography>
            </Card>
          </Grid>
        )}
        {strengthProgress.deadlift && strengthProgress.deadlift.length > 0 && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Deadlift
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {strengthProgress.deadlift[strengthProgress.deadlift.length - 1]?.weight} lbs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {strengthProgress.deadlift.length} data points
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const MeasurementsTab: React.FC<{ latestProgress: ProgressEntry | null }> = ({ latestProgress }) => {
  if (!latestProgress) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No measurements data yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Body Measurements
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Waist</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.waist} in
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Chest</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.chest} in
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Arms</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.arms} in
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Shoulders</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.shoulders} in
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Thighs</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.thighs} in
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card sx={{ p: 2, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="text.secondary">Calves</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {latestProgress.measurements.calves} in
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const ProgressTracker: React.FC = () => {
  const currentPhase = useCurrentPhase();
  const latestProgress = useLatestProgress();
  const progressTrends = useProgressTrends();
  const strengthProgress = useStrengthProgress();
  const addProgressEntry = useAddProgressEntry();

  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProgress = (entry: ProgressEntry) => {
    addProgressEntry(entry);
    setShowProgressDialog(false);
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          📈 Progress Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowProgressDialog(true)}
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          Log Progress
        </Button>
      </Box>

      {/* Progress Overview Card */}
      {latestProgress && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              🎯 Latest Progress Update
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                    {latestProgress.weight} lbs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 700 }}>
                    {latestProgress.bodyFatPercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat %
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 700 }}>
                    {latestProgress.sleepHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sleep Last Night
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 700 }}>
                    {latestProgress.stressLevel}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stress Level
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="progress tabs">
            <Tab label="Overview" icon={<Assessment />} />
            <Tab label="Trends" icon={<ShowChart />} />
            <Tab label="Strength" icon={<FitnessCenter />} />
            <Tab label="Measurements" icon={<Straighten />} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <ProgressOverviewTab latestProgress={latestProgress} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ProgressTrendsTab progressTrends={progressTrends} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <StrengthProgressTab strengthProgress={strengthProgress} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <MeasurementsTab latestProgress={latestProgress} />
        </TabPanel>
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
