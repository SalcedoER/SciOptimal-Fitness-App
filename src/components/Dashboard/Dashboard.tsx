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
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useCurrentPhase, useMacroTotals, useTargetMacros, useMacroCompliance, useTodayWorkout, useTodayNutrition, useLatestProgress } from '../../store/useAppStore';
import BodyDiagram from '../BodyDiagram/BodyDiagram';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
  const todayScheduledWorkout = currentPhase?.trainingSplit.days.find(day => day.dayNumber === new Date().getDay()) || null;

  const getMacroProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const getMacroColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'workout':
        navigate('/workout');
        break;
      case 'meal':
        navigate('/nutrition');
        break;
      case 'sleep':
        navigate('/sleep');
        break;
      case 'progress':
        navigate('/progress');
        break;
      case 'training':
        navigate('/training');
        break;
      default:
        break;
    }
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

      {/* Current Training Phase */}
      {currentPhase && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              🎯 Current Training Phase: {currentPhase.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Duration: {currentPhase.duration} weeks | Focus: {currentPhase.focus.replace('_', ' ')}
            </Typography>
            
            {todayScheduledWorkout && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Today's Workout Plan
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {todayScheduledWorkout.muscleGroups.map((group, index) => (
                    <Chip 
                      key={index}
                      label={group.charAt(0).toUpperCase() + group.slice(1)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {todayScheduledWorkout.exercises.length} compound exercises + {todayScheduledWorkout.accessories.length} accessories + {todayScheduledWorkout.abs.length} abs exercises
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => handleQuickAction('workout')}
                  sx={{ mt: 2 }}
                >
                  Start Today's Workout
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

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
                  {todayScheduledWorkout ? (
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
                        onClick={() => handleQuickAction('workout')}
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

      {/* Macro Tracking */}
      {targetMacros && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              🍽️ Today's Nutrition Progress
            </Typography>
            
            <Grid container spacing={3}>
              {/* Calories */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    {macroTotals.calories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {targetMacros.calories} cal
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getMacroProgress(macroTotals.calories, targetMacros.calories)}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    color={getMacroColor(getMacroProgress(macroTotals.calories, targetMacros.calories))}
                  />
                </Box>
              </Grid>
              
              {/* Protein */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                    {macroTotals.protein_g}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {targetMacros.protein_g}g protein
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getMacroProgress(macroTotals.protein_g, targetMacros.protein_g)}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    color={getMacroColor(getMacroProgress(macroTotals.protein_g, targetMacros.protein_g))}
                  />
                </Box>
              </Grid>
              
              {/* Carbs */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 700 }}>
                    {macroTotals.carbs_g}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {targetMacros.carbs_g}g carbs
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getMacroProgress(macroTotals.carbs_g, targetMacros.carbs_g)}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    color={getMacroColor(getMacroProgress(macroTotals.carbs_g, targetMacros.carbs_g))}
                  />
                </Box>
              </Grid>
              
              {/* Fat */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 700 }}>
                    {macroTotals.fat_g}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {targetMacros.fat_g}g fat
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getMacroProgress(macroTotals.fat_g, targetMacros.fat_g)}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    color={getMacroColor(getMacroProgress(macroTotals.fat_g, targetMacros.fat_g))}
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Restaurant />}
                onClick={() => handleQuickAction('meal')}
              >
                Log Meal
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                onClick={() => handleQuickAction('progress')}
              >
                Update Progress
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

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
      <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            ⚡ Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(145deg, #2d3748 0%, #4a5568 100%)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={() => handleQuickAction('workout')}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Start Workout
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isWorkoutDay ? 'Today is a training day!' : 'Rest day - plan tomorrow'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(145deg, #2d3748 0%, #4a5568 100%)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={() => handleQuickAction('meal')}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Restaurant sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Log Nutrition
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your macros and calories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(145deg, #2d3748 0%, #4a5568 100%)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={() => handleQuickAction('progress')}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Update Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Log weight, measurements, strength
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(145deg, #2d3748 0%, #4a5568 100%)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={() => handleQuickAction('training')}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Schedule sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Training Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your complete program
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
