import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Paper,
  Alert,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Schedule,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  MonitorWeight,
  Height,
  Cake,
  TrendingUp,
  Bedtime,
  WbSunny
} from '@mui/icons-material';
import { useAppStore } from '../../store/useAppStore';
import { Equipment, ActivityLevel } from '../../types';

const UserProfileSetup: React.FC = () => {
  const { setUserProfile } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    bodyFatPercentage: '',
    targetPhysique: '',
    equipment: [] as Equipment[],
    activityLevel: 'moderately_active' as ActivityLevel,
    sleepSchedule: {
      wakeUpTime: '06:00',
      bedTime: '22:00',
      targetSleepHours: 8,
      sleepQuality: 7,
      sleepTracking: true,
      sleepNotes: ''
    }
  });

  const steps = [
    'Basic Info',
    'Body Metrics',
    'Goals & Equipment',
    'Activity & Sleep',
    'Review & Complete'
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    const profile = {
      id: `profile_${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      bodyFatPercentage: parseFloat(formData.bodyFatPercentage),
      targetPhysique: formData.targetPhysique,
      equipment: formData.equipment,
      activityLevel: formData.activityLevel,
      sleepSchedule: formData.sleepSchedule,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setUserProfile(profile);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '' && formData.age !== '';
      case 1:
        return formData.height !== '' && formData.weight !== '' && formData.bodyFatPercentage !== '';
      case 2:
        return formData.targetPhysique !== '' && formData.equipment.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Let's Get Started!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tell us about yourself to create your personalized fitness plan
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Cake sx={{ mr: 1, color: 'primary.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      value={formData.activityLevel}
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                      label="Activity Level"
                    >
                      <MenuItem value="sedentary">Sedentary (Office job, little exercise)</MenuItem>
                      <MenuItem value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</MenuItem>
                      <MenuItem value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</MenuItem>
                      <MenuItem value="very_active">Very Active (Hard exercise 6-7 days/week)</MenuItem>
                      <MenuItem value="extremely_active">Extremely Active (Very hard exercise, physical job)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'secondary.main' }}>
                  <MonitorWeight sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Body Metrics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  These help us calculate your precise nutrition and training needs
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (inches)"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="175"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Height sx={{ mr: 1, color: 'secondary.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="80"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <MonitorWeight sx={{ mr: 1, color: 'secondary.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Body Fat Percentage"
                    type="number"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                    placeholder="15"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <TrendingUp sx={{ mr: 1, color: 'secondary.main' }} />
                    }}
                    helperText="Estimate your body fat percentage (10-30%)"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                  <FitnessCenter sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Goals & Equipment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  What's your target physique and what equipment do you have access to?
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Target Physique</InputLabel>
                    <Select
                      value={formData.targetPhysique}
                      onChange={(e) => handleInputChange('targetPhysique', e.target.value)}
                      label="Target Physique"
                    >
                      <MenuItem value="NFL fullback">NFL Fullback Build</MenuItem>
                      <MenuItem value="lean athlete">Lean Athlete</MenuItem>
                      <MenuItem value="powerlifter">Powerlifter</MenuItem>
                      <MenuItem value="bodybuilder">Bodybuilder</MenuItem>
                      <MenuItem value="general fitness">General Fitness</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Available Equipment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select all equipment you have access to:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(['dumbbells', 'barbells', 'machines', 'cables', 'smith_machine', 'treadmill', 'bench', 'squat_rack'] as Equipment[]).map((equipment) => (
                      <Chip
                        key={equipment}
                        label={equipment.replace('_', ' ')}
                        onClick={() => {
                          const newEquipment = formData.equipment.includes(equipment)
                            ? formData.equipment.filter(e => e !== equipment)
                            : [...formData.equipment, equipment];
                          handleInputChange('equipment', newEquipment);
                        }}
                        color={formData.equipment.includes(equipment) ? 'primary' : 'default'}
                        variant={formData.equipment.includes(equipment) ? 'filled' : 'outlined'}
                        icon={formData.equipment.includes(equipment) ? <CheckCircle /> : undefined}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'info.main' }}>
                  <Schedule sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Activity & Sleep
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Help us optimize your recovery and daily routine
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Wake Up Time"
                    type="time"
                    value={formData.sleepSchedule.wakeUpTime}
                    onChange={(e) => handleInputChange('sleepSchedule.wakeUpTime', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <WbSunny sx={{ mr: 1, color: 'info.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bed Time"
                    type="time"
                    value={formData.sleepSchedule.bedTime}
                    onChange={(e) => handleInputChange('sleepSchedule.bedTime', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Bedtime sx={{ mr: 1, color: 'info.main' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target Sleep Hours"
                    type="number"
                    value={formData.sleepSchedule.targetSleepHours}
                    onChange={(e) => handleInputChange('sleepSchedule.targetSleepHours', parseInt(e.target.value))}
                    placeholder="8"
                    variant="outlined"
                    inputProps={{ min: 6, max: 12 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sleep Quality (1-10)"
                    type="number"
                    value={formData.sleepSchedule.sleepQuality}
                    onChange={(e) => handleInputChange('sleepSchedule.sleepQuality', parseInt(e.target.value))}
                    placeholder="7"
                    variant="outlined"
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sleep Notes (Optional)"
                    multiline
                    rows={3}
                    value={formData.sleepSchedule.sleepNotes}
                    onChange={(e) => handleInputChange('sleepSchedule.sleepNotes', e.target.value)}
                    placeholder="Any sleep issues, patterns, or preferences..."
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Review Your Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Everything looks great! Let's create your personalized fitness plan
                </Typography>
              </Box>
              
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.age} years</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Height</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.height} inches</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.weight} kg</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Body Fat</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.bodyFatPercentage}%</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Target Physique</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formData.targetPhysique}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Equipment</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {formData.equipment.map((eq) => (
                        <Chip key={eq} label={eq.replace('_', ' ')} color="primary" size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Next:</strong> We'll generate your personalized training program, nutrition plan, and cardio strategy based on your goals and equipment!
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            SciOptimal Profile Setup
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Let's create your personalized fitness journey
          </Typography>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(((activeStep + 1) / steps.length) * 100)}% Complete
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={((activeStep + 1) / steps.length) * 100} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      {renderStepContent(activeStep)}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          size="large"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
          size="large"
          disabled={!isStepValid(activeStep)}
          color={activeStep === steps.length - 1 ? 'success' : 'primary'}
        >
          {activeStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfileSetup;
