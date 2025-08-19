import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  FitnessCenter,
  Restaurant,
  Bedtime,
  Schedule,
  CheckCircle,
  Warning,
  Info,
  PlayArrow,
  Timer,
  LocalFireDepartment
} from '@mui/icons-material';
import { useUserProfile, useCurrentPhase, useMacroTotals, useTargetMacros, useMacroCompliance, useTodayWorkout, useTodayNutrition, useLatestProgress } from '../../store/useAppStore';
import BodyDiagram from '../BodyDiagram/BodyDiagram';

const Dashboard: React.FC = () => {
  const userProfile = useUserProfile();
  const currentPhase = useCurrentPhase();
  const macroTotals = useMacroTotals();
  const targetMacros = useTargetMacros();
  const macroCompliance = useMacroCompliance();
  const todayWorkout = useTodayWorkout();
  const todayNutrition = useTodayNutrition();
  const latestProgress = useLatestProgress();

  if (!userProfile) {
    return (
      <Alert severity="info">
        Please complete your profile setup to view the dashboard.
      </Alert>
    );
  }

  const getToday = () => {
    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[today];
  };

  const isWorkoutDay = currentPhase?.trainingSplit.restDays.indexOf(new Date().getDay()) === -1;

  const getMacroProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const getMacroColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Welcome back, {userProfile.name}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {currentPhase ? `Currently in ${currentPhase.name}` : 'Ready to start your fitness journey'}
        </Typography>
      </Box>

      {/* Body Coverage Diagram */}
      <BodyDiagram showWeekly={true} title="This Week's Body Coverage" />

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentPhase?.trainingSplit.days.length || 0}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Weekly Workouts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {todayNutrition.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Today's Meals
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Bedtime sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {userProfile.sleepSchedule.targetSleepHours}h
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Sleep Target
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {userProfile.weight}kg
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Current Weight
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Workout Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Today's Workout
                </Typography>
              </Box>
              
              {isWorkoutDay ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    {getToday()} - Training Day
                  </Typography>
                  {todayWorkout ? (
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        icon={<CheckCircle />} 
                        label="Workout Completed" 
                        color="success" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Great job! You've completed today's workout.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="contained" 
                        startIcon={<PlayArrow />}
                        sx={{ mb: 1 }}
                      >
                        Start Workout
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        Ready to crush today's training session!
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    {getToday()} - Rest Day
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Take it easy today. Focus on recovery and nutrition.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Nutrition Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Today's Nutrition
                </Typography>
              </Box>
              
              {targetMacros ? (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Target: {targetMacros.calories} kcal
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Current: {macroTotals.calories} kcal
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Protein</Typography>
                      <Typography variant="body2">
                        {macroTotals.protein_g}g / {targetMacros.protein_g}g
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getMacroProgress(macroTotals.protein_g, targetMacros.protein_g)}
                      color={getMacroColor(getMacroProgress(macroTotals.protein_g, targetMacros.protein_g))}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Carbs</Typography>
                      <Typography variant="body2">
                        {macroTotals.carbs_g}g / {targetMacros.carbs_g}g
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getMacroProgress(macroTotals.carbs_g, targetMacros.carbs_g)}
                      color={getMacroColor(getMacroProgress(macroTotals.carbs_g, targetMacros.carbs_g))}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Fat</Typography>
                      <Typography variant="body2">
                        {macroTotals.fat_g}g / {targetMacros.fat_g}g
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getMacroProgress(macroTotals.fat_g, targetMacros.fat_g)}
                      color={getMacroColor(getMacroProgress(macroTotals.fat_g, targetMacros.fat_g))}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Set up your training phase to see macro targets.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Progress */}
      {latestProgress && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Latest Progress Update
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Weight</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {latestProgress.weight} kg
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Body Fat</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {latestProgress.bodyFatPercentage}%
                  </Typography>
                </Box>
              </Grid>
              {latestProgress.strengthLifts?.benchPress && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Bench</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {latestProgress.strengthLifts.benchPress} kg
                    </Typography>
                  </Box>
                </Grid>
              )}
              {latestProgress.strengthLifts?.squat && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Squat</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {latestProgress.strengthLifts.squat} kg
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FitnessCenter />}
                sx={{ py: 2 }}
              >
                Log Workout
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Restaurant />}
                sx={{ py: 2 }}
              >
                Log Meal
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Bedtime />}
                sx={{ py: 2 }}
              >
                Log Sleep
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUp />}
                sx={{ py: 2 }}
              >
                Update Progress
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
