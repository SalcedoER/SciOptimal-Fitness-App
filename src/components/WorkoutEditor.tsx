import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Card,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  FitnessCenter,
  Timer
} from '@mui/icons-material';
import { useAppStore, WorkoutSession, Exercise, ExerciseSet } from '../store';

interface WorkoutEditorProps {
  open: boolean;
  onClose: () => void;
  workout?: WorkoutSession | null;
  isEditing?: boolean;
}

export default function WorkoutEditor({ open, onClose, workout, isEditing = false }: WorkoutEditorProps) {
  const { addWorkout, workoutHistory } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    notes: '',
    rpe: 7
  });
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  useEffect(() => {
    if (workout && isEditing) {
      setFormData({
        name: workout.name,
        date: new Date(workout.date).toISOString().split('T')[0],
        duration: workout.duration,
        notes: workout.notes || '',
        rpe: workout.rpe || 7
      });
      setExercises(workout.exercises);
    } else {
      // Reset form for new workout
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        notes: '',
        rpe: 7
      });
      setExercises([]);
    }
  }, [workout, isEditing, open]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddExercise = () => {
    setEditingExercise({
      name: '',
      sets: [],
      notes: ''
    });
    setShowExerciseForm(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowExerciseForm(true);
  };

  const handleDeleteExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      // Editing existing exercise
      setExercises(prev => prev.map((ex, index) => 
        ex === editingExercise ? exercise : ex
      ));
    } else {
      // Adding new exercise
      setExercises(prev => [...prev, exercise]);
    }
    setShowExerciseForm(false);
    setEditingExercise(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (exercises.length === 0) {
        setError('Please add at least one exercise');
        setLoading(false);
        return;
      }

      const newWorkout: WorkoutSession = {
        id: workout?.id || `workout_${Date.now()}`,
        date: new Date(formData.date),
        name: formData.name,
        duration: formData.duration,
        exercises: exercises,
        notes: formData.notes,
        rpe: formData.rpe
      };

      addWorkout(newWorkout);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save workout');
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#000000',
            border: '1px solid #333333',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff !important', borderBottom: '1px solid #333333' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FitnessCenter sx={{ mr: 1 }} />
            {isEditing ? 'Edit Workout' : 'Add New Workout'}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, background: '#000000 !important' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Info */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workout Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff !important',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333 !important'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange('date')}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff !important',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333 !important'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange('duration')}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Timer sx={{ mr: 1, color: '#ffffff' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff !important',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333 !important'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: '#ffffff !important' }}>RPE (1-10)</InputLabel>
                  <Select
                    value={formData.rpe}
                    onChange={(e) => setFormData(prev => ({ ...prev, rpe: e.target.value as number }))}
                    sx={{
                      color: '#ffffff !important',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333 !important'
                      }
                    }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(rpe => (
                      <MenuItem key={rpe} value={rpe} sx={{ color: '#000000 !important' }}>
                        {rpe} - {rpe <= 3 ? 'Very Easy' : rpe <= 5 ? 'Easy' : rpe <= 7 ? 'Moderate' : rpe <= 9 ? 'Hard' : 'Max Effort'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  variant="outlined"
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff !important',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333 !important'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important'
                    }
                  }}
                />
              </Grid>

              {/* Exercises Section */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#ffffff !important' }}>
                    Exercises ({exercises.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddExercise}
                    sx={{
                      background: '#ffffff !important',
                      color: '#000000 !important',
                      '&:hover': {
                        background: '#cccccc !important'
                      }
                    }}
                  >
                    Add Exercise
                  </Button>
                </Box>

                {exercises.length > 0 ? (
                  <List>
                    {exercises.map((exercise, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ 
                          background: '#111111',
                          borderRadius: '8px',
                          mb: 1,
                          border: '1px solid #333333'
                        }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ color: '#ffffff !important' }}>
                                  {exercise.name}
                                </Typography>
                                <Chip 
                                  label={`${exercise.sets.length} sets`} 
                                  size="small" 
                                  sx={{ 
                                    background: '#333333 !important',
                                    color: '#ffffff !important'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                {exercise.sets.map((set, setIndex) => (
                                  <Typography key={setIndex} variant="body2" sx={{ color: '#cccccc !important' }}>
                                    Set {setIndex + 1}: {set.reps} reps × {set.weight} lbs
                                    {set.rpe && ` (RPE: ${set.rpe})`}
                                  </Typography>
                                ))}
                                {exercise.notes && (
                                  <Typography variant="body2" sx={{ color: '#cccccc !important', fontStyle: 'italic' }}>
                                    Notes: {exercise.notes}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleEditExercise(exercise)}
                              sx={{ color: '#ffffff !important', mr: 1 }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteExercise(index)}
                              sx={{ color: '#ff4444 !important' }}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < exercises.length - 1 && <Divider sx={{ borderColor: '#333333' }} />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Card sx={{ 
                    background: '#111111',
                    border: '1px solid #333333',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="body1" sx={{ color: '#cccccc !important' }}>
                      No exercises added yet. Click "Add Exercise" to get started.
                    </Typography>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #333333' }}>
          <Button
            onClick={onClose}
            sx={{ color: '#ffffff !important' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || exercises.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              background: '#ffffff !important',
              color: '#000000 !important',
              '&:hover': {
                background: '#cccccc !important'
              }
            }}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Workout' : 'Save Workout'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exercise Form Dialog */}
      <ExerciseForm
        open={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
          setEditingExercise(null);
        }}
        exercise={editingExercise}
        onSave={handleSaveExercise}
      />
    </>
  );
}

// Exercise Form Component
interface ExerciseFormProps {
  open: boolean;
  onClose: () => void;
  exercise?: Exercise | null;
  onSave: (exercise: Exercise) => void;
}

function ExerciseForm({ open, onClose, exercise, onSave }: ExerciseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    notes: ''
  });
  const [sets, setSets] = useState<ExerciseSet[]>([]);

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        notes: exercise.notes || ''
      });
      setSets(exercise.sets);
    } else {
      setFormData({ name: '', notes: '' });
      setSets([{ reps: 0, weight: 0 }]);
    }
  }, [exercise, open]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const handleAddSet = () => {
    setSets(prev => [...prev, { reps: 0, weight: 0 }]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      setSets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    const exercise: Exercise = {
      name: formData.name,
      sets: sets.filter(set => set.reps > 0 && set.weight > 0),
      notes: formData.notes
    };
    
    onSave(exercise);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#000000',
          border: '1px solid #333333',
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{ color: '#ffffff !important' }}>
        {exercise ? 'Edit Exercise' : 'Add Exercise'}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Exercise Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff !important',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333333 !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff !important'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#ffffff !important', mb: 2 }}>
              Sets ({sets.length})
            </Typography>
            
            {sets.map((set, index) => (
              <Card key={index} sx={{ 
                background: '#111111',
                border: '1px solid #333333',
                mb: 2,
                p: 2
              }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="body2" sx={{ color: '#ffffff !important' }}>
                      Set {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Reps"
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#ffffff !important',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333333 !important'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#ffffff !important'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Weight (lbs)"
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#ffffff !important',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333333 !important'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#ffffff !important'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => handleRemoveSet(index)}
                      disabled={sets.length === 1}
                      sx={{ color: '#ff4444 !important' }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddSet}
              sx={{
                borderColor: '#333333 !important',
                color: '#ffffff !important',
                '&:hover': {
                  borderColor: '#555555 !important'
                }
              }}
            >
              Add Set
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={handleInputChange('notes')}
              variant="outlined"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff !important',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333333 !important'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff !important'
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #333333' }}>
        <Button
          onClick={onClose}
          sx={{ color: '#ffffff !important' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name.trim()}
          sx={{
            background: '#ffffff !important',
            color: '#000000 !important',
            '&:hover': {
              background: '#cccccc !important'
            }
          }}
        >
          Save Exercise
        </Button>
      </DialogActions>
    </Dialog>
  );
}
