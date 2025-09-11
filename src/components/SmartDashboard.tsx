import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  MonitorHeart,
  DirectionsRun,
  Bedtime,
  Scale,
  WaterDrop,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Info,
  Settings,
  Sync,
  DeviceHub,
  Psychology,
  FitnessCenter
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { SleepIntelligenceService, RecoveryScore, SleepInsight } from '../services/sleepIntelligence';
import { WorkoutAdaptationService, WorkoutAdaptation } from '../services/workoutAdaptation';
import { HealthIntegrationService, HealthData, HealthInsight, DeviceConnection } from '../services/healthIntegration';

export default function SmartDashboard() {
  const { userProfile, workoutHistory, todaysWorkout, generateTodaysWorkout } = useAppStore();
  
  const [recoveryScore, setRecoveryScore] = useState<RecoveryScore | null>(null);
  const [sleepInsights, setSleepInsights] = useState<SleepInsight[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [devices, setDevices] = useState<DeviceConnection[]>([]);
  const [workoutAdaptation, setWorkoutAdaptation] = useState<WorkoutAdaptation | null>(null);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSmartData();
  }, [userProfile, workoutHistory]);

  const loadSmartData = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    
    try {
      // Load health devices
      const availableDevices = HealthIntegrationService.getAvailableDevices();
      setDevices(availableDevices);

      // Sync health data
      const health = await HealthIntegrationService.syncHealthData();
      setHealthData(health);

      // Analyze health data
      const insights = HealthIntegrationService.analyzeHealthData(health, userProfile);
      setHealthInsights(insights);

      // Mock sleep data for demonstration
      const mockSleepData = [
        { date: '2024-01-15', sleepHours: 7.5, sleepQuality: 8, stressLevel: 4, caffeineIntake: 8 },
        { date: '2024-01-14', sleepHours: 6.8, sleepQuality: 7, stressLevel: 6, caffeineIntake: 6 },
        { date: '2024-01-13', sleepHours: 8.2, sleepQuality: 9, stressLevel: 3, caffeineIntake: 10 },
        { date: '2024-01-12', sleepHours: 7.0, sleepQuality: 6, stressLevel: 7, caffeineIntake: 4 },
        { date: '2024-01-11', sleepHours: 7.8, sleepQuality: 8, stressLevel: 5, caffeineIntake: 8 }
      ];

      // Calculate recovery score
      const recovery = SleepIntelligenceService.calculateRecoveryScore(
        mockSleepData,
        userProfile,
        workoutHistory
      );
      setRecoveryScore(recovery);

      // Generate sleep insights
      const sleepInsights = SleepIntelligenceService.generateSleepInsights(mockSleepData);
      setSleepInsights(sleepInsights);

      // Adapt workout if available
      if (todaysWorkout) {
        const adaptation = WorkoutAdaptationService.adaptWorkout(
          todaysWorkout,
          userProfile,
          workoutHistory,
          recovery
        );
        setWorkoutAdaptation(adaptation);
      }

    } catch (error) {
      console.error('Error loading smart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectDevice = async (deviceType: string) => {
    const success = await HealthIntegrationService.connectDevice(deviceType);
    if (success) {
      setDevices(prev => 
        prev.map(device => 
          device.type === deviceType 
            ? { ...device, connected: true, lastSync: new Date() }
            : device
        )
      );
      loadSmartData(); // Reload data after connection
    }
  };

  const disconnectDevice = (deviceType: string) => {
    HealthIntegrationService.disconnectDevice(deviceType);
    setDevices(prev => 
      prev.map(device => 
        device.type === deviceType 
          ? { ...device, connected: false }
          : device
      )
    );
  };

  const applyWorkoutAdaptation = () => {
    if (workoutAdaptation) {
      // In a real app, this would update the workout in the store
      generateTodaysWorkout();
      setWorkoutAdaptation(null);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading smart insights...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary">
          Smart Dashboard
        </Typography>
        <Box>
          <IconButton onClick={() => setShowDeviceDialog(true)}>
            <DeviceHub />
          </IconButton>
          <IconButton onClick={loadSmartData}>
            <Sync />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Recovery Score */}
        {recoveryScore && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Recovery Score</Typography>
                </Box>
                
                <Box textAlign="center" mb={3}>
                  <Typography variant="h2" color="primary.main">
                    {recoveryScore.overall}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Recovery
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Sleep</Typography>
                    <Typography variant="body2">{recoveryScore.sleep}/100</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={recoveryScore.sleep} 
                    color={recoveryScore.sleep > 70 ? 'success' : recoveryScore.sleep > 50 ? 'warning' : 'error'}
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Stress</Typography>
                    <Typography variant="body2">{recoveryScore.stress}/100</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={recoveryScore.stress} 
                    color={recoveryScore.stress > 70 ? 'success' : recoveryScore.stress > 50 ? 'warning' : 'error'}
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Readiness</Typography>
                    <Typography variant="body2">{recoveryScore.readiness}/100</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={recoveryScore.readiness} 
                    color={recoveryScore.readiness > 70 ? 'success' : recoveryScore.readiness > 50 ? 'warning' : 'error'}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Workout Recommendation:
                </Typography>
                <Chip 
                  label={`${recoveryScore.workoutAdjustment.intensity} intensity • ${recoveryScore.workoutAdjustment.duration} duration`}
                  color={recoveryScore.overall > 70 ? 'success' : recoveryScore.overall > 50 ? 'warning' : 'error'}
                />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Health Data */}
        {healthData && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MonitorHeart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Health Metrics</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {healthData.heartRate.resting}
                      </Typography>
                      <Typography variant="body2">Resting HR (BPM)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="secondary.main">
                        {healthData.steps.today.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Steps Today</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        {healthData.sleep.duration}h
                      </Typography>
                      <Typography variant="body2">Sleep Duration</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {healthData.hydration.today}L
                      </Typography>
                      <Typography variant="body2">Hydration</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Health Score: {HealthIntegrationService.calculateHealthScore(healthData)}/100
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={HealthIntegrationService.calculateHealthScore(healthData)}
                    color={HealthIntegrationService.calculateHealthScore(healthData) > 80 ? 'success' : 'warning'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Workout Adaptation */}
        {workoutAdaptation && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Smart Workout Adaptation</Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>AI Recommendation:</strong> {workoutAdaptation.reason}
                  </Typography>
                </Alert>

                <Typography variant="subtitle2" gutterBottom>
                  Changes Made:
                </Typography>
                <List dense>
                  {workoutAdaptation.changes.map((change, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {change.impact === 'positive' ? (
                          <CheckCircle color="success" />
                        ) : change.impact === 'negative' ? (
                          <Warning color="error" />
                        ) : (
                          <Info color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={change.description} />
                    </ListItem>
                  ))}
                </List>

                <Box mt={2} display="flex" gap={2}>
                  <Button 
                    variant="contained" 
                    onClick={applyWorkoutAdaptation}
                    startIcon={<CheckCircle />}
                  >
                    Apply Changes
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setWorkoutAdaptation(null)}
                  >
                    Keep Original
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Health Insights */}
        {healthInsights.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Insights
                </Typography>
                <List>
                  {healthInsights.slice(0, 3).map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {insight.priority === 'high' ? (
                          <Warning color="error" />
                        ) : insight.priority === 'medium' ? (
                          <Info color="warning" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.recommendation}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Sleep Insights */}
        {sleepInsights.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sleep Insights
                </Typography>
                <List>
                  {sleepInsights.slice(0, 3).map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {insight.impact === 'negative' ? (
                          <TrendingDown color="error" />
                        ) : insight.impact === 'positive' ? (
                          <TrendingUp color="success" />
                        ) : (
                          <Info color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.recommendation}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Device Connection Dialog */}
      <Dialog open={showDeviceDialog} onClose={() => setShowDeviceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect Health Devices</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Connect your health devices to get personalized insights and recommendations.
          </Typography>
          <List>
            {devices.map((device) => (
              <ListItem key={device.type}>
                <ListItemIcon>
                  <DeviceHub color={device.connected ? 'success' : 'disabled'} />
                </ListItemIcon>
                <ListItemText
                  primary={device.name}
                  secondary={device.connected ? 'Connected' : 'Not connected'}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={device.connected}
                      onChange={() => 
                        device.connected 
                          ? disconnectDevice(device.type)
                          : connectDevice(device.type)
                      }
                    />
                  }
                  label=""
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeviceDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

