import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Add,
  Restaurant,
  PhotoCamera,
  QrCode,
  Edit,
  Delete,
  TrendingUp,
  Schedule,
  LocalDining,
  Close,
  QrCodeScanner,
  Image
} from '@mui/icons-material';
import { useAddNutritionEntry, useNutritionLog } from '../../store/useAppStore';
import { NutritionEntry, FoodItem } from '../../types';

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
      id={`nutrition-tabpanel-${index}`}
      aria-labelledby={`nutrition-tab-${index}`}
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

// Tab Components
const QuickAddTab: React.FC<any> = ({ 
  newEntry, setNewEntry, handleSubmit, isSubmitting, 
  imageDialogOpen, barcodeDialogOpen, uploadedImage, aiAnalysis, 
  isAnalyzing, scannedBarcode, barcodeResults, isScanning,
  handleImageUpload, analyzeImageWithAI, applyAiResults,
  startBarcodeScan, selectBarcodeResult, fileInputRef,
  onCloseImageDialog, onCloseBarcodeDialog
}) => {
  const handleInputChange = (field: string, value: string) => {
    setNewEntry((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Quick Add Food
      </Typography>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<PhotoCamera />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Food Photo
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<QrCode />}
          onClick={startBarcodeScan}
        >
          Scan Barcode
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Food Name"
              value={newEntry.food}
              onChange={(e) => handleInputChange('food', e.target.value)}
              placeholder="e.g., Grilled Chicken Breast"
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={newEntry.calories}
              onChange={(e) => handleInputChange('calories', e.target.value)}
              placeholder="0"
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={newEntry.protein}
              onChange={(e) => handleInputChange('protein', e.target.value)}
              placeholder="0"
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={newEntry.carbs}
              onChange={(e) => handleInputChange('carbs', e.target.value)}
              placeholder="0"
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fats (g)"
              type="number"
              value={newEntry.fats}
              onChange={(e) => handleInputChange('fats', e.target.value)}
              placeholder="0"
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !newEntry.food}
              startIcon={<Add />}
            >
              {isSubmitting ? 'Adding...' : 'Add Food Entry'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

const TodaysLogTab: React.FC<any> = ({ todayEntries, totalCalories, totalProtein, totalCarbs, totalFat }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Today's Nutrition ({todayEntries.length} entries)
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {totalCalories}
            </Typography>
            <Typography variant="body2" color="text.secondary">Calories</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
              {totalProtein}g
            </Typography>
            <Typography variant="body2" color="text.secondary">Protein</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 700 }}>
              {totalCarbs}g
            </Typography>
            <Typography variant="body2" color="text.secondary">Carbs</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>
              {totalFat}g
            </Typography>
            <Typography variant="body2" color="text.secondary">Fat</Typography>
          </Card>
        </Grid>
      </Grid>
      
      {todayEntries.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No entries yet today. Start tracking your nutrition!
        </Typography>
      ) : (
        <List>
          {todayEntries.map((entry: any, index: number) => (
            <React.Fragment key={entry.id || index}>
              <ListItem>
                <ListItemIcon>
                  <LocalDining />
                </ListItemIcon>
                <ListItemText
                  primary={entry.foods[0]?.name || 'Unknown Food'}
                  secondary={`${entry.totalCalories} cal | P: ${entry.macros.protein_g}g | C: ${entry.macros.carbs_g}g | F: ${entry.macros.fat_g}g | ${entry.meal}`}
                />
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              </ListItem>
              {index < todayEntries.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

const MealPlanningTab: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Meal Planning
      </Typography>
      <Typography color="text.secondary" align="center">
        Meal planning features coming soon! 🍽️
      </Typography>
    </Box>
  );
};

const AnalyticsTab: React.FC<any> = ({ nutritionLog, totalCalories, totalProtein, totalCarbs, totalFat }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Nutrition Analytics
      </Typography>
      <Typography color="text.secondary" align="center">
        Analytics features coming soon! 📊
      </Typography>
    </Box>
  );
};

const NutritionTracker: React.FC = () => {
  const nutritionLog = useNutritionLog();
  const addNutritionEntry = useAddNutritionEntry();
  const [newEntry, setNewEntry] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    meal: 'breakfast'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [barcodeResults, setBarcodeResults] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setNewEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const foodItem = {
        name: newEntry.food,
        kcal: parseFloat(newEntry.calories) || 0,
        protein_g: parseFloat(newEntry.protein) || 0,
        carbs_g: parseFloat(newEntry.carbs) || 0,
        fat_g: parseFloat(newEntry.fats) || 0,
        fiber_g: null,
        sodium_mg: null,
        potassium_mg: null
      };

      const entry: NutritionEntry = {
        id: `nutrition_${Date.now()}`,
        date: new Date(),
        meal: newEntry.meal as any,
        foods: [foodItem],
        totalCalories: foodItem.kcal,
        macros: {
          protein_g: foodItem.protein_g,
          carbs_g: foodItem.carbs_g,
          fat_g: foodItem.fat_g,
          fiber_g: foodItem.fiber_g || 0
        },
        notes: aiAnalysis ? `AI Analysis: ${aiAnalysis.description}` : ''
      };

      await addNutritionEntry(entry);
      
      // Reset form
      setNewEntry({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        meal: 'breakfast'
      });
      setUploadedImage(null);
      setAiAnalysis(null);
      
    } catch (error) {
      console.error('Failed to add nutrition entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Upload Functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setImageDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageWithAI = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - in production, this would call your AI service
      setTimeout(() => {
        const mockAnalysis = {
          food: 'Grilled Chicken Breast with Vegetables',
          calories: 320,
          protein: 35,
          carbs: 8,
          fats: 12,
          confidence: 0.89,
          description: 'Detected grilled chicken breast with mixed vegetables. High protein, low carb meal suitable for muscle building.'
        };
        
        setAiAnalysis(mockAnalysis);
        setIsAnalyzing(false);
      }, 2000);
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  const applyAiResults = () => {
    if (aiAnalysis) {
      setNewEntry({
        food: aiAnalysis.food,
        calories: aiAnalysis.calories.toString(),
        protein: aiAnalysis.protein.toString(),
        carbs: aiAnalysis.carbs.toString(),
        fats: aiAnalysis.fats.toString(),
        meal: newEntry.meal
      });
      setImageDialogOpen(false);
    }
  };

  // Barcode Scanning Functions
  const startBarcodeScan = async () => {
    setBarcodeDialogOpen(true);
    setIsScanning(true);
    
    try {
      // Simulate barcode scanning - in production, this would use a barcode library
      setTimeout(() => {
        const mockBarcode = '1234567890123';
        setScannedBarcode(mockBarcode);
        
        // Simulate API call to nutrition database
        const mockResults = [
          {
            name: 'Quest Protein Bar - Chocolate Brownie',
            brand: 'Quest Nutrition',
            calories: 190,
            protein: 21,
            carbs: 4,
            fats: 8,
            barcode: mockBarcode
          },
          {
            name: 'Clif Bar - Chocolate Chip',
            brand: 'Clif Bar',
            calories: 250,
            protein: 9,
            carbs: 45,
            fats: 4,
            barcode: mockBarcode
          }
        ];
        
        setBarcodeResults(mockResults);
        setIsScanning(false);
      }, 1500);
      
    } catch (error) {
      console.error('Barcode scanning failed:', error);
      setIsScanning(false);
    }
  };

  const selectBarcodeResult = (result: any) => {
    setNewEntry({
      food: result.name,
      calories: result.calories.toString(),
      protein: result.protein.toString(),
      carbs: result.carbs.toString(),
      fats: result.fats.toString(),
      meal: newEntry.meal
    });
    setBarcodeDialogOpen(false);
  };

  const getTodayNutrition = () => {
    const today = new Date().toDateString();
    return nutritionLog.filter(entry => 
      new Date(entry.date).toDateString() === today
    );
  };

  const todayEntries = getTodayNutrition();
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.totalCalories, 0);
  const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.macros.protein_g, 0);
  const totalCarbs = todayEntries.reduce((sum, entry) => sum + entry.macros.carbs_g, 0);
  const totalFat = todayEntries.reduce((sum, entry) => sum + entry.macros.fat_g, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Nutrition Tracker
      </Typography>

      {/* Tabs */}
      <Card sx={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="nutrition tabs">
            <Tab label="Quick Add" icon={<Add />} />
            <Tab label="Today's Log" icon={<LocalDining />} />
            <Tab label="Meal Planning" icon={<Schedule />} />
            <Tab label="Analytics" icon={<TrendingUp />} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <QuickAddTab 
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            imageDialogOpen={imageDialogOpen}
            barcodeDialogOpen={barcodeDialogOpen}
            uploadedImage={uploadedImage}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            scannedBarcode={scannedBarcode}
            barcodeResults={barcodeResults}
            isScanning={isScanning}
            handleImageUpload={handleImageUpload}
            analyzeImageWithAI={analyzeImageWithAI}
            applyAiResults={applyAiResults}
            startBarcodeScan={startBarcodeScan}
            selectBarcodeResult={selectBarcodeResult}
            fileInputRef={fileInputRef}
            onCloseImageDialog={() => setImageDialogOpen(false)}
            onCloseBarcodeDialog={() => setBarcodeDialogOpen(false)}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <TodaysLogTab 
            todayEntries={todayEntries}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            totalCarbs={totalCarbs}
            totalFat={totalFat}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <MealPlanningTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <AnalyticsTab 
            nutritionLog={nutritionLog}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            totalCarbs={totalCarbs}
            totalFat={totalFat}
          />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default NutritionTracker;
