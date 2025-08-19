import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
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
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Restaurant,
  Add,
  TrendingUp,
  CheckCircle,
  LocalFireDepartment,
  WaterDrop,
  Calculate,
  Schedule
} from '@mui/icons-material';
import { useCurrentPhase, useTodayNutrition, useMacroTotals, useTargetMacros, useMacroCompliance, useAppStore } from '../../store/useAppStore';
import { NutritionEntry, FoodItem, MacroTargets } from '../../types';
import MacroCalculator from './MacroCalculator';
import MealPlanner from './MealPlanner';

interface MealDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: NutritionEntry) => void;
  mealType: string;
}

const MealDialog: React.FC<MealDialogProps> = ({ open, onClose, onSave, mealType }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [currentFood, setCurrentFood] = useState<FoodItem>({
    name: '',
    kcal: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0
  });

  const addFood = () => {
    if (currentFood.name && currentFood.kcal > 0) {
      setFoods([...foods, { ...currentFood }]);
      setCurrentFood({
        name: '',
        kcal: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0
      });
    }
  };

  const removeFood = (index: number) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const saveMeal = () => {
    if (foods.length > 0) {
      const totalCalories = foods.reduce((sum, food) => sum + food.kcal, 0);
      const totalMacros: MacroTargets = {
        protein_g: foods.reduce((sum, food) => sum + food.protein_g, 0),
        carbs_g: foods.reduce((sum, food) => sum + food.carbs_g, 0),
        fat_g: foods.reduce((sum, food) => sum + food.fat_g, 0),
        fiber_g: foods.reduce((sum, food) => sum + (food.fiber_g || 0), 0)
      };

      const entry: NutritionEntry = {
        id: `nutrition_${Date.now()}`,
        date: new Date(),
        meal: mealType,
        foods,
        totalCalories,
        macros: totalMacros,
        notes: ''
      };

      onSave(entry);
      setFoods([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Log {mealType}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Food Name"
              value={currentFood.name}
              onChange={(e) => setCurrentFood({ ...currentFood, name: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={currentFood.kcal}
              onChange={(e) => setCurrentFood({ ...currentFood, kcal: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={currentFood.protein_g}
              onChange={(e) => setCurrentFood({ ...currentFood, protein_g: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={currentFood.carbs_g}
              onChange={(e) => setCurrentFood({ ...currentFood, carbs_g: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              value={currentFood.fat_g}
              onChange={(e) => setCurrentFood({ ...currentFood, fat_g: Number(e.target.value) })}
              size="small"
            />
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          onClick={addFood}
          disabled={!currentFood.name || currentFood.kcal === 0}
          startIcon={<Add />}
          sx={{ mb: 2 }}
        >
          Add Food
        </Button>

        {foods.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Added Foods:</Typography>
            <List dense>
              {foods.map((food, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={food.name}
                    secondary={`${food.kcal} cal • P: ${food.protein_g}g • C: ${food.carbs_g}g • F: ${food.fat_g}g`}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeFood(index)}
                    color="error"
                  >
                    ×
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveMeal} variant="contained" disabled={foods.length === 0}>
          Save Meal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NutritionTracker: React.FC = () => {
  const currentPhase = useCurrentPhase();
  const todayNutrition = useTodayNutrition();
  const macroTotals = useMacroTotals();
  const targetMacros = useTargetMacros();
  const macroCompliance = useMacroCompliance();
  const { addNutritionEntry } = useAppStore();

  const [showMealDialog, setShowMealDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'];

  const openMealDialog = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowMealDialog(true);
  };

  const handleSaveMeal = (entry: NutritionEntry) => {
    addNutritionEntry(entry);
  };

  const getMacroProgressColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'success';
    if (percentage >= 80 && percentage <= 120) return 'warning';
    return 'error';
  };

  const getCalorieProgress = () => {
    if (!targetMacros) return 0;
    const targetCalories = targetMacros.protein_g * 4 + targetMacros.carbs_g * 4 + targetMacros.fat_g * 9;
    return Math.min((macroTotals.calories / targetCalories) * 100, 100);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Restaurant />
        Nutrition Center
      </Typography>

      {!currentPhase && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No training phase found. Please set up your profile first.
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="nutrition tabs">
          <Tab label="Daily Tracking" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Macro Calculator" icon={<Calculate />} iconPosition="start" />
          <Tab label="Meal Planner" icon={<Schedule />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Daily Summary */}
          <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Today's Nutrition
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalFireDepartment color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {macroTotals.calories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      / {targetMacros ? Math.round(targetMacros.protein_g * 4 + targetMacros.carbs_g * 4 + targetMacros.fat_g * 9) : 0} cal
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCalorieProgress()}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WaterDrop color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {Math.round(macroTotals.fiber_g)}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      fiber
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={targetMacros ? Math.min((macroTotals.fiber_g / targetMacros.fiber_g) * 100, 100) : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

      {/* Macro Breakdown */}
      {targetMacros && macroCompliance && (
        <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Macro Breakdown
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Protein</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {macroTotals.protein_g}g / {targetMacros.protein_g}g
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
                    {macroTotals.carbs_g}g / {targetMacros.carbs_g}g
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
                    {macroTotals.fat_g}g / {targetMacros.fat_g}g
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
                    {macroTotals.fiber_g}g / {targetMacros.fiber_g}g
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
          </CardContent>
        </Card>
      )}

          {/* Today's Meals */}
          <Card sx={{ mb: 3, background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Today's Meals
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openMealDialog('Meal')}
                >
                  Add Meal
                </Button>
              </Box>
              
              {todayNutrition.length > 0 ? (
                <List>
                  {todayNutrition.map((entry, index) => (
                    <React.Fragment key={entry.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={entry.meal}
                          secondary={`${entry.totalCalories} calories • P: ${entry.macros.protein_g}g • C: ${entry.macros.carbs_g}g • F: ${entry.macros.fat_g}g`}
                        />
                        <Chip label={entry.foods.length} size="small" />
                      </ListItem>
                      {index < todayNutrition.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  No meals logged today. Start by adding your first meal!
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Quick Add Buttons */}
          <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Quick Add
              </Typography>
              <Grid container spacing={1}>
                {mealTypes.map((mealType) => (
                  <Grid item xs={6} sm={4} key={mealType}>
                    <Button
                      variant="outlined"
                      onClick={() => openMealDialog(mealType)}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      {mealType}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Meal Dialog */}
          <MealDialog
            open={showMealDialog}
            onClose={() => setShowMealDialog(false)}
            onSave={handleSaveMeal}
            mealType={selectedMealType}
          />
        </>
      )}

      {activeTab === 1 && (
        <MacroCalculator />
      )}

      {activeTab === 2 && (
        <MealPlanner />
      )}
    </Box>
  );
};

export default NutritionTracker;
