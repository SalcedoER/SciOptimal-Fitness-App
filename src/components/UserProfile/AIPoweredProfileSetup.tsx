import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  SmartToy,
  Send,
  CheckCircle,
  Person,
  FitnessCenter,
  Restaurant,
  Schedule,
  TrendingUp,
  EmojiEvents,
  Psychology,
  DirectionsRun,
  MonitorWeight
} from '@mui/icons-material';
import { useSetUserProfile, useSetCurrentPhase } from '../../store/useAppStore';
import { Equipment, ActivityLevel } from '../../types';
import { generateTrainingProgram } from '../../utils/trainingPhaseGenerator';

interface AIQuestion {
  id: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'multi_select';
  options?: string[];
  required: boolean;
  category: 'basic' | 'fitness' | 'nutrition' | 'lifestyle' | 'goals';
  followUp?: string;
}

interface AIResponse {
  type: 'question' | 'analysis' | 'plan' | 'confirmation';
  content: string;
  data?: any;
  nextAction?: string;
}

const AIPoweredProfileSetup: React.FC = () => {
  const setUserProfile = useSetUserProfile();
  const setCurrentPhase = useSetCurrentPhase();
  const [conversation, setConversation] = useState<AIResponse[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // AI Questions Flow
  const aiQuestions: AIQuestion[] = [
    // Basic Information
    {
      id: 'name',
      question: "Hi! I'm your AI fitness coach. Let's start with the basics. What's your name?",
      type: 'text',
      required: true,
      category: 'basic'
    },
    {
      id: 'age',
      question: "Great to meet you! How old are you? (This helps me calculate your metabolic rate and recovery needs)",
      type: 'number',
      required: true,
      category: 'basic'
    },
    {
      id: 'height',
      question: "What's your height in inches? (I'll use this for precise calculations)",
      type: 'number',
      required: true,
      category: 'basic'
    },
    {
      id: 'weight',
      question: "What's your current weight in kilograms? (Don't worry, this is just for calculations)",
      type: 'number',
      required: true,
      category: 'basic'
    },
    {
      id: 'bodyFat',
      question: "What's your estimated body fat percentage? (If you're not sure, I can help estimate based on your description)",
      type: 'select',
      options: ['10-15% (Very lean)', '15-20% (Lean)', '20-25% (Moderate)', '25-30% (Higher)', '30%+ (High)', 'Not sure'],
      required: true,
      category: 'basic'
    },

    // Fitness Goals & Experience
    {
      id: 'fitnessExperience',
      question: "What's your current fitness experience level?",
      type: 'select',
      options: ['Beginner (0-6 months)', 'Intermediate (6 months - 2 years)', 'Advanced (2+ years)', 'Elite athlete'],
      required: true,
      category: 'fitness'
    },
    {
      id: 'targetPhysique',
      question: "What's your primary goal? I want to understand exactly what you're aiming for.",
      type: 'select',
      options: ['NFL Fullback Build (strength + size + conditioning)', 'Lean Athlete (strength + endurance)', 'Powerlifter (maximal strength)', 'Bodybuilder (muscle mass)', 'General Fitness (overall health)'],
      required: true,
      category: 'goals'
    },
    {
      id: 'specificGoals',
      question: "Can you tell me more about your specific goals? For example, target weight, strength goals, or specific performance targets?",
      type: 'text',
      required: false,
      category: 'goals',
      followUp: "This helps me create a more targeted plan."
    },

    // Current Lifestyle
    {
      id: 'activityLevel',
      question: "How active are you currently? (This affects your calorie needs and recovery)",
      type: 'select',
      options: ['Sedentary (office job, little exercise)', 'Lightly Active (light exercise 1-3 days/week)', 'Moderately Active (moderate exercise 3-5 days/week)', 'Very Active (hard exercise 6-7 days/week)', 'Extremely Active (very hard exercise, physical job)'],
      required: true,
      category: 'lifestyle'
    },
    {
      id: 'sleepHabits',
      question: "How's your sleep quality? (This is crucial for recovery and progress)",
      type: 'select',
      options: ['Excellent (7-9 hours, feel rested)', 'Good (6-7 hours, mostly rested)', 'Fair (5-6 hours, sometimes tired)', 'Poor (less than 5 hours, often tired)', 'Very poor (insomnia, always exhausted)'],
      required: true,
      category: 'lifestyle'
    },
    {
      id: 'stressLevel',
      question: "How would you rate your current stress level? (Stress affects recovery and progress)",
      type: 'select',
      options: ['Very low (relaxed)', 'Low (manageable)', 'Moderate (some stress)', 'High (significant stress)', 'Very high (overwhelming)'],
      required: true,
      category: 'lifestyle'
    },

    // Equipment & Training Preferences
    {
      id: 'equipment',
      question: "What equipment do you have access to? Select all that apply:",
      type: 'multi_select',
      options: ['Dumbbells', 'Barbells', 'Weight machines', 'Cable machines', 'Smith machine', 'Treadmill', 'Bench', 'Squat rack', 'Pull-up bar', 'Resistance bands', 'Bodyweight only', 'Gym membership'],
      required: true,
      category: 'fitness'
    },
    {
      id: 'trainingFrequency',
      question: "How many days per week can you realistically train? (Be honest - consistency beats intensity)",
      type: 'select',
      options: ['2-3 days', '3-4 days', '4-5 days', '5-6 days', '6+ days'],
      required: true,
      category: 'fitness'
    },
    {
      id: 'trainingDuration',
      question: "How long can you typically spend on each training session?",
      type: 'select',
      options: ['30 minutes or less', '30-45 minutes', '45-60 minutes', '60-90 minutes', '90+ minutes'],
      required: true,
      category: 'fitness'
    },

    // Nutrition & Dietary Preferences
    {
      id: 'dietaryRestrictions',
      question: "Do you have any dietary restrictions or preferences?",
      type: 'select',
      options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Low-carb', 'Intermittent fasting', 'Other'],
      required: true,
      category: 'nutrition'
    },
    {
      id: 'mealFrequency',
      question: "How many meals do you prefer to eat per day?",
      type: 'select',
      options: ['2-3 meals', '3-4 meals', '4-5 meals', '5-6 meals', 'Flexible'],
      required: true,
      category: 'nutrition'
    },
    {
      id: 'supplementExperience',
      question: "What's your experience with supplements?",
      type: 'select',
      options: ['None (never used)', 'Beginner (basic vitamins)', 'Intermediate (protein, creatine)', 'Advanced (multiple supplements)', 'Expert (comprehensive stack)'],
      required: true,
      category: 'nutrition'
    },

    // Injury & Health Considerations
    {
      id: 'injuries',
      question: "Do you have any current injuries or physical limitations I should know about?",
      type: 'text',
      required: false,
      category: 'fitness',
      followUp: "This helps me design safe, effective workouts."
    },
    {
      id: 'healthConditions',
      question: "Any health conditions or medications that might affect your training?",
      type: 'text',
      required: false,
      category: 'fitness',
      followUp: "Your safety is my priority."
    }
  ];

  useEffect(() => {
    // Start the conversation with the first question
    if (aiQuestions.length > 0) {
      setCurrentQuestion(aiQuestions[0]);
      setConversation([{
        type: 'question',
        content: aiQuestions[0].question
      }]);
    }
  }, []);

  const handleAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim() || isLoading) return;

    setIsLoading(true);

    // Store the answer
    const newProfileData = {
      ...profileData,
      [currentQuestion.id]: userAnswer
    };
    setProfileData(newProfileData);

    // Add user answer to conversation
    setConversation(prev => [...prev, {
      type: 'analysis',
      content: `**Your Answer:** ${userAnswer}`
    }]);

    // Generate AI response and next question
    const aiResponse = await generateAIResponse(currentQuestion, userAnswer, newProfileData);
    setConversation(prev => [...prev, aiResponse]);

    // Move to next question
    const currentIndex = aiQuestions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < aiQuestions.length - 1) {
      const nextQuestion = aiQuestions[currentIndex + 1];
      setCurrentQuestion(nextQuestion);
      setCurrentStep(currentIndex + 1);
      
      // Add next question to conversation
      setTimeout(() => {
        setConversation(prev => [...prev, {
          type: 'question',
          content: nextQuestion.question
        }]);
      }, 1000);
    } else {
      // All questions answered - generate final plan
      await generateFinalPlan(newProfileData);
    }

    setUserAnswer('');
    setIsLoading(false);
  };

  const generateAIResponse = async (question: AIQuestion, answer: string, profileData: any): Promise<AIResponse> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // AI analysis based on question category and answer
    let analysis = '';
    let nextAction = '';

    switch (question.category) {
      case 'basic':
        if (question.id === 'name') {
          analysis = `Great to meet you, ${answer}! I'm excited to help you achieve your fitness goals.`;
        } else if (question.id === 'bodyFat') {
          if (answer.includes('10-15%') || answer.includes('15-20%')) {
            analysis = `Excellent! You're already in a great position for building muscle and strength.`;
          } else if (answer.includes('20-25%') || answer.includes('25-30%')) {
            analysis = `Perfect! This gives us a good foundation for both fat loss and muscle building.`;
          } else {
            analysis = `No worries! We can work on body composition together. Focus on consistency and the results will come.`;
          }
        }
        break;

      case 'goals':
        if (question.id === 'targetPhysique') {
          if (answer.includes('NFL Fullback')) {
            analysis = `Excellent choice! The fullback build requires a perfect balance of strength, power, and conditioning. I'll create a program that builds functional strength while maintaining athleticism.`;
            nextAction = 'We\'ll focus on compound movements, explosive power, and metabolic conditioning.';
          } else if (answer.includes('Lean Athlete')) {
            analysis = `Perfect! Lean athleticism is about maximizing performance while staying light and fast.`;
            nextAction = 'Your program will emphasize strength-to-weight ratio and cardiovascular fitness.';
          }
        }
        break;

      case 'fitness':
        if (question.id === 'equipment') {
          const equipment = answer.split(',');
          if (equipment.includes('Barbells')) {
            analysis = `Great! Barbells are perfect for building foundational strength.`;
          } else if (equipment.includes('Bodyweight only')) {
            analysis = `No problem! Bodyweight training can be incredibly effective for building strength and muscle.`;
          }
          nextAction = 'I\'ll design workouts that maximize your available equipment.';
        }
        break;

      case 'lifestyle':
        if (question.id === 'sleepHabits') {
          if (answer.includes('Poor') || answer.includes('Very poor')) {
            analysis = `Sleep is crucial for recovery and progress. We'll need to address this as part of your plan.`;
            nextAction = 'I\'ll include sleep optimization strategies and adjust training intensity accordingly.';
          } else {
            analysis = `Good sleep habits will accelerate your progress!`;
          }
        }
        break;
    }

    return {
      type: 'analysis',
      content: analysis,
      nextAction
    };
  };

  const generateFinalPlan = async (finalProfileData: any) => {
    setIsLoading(true);
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create the final user profile with validation
    const userProfile = {
      id: `profile_${Date.now()}`,
      name: finalProfileData.name || 'Unknown User',
      age: Math.max(16, Math.min(100, parseInt(finalProfileData.age) || 25)),
      height: Math.max(48, Math.min(96, parseFloat(finalProfileData.height) || 70)), // 4-8 feet
      weight: Math.max(80, Math.min(300, parseFloat(finalProfileData.weight) || 70)), // 80-300 lbs converted to kg
      bodyFatPercentage: Math.max(5, Math.min(50, parseFloat(finalProfileData.bodyFat || '20'))),
      targetPhysique: finalProfileData.targetPhysique,
      equipment: finalProfileData.equipment ? finalProfileData.equipment.split(',').map((e: string) => e.trim().toLowerCase().replace(' ', '_') as Equipment) : [],
      activityLevel: finalProfileData.activityLevel?.toLowerCase().replace(' ', '_') as ActivityLevel,
      sleepSchedule: {
        wakeUpTime: '06:00',
        bedTime: '22:00',
        targetSleepHours: 8,
        sleepQuality: finalProfileData.sleepHabits?.includes('Excellent') ? 9 : 
                     finalProfileData.sleepHabits?.includes('Good') ? 7 : 
                     finalProfileData.sleepHabits?.includes('Fair') ? 5 : 3,
        sleepTracking: true,
        sleepNotes: finalProfileData.sleepHabits
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add final analysis to conversation
    const finalAnalysis = await generateFinalAnalysis(userProfile);
    setConversation(prev => [...prev, finalAnalysis]);

    // Complete the setup
    setUserProfile(userProfile);
    
    // Generate and set the first training phase
    const trainingPhases = generateTrainingProgram(userProfile);
    if (trainingPhases.length > 0) {
      setCurrentPhase(trainingPhases[0]); // Set Phase 1 as the current phase
    }
    
    setIsComplete(true);
    setIsLoading(false);
  };

  const generateFinalAnalysis = async (userProfile: any): Promise<AIResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    let focus = 'lean_recomp';
    if (userProfile.targetPhysique.includes('NFL Fullback')) focus = 'strength_hypertrophy';
    else if (userProfile.targetPhysique.includes('Lean Athlete')) focus = 'lean_recomp';
    else if (userProfile.targetPhysique.includes('Powerlifter')) focus = 'strength';
    else if (userProfile.targetPhysique.includes('Bodybuilder')) focus = 'hypertrophy';

    const bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[userProfile.activityLevel as string];
    const protein = userProfile.weight * 2.2;
    const fat = (tdee * 0.25) / 9;
    const carbs = (tdee - (protein * 4) - (fat * 9)) / 4;

    return {
      type: 'plan',
      content: `🎯 **Your Personalized Fitness Plan is Ready!**

**Profile Summary:**
- **Name:** ${userProfile.name}
- **Goal:** ${userProfile.targetPhysique}
- **Focus:** ${focus === 'strength_hypertrophy' ? 'Strength + Hypertrophy + Conditioning' : 
              focus === 'lean_recomp' ? 'Lean Recomposition' : 
              focus === 'strength' ? 'Maximal Strength' : 'Muscle Building'}

**Nutrition Targets:**
- **Daily Calories:** ${Math.round(tdee)} kcal
- **Protein:** ${Math.round(protein)}g (${Math.round((protein * 4 / tdee) * 100)}%)
- **Carbs:** ${Math.round(carbs)}g (${Math.round((carbs * 4 / tdee) * 100)}%)
- **Fat:** ${Math.round(fat)}g (${Math.round((fat * 9 / tdee) * 100)}%)

**Training Strategy:**
- **Frequency:** ${userProfile.equipment.length > 0 ? '4-5 days/week' : '3-4 days/week'}
- **Focus:** Compound movements, progressive overload, RPE-based progression
- **Equipment:** ${userProfile.equipment.length > 0 ? userProfile.equipment.join(', ') : 'Bodyweight + minimal equipment'}

**Recovery & Lifestyle:**
- **Sleep Target:** ${userProfile.sleepSchedule.targetSleepHours} hours
- **Sleep Quality:** ${userProfile.sleepSchedule.sleepQuality}/10
- **Stress Management:** Integrated into your plan

**Next Steps:**
1. Review your dashboard for personalized insights
2. Start with your first workout
3. Track your nutrition and progress
4. Ask your AI coach for ongoing guidance

**Citations:** NSCA Guidelines, ACSM Position Stands, ISSN Recommendations

Ready to transform your fitness journey? Let's get started! 💪`,
      data: userProfile
    };
  };

  if (isComplete) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Card sx={{ textAlign: 'center', mb: 3 }}>
          <CardContent>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
              <CheckCircle sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              Profile Complete! 🎉
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Your AI coach has created a personalized fitness plan just for you
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/dashboard"
              startIcon={<FitnessCenter />}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SmartToy sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4">
              AI-Powered Profile Setup
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Your AI coach will ask intelligent questions to create the perfect fitness plan
          </Typography>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Question {currentStep + 1} of {aiQuestions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(((currentStep + 1) / aiQuestions.length) * 100)}% Complete
            </Typography>
          </Box>
          <Stepper activeStep={currentStep} alternativeLabel>
            {['Basic Info', 'Goals', 'Lifestyle', 'Equipment', 'Health'].map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                <SmartToy sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6">
                AI Coach Question
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
              {currentQuestion.question}
            </Typography>

            {currentQuestion.followUp && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {currentQuestion.followUp}
              </Alert>
            )}

            {currentQuestion.type === 'text' && (
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}

            {currentQuestion.type === 'number' && (
              <TextField
                fullWidth
                type="number"
                placeholder="Enter number..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}

            {currentQuestion.type === 'select' && (
              <Box sx={{ mb: 2 }}>
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={userAnswer === option ? 'contained' : 'outlined'}
                    onClick={() => setUserAnswer(option)}
                    sx={{ m: 0.5 }}
                    fullWidth
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            )}

            {currentQuestion.type === 'multi_select' && (
              <Box sx={{ mb: 2 }}>
                {currentQuestion.options?.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    onClick={() => {
                      const current = userAnswer ? userAnswer.split(',') : [];
                      const newSelection = current.includes(option)
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      setUserAnswer(newSelection.join(', '));
                    }}
                    color={userAnswer.includes(option) ? 'primary' : 'default'}
                    variant={userAnswer.includes(option) ? 'filled' : 'outlined'}
                    sx={{ m: 0.5 }}
                    clickable
                  />
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleAnswer}
              disabled={!userAnswer.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              fullWidth
              size="large"
            >
              {isLoading ? 'Processing...' : 'Submit Answer'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      {conversation.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Conversation with AI Coach
            </Typography>
            <List>
              {conversation.map((response, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: response.type === 'question' ? 'primary.main' : 'secondary.main' }}>
                      {response.type === 'question' ? <SmartToy sx={{ fontSize: 16 }} /> : <CheckCircle sx={{ fontSize: 16 }} />}
                    </Avatar>
                    <Typography variant="subtitle2" color={response.type === 'question' ? 'primary' : 'secondary'}>
                      {response.type === 'question' ? 'AI Coach' : 'Analysis'}
                    </Typography>
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

                  {response.nextAction && (
                    <Alert severity="info" sx={{ width: '100%' }}>
                      {response.nextAction}
                    </Alert>
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIPoweredProfileSetup;
