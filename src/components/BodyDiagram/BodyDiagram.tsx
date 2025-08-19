import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info, FitnessCenter } from '@mui/icons-material';
import { useWorkoutHistory, useWorkoutDays, useCurrentPhase } from '../../store/useAppStore';
import { MuscleGroup, Exercise, CompletedExercise, WorkoutDay, WorkoutSession } from '../../types';

interface MuscleGroupData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  svgPath: string;
  position: { x: number; y: number };
}

const MUSCLE_GROUPS: Record<MuscleGroup, MuscleGroupData> = {
  chest: {
    name: 'Chest',
    count: 0,
    percentage: 0,
    color: '#ff6b6b',
    svgPath: 'M 50 20 Q 60 25 70 20 Q 80 25 90 20 L 90 35 Q 80 40 70 35 Q 60 40 50 35 Z',
    position: { x: 70, y: 27 }
  },
  back: {
    name: 'Back',
    count: 0,
    percentage: 0,
    color: '#4ecdc4',
    svgPath: 'M 30 20 Q 40 25 50 20 Q 60 25 70 20 L 70 35 Q 60 40 50 35 Q 40 40 30 35 Z',
    position: { x: 50, y: 27 }
  },
  shoulders: {
    name: 'Shoulders',
    count: 0,
    percentage: 0,
    color: '#45b7d1',
    svgPath: 'M 25 15 Q 35 20 45 15 Q 55 20 65 15 Q 75 20 85 15 L 85 25 Q 75 30 65 25 Q 55 30 45 25 Q 35 30 25 25 Z',
    position: { x: 55, y: 20 }
  },
  arms: {
    name: 'Arms',
    count: 0,
    percentage: 0,
    color: '#96ceb4',
    svgPath: 'M 20 30 L 20 50 Q 20 55 25 55 L 35 55 Q 40 55 40 50 L 40 30 Z M 70 30 L 70 50 Q 70 55 75 55 L 85 55 Q 90 55 90 50 L 90 30 Z',
    position: { x: 55, y: 42 }
  },
  legs: {
    name: 'Legs',
    count: 0,
    percentage: 0,
    color: '#feca57',
    svgPath: 'M 35 60 L 35 90 Q 35 95 40 95 L 60 95 Q 65 95 65 90 L 65 60 Z',
    position: { x: 50, y: 77 }
  },
  core: {
    name: 'Core',
    count: 0,
    percentage: 0,
    color: '#ff9ff3',
    svgPath: 'M 40 40 L 40 55 Q 40 60 45 60 L 55 60 Q 60 60 60 55 L 60 40 Z',
    position: { x: 50, y: 47 }
  },
  forearms: {
    name: 'Forearms',
    count: 0,
    percentage: 0,
    color: '#54a0ff',
    svgPath: 'M 15 45 L 15 55 Q 15 60 20 60 L 30 60 Q 35 60 35 55 L 35 45 Z M 75 45 L 75 55 Q 75 60 80 60 L 90 60 Q 95 60 95 55 L 95 45 Z',
    position: { x: 55, y: 52 }
  }
};

// Type guard functions
const isWorkoutDay = (workout: any): workout is WorkoutDay => {
  return 'day_label' in workout && 'day_volume_lb' in workout;
};

const isWorkoutSession = (workout: any): workout is WorkoutSession => {
  return 'trainingDay' in workout && 'rpe' in workout;
};

