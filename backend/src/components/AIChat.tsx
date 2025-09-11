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
import { IntelligentAI } from '../services/intelligentAI';
import SmartFoodScanner from './SmartFoodScanner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  confidence?: number;
  personalized?: boolean;
  action?: string;
  data?: any;
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
      content: "Hello! I'm your intelligent AI fitness coach. I learn from your patterns, adapt to your preferences, and provide personalized recommendations. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "Create my meal plan",
        "Generate today's workout", 
        "Analyze my progress",
        "What should I eat post-workout?",
        "Help me track my food",
        "Give me fitness advice"
      ],
      confidence: 0.95,
      personalized: true
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    // Initialize voice recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = new SpeechSynthesisUtterance();
      synthesisRef.current.rate = 0.9;
      synthesisRef.current.pitch = 1;
      synthesisRef.current.volume = 0.8;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type: 'user' | 'ai', content: string, additionalData?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ...additionalData
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = (response: any) => {
    setIsLoading(true);
    setTimeout(() => {
      addMessage('ai', response.content, {
        suggestions: response.suggestions,
        confidence: response.confidence,
        personalized: response.personalized,
        action: response.action,
        data: response.data
      });
      setIsLoading(false);
      
      if (voiceEnabled && response.content.length < 500) {
        speakText(response.content.replace(/\*\*(.*?)\*\*/g, '$1'));
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    try {
      // Use the intelligent AI system
      const response = await IntelligentAI.generateResponse(
        userMessage,
        userProfile,
        workoutHistory,
        nutritionLog,
        'default'
      );
      
      simulateTyping(response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      simulateTyping({
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        suggestions: ["Try again", "Ask something else", "Get help"],
        confidence: 0.3,
        personalized: false
      });
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
      synthesisRef.current.text = text;
      speechSynthesis.speak(synthesisRef.current);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
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
      const mockAnalysis = [
        { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, confidence: 0.92 },
        { name: 'Brown Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, confidence: 0.88 },
        { name: 'Steamed Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, confidence: 0.85 }
      ];
      
      setPredictions(mockAnalysis);
      setIsAnalyzingImage(false);
      
      addMessage('ai', `I've analyzed your food image! Here's what I detected:\n\n${mockAnalysis.map(food => 
        `• ${food.name} (${Math.round(food.confidence * 100)}% confidence)\n  - ${food.calories} cal, ${food.protein}g protein, ${food.carbs}g carbs, ${food.fat}g fat`
      ).join('\n')}\n\nWould you like me to add these to your nutrition log?`, {
        suggestions: ["Add all to nutrition log", "Add selected items", "Try different image"],
        confidence: 0.88,
        personalized: true,
        data: { predictions: mockAnalysis }
      });
    }, 2000);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 2, display: 'flex', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
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
                  
                  {/* AI Response Metadata */}
                  {message.type === 'ai' && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {message.confidence && (
                        <Chip 
                          label={`${Math.round(message.confidence * 100)}% confidence`} 
                          size="small" 
                          sx={{ bgcolor: 'rgba(0,230,118,0.2)', color: '#00e676', fontSize: '0.7rem' }}
                        />
                      )}
                      {message.personalized && (
                        <Chip 
                          label="Personalized" 
                          size="small" 
                          icon={<Psychology />}
                          sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: '#9c27b0', fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
              <SmartToy />
            </Avatar>
            <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    AI is thinking...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Suggestions */}
      {messages.length > 0 && messages[messages.length - 1].suggestions && (
        <Box sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
            Quick suggestions:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ 
                  bgcolor: 'rgba(0,230,118,0.1)', 
                  color: '#00e676',
                  '&:hover': { bgcolor: 'rgba(0,230,118,0.2)' }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: '1px solid #333', background: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your fitness journey..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#00e676' }
              },
              '& .MuiInputBase-input': { color: '#fff' }
            }}
          />
          
          <IconButton onClick={triggerImageUpload} sx={{ color: '#00e676' }}>
            <CameraAlt />
          </IconButton>
          
          <IconButton 
            onClick={isListening ? stopListening : startListening}
            sx={{ color: isListening ? '#f44336' : '#00e676' }}
          >
            {isListening ? <MicOff /> : <Mic />}
          </IconButton>
          
          <IconButton 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            sx={{ color: voiceEnabled ? '#00e676' : '#666' }}
          >
            {voiceEnabled ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
          
          <IconButton 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            sx={{ 
              color: '#00e676',
              '&:disabled': { color: '#666' }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Food Scanner Modal */}
      <SmartFoodScanner
        open={showFoodScanner}
        onClose={() => setShowFoodScanner(false)}
        onFoodDetected={(food) => {
          // Handle detected food
          setShowFoodScanner(false);
        }}
      />
    </Box>
  );
}
