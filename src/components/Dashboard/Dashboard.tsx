import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  FitnessCenter,
  Restaurant,
  Schedule,
  TrendingDown
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  useUserProfile,
  useCurrentPhase,
  useLatestProgress,
  useTodayWorkout,
  useTodayNutrition,
  useMacroTotals,
  useTargetMacros,
  useMacroCompliance,
  useProgressTrends
} from '../../store/useAppStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const currentPhase = useCurrentPhase();
  const latestProgress = useLatestProgress();
  const todayWorkout = useTodayWorkout();
  const todayNutrition = useTodayNutrition();
  const macroTotals = useMacroTotals();
  const targetMacros = useTargetMacros();
  const macroCompliance = useMacroCompliance();
  const progressTrends = useProgressTrends();

  if (!userProfile || !currentPhase) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const getWeightChange = () => {
    if (!progressTrends?.weightTrend || progressTrends.weightTrend.length < 2) return 0;
    const recent = progressTrends.weightTrend.slice(-2);
    return recent[1].weight - recent[0].weight;
  };

  const weightChange = getWeightChange();
  const isWeightGaining = weightChange > 0;

  const getTodayWorkoutStatus = () => {
    if (todayWorkout) {
      return { status: 'completed', text: 'Workout Completed', color: 'success' as const };
    }
    
    const today = new Date().getDay();
    const isWorkoutDay = !currentPhase.trainingSplit.restDays.includes(today);
    
    if (isWorkoutDay) {
      return { status: 'pending', text: 'Workout Pending', color: 'warning' as const };
    }
    
    return { status: 'rest', text: 'Rest Day', color: 'info' as const };
  };

  const workoutStatus = getTodayWorkoutStatus();

  const getMacroProgressColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'success';
    if (percentage >= 80 && percentage <= 120) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome back, {userProfile.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {format(new Date(), 'EEEE, MMMM do, yyyy')} • {currentPhase.name}
        </Typography>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Current Weight */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {latestProgress?.weight || userProfile.weight} lbs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                </Box>
              </Box>
              {weightChange !== 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isWeightGaining ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography 
                    variant="body2" 
                    color={isWeightGaining ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5, fontWeight: 500 }}
                  >
                    {Math.abs(weightChange).toFixed(1)} kg this week
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Target Weight */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentPhase.targetWeight} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target Weight
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={((latestProgress?.weight || userProfile.weight) / currentPhase.targetWeight) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Workout */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: `${workoutStatus.color}.main`, mr: 2 }}>
                  <FitnessCenter />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {workoutStatus.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Status
                  </Typography>
                </Box>
              </Box>
              {workoutStatus.status === 'pending' && (
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => navigate('/workout')}
                  startIcon={<FitnessCenter />}
                >
                  Start Workout
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Nutrition Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Restaurant />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {macroTotals.calories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calories Today
                  </Typography>
                </Box>
              </Box>
              {targetMacros && (
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((macroTotals.calories / (targetMacros.protein * 4 + targetMacros.carbs * 4 + targetMacros.fat * 9)) * 100, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Today's Workout */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Today's Workout
                </Typography>
                <Chip 
                  label={workoutStatus.text} 
                  color={workoutStatus.color}
                  size="small"
                />
              </Box>
              
              {workoutStatus.status === 'completed' ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Great job! You completed today's workout.
                </Alert>
              ) : workoutStatus.status === 'pending' ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ready to crush your workout? Let's get started!
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/workout')}
                    startIcon={<FitnessCenter />}
                  >
                    Start Workout
                  </Button>
                </Box>
              ) : (
                <Alert severity="info">
                  Today is a rest day. Focus on recovery and nutrition.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Nutrition Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Nutrition Summary
              </Typography>
              
              {targetMacros && macroCompliance ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Protein</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {macroTotals.protein}g / {targetMacros.protein}g
                      </Typography>
                      <Chip 
                        label={`${Math.round(macroCompliance.protein)}%`}
                        color={getMacroProgressColor(macroCompliance.protein) as any}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(macroCompliance.protein, 100)}
                      color={getMacroProgressColor(macroCompliance.protein) as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Carbs</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {macroTotals.carbs}g / {targetMacros.carbs}g
                      </Typography>
                      <Chip 
                        label={`${Math.round(macroCompliance.carbs)}%`}
                        color={getMacroProgressColor(macroCompliance.carbs) as any}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(macroCompliance.carbs, 100)}
                      color={getMacroProgressColor(macroCompliance.carbs) as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Fat</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {macroTotals.fat}g / {targetMacros.fat}g
                      </Typography>
                      <Chip 
                        label={`${Math.round(macroCompliance.fat)}%`}
                        color={getMacroProgressColor(macroCompliance.fat) as any}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(macroCompliance.fat, 100)}
                      color={getMacroProgressColor(macroCompliance.fat) as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Fiber</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {macroTotals.fiber}g / {targetMacros.fiber}g
                      </Typography>
                      <Chip 
                        label={`${Math.round(macroCompliance.fiber)}%`}
                        color={getMacroProgressColor(macroCompliance.fiber) as any}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(macroCompliance.fiber, 100)}
                      color={getMacroProgressColor(macroCompliance.fiber) as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No nutrition data available for today.
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/nutrition')}
                  startIcon={<Restaurant />}
                >
                  Log Nutrition
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <List dense>
                <ListItem button onClick={() => navigate('/workout')}>
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText primary="Start Workout" />
                </ListItem>
                <ListItem button onClick={() => navigate('/nutrition')}>
                  <ListItemIcon>
                    <Restaurant />
                  </ListItemIcon>
                  <ListItemText primary="Log Nutrition" />
                </ListItem>
                <ListItem button onClick={() => navigate('/progress')}>
                  <ListItemIcon>
                    <TrendingUp />
                  </ListItemIcon>
                  <ListItemText primary="Update Progress" />
                </ListItem>
                <ListItem button onClick={() => navigate('/training')}>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText primary="View Training Plan" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Phase Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Current Phase
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {currentPhase.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentPhase.duration} weeks • {currentPhase.focus.replace('_', ' ')}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Target Weight: {currentPhase.targetWeight} lbs
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Target Body Fat: {currentPhase.targetBodyFat}%
                </Typography>
                <Typography variant="body2">
                  Cardio: {currentPhase.cardioPlan.frequency}x/week, {currentPhase.cardioPlan.duration}min
                </Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/training')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>

          {/* Today's Meals */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Today's Meals
              </Typography>
              
              {todayNutrition.length > 0 ? (
                <List dense>
                  {todayNutrition.map((entry, index) => (
                    <ListItem key={entry.id}>
                      <ListItemIcon>
                        <Restaurant fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={entry.meal}
                        secondary={`${entry.totalCalories} cal`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No meals logged today.
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/nutrition')}
                >
                  Add Meal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
