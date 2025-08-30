import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrendingUp,
  Psychology,
  Dashboard as DashboardIcon,
  Bedtime,
  Person,
  Add,
  Timeline,
  SmartToy,
  Insights,
  Watch,
  Science
} from '@mui/icons-material';
import { useAppStore } from './store';
import './App.css';

// Enhanced dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e676',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
          border: '1px solid rgba(0, 230, 118, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          '@media (max-width: 600px)': {
            fontSize: '0.875rem',
            padding: '8px 16px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            '@media (max-width: 600px)': {
              fontSize: '16px', // Prevents iOS zoom
            },
          },
        },
      },
    },
  },
});

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 'calc(100vh - 200px)', sm: 'auto' }
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Enhanced Dashboard with AI Insights
function Dashboard() {
  const { 
    userProfile, 
    workoutHistory, 
    nutritionLog, 
    progressHistory, 
    sleepLog,
    aiInsights,
    isAnalyzing,
    generateAIInsights 
  } = useAppStore();

  useEffect(() => {
    if (userProfile && !isAnalyzing) {
      generateAIInsights();
    }
  }, [userProfile, workoutHistory, nutritionLog, progressHistory]);

  const todayWorkouts = workoutHistory.filter(w => 
    new Date(w.date).toDateString() === new Date().toDateString()
  );

  const todayNutrition = nutritionLog.filter(n => 
    new Date(n.date).toDateString() === new Date().toDateString()
  );

  const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
  const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
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
                    <Chip 
                      label={`RPE: ${todayWorkouts[0].rpe}/10`} 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
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

          {/* Weekly Stats */}
          <Grid item xs={12}>
            <Card className="slide-in">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Weekly Progress</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Workouts</Typography>
                    <Typography variant="h6">{workoutHistory.length}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Avg RPE</Typography>
                    <Typography variant="h6">
                      {workoutHistory.length > 0 
                        ? (workoutHistory.reduce((sum, w) => sum + w.rpe, 0) / workoutHistory.length).toFixed(1)
                        : '0'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Progress Entries</Typography>
                    <Typography variant="h6">{progressHistory.length}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Sleep Avg</Typography>
                    <Typography variant="h6">
                      {sleepLog.length > 0 
                        ? `${(sleepLog.reduce((sum, s) => sum + s.duration, 0) / sleepLog.length).toFixed(1)}h`
                        : '0h'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* AI Insights Sidebar */}
      <Grid item xs={12} lg={4}>
        <Card className="slide-in">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToy sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">AI Insights</Typography>
              {isAnalyzing && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Box>
            
            {aiInsights.length > 0 ? (
              <List dense>
                {aiInsights.slice(-3).map((insight, index) => (
                  <React.Fragment key={insight.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Insights fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {insight.description}
                            </Typography>
                            <Typography variant="caption" color="primary.main">
                              💡 {insight.recommendation}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 2 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Complete some workouts and nutrition entries to get AI insights!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Enhanced Workout Tracker
function WorkoutTracker() {
  const { addWorkoutSession } = useAppStore();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('Push Day');
  const [exercises, setExercises] = useState([
    { name: 'Bench Press', sets: [{ reps: 8, weight: 185, rpe: 8 }], muscleGroups: ['chest', 'shoulders', 'triceps'] },
    { name: 'Incline Dumbbell Press', sets: [{ reps: 10, weight: 70, rpe: 7 }], muscleGroups: ['chest', 'shoulders'] },
    { name: 'Dips', sets: [{ reps: 12, weight: 0, rpe: 8 }], muscleGroups: ['chest', 'triceps'] },
    { name: 'Push-ups', sets: [{ reps: 15, weight: 0, rpe: 6 }], muscleGroups: ['chest'] },
  ]);

  const completeWorkout = () => {
    const session = {
      id: `workout_${Date.now()}`,
      date: new Date(),
      name: workoutName,
      exercises: exercises,
      duration: 45 + Math.floor(Math.random() * 30), // 45-75 minutes
      rpe: Math.round(exercises.reduce((sum, e) => sum + e.sets[0].rpe, 0) / exercises.length),
      notes: 'Great workout!'
    };
    
    addWorkoutSession(session);
    setShowAddDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="text-gradient">
          💪 Workout Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowAddDialog(true)}
          sx={{ 
            background: 'linear-gradient(45deg, #00e676 30%, #00c853 90%)',
            minHeight: { xs: 44, sm: 36 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 2, sm: 3 }
          }}
        >
          New Workout
        </Button>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {exercises.map((exercise, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              bgcolor: index === currentExercise ? 'rgba(0, 230, 118, 0.1)' : 'background.paper',
              border: index === currentExercise ? '2px solid' : '1px solid',
              borderColor: index === currentExercise ? 'primary.main' : 'rgba(255,255,255,0.1)',
              '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{exercise.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {exercise.sets[0].reps} reps @ {exercise.sets[0].weight} lbs (RPE {exercise.sets[0].rpe})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {exercise.muscleGroups.map((muscle, idx) => (
                    <Chip key={idx} label={muscle} size="small" variant="outlined" />
                  ))}
                </Box>
                <Button 
                  variant={index === currentExercise ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setCurrentExercise(index)}
                  fullWidth
                >
                  {index < currentExercise ? '✅ Complete' : index === currentExercise ? '🔥 Current' : '▶️ Start'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={completeWorkout}
          sx={{ 
            px: { xs: 2, sm: 4 }, 
            py: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(45deg, #ff4081 30%, #f50057 90%)',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            minHeight: { xs: 48, sm: 56 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          🏁 Complete Workout
        </Button>
      </Box>

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>🎉 Workout Completed!</DialogTitle>
        <DialogContent>
          <Typography>
            Great job completing your {workoutName}! The workout has been logged and AI insights will be updated.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Enhanced Nutrition Tracker
function NutritionTracker() {
  const { addNutritionEntry, nutritionLog } = useAppStore();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const addMeal = () => {
    if (mealName && calories && protein) {
      const entry = {
        id: `nutrition_${Date.now()}`,
        date: new Date(),
        meal: mealName,
        foods: [mealName],
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: Math.round(parseInt(calories) * 0.4 / 4), // Estimate carbs
        fats: Math.round(parseInt(calories) * 0.3 / 9), // Estimate fats
      };
      
      addNutritionEntry(entry);
      setShowAddMeal(false);
      setMealName('');
      setCalories('');
      setProtein('');
    }
  };

  const todayNutrition = nutritionLog.filter(n => 
    new Date(n.date).toDateString() === new Date().toDateString()
  );

  const totals = todayNutrition.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="text-gradient">
          🍎 Nutrition Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowAddMeal(true)}
          sx={{ background: 'linear-gradient(45deg, #ff4081 30%, #f50057 90%)' }}
        >
          Add Meal
        </Button>
      </Box>
      
      {/* Daily Summary */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(255, 64, 129, 0.1) 0%, rgba(0, 230, 118, 0.1) 100%)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📊 Today's Totals</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" color="primary.main">{totals.calories}</Typography>
              <Typography variant="body2" color="text.secondary">Calories</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" color="secondary.main">{totals.protein}g</Typography>
              <Typography variant="body2" color="text.secondary">Protein</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" color="info.main">{totals.carbs}g</Typography>
              <Typography variant="body2" color="text.secondary">Carbs</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" color="warning.main">{totals.fats}g</Typography>
              <Typography variant="body2" color="text.secondary">Fats</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Meals List */}
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {todayNutrition.map((meal, index) => (
          <Grid item xs={12} sm={6} key={meal.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{meal.meal}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(meal.date).toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Meal Dialog */}
      <Dialog open={showAddMeal} onClose={() => setShowAddMeal(false)}>
        <DialogTitle>🍽️ Add Meal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Meal Name"
            fullWidth
            variant="outlined"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Calories"
            type="number"
            fullWidth
            variant="outlined"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Protein (g)"
            type="number"
            fullWidth
            variant="outlined"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMeal(false)}>Cancel</Button>
          <Button onClick={addMeal} variant="contained">Add Meal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Enhanced Progress Tracker
function ProgressTracker() {
  const { addProgressEntry, progressHistory, userProfile } = useAppStore();
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const addProgress = () => {
    if (weight) {
      const entry = {
        id: `progress_${Date.now()}`,
        date: new Date(),
        weight: parseFloat(weight),
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        notes: 'Manual entry'
      };
      
      addProgressEntry(entry);
      setShowAddProgress(false);
      setWeight('');
      setBodyFat('');
    }
  };

  const latestProgress = progressHistory[progressHistory.length - 1];
  const weightChange = progressHistory.length >= 2 
    ? progressHistory[progressHistory.length - 1].weight - progressHistory[progressHistory.length - 2].weight
    : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="text-gradient">
          📈 Progress Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowAddProgress(true)}
          sx={{ background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)' }}
        >
          Log Progress
        </Button>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Current Stats */}
        <Grid item xs={12} sm={6}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>📏 Current Stats</Typography>
              {latestProgress ? (
                <Box>
                  <Typography variant="h3" color="primary.main">
                    {latestProgress.weight} lbs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                  {latestProgress.bodyFat && (
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {latestProgress.bodyFat}% Body Fat
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(latestProgress.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No progress data yet. Add your first entry!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Trend */}
        <Grid item xs={12} sm={6}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>📊 Progress Trend</Typography>
              {progressHistory.length >= 2 ? (
                <Box>
                  <Typography variant="h3" color={weightChange >= 0 ? 'success.main' : 'info.main'}>
                    {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weight Change
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, Math.abs(weightChange) * 20)}
                    sx={{ mt: 2 }}
                    color={weightChange >= 0 ? 'success' : 'info'}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Need at least 2 entries to show trends
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📋 Progress History</Typography>
              {progressHistory.length > 0 ? (
                <List>
                  {progressHistory.slice(-5).reverse().map((entry, index) => (
                    <ListItem key={entry.id}>
                      <ListItemIcon>
                        <TrendingUp color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${entry.weight} lbs${entry.bodyFat ? ` • ${entry.bodyFat}% BF` : ''}`}
                        secondary={new Date(entry.date).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Start tracking your progress by adding your first measurement!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Progress Dialog */}
      <Dialog open={showAddProgress} onClose={() => setShowAddProgress(false)}>
        <DialogTitle>📊 Log Progress</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Weight (lbs)"
            type="number"
            fullWidth
            variant="outlined"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Body Fat % (optional)"
            type="number"
            fullWidth
            variant="outlined"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddProgress(false)}>Cancel</Button>
          <Button onClick={addProgress} variant="contained">Log Progress</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Enhanced Sleep Tracker
function SleepTracker() {
  const { addSleepEntry, sleepLog } = useAppStore();
  const [showAddSleep, setShowAddSleep] = useState(false);
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState('');

  const addSleep = () => {
    if (bedTime && wakeTime && quality) {
      // Calculate duration
      const bed = new Date(`2000-01-01 ${bedTime}`);
      const wake = new Date(`2000-01-01 ${wakeTime}`);
      let duration = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
      if (duration < 0) duration += 24; // Handle overnight sleep
      
      const entry = {
        id: `sleep_${Date.now()}`,
        date: new Date(),
        bedTime,
        wakeTime,
        duration,
        quality: parseInt(quality),
        notes: 'Manual entry'
      };
      
      addSleepEntry(entry);
      setShowAddSleep(false);
      setBedTime('');
      setWakeTime('');
      setQuality('');
    }
  };

  const recentSleep = sleepLog.slice(-7);
  const avgSleep = recentSleep.length > 0 
    ? recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length 
    : 0;
  const avgQuality = recentSleep.length > 0 
    ? recentSleep.reduce((sum, s) => sum + s.quality, 0) / recentSleep.length 
    : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="text-gradient">
          😴 Sleep Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowAddSleep(true)}
          sx={{ background: 'linear-gradient(45deg, #9c27b0 30%, #7b1fa2 90%)' }}
        >
          Log Sleep
        </Button>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Sleep Summary */}
        <Grid item xs={12} sm={6}>
          <Card className="glass-effect">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Bedtime sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Sleep Summary (7 days)</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {avgSleep.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Sleep Duration
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {avgQuality.toFixed(1)}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Quality Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sleep Quality Indicator */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>💤 Sleep Quality</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Duration Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(100, (avgSleep / 8) * 100)}
                  sx={{ mb: 2 }}
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quality Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={avgQuality * 10}
                  color="secondary"
                />
              </Box>
              {avgSleep < 7 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Consider getting more sleep for better recovery!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Sleep Log */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📋 Recent Sleep Log</Typography>
              {recentSleep.length > 0 ? (
                <List>
                  {recentSleep.reverse().map((entry) => (
                    <ListItem key={entry.id}>
                      <ListItemIcon>
                        <Bedtime color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${entry.duration.toFixed(1)} hours • Quality: ${entry.quality}/10`}
                        secondary={`${entry.bedTime} - ${entry.wakeTime} • ${new Date(entry.date).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Start tracking your sleep to get recovery insights!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Sleep Dialog */}
      <Dialog open={showAddSleep} onClose={() => setShowAddSleep(false)}>
        <DialogTitle>😴 Log Sleep</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Bed Time"
            type="time"
            fullWidth
            variant="outlined"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Wake Time"
            type="time"
            fullWidth
            variant="outlined"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Quality (1-10)"
            type="number"
            fullWidth
            variant="outlined"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            inputProps={{ min: 1, max: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSleep(false)}>Cancel</Button>
          <Button onClick={addSleep} variant="contained">Log Sleep</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Enhanced AI Assistant
function AIAssistant() {
  const { aiInsights, isAnalyzing, generateAIInsights, userProfile } = useAppStore();
  const [question, setQuestion] = useState('');

  const handleAskAI = () => {
    if (question.trim()) {
      // Simulate AI response
      setTimeout(() => {
        // This would connect to a real AI service
        setQuestion('');
      }, 1000);
    }
  };

  return (
    <Box>
      <Typography variant="h4" className="text-gradient" gutterBottom>
        🤖 AI Fitness Coach
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* AI Chat Interface */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>💬 Ask Your AI Coach</Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }, 
                mb: 3 
              }}>
                <TextField
                  fullWidth
                  placeholder="Ask about your workout, nutrition, or progress..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  size="small"
                />
                <Button 
                  variant="contained" 
                  onClick={handleAskAI}
                  disabled={!question.trim()}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ask AI
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🎯 Try asking: "How can I improve my bench press?" or "What should I eat post-workout?"
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Smart Insights</Typography>
                {isAnalyzing && <CircularProgress size={20} sx={{ ml: 1 }} />}
              </Box>
              
              <Button 
                variant="outlined" 
                onClick={generateAIInsights}
                disabled={isAnalyzing || !userProfile}
                fullWidth
                sx={{ mb: 2 }}
              >
                Generate New Insights
              </Button>
              
              {aiInsights.length > 0 ? (
                <List dense>
                  {aiInsights.slice(-3).map((insight) => (
                    <Paper key={insight.id} sx={{ p: 2, mb: 1, bgcolor: 'rgba(0, 230, 118, 0.05)' }}>
                      <Typography variant="subtitle2" color="primary.main">
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {insight.description}
                      </Typography>
                      <Typography variant="caption" color="secondary.main">
                        💡 {insight.recommendation}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={`${insight.confidence}% confidence`} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No insights yet. Complete some workouts to get AI recommendations!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Features Overview */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🧠 AI Features</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Science sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle2">Scientific Validation</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Evidence-based recommendations
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timeline sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="subtitle2">Predictive Analytics</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Forecast your progress
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Watch sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="subtitle2">Biometric Tracking</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Real-time health monitoring
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Psychology sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="subtitle2">Adaptive Learning</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Personalized optimization
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Profile Setup Component
function ProfileSetup() {
  const { setUserProfile } = useAppStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetPhysique, setTargetPhysique] = useState('');

  const createProfile = () => {
    if (name && age && height && weight && targetPhysique) {
      const profile = {
        id: `user_${Date.now()}`,
        name,
        age: parseInt(age),
        height: parseInt(height),
        weight: parseInt(weight),
        bodyFatPercentage: 15, // Default estimate
        targetPhysique,
        activityLevel: 'Moderately Active' as const,
        createdAt: new Date(),
      };
      
      setUserProfile(profile);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" className="text-gradient" gutterBottom textAlign="center">
            🚀 Welcome to SciOptimal
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Let's set up your AI-powered fitness profile
          </Typography>
          
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Height (inches)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Weight (lbs)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Target Physique"
            placeholder="e.g., Lean and muscular, Athletic build, etc."
            value={targetPhysique}
            onChange={(e) => setTargetPhysique(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={createProfile}
            disabled={!name || !age || !height || !weight || !targetPhysique}
            sx={{ background: 'linear-gradient(45deg, #00e676 30%, #00c853 90%)' }}
          >
            🎯 Create My Profile
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

function App() {
  const { currentTab, setCurrentTab, userProfile } = useAppStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Show profile setup if no user profile
  if (!userProfile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProfileSetup />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <FitnessCenter sx={{ mr: { xs: 1, sm: 2 } }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            SciOptimal Fitness - AI-Powered Training
          </Typography>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            SciOptimal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
              <Person fontSize="small" />
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              {userProfile.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: { xs: 1, sm: 3 }, mb: 3, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, sm: 3 } }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 60, sm: 120 },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                padding: { xs: '8px 4px', sm: '12px 16px' }
              }
            }}
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<FitnessCenter />} label="Workouts" />
            <Tab icon={<Restaurant />} label="Nutrition" />
            <Tab icon={<TrendingUp />} label="Progress" />
            <Tab icon={<Bedtime />} label="Sleep" />
            <Tab icon={<Psychology />} label="AI Coach" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Dashboard />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <WorkoutTracker />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <NutritionTracker />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <ProgressTracker />
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <SleepTracker />
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
          <AIAssistant />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;