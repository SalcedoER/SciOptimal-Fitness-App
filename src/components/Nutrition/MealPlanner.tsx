import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Divider,
  Autocomplete
} from '@mui/material';
import {
  Restaurant,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useUserProfile, useCurrentPhase } from '../../store/useAppStore';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  notes?: string;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  quantity: number;
}

const commonFoods: FoodItem[] = [
  { id: '1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g', quantity: 1 },
  { id: '2', name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, servingSize: '100g', quantity: 1 },
  { id: '3', name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, servingSize: '100g', quantity: 1 },
  { id: '4', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, servingSize: '2 large eggs', quantity: 1 },
  { id: '5', name: 'Oatmeal', calories: 307, protein: 13, carbs: 55, fat: 5, fiber: 8, servingSize: '100g', quantity: 1 },
  { id: '6', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, servingSize: '1 medium', quantity: 1 },
  { id: '7', name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, servingSize: '100g', quantity: 1 },
  { id: '8', name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, servingSize: '100g', quantity: 1 },
  { id: '9', name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, servingSize: '100g', quantity: 1 },
  { id: '10', name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, servingSize: '100g', quantity: 1 },
];

const MealPlanner: React.FC = () => {
  const userProfile = useUserProfile();
  const currentPhase = useCurrentPhase();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Partial<Meal>>({
    name: '',
    type: 'breakfast',
    foods: [],
    totalCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  });
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  const calculateMealTotals = (foods: FoodItem[]) => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + (food.calories * food.quantity),
      protein: totals.protein + (food.protein * food.quantity),
      carbs: totals.carbs + (food.carbs * food.quantity),
      fat: totals.fat + (food.fat * food.quantity),
      fiber: totals.fiber + (food.fiber * food.quantity)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const addFoodToMeal = () => {
    if (selectedFood) {
      const foodWithQuantity = {
        ...selectedFood,
        quantity: foodQuantity
      };
      
      const updatedFoods = [...(currentMeal.foods || []), foodWithQuantity];
      const totals = calculateMealTotals(updatedFoods);
      
      setCurrentMeal({
        ...currentMeal,
        foods: updatedFoods,
        totalCalories: totals.calories,
        macros: totals
      });
      
      setSelectedFood(null);
      setFoodQuantity(1);
    }
  };

  const removeFoodFromMeal = (foodId: string) => {
    const updatedFoods = currentMeal.foods?.filter(food => food.id !== foodId) || [];
    const totals = calculateMealTotals(updatedFoods);
    
    setCurrentMeal({
      ...currentMeal,
      foods: updatedFoods,
      totalCalories: totals.calories,
      macros: totals
    });
  };

  const saveMeal = () => {
    if (currentMeal.name && currentMeal.foods && currentMeal.foods.length > 0) {
      const newMeal: Meal = {
        id: `meal_${Date.now()}`,
        name: currentMeal.name,
        type: currentMeal.type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        foods: currentMeal.foods,
        totalCalories: currentMeal.totalCalories || 0,
        macros: currentMeal.macros || { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        notes: currentMeal.notes
      };

      setMeals([...meals, newMeal]);
      setShowAddMeal(false);
      setCurrentMeal({
        name: '',
        type: 'breakfast',
        foods: [],
        totalCalories: 0,
        macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
      });
    }
  };

  const getDailyTotals = () => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.totalCalories,
      protein: totals.protein + meal.macros.protein,
      carbs: totals.carbs + meal.macros.carbs,
      fat: totals.fat + meal.macros.fat,
      fiber: totals.fiber + meal.macros.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const dailyTotals = getDailyTotals();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Restaurant />
        Meal Planner
      </Typography>

      {/* Daily Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Daily Nutrition Summary</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="primary.main">
                {dailyTotals.calories.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Calories</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="success.main">
                {dailyTotals.protein.toFixed(0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Protein</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="warning.main">
                {dailyTotals.carbs.toFixed(0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Carbs</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="info.main">
                {dailyTotals.fat.toFixed(0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Fat</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Add Meal Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddMeal(true)}
        >
          Add Meal
        </Button>
      </Box>

      {/* Meals List */}
      <Grid container spacing={2}>
        {meals.map((meal) => (
          <Grid item xs={12} key={meal.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">
                      {meal.name}
                    </Typography>
                    <Chip 
                      label={meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    {meal.totalCalories.toFixed(0)} cal
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">Protein</Typography>
                    <Typography variant="body1">{meal.macros.protein.toFixed(0)}g</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">Carbs</Typography>
                    <Typography variant="body1">{meal.macros.carbs.toFixed(0)}g</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">Fat</Typography>
                    <Typography variant="body1">{meal.macros.fat.toFixed(0)}g</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">Fiber</Typography>
                    <Typography variant="body1">{meal.macros.fiber.toFixed(0)}g</Typography>
                  </Grid>
                </Grid>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Foods:
                </Typography>
                <List dense>
                  {meal.foods.map((food) => (
                    <ListItem key={food.id} sx={{ py: 0 }}>
                      <ListItemText
                        primary={`${food.name} (${food.quantity}x ${food.servingSize})`}
                        secondary={`${(food.calories * food.quantity).toFixed(0)} cal`}
                      />
                    </ListItem>
                  ))}
                </List>

                {meal.notes && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {meal.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Meal Dialog */}
      <Dialog open={showAddMeal} onClose={() => setShowAddMeal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meal Name"
                value={currentMeal.name}
                onChange={(e) => setCurrentMeal({ ...currentMeal, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={currentMeal.type}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, type: e.target.value as any })}
                  label="Meal Type"
                >
                  {mealTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Add Foods</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={commonFoods}
                getOptionLabel={(option) => option.name}
                value={selectedFood}
                onChange={(_, newValue) => setSelectedFood(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Foods"
                    placeholder="Start typing to search..."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={foodQuantity}
                onChange={(e) => setFoodQuantity(Number(e.target.value))}
                inputProps={{ min: 0.1, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={addFoodToMeal}
                disabled={!selectedFood}
                sx={{ height: 56 }}
              >
                Add Food
              </Button>
            </Grid>

            {currentMeal.foods && currentMeal.foods.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Added Foods</Typography>
                <List dense>
                  {currentMeal.foods.map((food) => (
                    <ListItem key={food.id}>
                      <ListItemText
                        primary={`${food.name} (${food.quantity}x ${food.servingSize})`}
                        secondary={`${(food.calories * food.quantity).toFixed(0)} cal`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeFoodFromMeal(food.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={currentMeal.notes || ''}
                onChange={(e) => setCurrentMeal({ ...currentMeal, notes: e.target.value })}
                placeholder="Any notes about this meal..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMeal(false)}>Cancel</Button>
          <Button 
            onClick={saveMeal} 
            variant="contained"
            disabled={!currentMeal.name || !currentMeal.foods || currentMeal.foods.length === 0}
          >
            Save Meal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlanner;
