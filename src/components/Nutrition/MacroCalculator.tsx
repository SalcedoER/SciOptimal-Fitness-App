import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider
} from '@mui/material';
import {
  Calculate,
  Restaurant,
  FitnessCenter,
  TrendingUp,
  Info
} from '@mui/icons-material';
import { useAppStore } from '../../store/useAppStore';
import { calculateBMR, calculateTDEE, calculateMacroTargets } from '../../utils/scientificCalculations';

interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calories: number;
}

const MacroCalculator: React.FC = () => {
  const { userProfile, currentPhase } = useAppStore();
  const [macroTargets, setMacroTargets] = useState<MacroTargets | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    activityMultiplier: 1.55,
    proteinMultiplier: 2.2,
    carbPercentage: 40,
    fatPercentage: 25,
    deficit: 0
  });

  useEffect(() => {
    if (userProfile) {
      calculateMacros();
    }
  }, [userProfile, customSettings]);

  const calculateMacros = () => {
    if (!userProfile) return;

    const bmr = calculateBMR(userProfile);
    const tdee = calculateTDEE(bmr, userProfile.activityLevel);
    const adjustedCalories = tdee + customSettings.deficit;
    
    const macros = calculateMacroTargets(
      userProfile.weight,
      userProfile.bodyFatPercentage,
      adjustedCalories,
      customSettings.proteinMultiplier,
      customSettings.carbPercentage,
      customSettings.fatPercentage
    );

    setMacroTargets({
      ...macros,
      calories: adjustedCalories
    });
  };

  const getActivityMultiplier = (activityLevel: string) => {
    switch (activityLevel) {
      case 'sedentary': return 1.2;
      case 'lightly_active': return 1.375;
      case 'moderately_active': return 1.55;
      case 'very_active': return 1.725;
      case 'extremely_active': return 1.9;
      default: return 1.55;
    }
  };

  const getProteinRecommendation = () => {
    if (!userProfile) return '2.2g per lb';
    
    const leanMass = userProfile.weight * (1 - userProfile.bodyFatPercentage / 100);
    const proteinPerLb = (macroTargets?.protein || 0) / userProfile.weight;
    
    if (proteinPerLb >= 2.2) return 'High protein (2.2g+ per lb)';
    if (proteinPerLb >= 1.6) return 'Moderate protein (1.6g per lb)';
    return 'Standard protein (1.2g per lb)';
  };

  const getCalorieStatus = () => {
    if (!macroTargets) return 'neutral';
    const bmr = userProfile ? calculateBMR(userProfile) : 0;
    const tdee = userProfile ? calculateTDEE(bmr, userProfile.activityLevel) : 0;
    
    if (macroTargets.calories < tdee - 500) return 'deficit';
    if (macroTargets.calories > tdee + 500) return 'surplus';
    return 'maintenance';
  };

  const getCalorieStatusLabel = () => {
    const status = getCalorieStatus();
    switch (status) {
      case 'deficit': return 'Calorie Deficit';
      case 'surplus': return 'Calorie Surplus';
      default: return 'Maintenance';
    }
  };

  if (!userProfile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Please complete your profile to see macro calculations
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calculate />
          Macro Calculator
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Info />}
          onClick={() => setShowCalculator(true)}
        >
          Customize
        </Button>
      </Box>

      {macroTargets && (
        <>
          {/* Macro Summary */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Daily Calories</Typography>
                  <Typography variant="h3" sx={{ color: getCalorieStatus() === 'deficit' ? 'success.main' : getCalorieStatus() === 'surplus' ? 'warning.main' : 'primary.main' }}>
                    {macroTargets.calories.toFixed(0)}
                  </Typography>
                  <Chip 
                    label={getCalorieStatusLabel()} 
                    color={getCalorieStatus() === 'deficit' ? 'success' : getCalorieStatus() === 'surplus' ? 'warning' : 'primary'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Protein</Typography>
                  <Typography variant="h3" color="primary.main">
                    {macroTargets.protein.toFixed(0)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getProteinRecommendation()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Carbs</Typography>
                  <Typography variant="h3" color="success.main">
                    {macroTargets.carbs.toFixed(0)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {((macroTargets.carbs * 4 / macroTargets.calories) * 100).toFixed(0)}% of calories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Fat</Typography>
                  <Typography variant="h3" color="warning.main">
                    {macroTargets.fat.toFixed(0)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {((macroTargets.fat * 9 / macroTargets.calories) * 100).toFixed(0)}% of calories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Macro Breakdown */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Macro Breakdown</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Protein ({macroTargets.protein.toFixed(0)}g)</Typography>
                    <Typography variant="body2">{((macroTargets.protein * 4 / macroTargets.calories) * 100).toFixed(0)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macroTargets.protein * 4 / macroTargets.calories) * 100} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Carbs ({macroTargets.carbs.toFixed(0)}g)</Typography>
                    <Typography variant="body2">{((macroTargets.carbs * 4 / macroTargets.calories) * 100).toFixed(0)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macroTargets.carbs * 4 / macroTargets.calories) * 100} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Fat ({macroTargets.fat.toFixed(0)}g)</Typography>
                    <Typography variant="body2">{((macroTargets.fat * 9 / macroTargets.calories) * 100).toFixed(0)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(macroTargets.fat * 9 / macroTargets.calories) * 100} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Fiber Target</Typography>
                  <Typography variant="h4" color="info.main">
                    {macroTargets.fiber.toFixed(0)}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recommended daily fiber intake
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Water Intake</Typography>
                  <Typography variant="h4" color="info.main">
                    {(userProfile.weight * 0.67).toFixed(0)}oz
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily water recommendation (0.67oz per lb)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Customize Dialog */}
      <Dialog open={showCalculator} onClose={() => setShowCalculator(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customize Macro Calculations</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Protein Multiplier (g per lb)</Typography>
              <Slider
                value={customSettings.proteinMultiplier}
                onChange={(_, value) => setCustomSettings({ ...customSettings, proteinMultiplier: value as number })}
                min={1.2}
                max={3.0}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {customSettings.proteinMultiplier}g per lb
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Carb Percentage</Typography>
              <Slider
                value={customSettings.carbPercentage}
                onChange={(_, value) => setCustomSettings({ ...customSettings, carbPercentage: value as number })}
                min={20}
                max={60}
                step={5}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {customSettings.carbPercentage}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Fat Percentage</Typography>
              <Slider
                value={customSettings.fatPercentage}
                onChange={(_, value) => setCustomSettings({ ...customSettings, fatPercentage: value as number })}
                min={15}
                max={40}
                step={5}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {customSettings.fatPercentage}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Calorie Adjustment</Typography>
              <Slider
                value={customSettings.deficit}
                onChange={(_, value) => setCustomSettings({ ...customSettings, deficit: value as number })}
                min={-1000}
                max={1000}
                step={100}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {customSettings.deficit > 0 ? '+' : ''}{customSettings.deficit} calories
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCalculator(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MacroCalculator;
