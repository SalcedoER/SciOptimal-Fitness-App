import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import {
  SmartToy,
  Send,
  CheckCircle,
  ExpandMore
} from '@mui/icons-material';
import { useAppStore } from '../../store/useAppStore';
import { llmService } from '../../services/llmService';

interface AIResponse {
  type: 'advice' | 'plan' | 'analysis' | 'question';
  content: string;
  citations?: string[];
  actionable?: boolean;
  nextSteps?: string[];
  model?: string;
  usage?: any;
}

const AIAssistant: React.FC = () => {
  const { userProfile, currentPhase } = useAppStore();
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<AIResponse[]>([]);

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    setIsLoading(true);
    
    try {
      // Use the LLM service for real AI responses
      const llmResponse = await llmService.generateFitnessAdvice(
        userQuestion,
        userProfile,
        { currentPhase }
      );

      // Process the LLM response
      const response = await processLLMResponse(llmResponse, userQuestion);
      
      setConversation(prev => [...prev, response]);
      setUserQuestion('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      setConversation(prev => [...prev, {
        type: 'advice',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        actionable: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLLMResponse = async (llmResponse: any, originalQuestion: string): Promise<AIResponse> => {
    // Extract citations and actionable content from the response
    const content = llmResponse.content;
    
    // Look for citations in the response
    const citations = extractCitations(content);
    
    // Generate actionable next steps based on the response
    const nextSteps = generateNextSteps(content, originalQuestion);
    
    // Determine response type
    let type: 'advice' | 'plan' | 'analysis' | 'question' = 'advice';
    if (content.includes('plan') || content.includes('program') || content.includes('schedule')) {
      type = 'plan';
    } else if (content.includes('analysis') || content.includes('assessment')) {
      type = 'analysis';
    }

    return {
      type,
      content,
      citations,
      actionable: nextSteps.length > 0,
      nextSteps,
      model: llmResponse.model,
      usage: llmResponse.usage
    };
  };

  const extractCitations = (content: string): string[] => {
    const citations: string[] = [];
    
    // Look for common citation patterns
    const citationPatterns = [
      /(?:NSCA|ACSM|ISSN|American College of Sports Medicine|National Strength and Conditioning Association|International Society of Sports Nutrition)/gi,
      /(?:research|study|evidence|guidelines|position stand)/gi,
      /(?:Journal of|Journal|Research|Study)/gi
    ];

    citationPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!citations.includes(match)) {
            citations.push(match);
          }
        });
      }
    });

    // If no specific citations found, add general ones based on content
    if (citations.length === 0) {
      if (content.includes('strength') || content.includes('training')) {
        citations.push('NSCA Guidelines');
      }
      if (content.includes('nutrition') || content.includes('diet')) {
        citations.push('ISSN Position Stands');
      }
      if (content.includes('exercise') || content.includes('fitness')) {
        citations.push('ACSM Guidelines');
      }
    }

    return citations;
  };

  const generateNextSteps = (content: string, question: string): string[] => {
    const steps: string[] = [];
    
    // Generate contextual next steps based on the response content
    if (content.includes('track') || content.includes('monitor')) {
      steps.push('Implement tracking and monitoring systems');
    }
    
    if (content.includes('progressive') || content.includes('increase')) {
      steps.push('Plan progressive overload strategy');
    }
    
    if (content.includes('recovery') || content.includes('sleep')) {
      steps.push('Optimize recovery and sleep protocols');
    }
    
    if (content.includes('form') || content.includes('technique')) {
      steps.push('Focus on proper form and technique');
    }
    
    if (content.includes('nutrition') || content.includes('macros')) {
      steps.push('Adjust nutrition plan based on recommendations');
    }
    
    if (content.includes('equipment') || content.includes('gym')) {
      steps.push('Review and optimize equipment usage');
    }

    // Add general next steps if none specific
    if (steps.length === 0) {
      steps.push('Review the recommendations above');
      steps.push('Implement changes gradually');
      steps.push('Monitor progress and adjust as needed');
    }

    return steps;
  };

  const suggestedQuestions = [
    "How should I structure my workouts for my goals?",
    "What's the best nutrition strategy for my body type?",
    "How do I know when to increase weight?",
    "What recovery protocols should I follow?",
    "How can I track my progress effectively?"
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SmartToy sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4">
              AI Fitness Coach
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Get personalized, evidence-based fitness advice from your AI coach
          </Typography>
          {llmService && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>AI Service:</strong> {llmService.constructor.name} - Ready to provide intelligent fitness guidance
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ask Your AI Coach
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Ask me about workouts, nutrition, recovery, progression, or any fitness topic..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAskQuestion}
              disabled={!userQuestion.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              sx={{ minWidth: 100 }}
            >
              {isLoading ? 'Thinking...' : 'Ask'}
            </Button>
          </Box>
          
          {/* Suggested Questions */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Suggested questions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestedQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => setUserQuestion(question)}
                variant="outlined"
                size="small"
                clickable
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Conversation History
            </Typography>
            <List>
              {conversation.map((response, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                      <SmartToy sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="subtitle2" color="primary">
                      AI Coach
                    </Typography>
                    <Chip 
                      label={response.type} 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', width: '100%', mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {response.content}
                    </Typography>
                  </Paper>

                  {response.citations && response.citations.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Sources: {response.citations.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {response.model && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        AI Model: {response.model}
                      </Typography>
                    </Box>
                  )}

                  {response.actionable && response.nextSteps && (
                    <Accordion sx={{ width: '100%' }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2" color="primary">
                          Action Steps
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {response.nextSteps.map((step, stepIndex) => (
                            <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={step} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Profile Status */}
      {!userProfile && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Complete your profile</strong> to get personalized, accurate fitness advice tailored to your goals, equipment, and body composition.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default AIAssistant;