const BodyDiagram: React.FC<{ 
  workoutId?: string; 
  showWeekly?: boolean;
  title?: string;
}> = ({ workoutId, showWeekly = false, title }) => {
  const workoutHistory = useWorkoutHistory();
  const workoutDays = useWorkoutDays();
  const currentPhase = useCurrentPhase();

  const muscleGroupData = useMemo(() => {
    const data = { ...MUSCLE_GROUPS };
    
    if (workoutId) {
      // Single workout analysis
      const workout = [...workoutHistory, ...workoutDays].find(w => w.id === workoutId);
      if (workout) {
        if (isWorkoutDay(workout)) {
          // WorkoutDay format
          workout.exercises.forEach((exercise: Exercise) => {
            exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        } else if (isWorkoutSession(workout)) {
          // WorkoutSession format
          workout.exercises.forEach((completedExercise: CompletedExercise) => {
            completedExercise.exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        }
      }
    } else if (showWeekly) {
      // Weekly analysis
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weeklyWorkouts = [...workoutHistory, ...workoutDays].filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });
      
      weeklyWorkouts.forEach(workout => {
        if (isWorkoutDay(workout)) {
          // WorkoutDay format
          workout.exercises.forEach((exercise: Exercise) => {
            exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        } else if (isWorkoutSession(workout)) {
          // WorkoutSession format
          workout.exercises.forEach((completedExercise: CompletedExercise) => {
            completedExercise.exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        }
      });
    } else {
      // Overall analysis
      const allWorkouts = [...workoutHistory, ...workoutDays];
      allWorkouts.forEach(workout => {
        if (isWorkoutDay(workout)) {
          // WorkoutDay format
          workout.exercises.forEach((exercise: Exercise) => {
            exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        } else if (isWorkoutSession(workout)) {
          // WorkoutSession format
          workout.exercises.forEach((completedExercise: CompletedExercise) => {
            completedExercise.exercise.muscle_group.forEach(mg => {
              if (data[mg]) {
                data[mg].count++;
              }
            });
          });
        }
      });
    }
    
    // Calculate percentages
    const totalWorkouts = workoutId ? 1 : 
      showWeekly ? 
        [...workoutHistory, ...workoutDays].filter(w => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const workoutDate = new Date(w.date);
          return workoutDate >= weekStart && workoutDate <= weekEnd;
        }).length :
        [...workoutHistory, ...workoutDays].length;
    
    Object.values(data).forEach(mg => {
      mg.percentage = totalWorkouts > 0 ? (mg.count / totalWorkouts) * 100 : 0;
    });
    
    return data;
  }, [workoutHistory, workoutDays, workoutId, showWeekly]);

  const totalBodyCoverage = useMemo(() => {
    const workedGroups = Object.values(muscleGroupData).filter(mg => mg.count > 0).length;
    return (workedGroups / Object.keys(muscleGroupData).length) * 100;
  }, [muscleGroupData]);

  const getIntensityColor = (percentage: number) => {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    if (percentage >= 40) return '#ffc107';
    if (percentage >= 20) return '#ff5722';
    return '#9e9e9e';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title || (workoutId ? 'Workout Analysis' : showWeekly ? 'Weekly Body Coverage' : 'Overall Body Coverage')}
          </Typography>
          <Tooltip title="Shows muscle group coverage and workout distribution">
            <IconButton size="small" sx={{ ml: 1 }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Body Diagram */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
              <svg
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Body outline */}
                <path
                  d="M 50 10 Q 60 15 70 10 Q 80 15 90 10 L 90 25 Q 80 30 70 25 Q 60 30 50 25 Q 40 30 30 25 Q 20 30 10 25 L 10 10 Q 20 15 30 10 Q 40 15 50 10 Z M 35 25 L 35 90 Q 35 95 40 95 L 60 95 Q 65 95 65 90 L 65 25 Z"
                  fill="none"
                  stroke="#666"
                  strokeWidth="0.5"
                />
                
                {/* Muscle groups */}
                {Object.entries(muscleGroupData).map(([key, mg]) => (
                  <g key={key}>
                    <path
                      d={mg.svgPath}
                      fill={mg.count > 0 ? getIntensityColor(mg.percentage) : '#f0f0f0'}
                      opacity={mg.count > 0 ? 0.8 : 0.3}
                      stroke="#333"
                      strokeWidth="0.3"
                    />
                    {mg.count > 0 && (
                      <text
                        x={mg.position.x}
                        y={mg.position.y}
                        fontSize="3"
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                      >
                        {mg.count}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </Box>
          </Grid>

          {/* Muscle Group Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Body Coverage: {totalBodyCoverage.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={totalBodyCoverage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, #4caf50, #8bc34a)`
                  }
                }}
              />
            </Box>

            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {Object.entries(muscleGroupData).map(([key, mg]) => (
                <Box key={key} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {mg.name}
                    </Typography>
                    <Chip
                      label={`${mg.count} workout${mg.count !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{
                        backgroundColor: mg.count > 0 ? getIntensityColor(mg.percentage) : '#9e9e9e',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={mg.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: getIntensityColor(mg.percentage)
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {mg.percentage.toFixed(1)}% of workouts
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Recommendations */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Recommendations:
          </Typography>
          {totalBodyCoverage < 100 && (
            <Typography variant="body2" color="text.secondary">
              • Target 100% body coverage by including exercises for all muscle groups
              • Focus on underworked areas: {
                Object.entries(muscleGroupData)
                  .filter(([_, mg]) => mg.count === 0)
                  .map(([_, mg]) => mg.name)
                  .join(', ')
              }
            </Typography>
          )}
          {totalBodyCoverage >= 100 && (
            <Typography variant="body2" color="text.secondary">
              ✓ Excellent body coverage! Consider focusing on specific muscle groups for targeted development.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyDiagram;
