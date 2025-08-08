import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppStore } from '../../store/useAppStore';
import { UserProfile, Equipment, ActivityLevel } from '../../types';

const steps = ['Basic Info', 'Goals & Physique', 'Body Stats', 'Sleep Schedule'];

const equipmentOptions: { value: Equipment; label: string }[] = [
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'barbells', label: 'Barbells' },
  { value: 'machines', label: 'Machines' },
  { value: 'cables', label: 'Cables' },
  { value: 'smith_machine', label: 'Smith Machine' },
  { value: 'treadmill', label: 'Treadmill' },
  { value: 'bench', label: 'Bench' },
  { value: 'squat_rack', label: 'Squat Rack' },
];

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
];

const physiqueExamples = [
  'NFL fullback',
  'Lean athlete',
  'Bodybuilder',
  'Powerlifter',
  'CrossFit athlete',
  'Soccer player',
  'Basketball player',
  'Swimmer',
  'Runner',
  'Custom...'
];

const validationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  age: yup.number().required('Age is required').min(16, 'Must be at least 16').max(80, 'Must be under 80'),
  height: yup.number().required('Height is required').min(48, 'Height must be at least 4 feet').max(96, 'Height must be under 8 feet'),
  weight: yup.number().required('Weight is required').min(88, 'Weight must be at least 88 lbs').max(440, 'Weight must be under 440 lbs'),
  bodyFatPercentage: yup.number().required('Body fat % is required').min(5, 'Body fat must be at least 5%').max(40, 'Body fat must be under 40%'),

  targetPhysique: yup.string().required('Target physique is required'),
  equipment: yup.array().min(1, 'Select at least one piece of equipment').required('Equipment is required'),
  activityLevel: yup.string().required('Activity level is required'),
  sleepSchedule: yup.object({
    wakeUpTime: yup.string().required('Wake up time is required'),
    bedTime: yup.string().required('Bed time is required'),
    targetSleepHours: yup.number().required('Target sleep hours is required').min(6, 'Must be at least 6 hours').max(10, 'Must be under 10 hours'),
  }),
});

const UserProfileSetup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [customPhysique, setCustomPhysique] = useState('');
  const [loading, setLoadingState] = useState(false);
  const navigate = useNavigate();
  const { setUserProfile, setError } = useAppStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    getValues
  } = useForm<UserProfile>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      age: 25,
      height: 70, // 5'10" in inches
      weight: 176, // 176 lbs
      bodyFatPercentage: 15,

      targetPhysique: '',
      equipment: [],
      activityLevel: 'moderately_active',
      sleepSchedule: {
        wakeUpTime: '06:00',
        bedTime: '22:00',
        targetSleepHours: 8,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  const watchedValues = watch();

  const handleNext = async () => {
    // For now, just move to the next step
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof UserProfile)[] => {
    switch (step) {
      case 0:
        return ['name', 'age'];
      case 1:
        return ['targetPhysique', 'equipment', 'activityLevel'];
      case 2:
        return ['height', 'weight', 'bodyFatPercentage'];
      case 3:
        return ['sleepSchedule'] as any;
      default:
        return [];
    }
  };

  const onSubmit = async (data: UserProfile) => {
    try {
      setLoadingState(true);
      setError(null);
      
      const profile: UserProfile = {
        ...data,
        id: `user_${Date.now()}`,
        targetPhysique: data.targetPhysique === 'Custom...' ? customPhysique : data.targetPhysique,
        goalWeight: data.weight, // Set goal weight to current weight initially
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUserProfile(profile);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Age"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="targetPhysique"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.targetPhysique}>
                    <InputLabel>Target Physique</InputLabel>
                    <Select {...field} label="Target Physique">
                      {physiqueExamples.map((physique) => (
                        <MenuItem key={physique} value={physique}>
                          {physique}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.targetPhysique && (
                      <FormHelperText>{errors.targetPhysique.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            {watch('targetPhysique') === 'Custom...' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Physique Goal"
                  value={customPhysique}
                  onChange={(e) => setCustomPhysique(e.target.value)}
                  placeholder="e.g., NFL linebacker, Olympic sprinter, etc."
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.equipment}>
                    <InputLabel>Available Equipment</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Available Equipment" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(Array.isArray(selected) ? selected : []).map((value) => (
                            <Chip 
                              key={value} 
                              label={equipmentOptions.find(opt => opt.value === value)?.label} 
                              size="small" 
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {equipmentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.equipment && (
                      <FormHelperText>{errors.equipment.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="activityLevel"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.activityLevel}>
                    <InputLabel>Activity Level</InputLabel>
                    <Select {...field} label="Activity Level">
                      {activityLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          <Box>
                            <Typography variant="body1">{level.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {level.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.activityLevel && (
                      <FormHelperText>{errors.activityLevel.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Height (inches)"
                    placeholder="e.g., 70 for 5'10 inches"
                    error={!!errors.height}
                    helperText={errors.height?.message || "Enter height in inches (e.g., 70 for 5'10 inches)"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Current Weight (lbs)"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bodyFatPercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Body Fat %"
                    error={!!errors.bodyFatPercentage}
                    helperText={errors.bodyFatPercentage?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sleepSchedule.wakeUpTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="time"
                    label="Wake Up Time"
                    error={!!errors.sleepSchedule?.wakeUpTime}
                    helperText={errors.sleepSchedule?.wakeUpTime?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sleepSchedule.bedTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="time"
                    label="Bed Time"
                    error={!!errors.sleepSchedule?.bedTime}
                    helperText={errors.sleepSchedule?.bedTime?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sleepSchedule.targetSleepHours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Target Sleep Hours"
                    error={!!errors.sleepSchedule?.targetSleepHours}
                    helperText={errors.sleepSchedule?.targetSleepHours?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sleepSchedule.sleepTracking"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Sleep Quality Tracking</InputLabel>
                    <Select {...field} label="Sleep Quality Tracking">
                      <MenuItem value="true">Enable Sleep Tracking</MenuItem>
                      <MenuItem value="false">Disable Sleep Tracking</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                💡 Sleep tracking will help you monitor sleep quality, stress levels, and optimize recovery for better performance.
              </Typography>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      }}
    >
      <Card sx={{ 
        maxWidth: 800, 
        width: '100%',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 16px 64px rgba(0,0,0,0.4)'
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to Phase Fitness
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Let's create your personalized training program
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isValid || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                      color: '#000000',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.3)',
                        color: 'rgba(0,0,0,0.5)',
                      },
                    }}
                  >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={false}
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                      color: '#000000',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.3)',
                        color: 'rgba(0,0,0,0.5)',
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfileSetup;
