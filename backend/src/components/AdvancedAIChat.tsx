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
  Divider,
  LinearProgress,
  Tooltip,
  Badge
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
  Insights,
  AutoAwesome,
  PsychologyAlt,
  Analytics,
  Lightbulb
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { IntelligentResponseGenerator } from '../services/intelligentResponseGenerator';
import { ConversationMemory } from '../services/intelligentResponseGenerator';
import { SuggestionEngine } from '../services/intelligentResponseGenerator';
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

interface ConversationStats {
  totalMessages: number;
  averageSatisfaction: number;
  commonIntents: string[];
  moodTrends: string[];
  improvementAreas: string[];
}

export default function AdvancedAIChat() {
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
      content: `Hello ${userProfile?.name || 'there'}! I'm your advanced AI fitness coach. I can:\n\n🧠 **Understand context** - I remember our conversations and learn from them\n🎯 **Personalize responses** - I adapt to your preferences and goals\n📊 **Analyze patterns** - I spot trends in your fitness journey\n🔮 **Predict needs** - I anticipate what you might need next\n💬 **Natural conversation** - I understand complex requests and emotions\n\nWhat would you like to explore today?`,
      timestamp: new Date(),
      suggestions: [
        "Generate a personalized workout",
        "Analyze my progress trends",
        "Create a meal plan",
        "Upload food image for analysis",
        "How can I improve my form?",
        "What should I focus on this week?"
      ],
      confidence: 0.95,
      personalized: true
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [conversationStats, setConversationStats] = useState<ConversationStats | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  
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

    // Load conversation stats
    loadConversationStats();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const loadConversationStats = () => {
    const stats = ConversationMemory.analyzeConversationTrends(sessionId);
    setConversationStats(stats);
  };

  const addMessage = (type: 'user' | 'ai', content: string, suggestions?: string[], confidence?: number, personalized?: boolean, action?: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions,
      confidence,
      personalized,
      action,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (response: any) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage('ai', response.content, response.suggestions, response.confidence, response.personalized, response.action, response.data);
      setIsTyping(false);
      
      // Store interaction in memory
      ConversationMemory.storeInteraction(
        sessionId,
        input,
        response.content,
        response.action || 'general_advice',
        'neutral', // This would be determined by sentiment analysis
        response.confidence || 0.5,
        [], // Entities would be extracted
        response.action || 'general_advice'
      );
      
      // Update stats
      loadConversationStats();
      
      // Speak the response if voice is enabled
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
      // Use the advanced AI system
      const response = await IntelligentResponseGenerator.generateResponse(
        userMessage,
        userProfile,
        workoutHistory,
        nutritionLog,
        sessionId
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
    
    // Simulate advanced AI image analysis
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
        totalFat: 4.3,
        analysis: {
          mealType: 'lunch',
          healthScore: 8.5,
          macroBalance: 'excellent',
          recommendations: ['Add some healthy fats', 'Consider more vegetables']
        }
      };

      addMessage('ai', `🔍 **Advanced Food Analysis Complete!**\n\n**Detected Foods:**\n${mockAnalysis.foods.map(food => 
        `• ${food.name} (${Math.round(food.confidence * 100)}% confidence)\n  - ${food.calories} cal, ${food.protein}g protein, ${food.carbs}g carbs, ${food.fat}g fat`
      ).join('\n')}\n\n**Nutritional Analysis:**\n• Total: ${mockAnalysis.totalCalories} calories\n• Protein: ${mockAnalysis.totalProtein}g\n• Carbs: ${mockAnalysis.totalCarbs}g\n• Fat: ${mockAnalysis.totalFat}g\n\n**AI Insights:**\n• Meal Type: ${mockAnalysis.analysis.mealType}\n• Health Score: ${mockAnalysis.analysis.healthScore}/10\n• Macro Balance: ${mockAnalysis.analysis.macroBalance}\n• Recommendations: ${mockAnalysis.analysis.recommendations.join(', ')}\n\nWould you like me to add these to your nutrition log?`, [
        "Add to nutrition log",
        "Analyze another image",
        "Get meal recommendations",
        "Show macro breakdown"
      ], 0.92, true);

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
    }, 3000);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4caf50';
    if (confidence >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Advanced Chat Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <PsychologyAlt />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: '#ffffff !important' }}>
                Advanced AI Fitness Coach
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Context-aware • Learning • Predictive
              </Typography>
            </Box>
          </Box>
          
          {/* Advanced Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Conversation Analytics">
              <IconButton
                onClick={() => setShowStats(!showStats)}
                color="info"
              >
                <Analytics />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Input">
              <IconButton
                onClick={isListening ? stopListening : startListening}
                color={isListening ? 'error' : 'primary'}
                disabled={!recognitionRef.current}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Output">
              <IconButton
                onClick={isSpeaking ? stopSpeaking : () => {}}
                color={isSpeaking ? 'error' : 'primary'}
              >
                {isSpeaking ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Scan Food with Camera">
              <IconButton
                onClick={() => setShowFoodScanner(true)}
                color="secondary"
              >
                <CameraAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Food Image">
              <IconButton
                onClick={triggerImageUpload}
                color="info"
              >
                <Restaurant />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Conversation Stats */}
        {showStats && conversationStats && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
              Conversation Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${conversationStats.totalMessages} messages`}
                size="small"
                color="primary"
              />
              <Chip
                label={`${Math.round(conversationStats.averageSatisfaction * 100)}% satisfaction`}
                size="small"
                color={conversationStats.averageSatisfaction > 0.7 ? 'success' : 'warning'}
              />
              <Chip
                label={`${conversationStats.commonIntents.length} intents`}
                size="small"
                color="info"
              />
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
                  maxWidth: '85%',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                }}>
                  <Avatar sx={{ 
                    bgcolor: message.type === 'user' ? 'secondary.main' : 'primary.main',
                    width: 36,
                    height: 36,
                    mr: message.type === 'ai' ? 1 : 0,
                    ml: message.type === 'user' ? 1 : 0
                  }}>
                    {message.type === 'user' ? <Person /> : <PsychologyAlt />}
                  </Avatar>
                  <Card sx={{ 
                    bgcolor: message.type === 'user' ? 'secondary.main' : 'rgba(255, 255, 255, 0.1)',
                    color: message.type === 'user' ? '#000' : '#fff',
                    position: 'relative'
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {message.content}
                      </Typography>
                      
                      {/* AI Response Metadata */}
                      {message.type === 'ai' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          {message.personalized && (
                            <Chip
                              label="Personalized"
                              size="small"
                              color="success"
                              icon={<AutoAwesome />}
                            />
                          )}
                          {message.confidence && (
                            <Chip
                              label={getConfidenceLabel(message.confidence)}
                              size="small"
                              sx={{ 
                                bgcolor: getConfidenceColor(message.confidence),
                                color: 'white'
                              }}
                            />
                          )}
                        </Box>
                      )}
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
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 36, height: 36 }}>
                  <PsychologyAlt />
                </Avatar>
                <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">AI is analyzing and learning...</Typography>
                    </Box>
                    <LinearProgress sx={{ mt: 1 }} />
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
            <Typography variant="body2">AI is analyzing your food image...</Typography>
            <LinearProgress sx={{ flex: 1 }} />
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask me anything about your fitness journey... (I understand context and learn from our conversations)"
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

      {/* Smart Food Scanner */}
      <SmartFoodScanner
        open={showFoodScanner}
        onClose={() => setShowFoodScanner(false)}
        onFoodDetected={(foods) => {
          addMessage('ai', `🔍 **Smart Food Detection Complete!**\n\nI've detected ${foods.length} food items using advanced computer vision. They've been automatically added to your nutrition log with precise macro calculations.\n\n**Next Steps:**\n• Review the macro breakdown\n• Adjust portions if needed\n• Get personalized meal recommendations`, [
            "Show macro breakdown",
            "Get meal recommendations",
            "Analyze nutrition trends",
            "Create meal plan"
          ], 0.95, true);
        }}
      />
    </Box>
  );
}
