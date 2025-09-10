import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  CameraAlt,
  Close,
  Check,
  Edit,
  Add,
  Remove,
  Restaurant
} from '@mui/icons-material';
import { useAppStore } from '../store';

interface DetectedFood {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  quantity: number;
}

interface SmartFoodScannerProps {
  open: boolean;
  onClose: () => void;
  onFoodDetected: (foods: DetectedFood[]) => void;
}

export default function SmartFoodScanner({ open, onClose, onFoodDetected }: SmartFoodScannerProps) {
  const { addNutritionEntry } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock food database for demonstration
  const foodDatabase: { [key: string]: Omit<DetectedFood, 'confidence' | 'quantity'> } = {
    'chicken breast': { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
    'rice': { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g' },
    'broccoli': { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '100g' },
    'salmon': { name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, serving: '100g' },
    'sweet potato': { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: '100g' },
    'avocado': { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '100g' },
    'eggs': { name: 'Eggs', calories: 140, protein: 12, carbs: 1.2, fat: 10, serving: '2 large' },
    'oatmeal': { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '100g' },
    'banana': { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
    'greek yogurt': { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0, serving: '100g' }
  };

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to scan food.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simulate AI processing
    setIsProcessing(true);
    setTimeout(() => {
      simulateFoodDetection();
      setIsProcessing(false);
    }, 2000);
  }, []);

  const simulateFoodDetection = () => {
    // Simulate AI food detection with realistic results
    const detectedItems = [
      { name: 'chicken breast', confidence: 0.92 },
      { name: 'rice', confidence: 0.88 },
      { name: 'broccoli', confidence: 0.85 }
    ];

    const foods: DetectedFood[] = detectedItems.map(item => ({
      ...foodDatabase[item.name],
      confidence: item.confidence,
      quantity: 1
    }));

    setDetectedFoods(foods);
    stopCamera();
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 0.1) return;
    
    const updatedFoods = [...detectedFoods];
    updatedFoods[index].quantity = newQuantity;
    setDetectedFoods(updatedFoods);
  };

  const removeFood = (index: number) => {
    const updatedFoods = detectedFoods.filter((_, i) => i !== index);
    setDetectedFoods(updatedFoods);
  };

  const addFood = () => {
    const newFood: DetectedFood = {
      name: 'Custom Food',
      confidence: 1.0,
      calories: 100,
      protein: 10,
      carbs: 15,
      fat: 3,
      serving: '1 serving',
      quantity: 1
    };
    setDetectedFoods([...detectedFoods, newFood]);
  };

  const saveFoods = () => {
    detectedFoods.forEach(food => {
      const nutritionEntry = {
        id: `food_${Date.now()}_${Math.random()}`,
        date: new Date(),
        food: `${food.name} (${food.quantity} ${food.serving})`,
        calories: Math.round(food.calories * food.quantity),
        protein: Math.round(food.protein * food.quantity * 10) / 10,
        carbs: Math.round(food.carbs * food.quantity * 10) / 10,
        fat: Math.round(food.fat * food.quantity * 10) / 10
      };
      addNutritionEntry(nutritionEntry);
    });

    onFoodDetected(detectedFoods);
    setDetectedFoods([]);
    onClose();
  };

  const totalCalories = detectedFoods.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
  const totalProtein = detectedFoods.reduce((sum, food) => sum + (food.protein * food.quantity), 0);
  const totalCarbs = detectedFoods.reduce((sum, food) => sum + (food.carbs * food.quantity), 0);
  const totalFat = detectedFoods.reduce((sum, food) => sum + (food.fat * food.quantity), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <CameraAlt sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Smart Food Scanner</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!isScanning && detectedFoods.length === 0 && (
          <Box textAlign="center" py={4}>
            <Restaurant sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Scan Your Food with AI
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Point your camera at your food and let AI identify it automatically
            </Typography>
            <Button
              variant="contained"
              startIcon={<CameraAlt />}
              onClick={startCamera}
              size="large"
            >
              Start Scanning
            </Button>
          </Box>
        )}

        {isScanning && (
          <Box>
            <Box position="relative" mb={2}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', borderRadius: 8 }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.3)'
                }}
              >
                <Typography variant="h6" color="white">
                  Point camera at food
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={capturePhoto}
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CameraAlt />}
              >
                {isProcessing ? 'Processing...' : 'Capture Photo'}
              </Button>
              <Button variant="outlined" onClick={stopCamera}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {detectedFoods.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Detected Foods
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {detectedFoods.map((food, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6">{food.name}</Typography>
                        <IconButton size="small" onClick={() => removeFood(index)}>
                          <Close />
                        </IconButton>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Chip 
                          label={`${Math.round(food.confidence * 100)}% confidence`} 
                          color={food.confidence > 0.8 ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Typography variant="body2">Quantity:</Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(index, food.quantity - 0.1)}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          size="small"
                          value={food.quantity}
                          onChange={(e) => updateQuantity(index, parseFloat(e.target.value) || 0.1)}
                          inputProps={{ min: 0.1, step: 0.1 }}
                          sx={{ width: 80 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(index, food.quantity + 0.1)}
                        >
                          <Add />
                        </IconButton>
                        <Typography variant="body2">{food.serving}</Typography>
                      </Box>

                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip label={`${Math.round(food.calories * food.quantity)} cal`} size="small" />
                        <Chip label={`${Math.round(food.protein * food.quantity * 10) / 10}g protein`} size="small" />
                        <Chip label={`${Math.round(food.carbs * food.quantity * 10) / 10}g carbs`} size="small" />
                        <Chip label={`${Math.round(food.fat * food.quantity * 10) / 10}g fat`} size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Nutrition
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Chip label={`${Math.round(totalCalories)} calories`} sx={{ bgcolor: 'white', color: 'primary.main' }} />
                  <Chip label={`${Math.round(totalProtein * 10) / 10}g protein`} sx={{ bgcolor: 'white', color: 'primary.main' }} />
                  <Chip label={`${Math.round(totalCarbs * 10) / 10}g carbs`} sx={{ bgcolor: 'white', color: 'primary.main' }} />
                  <Chip label={`${Math.round(totalFat * 10) / 10}g fat`} sx={{ bgcolor: 'white', color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>

            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addFood}
              >
                Add Custom Food
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {detectedFoods.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={saveFoods}
          >
            Add to Nutrition Log ({detectedFoods.length} items)
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
