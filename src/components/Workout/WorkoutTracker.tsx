import React, { useState, useEffect } from 'react';
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
  IconButton,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  FitnessCenter,
  Timer,
  TrendingUp,
  PlayArrow,
  Pause,
  Stop,
  Add,
  CheckCircle,
  Schedule,
  LocalFireDepartment
} from '@mui/icons-material';
import { useCurrentPhase, useTodayWorkout, useAddWorkoutSession } from '../../store/useAppStore';
import { Exercise, CompletedExercise, CompletedSet, WorkoutSession } from '../../types';

interface WorkoutTimerProps {
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ duration, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => setTimeLeft(duration);

  return (
    <Card sx={{ mb: 2, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Rest Timer
        </Typography>
        <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          {formatTime(timeLeft)}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={((duration - timeLeft) / duration) * 100}
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={isRunning ? <Pause /> : <PlayArrow />}
            onClick={toggleTimer}
            size="small"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="outlined"
            onClick={resetTimer}
            size="small"
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            size="small"
          >
            Skip
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

interface ExerciseLogProps {
  exercise: Exercise;
  onComplete: (sets: CompletedSet[]) => void;
  onSkip: () => void;
}

const ExerciseLog: React.FC<ExerciseLogProps> = ({ exercise, onComplete, onSkip }) => {
  const [sets, setSets] = useState<CompletedSet[]>([]);
  const [currentSet, setCurrentSet] = useState<CompletedSet>({
    setNumber: 1,
    weight: 0,
    reps: 0,
    rpe: 7,
    restTime: 0
  });

  const addSet = () => {
    const weight = currentSet.weight || 0;
    const reps = currentSet.reps || 0;
    if (weight > 0 && reps > 0) {
      setSets([...sets, { ...currentSet, setNumber: sets.length + 1, weight, reps }]);
      setCurrentSet({
        setNumber: sets.length + 2,
        weight,
        reps,
        rpe: 7,
        restTime: 0
      });
    }
  };

  const completeExercise = () => {
    if (sets.length > 0) {
      onComplete(sets);
    }
  };

  return (
    <Card sx={{ mb: 2, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {exercise.sets} sets × {exercise.reps} reps • RPE {exercise.rpe}
        </Typography>

        {/* Completed Sets */}
        {sets.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Completed Sets:</Typography>
            <List dense>
              {sets.map((set, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Set ${set.setNumber}: ${set.weight}lbs × ${set.reps} reps (RPE ${set.rpe})`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Current Set Input */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
                          <TextField
                fullWidth
                label="Weight (lbs)"
                type="number"
                value={currentSet.weight}
                onChange={(e) => {
                  const weight = Math.max(0, Math.min(2000, Number(e.target.value) || 0));
                  setCurrentSet({ ...currentSet, weight });
                }}
                inputProps={{ min: 0, max: 2000, step: 0.5 }}
                size="small"
              />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Reps"
              type="number"
              value={currentSet.reps}
              onChange={(e) => {
                const reps = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                setCurrentSet({ ...currentSet, reps });
              }}
              inputProps={{ min: 0, max: 100, step: 1 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>RPE</InputLabel>
              <Select
                value={currentSet.rpe}
                onChange={(e) => setCurrentSet({ ...currentSet, rpe: Number(e.target.value) })}
                label="RPE"
              >
                {[6, 7, 8, 9, 10].map((rpe) => (
                  <MenuItem key={rpe} value={rpe}>
                    RPE {rpe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={addSet}
            disabled={(currentSet.weight || 0) === 0 || (currentSet.reps || 0) === 0}
            startIcon={<Add />}
          >
            Add Set
          </Button>
          <Button
            variant="outlined"
            onClick={completeExercise}
            disabled={sets.length === 0}
          >
            Complete Exercise
          </Button>
          <Button
            variant="outlined"
            onClick={onSkip}
            color="secondary"
          >
            Skip
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const WorkoutTracker: React.FC = () => {
  const currentPhase = useCurrentPhase();
  const todayWorkout = useTodayWorkout();
  const addWorkoutSession = useAddWorkoutSession();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState<Partial<WorkoutSession>>({
    exercises: [],
    duration: 0,
    rpe: 7,
    notes: ''
  });

  // Get today's scheduled workout from training plan
  const todayScheduledWorkout = currentPhase?.trainingSplit.days.find(
    day => day.dayNumber === new Date().getDay()
  );

  const isWorkoutDay = currentPhase?.trainingSplit.restDays.indexOf(new Date().getDay()) === -1;

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(new Date());
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
  };

  const completeExercise = (sets: CompletedSet[]) => {
    if (!todayScheduledWorkout) return;

    const exercise = todayScheduledWorkout.exercises[currentExerciseIndex] || 
                    todayScheduledWorkout.accessories[currentExerciseIndex - todayScheduledWorkout.exercises.length] ||
                    todayScheduledWorkout.abs[currentExerciseIndex - todayScheduledWorkout.exercises.length - todayScheduledWorkout.accessories.length];

    if (exercise) {
      const completedExercise: CompletedExercise = {
        exercise,
        sets,
        notes: ''
      };

      setCompletedExercises([...completedExercises, completedExercise]);
      
      if (currentExerciseIndex < getTotalExercises() - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        // setShowTimer(true); // This line was removed as per the new_code
        // setRestDuration(exercise.restTime); // This line was removed as per the new_code
      } else {
        finishWorkout();
      }
    }
  };

  const skipExercise = () => {
    if (currentExerciseIndex < getTotalExercises() - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    if (workoutStartTime) {
      const duration = Math.round((new Date().getTime() - workoutStartTime.getTime()) / 60000);
      const workoutSession: WorkoutSession = {
        id: `workout_${Date.now()}`,
        date: new Date(),
        trainingDay: todayScheduledWorkout!,
        exercises: completedExercises,
        duration,
        notes: '',
        rpe: Math.round(completedExercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + set.rpe, 0), 0) / completedExercises.reduce((sum, ex) => sum + ex.sets.length, 0))
      };
      
      addWorkoutSession(workoutSession);
    }
    
    setIsWorkoutActive(false);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setWorkoutStartTime(null);
  };

  const getTotalExercises = () => {
    if (!todayScheduledWorkout) return 0;
    return todayScheduledWorkout.exercises.length + todayScheduledWorkout.accessories.length + todayScheduledWorkout.abs.length;
  };

  const getCurrentExercise = () => {
    if (!todayScheduledWorkout) return null;
    
    if (currentExerciseIndex < todayScheduledWorkout.exercises.length) {
      return todayScheduledWorkout.exercises[currentExerciseIndex];
    } else if (currentExerciseIndex < todayScheduledWorkout.exercises.length + todayScheduledWorkout.accessories.length) {
      return todayScheduledWorkout.accessories[currentExerciseIndex - todayScheduledWorkout.exercises.length];
    } else {
      return todayScheduledWorkout.abs[currentExerciseIndex - todayScheduledWorkout.exercises.length - todayScheduledWorkout.accessories.length];
    }
  };

  if (!currentPhase) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Workout Tracker
        </Typography>
        <Alert severity="info">
          No training phase found. Please set up your profile first.
        </Alert>
      </Box>
    );
  }

  if (!isWorkoutDay) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Workout Tracker
        </Typography>
        <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Rest Day
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Today is a rest day. Focus on recovery, nutrition, and preparation for tomorrow's workout.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (todayWorkout) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Workout Tracker
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          Great job! You completed today's workout.
        </Alert>
        <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Workout Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Duration: {todayWorkout.duration} minutes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Average RPE: {todayWorkout.rpe}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Exercises completed: {todayWorkout.exercises.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Workout Tracker
      </Typography>

      {/* Today's Scheduled Workout */}
      {todayScheduledWorkout && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              🎯 Today's Training Plan
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Muscle Groups: {todayScheduledWorkout.muscleGroups.map(group => 
                  group.charAt(0).toUpperCase() + group.slice(1)
                ).join(', ')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom>
                    Compound Exercises ({todayScheduledWorkout.exercises.length})
                  </Typography>
                  <List dense>
                    {todayScheduledWorkout.exercises.map((exercise, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <FitnessCenter sx={{ fontSize: 16, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={exercise.name}
                          secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="success.main" gutterBottom>
                    Accessories ({todayScheduledWorkout.accessories.length})
                  </Typography>
                  <List dense>
                    {todayScheduledWorkout.accessories.map((exercise, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <FitnessCenter sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={exercise.name}
                          secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="warning.main" gutterBottom>
                    Core Work ({todayScheduledWorkout.abs.length})
                  </Typography>
                  <List dense>
                    {todayScheduledWorkout.abs.map((exercise, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <FitnessCenter sx={{ fontSize: 16, color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={exercise.name}
                          secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
            
            {!isWorkoutActive && (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={startWorkout}
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                  }
                }}
              >
                Start Today's Workout
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!isWorkoutActive ? (
        <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Today's Workout: {todayScheduledWorkout?.muscleGroups.join(', ')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {getTotalExercises()} exercises • Estimated duration: 60-90 minutes
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Exercises:</Typography>
              <List dense>
                {todayScheduledWorkout?.exercises.map((exercise, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <FitnessCenter fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                    />
                  </ListItem>
                ))}
                {todayScheduledWorkout?.accessories.map((exercise, index) => (
                  <ListItem key={`acc-${index}`} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <TrendingUp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={startWorkout}
              startIcon={<PlayArrow />}
              fullWidth
            >
              Start Workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {/* Workout Progress */}
          <Card sx={{ mb: 2, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Progress: {currentExerciseIndex + 1} / {getTotalExercises()}
                </Typography>
                <Chip 
                  label={`${Math.round(((currentExerciseIndex + 1) / getTotalExercises()) * 100)}%`}
                  color="primary"
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={((currentExerciseIndex + 1) / getTotalExercises()) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>

          {/* Rest Timer */}
          {/* showTimer && ( // This line was removed as per the new_code
            <WorkoutTimer
              duration={restDuration} // This line was removed as per the new_code
              onComplete={() => setShowTimer(false)} // This line was removed as per the new_code
              onCancel={() => setShowTimer(false)} // This line was removed as per the new_code
            />
          ) */}

          {/* Current Exercise */}
          {getCurrentExercise() && (
            <ExerciseLog
              exercise={getCurrentExercise()!}
              onComplete={completeExercise}
              onSkip={skipExercise}
            />
          )}

          {/* Workout Controls */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={finishWorkout}
              startIcon={<Stop />}
              fullWidth
            >
              End Workout
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WorkoutTracker;
