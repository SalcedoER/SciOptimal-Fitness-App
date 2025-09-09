import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrendingUp,
  Psychology,
  Watch,
  Sync,
  Insights,
  Warning,
  CheckCircle,
  Schedule,
  Speed,
  MonitorHeart,
  LocalFireDepartment,
  Bedtime,
  Timer
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { format } from 'date-fns';

// Enhanced Dashboard with Apple Watch Integration and Smart AI
export default function EnhancedDashboard() {
  const { 
    userProfile, 
    workoutHistory, 
    nutritionLog, 
    progressHistory, 
    sleepLog,
    healthData,
    isHealthDataConnected,
    lastHealthSync,
    optimizationInsights,
    adaptivePlan,
    aiAnalysis,
    isOptimizing,
    syncHealthData,
    runAIOptimization
  } = useAppStore();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (userProfile && !isOptimizing) {
      runAIOptimization();
    }
  }, [userProfile, workoutHistory, nutritionLog, progressHistory, sleepLog]);

  const handleSyncHealthData = async () => {
    setIsSyncing(true);
    await syncHealthData();
    setIsSyncing(false);
  };

  const todayWorkouts = workoutHistory.filter(w => 
    new Date(w.date).toDateString() === new Date().toDateString()
  );

  const todayNutrition = nutritionLog.filter(n => 
    new Date(n.date).toDateString() === new Date().toDateString()
  );

  const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
  const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);

  // Health metrics from Apple Watch
  const todaySteps = healthData?.steps.find((s: any) => 
    new Date(s.date).toDateString() === new Date().toDateString()
  )?.count || 0;

  const todayHeartRate = healthData?.heartRate.filter((h: any) => 
    new Date(h.timestamp).toDateString() === new Date().toDateString()
  ) || [];
  const avgHeartRate = todayHeartRate.length > 0 
    ? todayHeartRate.reduce((sum: number, h: any) => sum + h.value, 0) / todayHeartRate.length 
    : 0;

  const restingHR = healthData?.restingHeartRate || 0;
  const vo2Max = 45; // Default VO2 Max value

  // AI Optimization Score
  const optimizationScore = aiAnalysis?.overallScore || 0;
  const highPriorityInsights = optimizationInsights.filter((i: any) => i.priority === 'high');
  const riskFactors = aiAnalysis?.riskFactors || [];

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {/* Apple Watch Integration Status */}
      <Grid item xs={12}>
        <Card className="fitness-card glass-effect" sx={{ 
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
          border: '1px solid rgba(0, 122, 255, 0.2)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Watch sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: '#ffffff !important' }}>Apple Watch Integration</Typography>
                <Chip 
                  label={isHealthDataConnected ? 'Connected' : 'Disconnected'} 
                  color={isHealthDataConnected ? 'success' : 'error'}
                  size="small"
                  className={isHealthDataConnected ? "status-online" : "status-offline"}
                  sx={{ ml: 2 }}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={isSyncing ? <CircularProgress size={16} /> : <Sync />}
                onClick={handleSyncHealthData}
                disabled={isSyncing}
                size="small"
                className="gradient-button"
              >
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </Button>
            </Box>
            
            {isHealthDataConnected && lastHealthSync && (
              <Typography variant="body2" color="text.secondary">
                Last sync: {format(lastHealthSync, 'MMM d, h:mm a')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Real-time Health Metrics */}
      <Grid item xs={12} md={6}>
        <Card className="fitness-card metric-card slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonitorHeart sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ color: '#ffffff !important' }}>Today's Health Metrics</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h4" color="primary.main">
                  {todaySteps.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">Steps</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="error.main">
                  {Math.round(avgHeartRate || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Avg HR (BPM)</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="info.main">
                  {restingHR}
                </Typography>
                <Typography variant="body2" color="text.secondary">Resting HR</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="success.main">
                  {vo2Max}
                </Typography>
                <Typography variant="body2" color="text.secondary">VO2 Max</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* AI Optimization Score */}
      <Grid item xs={12} md={6}>
        <Card className="fitness-card metric-card slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Insights sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ color: '#ffffff !important' }}>AI Optimization Score</Typography>
              {isOptimizing && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Box>
            
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h2" color={optimizationScore >= 80 ? 'success.main' : optimizationScore >= 60 ? 'warning.main' : 'error.main'}>
                {optimizationScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">Overall Score</Typography>
              <LinearProgress 
                variant="determinate" 
                value={optimizationScore} 
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                color={optimizationScore >= 80 ? 'success' : optimizationScore >= 60 ? 'warning' : 'error'}
              />
            </Box>

            {riskFactors.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {riskFactors.length} high-priority issue{riskFactors.length > 1 ? 's' : ''} detected
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Workout */}
      <Grid item xs={12} md={6}>
        <Card className="slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Today's Workout</Typography>
            </Box>
            {todayWorkouts.length > 0 ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  {todayWorkouts[0].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {todayWorkouts[0].exercises.length} exercises • {todayWorkouts[0].duration} min
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip 
                    label={`RPE: ${todayWorkouts[0].rpe}/10`} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={`Calories: ${Math.round(todayWorkouts[0].duration * 8)}`} 
                    color="secondary" 
                    size="small" 
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No workout scheduled for today
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Nutrition Progress */}
      <Grid item xs={12} md={6}>
        <Card className="slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Restaurant sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6">Nutrition Today</Typography>
            </Box>
            <Typography variant="h4" color="primary.main">
              {totalCalories}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              calories consumed
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Protein: ${totalProtein}g`} size="small" />
              <Chip label={`${todayNutrition.length} meals`} size="small" variant="outlined" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* AI Optimization Insights */}
      <Grid item xs={12}>
        <Card className="slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">AI Optimization Insights</Typography>
              <Badge badgeContent={highPriorityInsights.length} color="error" sx={{ ml: 1 }}>
                <Warning color="error" />
              </Badge>
            </Box>
            
            {optimizationInsights.length > 0 ? (
              <List dense>
                {optimizationInsights.slice(0, 5).map((insight: any, index: number) => (
                  <React.Fragment key={insight.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: insight.priority === 'high' ? 'error.main' : 
                                  insight.priority === 'medium' ? 'warning.main' : 'info.main'
                        }}>
                          {insight.priority === 'high' ? <Warning fontSize="small" /> :
                           insight.priority === 'medium' ? <Schedule fontSize="small" /> :
                           <CheckCircle fontSize="small" />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">{insight.title}</Typography>
                            <Chip 
                              label={insight.priority} 
                              size="small" 
                              color={insight.priority === 'high' ? 'error' : 
                                    insight.priority === 'medium' ? 'warning' : 'info'}
                            />
                            <Chip 
                              label={`${insight.confidence}% confidence`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {insight.description}
                            </Typography>
                            <Typography variant="caption" color="primary.main">
                              💡 {insight.recommendation}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Expected Impact: {insight.expectedImpact}% • 
                                Data Points: {insight.dataPoints.join(', ')}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Complete some workouts and nutrition entries to get AI optimization insights!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Adaptive Plan Status */}
      {adaptivePlan && (
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
            border: '1px solid rgba(156, 39, 176, 0.2)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Adaptive Plan Status</Typography>
                <Chip 
                  label={`Phase: ${adaptivePlan.currentPhase}`} 
                  color="primary" 
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              
              <Typography variant="body1" gutterBottom>
                {adaptivePlan.currentPhase.replace('_', ' ').toUpperCase()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Next review: {format(new Date(adaptivePlan.nextReview), 'MMM d, h:mm a')}
              </Typography>
              
              {adaptivePlan.adjustments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Adjustments ({adaptivePlan.adjustments.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {adaptivePlan.adjustments.slice(-3).map((adjustment: any, index: number) => (
                      <Chip
                        key={adjustment.id}
                        label={`${adjustment.type}: ${adjustment.reason.substring(0, 30)}...`}
                        size="small"
                        color={adjustment.impact === 'positive' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
