import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FitnessCenter,
  Schedule,
  TrendingUp,
  PlayArrow,
  CheckCircle,
  Timer,
  EmojiEvents,
  Info,
  Close
} from '@mui/icons-material';
import { useUserProfile, useCurrentPhase, useWorkoutHistory, useWorkoutDays } from '../../store/useAppStore';
import BodyDiagram from '../BodyDiagram/BodyDiagram';

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
      id={`training-tabpanel-${index}`}
      aria-labelledby={`training-tab-${index}`}
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

const TrainingPlan: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);

  const userProfile = useUserProfile();
  const currentPhase = useCurrentPhase();
  const workoutHistory = useWorkoutHistory();
  const workoutDays = useWorkoutDays();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const startWorkout = (day: any) => {
    setSelectedDay(day);
    setWorkoutDialogOpen(true);
  };

  const completeWorkout = (workout: any) => {
    setCurrentWorkout(workout);
    setWorkoutDialogOpen(false);
    // Here you would typically save the workout
  };

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: Record<string, string> = {
      chest: '#ff6b6b',
      back: '#4ecdc4',
      shoulders: '#45b7d1',
      arms: '#96ceb4',
      legs: '#feca57',
      core: '#ff9ff3',
      forearms: '#54a0ff'
    };
    return colors[muscleGroup] || '#9e9e9e';
  };

  const getWorkoutStatus = (day: any) => {
    const today = new Date().getDay();
    if (day.dayNumber === today) {
      return 'Today';
    } else if (day.dayNumber < today) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  };

  if (!currentPhase) {
    return (
      <Alert severity="info">
        No training phase is currently active. Please set up your training plan first.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Training Plan
      </Typography>

      {/* Phase Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                {currentPhase.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Focus: {currentPhase.focus === 'lean_recomp' ? 'Lean Recomp' : 
                       currentPhase.focus === 'muscle_gain' ? 'Muscle Gain' : 'Final Cut'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Timer />} 
                  label={`${currentPhase.duration} weeks`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<EmojiEvents />} 
                  label={`${currentPhase.trainingSplit.days.length} workouts/week`} 
                  color="secondary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<TrendingUp />} 
                  label={`Target: ${currentPhase.targetWeight}kg`} 
                  color="success" 
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {Math.floor((new Date().getTime() - new Date(currentPhase.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weeks Completed
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Body Coverage Analysis */}
      <BodyDiagram title="Overall Training Body Coverage" />

      {/* Tabs */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="training plan tabs">
              <Tab label="Weekly Schedule" />
              <Tab label="Exercise Library" />
              <Tab label="Phase Progress" />
              <Tab label="Workout History" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Weekly Schedule */}
            <Grid container spacing={2}>
              {currentPhase.trainingSplit.days.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: getWorkoutStatus(day) === 'Today' ? '2px solid' : '1px solid',
                      borderColor: getWorkoutStatus(day) === 'Today' ? 'primary.main' : 'divider'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Day {day.dayNumber}
                        </Typography>
                        <Chip 
                          label={getWorkoutStatus(day)}
                          color={getWorkoutStatus(day) === 'Today' ? 'primary' : 
                                 getWorkoutStatus(day) === 'Completed' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {day.muscleGroups.join(', ')}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Exercises: {day.exercises.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Accessories: {day.accessories.length}
                        </Typography>
                      </Box>
                      
                      {getWorkoutStatus(day) === 'Today' && (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrow />}
                          onClick={() => startWorkout(day)}
                        >
                          Start Workout
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Exercise Library */}
            <Typography variant="h6" gutterBottom>
              Exercise Database
            </Typography>
            <Grid container spacing={2}>
              {(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'forearms'] as any[]).map((muscleGroup) => (
                <Grid item xs={12} sm={6} md={4} key={muscleGroup}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: getMuscleGroupColor(muscleGroup),
                            mr: 2
                          }}
                        />
                        <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                          {muscleGroup}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {currentPhase.trainingSplit.days
                          .flatMap(day => day.exercises)
                          .filter(ex => ex.muscle_group.includes(muscleGroup)).length} exercises
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Phase Progress */}
            <Typography variant="h6" gutterBottom>
              Phase Progress
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Workout Completion
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((workoutHistory.length + workoutDays.length) / (currentPhase.duration * 4) * 100, 100)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2">
                        {workoutHistory.length + workoutDays.length} / {currentPhase.duration * 4}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Weekly Consistency
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {Math.round((workoutHistory.length + workoutDays.length) / Math.max(1, Math.floor((new Date().getTime() - new Date(currentPhase.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))) * 100) / 100}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      workouts per week average
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Workout History */}
            <Typography variant="h6" gutterBottom>
              Recent Workouts
            </Typography>
            {workoutHistory.length === 0 && workoutDays.length === 0 ? (
              <Alert severity="info">
                No workouts completed yet. Start your first workout to see your history here.
              </Alert>
            ) : (
              <List>
                {[...workoutHistory, ...workoutDays]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((workout, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <FitnessCenter color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(workout.date).toLocaleDateString()}
                        secondary={`${('exercises' in workout ? workout.exercises : []).length} exercises • ${workout.duration || 0} minutes`}
                      />
                      <Chip 
                        label="Completed" 
                        color="success" 
                        size="small" 
                        icon={<CheckCircle />}
                      />
                    </ListItem>
                  ))}
              </List>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Workout Dialog */}
      <Dialog 
        open={workoutDialogOpen} 
        onClose={() => setWorkoutDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedDay ? `Day ${selectedDay.dayNumber} Workout` : 'Workout'}
            </Typography>
            <IconButton onClick={() => setWorkoutDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDay && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Focus: {selectedDay.muscleGroups.join(', ')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedDay.exercises.length} main exercises • {selectedDay.accessories.length} accessories
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Main Exercises:
                </Typography>
                <List>
                  {selectedDay.exercises.map((exercise: any, index: number) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={exercise.name}
                        secondary={`${exercise.sets} sets × ${exercise.reps} reps • RPE ${exercise.rpe}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkoutDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => completeWorkout(selectedDay)}>
            Complete Workout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingPlan;
