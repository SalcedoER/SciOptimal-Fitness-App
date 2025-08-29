import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { intelligentAI, AIAnalysis } from '../../services/intelligentAIService';
import { useUserProfile, useWorkoutHistory, useNutritionLog, useSleepLog, useProgressHistory } from '../../store/useAppStore';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  analysis?: AIAnalysis;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
  // Get user data from store
  const userProfile = useUserProfile();
  const workoutHistory = useWorkoutHistory();
  const nutritionLog = useNutritionLog();
  const sleepLog = useSleepLog();
  const progressHistory = useProgressHistory();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI with user context
  useEffect(() => {
    if (userProfile && workoutHistory && nutritionLog && sleepLog && progressHistory) {
      intelligentAI.setUserContext(
        userProfile,
        workoutHistory,
        nutritionLog,
        sleepLog,
        progressHistory
      );
    }
  }, [userProfile, workoutHistory, nutritionLog, sleepLog, progressHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && userProfile) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hello ${userProfile.name}! I'm your AI fitness coach, powered by the latest scientific research. I can help you with:\n\n• Workout planning and optimization\n• Nutrition advice and macro calculations\n• Recovery strategies and sleep optimization\n• Progress tracking and plateau busting\n• Evidence-based fitness guidance\n\nWhat would you like to know about today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [userProfile, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI analysis
      const analysis = await intelligentAI.analyzeQuestion(inputValue);
      
      // Generate AI response
      const aiResponse = generateAIResponse(analysis);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [...prev, inputValue, aiResponse]);
    } catch (error) {
      console.error('AI analysis error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error analyzing your question. Please try rephrasing or ask something else.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (analysis: AIAnalysis): string => {
    let response = `${analysis.recommendation}\n\n`;
    
    if (analysis.implementation.length > 0) {
      response += '**Implementation Steps:**\n';
      analysis.implementation.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += '\n';
    }
    
    if (analysis.warnings.length > 0) {
      response += '**Important Notes:**\n';
      analysis.warnings.forEach(warning => {
        response += `⚠️ ${warning}\n`;
      });
      response += '\n';
    }
    
    response += '**Next Steps:**\n';
    analysis.nextSteps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });
    
    return response;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <TrendingUpIcon color="primary" />;
      case 'nutrition':
        return <PsychologyIcon color="success" />;
      case 'recovery':
        return <CheckCircleIcon color="info" />;
      case 'progress':
        return <TrendingUpIcon color="secondary" />;
      default:
        return <ScienceIcon color="action" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'primary';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <ScienceIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              AI Fitness Coach
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Powered by Latest Scientific Research
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#f5f5f5' }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                backgroundColor: message.isUser ? 'primary.main' : 'white',
                color: message.isUser ? 'white' : 'text.primary'
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {message.text}
              </Typography>
              
              {/* AI Analysis Details */}
              {!message.isUser && message.analysis && (
                <Box mt={2}>
                  <Divider sx={{ my: 1, opacity: 0.3 }} />
                  
                  {/* Analysis Type and Confidence */}
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getMessageIcon(message.analysis.type)}
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {message.analysis.type.toUpperCase()} ANALYSIS
                    </Typography>
                    <Chip
                      label={`${message.analysis.confidence}% Confidence`}
                      size="small"
                      color={getConfidenceColor(message.analysis.confidence) as any}
                      variant="outlined"
                    />
                  </Box>

                  {/* Scientific Basis */}
                  <Accordion sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        🔬 Scientific Basis
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {message.analysis.scientificBasis}
                      </Typography>
                      {message.analysis.studies.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="caption" fontWeight="bold">
                            Supporting Studies:
                          </Typography>
                          {message.analysis.studies.map((study, index) => (
                            <Chip
                              key={index}
                              label={study}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mt: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Warnings */}
                  {message.analysis.warnings.length > 0 && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        {message.analysis.warnings.join(', ')}
                      </Typography>
                    </Alert>
                  )}

                  {/* Follow-up Questions */}
                  {message.analysis.followUpQuestions.length > 0 && (
                    <Box mt={1}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                        💭 Follow-up Questions:
                      </Typography>
                      {message.analysis.followUpQuestions.map((question, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}
                        >
                          • {question}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Box>
        ))}
        
        {isLoading && (
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Paper elevation={1} sx={{ p: 2, backgroundColor: 'white' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing your question with scientific research...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white' }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about fitness, nutrition, or recovery..."
            variant="outlined"
            size="small"
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SendIcon />
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          💡 Try asking: "How many sets should I do for chest?", "What's the best protein intake for muscle gain?", or "How can I improve my recovery?"
        </Typography>
      </Paper>
    </Box>
  );
};

export default AIAssistant;
