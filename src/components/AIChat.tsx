import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Restaurant,
  FitnessCenter,
  Psychology,
  TrendingUp,
  Close,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  CameraAlt,
  Insights
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { NutritionCalculator } from '../services/nutritionCalculator';
import { PredictiveAnalyticsService } from '../services/predictiveAnalytics';
import SmartFoodScanner from './SmartFoodScanner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export default function AIChat() {
  const { 
    userProfile, 
    nutritionLog, 
    workoutHistory, 
    addNutritionEntry,
    generateTodaysWorkout,
    todaysWorkout,
    setUserProfile
  } = useAppStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi ${userProfile?.name || 'there'}! I'm your AI fitness coach. I can help you with:\n\n• Generate new workouts\n• Create personalized meal plans\n• Track your nutrition\n• Answer fitness questions\n• Adjust your goals\n• Provide personalized advice\n\nWhat would you like to do today?`,
      timestamp: new Date(),
      suggestions: [
        "Generate new workout",
        "Create meal plan",
        "Upload food image",
        "How's my progress looking?"
      ]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [foodInput, setFoodInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load predictions on mount
    if (userProfile) {
      const newPredictions = PredictiveAnalyticsService.generatePredictions(
        userProfile,
        workoutHistory,
        nutritionLog
      );
      setPredictions(newPredictions);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [userProfile, workoutHistory, nutritionLog]);

  const addMessage = (type: 'user' | 'ai', content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (response: string, suggestions?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage('ai', response, suggestions);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    // Simulate AI processing
    const response = await generateAIResponse(userMessage);
    simulateTyping(response.content, response.suggestions);
    
    // Speak the response if voice is enabled
    if (voiceEnabled && response.content.length < 500) {
      speakText(response.content.replace(/\*\*(.*?)\*\*/g, '$1')); // Remove markdown formatting
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; suggestions?: string[] }> => {
    const message = userMessage.toLowerCase();

    // Food tracking responses
    if (message.includes('food') || message.includes('eat') || message.includes('meal') || message.includes('breakfast') || message.includes('lunch') || message.includes('dinner')) {
      if (message.includes('add') || message.includes('track') || message.includes('log')) {
        return {
          content: "I'd be happy to help you track your food! Please tell me what you ate and I'll add it to your nutrition log.\n\nFor example: 'I had 2 eggs, 1 slice of toast, and a banana for breakfast'",
          suggestions: ["I had 2 eggs and toast", "Add my protein shake", "Log my chicken and rice"]
        };
      }
      
      // Calculate accurate nutrition targets
      if (userProfile) {
        const nutritionTargets = NutritionCalculator.calculateNutritionTargets(userProfile);
        return {
          content: `Based on your profile and ${userProfile.targetPhysique} goals, here are your scientifically calculated daily nutrition targets:\n\n**Daily Targets:**\n• **Calories**: ${nutritionTargets.calories}\n• **Protein**: ${nutritionTargets.protein}g (${nutritionTargets.breakdown.proteinPercent}%)\n• **Carbs**: ${nutritionTargets.carbs}g (${nutritionTargets.breakdown.carbPercent}%)\n• **Fat**: ${nutritionTargets.fat}g (${nutritionTargets.breakdown.fatPercent}%)\n• **Fiber**: ${nutritionTargets.fiber}g\n• **Water**: ${nutritionTargets.water}L\n\n**Scientific Rationale:**\n${nutritionTargets.rationale.map(r => `• ${r}`).join('\n')}\n\nThese calculations are based on your lean body mass, activity level, and body composition for optimal results.`,
          suggestions: ["Create meal plan", "Add my own meals", "What should I eat post-workout?", "Track my dinner"]
        };
      }
      
      return {
        content: "I'd be happy to calculate your personalized nutrition targets! Please complete your profile first so I can give you accurate, science-based recommendations.",
        suggestions: ["Complete my profile", "What should I eat post-workout?", "Track my dinner"]
      };
    }

    // Workout modification responses
    if (message.includes('workout') || message.includes('exercise') || message.includes('gym')) {
      if (message.includes('modify') || message.includes('change') || message.includes('adjust') || message.includes('generate') || message.includes('new')) {
        // Actually generate a new workout
        try {
          generateTodaysWorkout();
          return {
            content: "Perfect! I've generated a fresh workout for you based on your goals and recent activity. The new workout should now appear on your dashboard.\n\nWould you like me to also create a meal plan to complement your training, or would you prefer to add your own meals?",
            suggestions: ["Create meal plan", "Add my own meals", "What should I eat post-workout?", "Check my macros"]
          };
        } catch (error) {
          return {
            content: "I had trouble generating a new workout. Let me try a different approach. Would you like me to create a meal plan instead, or would you prefer to add your own meals?",
            suggestions: ["Create meal plan", "Add my own meals", "Try workout again", "Check my progress"]
          };
        }
      }
      return {
        content: `Your current workout plan looks great! Here's what I see:\n\n• **Today's Workout**: ${todaysWorkout?.name || 'No workout generated yet'}\n• **Focus**: ${todaysWorkout?.focus || 'Full body'}\n• **Duration**: ${todaysWorkout?.duration || 45} minutes\n• **Exercises**: ${todaysWorkout?.exercises.length || 0} exercises planned\n\nWould you like me to generate a new workout or create a meal plan?`,
        suggestions: ["Generate new workout", "Create meal plan", "Add my own meals", "Make it harder"]
      };
    }

    // Progress and analytics
    if (message.includes('progress') || message.includes('how am i doing') || message.includes('analytics')) {
      const todayWorkouts = workoutHistory.filter(w => 
        new Date(w.date).toDateString() === new Date().toDateString()
      );
      const todayNutrition = nutritionLog.filter(n => 
        new Date(n.date).toDateString() === new Date().toDateString()
      );
      
      return {
        content: `Here's your progress summary:\n\n**Today's Activity:**\n• Workouts completed: ${todayWorkouts.length}\n• Nutrition entries: ${todayNutrition.length}\n• Total calories: ${todayNutrition.reduce((sum, n) => sum + n.calories, 0)}\n\n**This Week:**\n• Total workouts: ${workoutHistory.filter(w => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(w.date) > weekAgo;
        }).length}\n• Average daily calories: ${Math.round(nutritionLog.reduce((sum, n) => sum + n.calories, 0) / Math.max(nutritionLog.length, 1))}\n\nKeep up the great work! 💪`,
        suggestions: ["Show detailed analytics", "What should I focus on?", "Generate new workout"]
      };
    }

    // Meal plan responses
    if (message.includes('meal plan') || message.includes('create meal') || message.includes('meal plan')) {
      if (userProfile) {
        const nutritionTargets = NutritionCalculator.calculateNutritionTargets(userProfile);
        
        // Create a scientifically balanced meal plan
        const mealPlan = createBalancedMealPlan(nutritionTargets, userProfile.targetPhysique);
        
        return {
          content: `I'll create a personalized meal plan for your ${userProfile.targetPhysique} goals!\n\n**Your Daily Targets:**\n• Calories: ${nutritionTargets.calories}\n• Protein: ${nutritionTargets.protein}g (${nutritionTargets.breakdown.proteinPercent}%)\n• Carbs: ${nutritionTargets.carbs}g (${nutritionTargets.breakdown.carbPercent}%)\n• Fat: ${nutritionTargets.fat}g (${nutritionTargets.breakdown.fatPercent}%)\n• Fiber: ${nutritionTargets.fiber}g\n• Water: ${nutritionTargets.water}L\n\n**Personalized Meal Plan:**\n\n${mealPlan}\n\n**Scientific Basis:**\n${nutritionTargets.rationale.map(r => `• ${r}`).join('\n')}\n\nWould you like me to add these meals to your nutrition log, or would you prefer to add your own meals?`,
          suggestions: ["Add this meal plan", "Add my own meals", "Modify the plan", "What about post-workout?"]
        };
      }
      
      return {
        content: "I'd be happy to create a personalized meal plan! Please complete your profile first so I can give you accurate, science-based nutrition recommendations.",
        suggestions: ["Complete my profile", "Add my own meals", "What should I eat post-workout?"]
      };
    }

    // General fitness advice
    if (message.includes('advice') || message.includes('help') || message.includes('tips')) {
      return {
        content: `Here are some personalized tips for your ${userProfile?.targetPhysique || 'fitness'} journey:\n\n• **Consistency is key** - Stick to your plan 80% of the time\n• **Progressive overload** - Gradually increase weight or reps\n• **Recovery matters** - Get 7-9 hours of quality sleep\n• **Nutrition timing** - Eat protein within 2 hours post-workout\n• **Track everything** - Monitor your progress regularly\n\nWhat specific area would you like help with?`,
        suggestions: ["Create meal plan", "Add my own meals", "Workout tips", "Recovery strategies"]
      };
    }

    // Default response
    return {
      content: "I understand you're asking about fitness and nutrition. I'm here to help with:\n\n• **Nutrition tracking** - Tell me what you ate\n• **Workout modifications** - Adjust your training plan\n• **Progress analysis** - Check how you're doing\n• **Personalized advice** - Get tips for your goals\n\nWhat would you like to focus on?",
      suggestions: ["Track my food", "Modify my workout", "Check my progress", "Get advice"]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Add this meal plan") {
      handleAddMealPlan();
    } else if (suggestion === "Add my own meals") {
      setShowFoodDialog(true);
    } else if (suggestion === "Scan my food") {
      setShowFoodScanner(true);
    } else if (suggestion === "Upload food image") {
      triggerImageUpload();
    } else if (suggestion === "Analyze another image") {
      triggerImageUpload();
    } else {
      setInput(suggestion);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    if (synthesisRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        analyzeImageForMacros(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageForMacros = async (imageData: string) => {
    setIsAnalyzingImage(true);
    
    // Simulate AI image analysis
    setTimeout(() => {
      const mockAnalysis = {
        foods: [
          { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, confidence: 0.92 },
          { name: 'Brown Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, confidence: 0.88 },
          { name: 'Steamed Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, confidence: 0.85 }
        ],
        totalCalories: 329,
        totalProtein: 36.5,
        totalCarbs: 35.3,
        totalFat: 4.3
      };

      addMessage('ai', `I've analyzed your food image! Here's what I found:\n\n**Detected Foods:**\n${mockAnalysis.foods.map(food => 
        `• ${food.name} (${Math.round(food.confidence * 100)}% confidence)\n  - ${food.calories} cal, ${food.protein}g protein, ${food.carbs}g carbs, ${food.fat}g fat`
      ).join('\n')}\n\n**Total Nutrition:**\n• Calories: ${mockAnalysis.totalCalories}\n• Protein: ${mockAnalysis.totalProtein}g\n• Carbs: ${mockAnalysis.totalCarbs}g\n• Fat: ${mockAnalysis.totalFat}g\n\nWould you like me to add these to your nutrition log?`, [
        "Add to nutrition log",
        "Analyze another image",
        "What should I eat next?"
      ]);

      // Add the foods to nutrition log
      mockAnalysis.foods.forEach(food => {
        const nutritionEntry = {
          id: `image_${Date.now()}_${Math.random()}`,
          date: new Date(),
          food: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat
        };
        addNutritionEntry(nutritionEntry);
      });

      setSelectedImage(null);
      setIsAnalyzingImage(false);
    }, 2000);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFoodTracking = () => {
    if (!foodInput.trim()) return;

    // Simple food parsing (in a real app, this would use a nutrition API)
    const foodItems = parseFoodInput(foodInput);
    
    foodItems.forEach(item => {
      const nutritionEntry = {
        id: `food_${Date.now()}_${Math.random()}`,
        date: new Date(),
        food: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      };
      addNutritionEntry(nutritionEntry);
    });

    addMessage('ai', `Great! I've added ${foodItems.length} food item(s) to your nutrition log. Your macros have been updated.`, [
      "Add more food",
      "Check my macros",
      "What should I eat next?"
    ]);

    setFoodInput('');
    setShowFoodDialog(false);
  };

  const handleAddMealPlan = () => {
    const mealPlan = [
      { name: 'Breakfast - Eggs & Oatmeal', calories: 600, protein: 31, carbs: 45, fat: 18 },
      { name: 'Lunch - Chicken & Rice', calories: 700, protein: 61, carbs: 55, fat: 12 },
      { name: 'Dinner - Salmon & Sweet Potato', calories: 600, protein: 41, carbs: 35, fat: 20 },
      { name: 'Snacks - Yogurt & Apple', calories: 300, protein: 19, carbs: 25, fat: 8 }
    ];

    mealPlan.forEach(meal => {
      const nutritionEntry = {
        id: `meal_${Date.now()}_${Math.random()}`,
        date: new Date(),
        food: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat
      };
      addNutritionEntry(nutritionEntry);
    });

    addMessage('ai', `Perfect! I've added your complete meal plan to your nutrition log. You now have 4 meals totaling 2,200 calories with 152g protein, 160g carbs, and 58g fat.`, [
      "Add more food",
      "Check my macros",
      "Modify the plan",
      "What about post-workout?"
    ]);
  };

  const createBalancedMealPlan = (targets: any, goal: string): string => {
    const { calories, protein, carbs, fat } = targets;
    
    // Distribute calories across meals based on goal
    let breakfastCal, lunchCal, dinnerCal, snackCal;
    
    if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('power')) {
      // Higher calories for muscle building
      breakfastCal = Math.round(calories * 0.25);
      lunchCal = Math.round(calories * 0.35);
      dinnerCal = Math.round(calories * 0.30);
      snackCal = Math.round(calories * 0.10);
    } else if (goal.toLowerCase().includes('lean')) {
      // Lower calories for fat loss
      breakfastCal = Math.round(calories * 0.20);
      lunchCal = Math.round(calories * 0.30);
      dinnerCal = Math.round(calories * 0.35);
      snackCal = Math.round(calories * 0.15);
    } else {
      // Balanced approach
      breakfastCal = Math.round(calories * 0.25);
      lunchCal = Math.round(calories * 0.30);
      dinnerCal = Math.round(calories * 0.35);
      snackCal = Math.round(calories * 0.10);
    }
    
    // Distribute macros proportionally
    const breakfastProtein = Math.round(protein * 0.25);
    const lunchProtein = Math.round(protein * 0.35);
    const dinnerProtein = Math.round(protein * 0.30);
    const snackProtein = Math.round(protein * 0.10);
    
    const breakfastCarbs = Math.round(carbs * 0.25);
    const lunchCarbs = Math.round(carbs * 0.35);
    const dinnerCarbs = Math.round(carbs * 0.30);
    const snackCarbs = Math.round(carbs * 0.10);
    
    return `**Breakfast (${breakfastCal} cal, ${breakfastProtein}g protein, ${breakfastCarbs}g carbs):**
• 2-3 whole eggs (140-210 cal, 12-18g protein)
• 1/2 cup oatmeal with berries (150 cal, 5g protein, 25g carbs)
• 1 tbsp almond butter (95 cal, 3g protein, 3g fat)

**Lunch (${lunchCal} cal, ${lunchProtein}g protein, ${lunchCarbs}g carbs):**
• 5-6oz lean protein (chicken/fish) (250-300 cal, 40-50g protein)
• 1 cup complex carbs (rice/quinoa) (200 cal, 4g protein, 40g carbs)
• 2 cups mixed vegetables (50 cal, 4g protein, 10g carbs)
• 1/2 avocado (120 cal, 2g protein, 11g fat)

**Dinner (${dinnerCal} cal, ${dinnerProtein}g protein, ${dinnerCarbs}g carbs):**
• 5-6oz protein (salmon/lean meat) (250-300 cal, 40-50g protein)
• 1 medium sweet potato (100 cal, 2g protein, 25g carbs)
• 2 cups leafy greens (20 cal, 2g protein, 4g carbs)
• 1 tbsp olive oil (120 cal, 14g fat)

**Snacks (${snackCal} cal, ${snackProtein}g protein, ${snackCarbs}g carbs):**
• Greek yogurt with nuts (150 cal, 15g protein, 8g carbs)
• Apple with nut butter (100 cal, 4g protein, 15g carbs)`;
  };

  const parseFoodInput = (input: string): FoodItem[] => {
    // Simple food parsing - in a real app, this would use a nutrition database
    const commonFoods: { [key: string]: FoodItem } = {
      'egg': { name: 'Egg', calories: 70, protein: 6, carbs: 0.6, fat: 5, serving: '1 large' },
      'eggs': { name: 'Eggs', calories: 140, protein: 12, carbs: 1.2, fat: 10, serving: '2 large' },
      'toast': { name: 'Toast', calories: 80, protein: 3, carbs: 15, fat: 1, serving: '1 slice' },
      'banana': { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
      'chicken': { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
      'rice': { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g' },
      'protein shake': { name: 'Protein Shake', calories: 120, protein: 25, carbs: 3, fat: 1, serving: '1 scoop' }
    };

    const items: FoodItem[] = [];
    const words = input.toLowerCase().split(/\s+/);
    
    for (const [key, food] of Object.entries(commonFoods)) {
      if (words.some(word => word.includes(key))) {
        items.push(food);
      }
    }

    // If no common foods found, create a generic entry
    if (items.length === 0) {
      items.push({
        name: input,
        calories: 200,
        protein: 10,
        carbs: 20,
        fat: 8,
        serving: '1 serving'
      });
    }

    return items;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: '#ffffff !important' }}>
                AI Fitness Coach
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your personalized fitness assistant
              </Typography>
            </Box>
          </Box>
          
          {/* Voice Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={isListening ? stopListening : startListening}
              color={isListening ? 'error' : 'primary'}
              disabled={!recognitionRef.current}
            >
              {isListening ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton
              onClick={isSpeaking ? stopSpeaking : () => {}}
              color={isSpeaking ? 'error' : 'primary'}
            >
              {isSpeaking ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <IconButton
              onClick={() => setShowFoodScanner(true)}
              color="secondary"
              title="Scan food with camera"
            >
              <CameraAlt />
            </IconButton>
            <IconButton
              onClick={triggerImageUpload}
              color="info"
              title="Upload food image"
            >
              <Restaurant />
            </IconButton>
          </Box>
        </Box>
        
        {/* AI Predictions */}
        {predictions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
              AI Insights
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {predictions.slice(0, 3).map((prediction, index) => (
                <Chip
                  key={index}
                  label={prediction.title}
                  color={prediction.priority === 'high' ? 'error' : prediction.priority === 'medium' ? 'warning' : 'info'}
                  size="small"
                  onClick={() => setInput(prediction.title)}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ flexDirection: 'column', alignItems: 'stretch', px: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  maxWidth: '80%',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                }}>
                  <Avatar sx={{ 
                    bgcolor: message.type === 'user' ? 'secondary.main' : 'primary.main',
                    width: 32,
                    height: 32,
                    mr: message.type === 'ai' ? 1 : 0,
                    ml: message.type === 'user' ? 1 : 0
                  }}>
                    {message.type === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Card sx={{ 
                    bgcolor: message.type === 'user' ? 'secondary.main' : 'rgba(255, 255, 255, 0.1)',
                    color: message.type === 'user' ? '#000' : '#fff'
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {message.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, mb: 2 }}>
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    />
                  ))}
                </Box>
              )}
            </ListItem>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                  <SmartToy />
                </Avatar>
                <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">AI is thinking...</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {/* Image analysis loading */}
        {isAnalyzingImage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Analyzing your food image...</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask me anything about your fitness journey..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping || isAnalyzingImage}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping || isAnalyzingImage}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>

      {/* Food Tracking Dialog */}
      <Dialog open={showFoodDialog} onClose={() => setShowFoodDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Track Your Food</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tell me what you ate and I'll add it to your nutrition log:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., I had 2 eggs, 1 slice of toast, and a banana for breakfast"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Alert severity="info">
            I'll automatically calculate the macros for common foods. For specific items, I'll estimate based on typical values.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFoodDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFoodTracking}>Add to Macros</Button>
        </DialogActions>
      </Dialog>

      {/* Smart Food Scanner */}
      <SmartFoodScanner
        open={showFoodScanner}
        onClose={() => setShowFoodScanner(false)}
        onFoodDetected={(foods) => {
          addMessage('ai', `Great! I've detected ${foods.length} food items. They've been added to your nutrition log.`, [
            "Check my macros",
            "What should I eat next?",
            "Create meal plan"
          ]);
        }}
      />
    </Box>
  );
}
