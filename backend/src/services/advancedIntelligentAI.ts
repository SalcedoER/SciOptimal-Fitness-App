import { UserProfile, WorkoutSession, NutritionEntry } from '../store';

export interface AIResponse {
  content: string;
  suggestions: string[];
  confidence: number;
  personalized: boolean;
  action?: string;
  data?: any;
}

export interface ConversationContext {
  userProfile: UserProfile | null;
  recentMessages: string[];
  currentGoals: string[];
  workoutHistory: WorkoutSession[];
  nutritionLog: NutritionEntry[];
  mood: string;
  lastWorkoutDate?: Date;
  lastNutritionDate?: Date;
  userPreferences: UserPreferences;
  conversationHistory: ConversationEntry[];
}

export interface UserPreferences {
  preferredIntensity: 'low' | 'moderate' | 'high';
  preferredWorkoutTimes: string[];
  favoriteExercises: string[];
  commonFoods: string[];
  communicationStyle: 'encouraging' | 'technical' | 'casual' | 'motivational';
  goals: string[];
  challenges: string[];
  achievements: string[];
}

export interface ConversationEntry {
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  intent: string;
  sentiment: string;
  entities: any[];
  satisfaction: number;
}

export class AdvancedIntelligentAI {
  private static conversationMemory: Map<string, ConversationContext> = new Map();
  private static userPatterns: Map<string, UserPreferences> = new Map();
  private static responseVariations: Map<string, string[]> = new Map();

  static async generateResponse(
    userMessage: string,
    userProfile: UserProfile | null,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[],
    sessionId: string = 'default'
  ): Promise<AIResponse> {
    
    // Create or update conversation context
    const context = this.getOrCreateContext(sessionId, userProfile, workoutHistory, nutritionLog);
    
    // Update conversation memory
    context.recentMessages.push(userMessage);
    if (context.recentMessages.length > 10) {
      context.recentMessages = context.recentMessages.slice(-10);
    }
    
    // Analyze user intent and sentiment with advanced NLP
    const analysis = this.analyzeMessageAdvanced(userMessage, context);
    
    // Generate dynamic, contextual response
    const response = this.generateDynamicResponse(analysis, context);
    
    // Learn from this interaction
    this.learnFromInteraction(sessionId, userMessage, response, analysis);
    
    return response;
  }

  private static getOrCreateContext(
    sessionId: string,
    userProfile: UserProfile | null,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[]
  ): ConversationContext {
    if (!this.conversationMemory.has(sessionId)) {
      this.conversationMemory.set(sessionId, {
        userProfile,
        recentMessages: [],
        currentGoals: userProfile ? [userProfile.targetPhysique] : [],
        workoutHistory,
        nutritionLog,
        mood: 'neutral',
        lastWorkoutDate: this.getLastWorkoutDate(workoutHistory),
        lastNutritionDate: this.getLastNutritionDate(nutritionLog),
        userPreferences: this.getDefaultPreferences(),
        conversationHistory: []
      });
    }
    
    const context = this.conversationMemory.get(sessionId)!;
    context.userProfile = userProfile;
    context.workoutHistory = workoutHistory;
    context.nutritionLog = nutritionLog;
    context.currentGoals = userProfile ? [userProfile.targetPhysique] : [];
    
    return context;
  }

  private static getDefaultPreferences(): UserPreferences {
    return {
      preferredIntensity: 'moderate',
      preferredWorkoutTimes: [],
      favoriteExercises: [],
      commonFoods: [],
      communicationStyle: 'encouraging',
      goals: [],
      challenges: [],
      achievements: []
    };
  }

  private static analyzeMessageAdvanced(message: string, context: ConversationContext) {
    const lowerMessage = message.toLowerCase();
    
    // Advanced intent analysis with multiple patterns
    const intent = this.detectIntent(lowerMessage, context);
    
    // Enhanced sentiment analysis
    const sentiment = this.analyzeSentimentAdvanced(lowerMessage, context);
    
    // Extract entities with context
    const entities = this.extractEntitiesAdvanced(lowerMessage, context);
    
    // Detect user patterns and preferences
    const patterns = this.detectPatterns(message, context);
    
    // Calculate confidence based on multiple factors
    const confidence = this.calculateConfidenceAdvanced(intent, entities, context, sentiment);
    
    return {
      intent,
      sentiment,
      entities,
      patterns,
      confidence,
      urgency: this.detectUrgency(lowerMessage),
      complexity: this.detectComplexity(message),
      emotionalState: this.detectEmotionalState(lowerMessage, context)
    };
  }

  private static detectIntent(message: string, context: ConversationContext): string {
    // More sophisticated intent detection
    const workoutPatterns = [
      'workout', 'exercise', 'gym', 'train', 'training', 'lift', 'lifting', 'cardio', 'strength',
      'muscle', 'gains', 'squat', 'deadlift', 'bench', 'press', 'curl', 'row', 'pull', 'push'
    ];
    
    const nutritionPatterns = [
      'food', 'eat', 'meal', 'nutrition', 'diet', 'calorie', 'protein', 'carbs', 'fat',
      'breakfast', 'lunch', 'dinner', 'snack', 'macro', 'supplement', 'vitamin'
    ];
    
    const progressPatterns = [
      'progress', 'how am i doing', 'analytics', 'stats', 'results', 'improvement',
      'gains', 'loss', 'weight', 'muscle', 'strength', 'performance'
    ];
    
    const advicePatterns = [
      'help', 'advice', 'tips', 'how to', 'what should', 'recommend', 'suggest',
      'best way', 'optimal', 'efficient', 'effective'
    ];
    
    const motivationPatterns = [
      'motivate', 'motivation', 'encourage', 'support', 'struggle', 'difficult',
      'hard', 'tired', 'exhausted', 'frustrated', 'stuck'
    ];
    
    const planningPatterns = [
      'plan', 'schedule', 'routine', 'program', 'regimen', 'structure',
      'organize', 'arrange', 'coordinate'
    ];

    // Check for multiple intents
    const intents = [];
    if (workoutPatterns.some(pattern => message.includes(pattern))) intents.push('workout');
    if (nutritionPatterns.some(pattern => message.includes(pattern))) intents.push('nutrition');
    if (progressPatterns.some(pattern => message.includes(pattern))) intents.push('progress');
    if (advicePatterns.some(pattern => message.includes(pattern))) intents.push('advice');
    if (motivationPatterns.some(pattern => message.includes(pattern))) intents.push('motivation');
    if (planningPatterns.some(pattern => message.includes(pattern))) intents.push('planning');

    // Return primary intent or combined
    if (intents.length === 0) return 'general';
    if (intents.length === 1) return intents[0];
    return intents.join('_'); // e.g., 'workout_nutrition'
  }

  private static analyzeSentimentAdvanced(message: string, context: ConversationContext): string {
    const positiveWords = [
      'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful', 'love', 'enjoy',
      'proud', 'accomplished', 'achieved', 'success', 'win', 'victory', 'happy', 'excited',
      'motivated', 'energized', 'confident', 'strong', 'powerful'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'dislike', 'frustrated', 'angry', 'sad',
      'disappointed', 'discouraged', 'weak', 'tired', 'exhausted', 'struggling',
      'difficult', 'hard', 'challenging', 'stuck', 'plateau'
    ];
    
    const urgentWords = [
      'urgent', 'asap', 'immediately', 'quickly', 'fast', 'emergency', 'crisis',
      'help now', 'need help', 'stuck', 'problem'
    ];

    const positiveCount = positiveWords.filter(word => message.includes(word)).length;
    const negativeCount = negativeWords.filter(word => message.includes(word)).length;
    const urgentCount = urgentWords.filter(word => message.includes(word)).length;

    if (urgentCount > 0) return 'urgent';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private static extractEntitiesAdvanced(message: string, context: ConversationContext): any[] {
    const entities: any[] = [];
    
    // Extract numbers with context
    const numbers = message.match(/\d+(\.\d+)?/g);
    if (numbers) {
      entities.push({ 
        type: 'number', 
        value: numbers.map(Number),
        context: this.getNumberContext(message)
      });
    }
    
    // Extract food items with nutritional context
    const foodKeywords = [
      'chicken', 'beef', 'fish', 'salmon', 'tuna', 'eggs', 'milk', 'cheese', 'yogurt',
      'rice', 'pasta', 'bread', 'potato', 'sweet potato', 'quinoa', 'oats',
      'banana', 'apple', 'orange', 'berries', 'avocado', 'spinach', 'broccoli',
      'protein', 'carbs', 'calories', 'fat', 'fiber', 'vitamin', 'mineral'
    ];
    const foundFoods = foodKeywords.filter(food => message.toLowerCase().includes(food));
    if (foundFoods.length > 0) {
      entities.push({ 
        type: 'food', 
        value: foundFoods,
        nutritionalValue: this.getNutritionalContext(foundFoods)
      });
    }
    
    // Extract exercises with muscle groups
    const exerciseKeywords = [
      'squat', 'deadlift', 'bench press', 'overhead press', 'bicep curl', 'tricep extension',
      'row', 'pull-up', 'push-up', 'dip', 'lunge', 'leg press', 'calf raise',
      'plank', 'crunch', 'sit-up', 'burpee', 'mountain climber'
    ];
    const foundExercises = exerciseKeywords.filter(exercise => message.toLowerCase().includes(exercise));
    if (foundExercises.length > 0) {
      entities.push({ 
        type: 'exercise', 
        value: foundExercises,
        muscleGroups: this.getMuscleGroups(foundExercises)
      });
    }
    
    // Extract time references
    const timePatterns = [
      'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday',
      'this week', 'next week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    const foundTimes = timePatterns.filter(time => message.toLowerCase().includes(time));
    if (foundTimes.length > 0) {
      entities.push({ type: 'time', value: foundTimes });
    }
    
    return entities;
  }

  private static getNumberContext(message: string): string {
    if (message.includes('weight') || message.includes('kg') || message.includes('lb')) return 'weight';
    if (message.includes('rep') || message.includes('set')) return 'exercise';
    if (message.includes('calorie') || message.includes('cal')) return 'nutrition';
    if (message.includes('minute') || message.includes('hour')) return 'time';
    return 'general';
  }

  private static getNutritionalContext(foods: string[]): any {
    // Simplified nutritional context
    const proteinFoods = ['chicken', 'beef', 'fish', 'eggs', 'milk', 'cheese', 'yogurt'];
    const carbFoods = ['rice', 'pasta', 'bread', 'potato', 'quinoa', 'oats', 'banana'];
    const fatFoods = ['avocado', 'nuts', 'olive oil', 'cheese'];
    
    return {
      protein: foods.filter(food => proteinFoods.includes(food)).length,
      carbs: foods.filter(food => carbFoods.includes(food)).length,
      fats: foods.filter(food => fatFoods.includes(food)).length
    };
  }

  private static getMuscleGroups(exercises: string[]): string[] {
    const muscleMap: { [key: string]: string[] } = {
      'squat': ['quadriceps', 'glutes', 'hamstrings'],
      'deadlift': ['hamstrings', 'glutes', 'back', 'traps'],
      'bench press': ['chest', 'triceps', 'shoulders'],
      'overhead press': ['shoulders', 'triceps'],
      'bicep curl': ['biceps'],
      'row': ['back', 'biceps', 'rear delts']
    };
    
    const muscleGroups: string[] = [];
    exercises.forEach(exercise => {
      if (muscleMap[exercise]) {
        muscleGroups.push(...muscleMap[exercise]);
      }
    });
    
    return [...new Set(muscleGroups)];
  }

  private static detectPatterns(message: string, context: ConversationContext): any {
    const patterns: any = {};
    
    // Time patterns
    if (message.includes('morning') || message.includes('am')) {
      patterns.timePreference = 'morning';
    } else if (message.includes('evening') || message.includes('pm')) {
      patterns.timePreference = 'evening';
    }
    
    // Intensity patterns
    if (message.includes('hard') || message.includes('intense') || message.includes('challenging')) {
      patterns.intensityPreference = 'high';
    } else if (message.includes('easy') || message.includes('light') || message.includes('moderate')) {
      patterns.intensityPreference = 'low';
    }
    
    // Goal patterns
    if (message.includes('muscle') || message.includes('strength') || message.includes('bulk')) {
      patterns.goalFocus = 'muscle_gain';
    } else if (message.includes('fat') || message.includes('lean') || message.includes('cut')) {
      patterns.goalFocus = 'fat_loss';
    } else if (message.includes('endurance') || message.includes('stamina') || message.includes('cardio')) {
      patterns.goalFocus = 'endurance';
    }
    
    // Communication style patterns
    if (message.includes('please') || message.includes('thank you') || message.includes('appreciate')) {
      patterns.communicationStyle = 'polite';
    } else if (message.includes('yo') || message.includes('hey') || message.includes('what\'s up')) {
      patterns.communicationStyle = 'casual';
    } else if (message.includes('explain') || message.includes('how does') || message.includes('why')) {
      patterns.communicationStyle = 'technical';
    }
    
    return patterns;
  }

  private static detectUrgency(message: string): number {
    const urgentWords = ['urgent', 'asap', 'immediately', 'quickly', 'emergency', 'crisis'];
    const urgentCount = urgentWords.filter(word => message.includes(word)).length;
    return Math.min(urgentCount / 2, 1); // Scale 0-1
  }

  private static detectComplexity(message: string): number {
    const complexWords = ['analyze', 'optimize', 'calculate', 'formula', 'algorithm', 'methodology'];
    const complexCount = complexWords.filter(word => message.includes(word)).length;
    return Math.min(complexCount / 3, 1); // Scale 0-1
  }

  private static detectEmotionalState(message: string, context: ConversationContext): string {
    if (message.includes('excited') || message.includes('pumped') || message.includes('ready')) return 'excited';
    if (message.includes('tired') || message.includes('exhausted') || message.includes('drained')) return 'tired';
    if (message.includes('frustrated') || message.includes('stuck') || message.includes('plateau')) return 'frustrated';
    if (message.includes('confident') || message.includes('strong') || message.includes('powerful')) return 'confident';
    if (message.includes('nervous') || message.includes('anxious') || message.includes('worried')) return 'anxious';
    return 'neutral';
  }

  private static calculateConfidenceAdvanced(intent: string, entities: any[], context: ConversationContext, sentiment: string): number {
    let confidence = 0.5;
    
    // Higher confidence for specific intents
    if (intent !== 'general') {
      confidence += 0.2;
    }
    
    // Higher confidence with more entities
    if (entities.length > 0) {
      confidence += Math.min(entities.length * 0.1, 0.3);
    }
    
    // Higher confidence with user profile
    if (context.userProfile) {
      confidence += 0.2;
    }
    
    // Higher confidence with conversation history
    if (context.conversationHistory.length > 0) {
      confidence += Math.min(context.conversationHistory.length * 0.02, 0.1);
    }
    
    // Adjust based on sentiment clarity
    if (sentiment !== 'neutral') {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 0.95);
  }

  private static generateDynamicResponse(analysis: any, context: ConversationContext): AIResponse {
    const { intent, sentiment, entities, patterns, confidence, urgency, complexity, emotionalState } = analysis;
    
    // Generate completely dynamic response
    let response = this.generateCompletelyDynamicResponse(intent, context, analysis);
    
    // Add dynamic personalization
    response = this.addDynamicPersonalization(response, patterns, context, sentiment, emotionalState);
    
    // Add contextual suggestions
    response.suggestions = this.generateContextualSuggestions(entities, intent, context, analysis);
    
    // Add urgency indicators
    if (urgency > 0.5) {
      response.content = `🚨 ${response.content}`;
    }
    
    return {
      ...response,
      confidence,
      personalized: this.isPersonalized(patterns, context),
      action: this.determineAction(intent, analysis)
    };
  }

  private static generateCompletelyDynamicResponse(intent: string, context: ConversationContext, analysis: any): any {
    // Generate intelligent, contextual responses based on user data and situation
    const content = this.generateIntelligentContent(intent, context, analysis);
    const suggestions = this.generateContextualSuggestions(intent, context, analysis);
    const action = this.determineSmartAction(intent, context, analysis);
    
    return {
      content,
      suggestions,
      action
    };
  }

  private static generateIntelligentContent(intent: string, context: ConversationContext, analysis: any): string {
    const { sentiment, emotionalState, urgency } = analysis;
    const userProfile = context.userProfile;
    const recentWorkouts = context.workoutHistory.slice(-3);
    const recentNutrition = context.nutritionLog.slice(-7);
    
    // Generate intelligent responses based on actual user data and context
    switch (intent) {
      case 'workout':
        return this.generateSmartWorkoutResponse(userProfile, recentWorkouts, context, analysis);
      case 'nutrition':
        return this.generateSmartNutritionResponse(userProfile, recentNutrition, context, analysis);
      case 'progress':
        return this.generateSmartProgressResponse(userProfile, recentWorkouts, recentNutrition, context, analysis);
      case 'advice':
        return this.generateSmartAdviceResponse(userProfile, context, analysis);
      case 'motivation':
        return this.generateSmartMotivationResponse(userProfile, recentWorkouts, context, analysis);
      default:
        return this.generateSmartGeneralResponse(userProfile, context, analysis);
    }
  }

  private static generateSmartWorkoutResponse(userProfile: UserProfile | null, recentWorkouts: WorkoutSession[], context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "I'd love to help you with your workouts! First, let's complete your profile so I can create personalized training plans that match your goals and fitness level.";
    }

    const lastWorkout = recentWorkouts[recentWorkouts.length - 1];
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    const workoutCount = recentWorkouts.length;
    const avgRPE = recentWorkouts.length > 0 ? 
      recentWorkouts.reduce((sum, w) => sum + (w.rpe || 5), 0) / recentWorkouts.length : 5;

    // Intelligent analysis based on actual data
    if (workoutCount === 0) {
      return `Welcome to your fitness journey! As someone targeting a ${userProfile.targetPhysique} physique, I'll create a comprehensive training plan that builds strength, power, and athleticism. Your current stats (${userProfile.weight}lbs, ${userProfile.height}cm) suggest we should focus on compound movements and progressive overload. Ready to start?`;
    } else if (daysSinceLastWorkout === 0) {
      const lastRPE = lastWorkout?.rpe || 5;
      if (lastRPE >= 8) {
        return `Excellent work today! That was a high-intensity session (RPE ${lastRPE}). For your ${userProfile.targetPhysique} goals, I recommend focusing on recovery - proper nutrition, hydration, and sleep. Tomorrow we can do active recovery or a lighter session. How are you feeling?`;
      } else {
        return `Good session today! Since your RPE was ${lastRPE}, you have room to push harder next time. For your ${userProfile.targetPhysique} transformation, we need to progressively overload. What muscle groups felt strongest today?`;
      }
    } else if (daysSinceLastWorkout === 1) {
      return `Perfect timing for your next workout! Your consistency is key for ${userProfile.targetPhysique} development. Based on your last session, I suggest focusing on upper body to balance your training. Ready to train?`;
    } else if (daysSinceLastWorkout <= 3) {
      return `It's been ${daysSinceLastWorkout} days since your last workout. No worries - life happens! For your ${userProfile.targetPhysique} goals, let's get back on track with a session that matches your current energy level. What's your preference: upper body, lower body, or full body?`;
    } else {
      return `Welcome back! It's been ${daysSinceLastWorkout} days since your last workout. For your ${userProfile.targetPhysique} goals, we need to restart gradually to avoid injury. I recommend starting with a moderate-intensity full-body session to re-engage your muscles. Sound good?`;
    }
  }

  private static generateSmartNutritionResponse(userProfile: UserProfile | null, recentNutrition: NutritionEntry[], context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "I'd love to help optimize your nutrition! Please complete your profile first so I can calculate your precise macro targets based on your goals, body composition, and activity level.";
    }

    const todayNutrition = recentNutrition.filter(n => 
      new Date(n.date).toDateString() === new Date().toDateString()
    );
    
    if (todayNutrition.length === 0) {
      return `Let's fuel your ${userProfile.targetPhysique} goals! Based on your stats (${userProfile.weight}lbs, ${userProfile.height}cm, ${userProfile.activityLevel}), you need approximately 2,800-3,200 calories daily. For muscle building, aim for 1.6-2.2g protein per kg body weight. What would you like to log first?`;
    } else {
      const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
      const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);
      const totalCarbs = todayNutrition.reduce((sum, n) => sum + n.carbs, 0);
      const totalFat = todayNutrition.reduce((sum, n) => sum + n.fat, 0);
      
      const proteinTarget = userProfile.weight * 2.2; // 2.2g per kg
      const proteinProgress = (totalProtein / proteinTarget * 100).toFixed(1);
      
      if (totalProtein < proteinTarget * 0.8) {
        return `Your nutrition tracking is great! You're at ${totalCalories} calories with ${totalProtein.toFixed(1)}g protein (${proteinProgress}% of target). For your ${userProfile.targetPhysique} goals, you need more protein - try adding lean meat, Greek yogurt, or a protein shake. What's your next meal?`;
      } else if (totalCalories < 2500) {
        return `Good macro balance! ${totalCalories} calories with ${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, ${totalFat.toFixed(1)}g fat. For your ${userProfile.targetPhysique} goals, you might need more calories overall. Consider adding healthy fats like nuts or avocado. What's next?`;
      } else {
        return `Excellent nutrition today! ${totalCalories} calories with solid macros (${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, ${totalFat.toFixed(1)}g fat). This is perfect for your ${userProfile.targetPhysique} goals. Keep this up! What else can I help with?`;
      }
    }
  }

  private static generateSmartProgressResponse(userProfile: UserProfile | null, recentWorkouts: WorkoutSession[], recentNutrition: NutritionEntry[], context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "I'd love to analyze your progress! Please complete your profile first so I can track your journey toward your fitness goals.";
    }

    const workoutCount = recentWorkouts.length;
    const nutritionCount = recentNutrition.length;
    const avgRPE = recentWorkouts.length > 0 ? 
      recentWorkouts.reduce((sum, w) => sum + (w.rpe || 5), 0) / recentWorkouts.length : 0;
    
    if (workoutCount === 0 && nutritionCount === 0) {
      return `Let's start tracking your ${userProfile.targetPhysique} journey! I'll help you monitor your workouts, nutrition, and progress. Every data point helps me give you better advice. Ready to begin?`;
    } else if (workoutCount > 0 && nutritionCount > 0) {
      const consistency = Math.min(workoutCount / 7, 1) * 100;
      return `Great progress tracking! You've logged ${workoutCount} workouts and ${nutritionCount} nutrition entries. Your consistency is ${consistency.toFixed(0)}%. For your ${userProfile.targetPhysique} goals, this data shows you're ${avgRPE > 7 ? 'pushing hard' : 'building steadily'}. Keep it up!`;
    } else if (workoutCount > 0) {
      return `Good workout tracking! You've logged ${workoutCount} sessions with an average RPE of ${avgRPE.toFixed(1)}. For your ${userProfile.targetPhysique} goals, I'd also recommend tracking your nutrition to see the full picture. Want to start logging meals?`;
    } else {
      return `Nice nutrition tracking! You've logged ${nutritionCount} entries. For your ${userProfile.targetPhysique} goals, I'd also recommend tracking your workouts to monitor strength gains and performance. Ready to log some training sessions?`;
    }
  }

  private static generateSmartAdviceResponse(userProfile: UserProfile | null, context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "I'd love to give you personalized advice! Please complete your profile first so I can provide guidance tailored to your specific goals and situation.";
    }

    const recentWorkouts = context.workoutHistory.slice(-7);
    const recentNutrition = context.nutritionLog.slice(-7);
    const workoutCount = recentWorkouts.length;
    const nutritionCount = recentNutrition.length;
    
    // Provide specific advice based on user's actual data
    if (workoutCount === 0) {
      return `For your ${userProfile.targetPhysique} goals, start with 3-4 workouts per week focusing on compound movements. Since you're ${userProfile.activityLevel.toLowerCase()}, begin with moderate intensity and gradually increase. Key exercises: squats, deadlifts, bench press, rows, and overhead press. Form over weight always!`;
    } else if (nutritionCount === 0) {
      return `Your workout consistency is great! For your ${userProfile.targetPhysique} goals, nutrition is equally important. Aim for 1.6-2.2g protein per kg body weight (${(userProfile.weight * 0.45 * 2.2).toFixed(0)}g daily). Time your carbs around workouts and include healthy fats. Want help planning meals?`;
    } else if (workoutCount < 3) {
      return `You're tracking well! For your ${userProfile.targetPhysique} goals, increase workout frequency to 3-4x weekly. Focus on progressive overload - add weight, reps, or sets each week. Your current routine needs more volume. What's your main training focus?`;
    } else {
      return `Excellent consistency! You're on track for your ${userProfile.targetPhysique} goals. Key advice: 1) Progressive overload weekly, 2) 7-9 hours sleep for recovery, 3) Stay hydrated (3-4L daily), 4) Track your progress monthly. What specific area needs improvement?`;
    }
  }

  private static generateSmartMotivationResponse(userProfile: UserProfile | null, recentWorkouts: WorkoutSession[], context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "You've got this! Every fitness journey starts with a single step. I'm here to support you every step of the way toward your goals.";
    }

    const workoutCount = recentWorkouts.length;
    const lastWorkout = recentWorkouts[recentWorkouts.length - 1];
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    // Provide motivation based on actual progress
    if (workoutCount === 0) {
      return `Your ${userProfile.targetPhysique} transformation starts today! You have the power to change your body and life. Every champion was once a beginner who refused to give up. Let's make it happen!`;
    } else if (workoutCount < 5) {
      return `You're building momentum! Those ${workoutCount} workouts are the foundation of your ${userProfile.targetPhysique} success. Consistency beats perfection - keep showing up and the results will follow. You're stronger than you think!`;
    } else if (daysSinceLastWorkout === 0) {
      return `Amazing work today! Your dedication to becoming a ${userProfile.targetPhysique} is inspiring. Every rep, every set, every drop of sweat is bringing you closer to your goals. You're crushing it!`;
    } else if (daysSinceLastWorkout <= 2) {
      return `You're on fire! ${workoutCount} workouts logged and counting. Your ${userProfile.targetPhysique} goals are within reach because you're putting in the work. Keep this energy going - you're unstoppable!`;
    } else {
      return `You've got this! Your ${workoutCount} workouts prove you're committed to your ${userProfile.targetPhysique} goals. Every champion faces setbacks - what matters is getting back up. You're stronger than any obstacle. Let's go!`;
    }
  }

  private static generateSmartGeneralResponse(userProfile: UserProfile | null, context: ConversationContext, analysis: any): string {
    if (!userProfile) {
      return "I'm here to help you achieve your fitness goals! Whether it's workouts, nutrition, progress tracking, or motivation, I've got your back. What would you like to work on today?";
    }

    return `I'm excited to help you reach your ${userProfile.targetPhysique} goals! With your ${userProfile.activityLevel.toLowerCase()} lifestyle and current stats, we can create a plan that works for you. What's on your mind today?`;
  }

  // Random word generators for truly unique content
  private static getRandomVerb(): string {
    const verbs = ['crush', 'dominate', 'conquer', 'master', 'excel', 'achieve', 'push', 'drive', 'power', 'fuel'];
    return verbs[Math.floor(Math.random() * verbs.length)];
  }

  private static getRandomIntensity(): string {
    const intensities = ['intense', 'powerful', 'explosive', 'dynamic', 'brutal', 'savage', 'epic', 'legendary', 'insane', 'unleashed'];
    return intensities[Math.floor(Math.random() * intensities.length)];
  }

  private static getRandomMotivation(): string {
    const motivations = ['You\'ve got this!', 'Let\'s go!', 'Time to shine!', 'You\'re unstoppable!', 'Make it happen!', 'Push harder!', 'Stay strong!', 'Keep going!', 'You\'re amazing!', 'Believe in yourself!'];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  private static getRandomAction(): string {
    const actions = ['push', 'pull', 'squat', 'press', 'lift', 'run', 'jump', 'explode', 'power', 'thrive'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private static getRandomGoal(): string {
    const goals = ['build strength', 'gain power', 'increase endurance', 'improve form', 'boost performance', 'enhance mobility', 'develop speed', 'create muscle', 'achieve greatness', 'reach new heights'];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  private static getRandomEncouragement(): string {
    const encouragements = ['You\'re doing incredible!', 'Keep pushing forward!', 'You\'re stronger than you think!', 'Every rep counts!', 'You\'re making progress!', 'Stay focused!', 'You\'re crushing it!', 'Don\'t give up!', 'You\'re on fire!', 'Keep the momentum!'];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private static getRandomWorkoutType(): string {
    const types = ['train hard', 'work out', 'exercise', 'sweat it out', 'get after it', 'push limits', 'build muscle', 'burn calories', 'get stronger', 'transform'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static getRandomResult(): string {
    const results = ['see results', 'make gains', 'get stronger', 'build muscle', 'burn fat', 'improve fitness', 'boost energy', 'enhance performance', 'achieve goals', 'transform your body'];
    return results[Math.floor(Math.random() * results.length)];
  }

  private static getRandomSupport(): string {
    const supports = ['I\'m here for you!', 'You\'ve got my support!', 'Let\'s do this together!', 'I believe in you!', 'You\'re not alone!', 'We\'re in this together!', 'You\'re doing great!', 'Keep it up!', 'You\'re amazing!', 'Stay strong!'];
    return supports[Math.floor(Math.random() * supports.length)];
  }

  private static getRandomBodyPart(): string {
    const bodyParts = ['core', 'back', 'chest', 'legs', 'arms', 'shoulders', 'glutes', 'abs', 'muscles', 'strength'];
    return bodyParts[Math.floor(Math.random() * bodyParts.length)];
  }

  private static getRandomExercise(): string {
    const exercises = ['work', 'perform', 'excel', 'dominate', 'push', 'pull', 'squat', 'press', 'lift', 'thrive'];
    return exercises[Math.floor(Math.random() * exercises.length)];
  }

  private static getRandomFocus(): string {
    const focuses = ['focus on form', 'push the limits', 'build strength', 'improve technique', 'increase intensity', 'enhance performance', 'boost power', 'develop speed', 'create muscle', 'achieve greatness'];
    return focuses[Math.floor(Math.random() * focuses.length)];
  }

  private static getRandomAchievement(): string {
    const achievements = ['see amazing results', 'make incredible gains', 'get stronger than ever', 'build serious muscle', 'burn tons of fat', 'improve dramatically', 'boost your energy', 'enhance your performance', 'achieve your goals', 'transform completely'];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  // Nutrition generators
  private static getRandomNutritionAction(): string {
    const actions = ['fuel', 'nourish', 'optimize', 'enhance', 'boost', 'power', 'strengthen', 'support', 'improve', 'maximize'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private static getRandomMealType(): string {
    const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout', 'recovery meal', 'fuel meal', 'power meal', 'nutrition meal'];
    return meals[Math.floor(Math.random() * meals.length)];
  }

  private static getRandomBenefit(): string {
    const benefits = ['maximum energy', 'optimal recovery', 'muscle growth', 'fat burning', 'performance boost', 'strength gains', 'endurance improvement', 'health optimization', 'body transformation', 'peak performance'];
    return benefits[Math.floor(Math.random() * benefits.length)];
  }

  private static getRandomNutritionTip(): string {
    const tips = ['Remember to stay hydrated!', 'Protein is your friend!', 'Carbs fuel your workouts!', 'Healthy fats are essential!', 'Timing matters!', 'Quality over quantity!', 'Listen to your body!', 'Consistency is key!', 'You\'re doing great!', 'Keep it up!'];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  private static getRandomFuel(): string {
    const fuels = ['fuel', 'power', 'energize', 'nourish', 'strengthen', 'boost', 'enhance', 'optimize', 'support', 'maximize'];
    return fuels[Math.floor(Math.random() * fuels.length)];
  }

  private static getRandomNutrient(): string {
    const nutrients = ['protein', 'carbs', 'healthy fats', 'vitamins', 'minerals', 'antioxidants', 'fiber', 'omega-3s', 'electrolytes', 'micronutrients'];
    return nutrients[Math.floor(Math.random() * nutrients.length)];
  }

  private static getRandomNutritionAdvice(): string {
    const advice = ['Your body will thank you!', 'This will fuel your gains!', 'Perfect for your goals!', 'Your muscles need this!', 'This is exactly what you need!', 'Your performance will improve!', 'This will help you recover!', 'Your energy will soar!', 'This is the right choice!', 'You\'re making great decisions!'];
    return advice[Math.floor(Math.random() * advice.length)];
  }

  private static getRandomMealTime(): string {
    const times = ['morning', 'afternoon', 'evening', 'pre-workout', 'post-workout', 'bedtime', 'midday', 'late night', 'early morning', 'lunch time'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private static getRandomMacro(): string {
    const macros = ['protein', 'carbs', 'healthy fats', 'fiber', 'vitamins', 'minerals', 'antioxidants', 'omega-3s', 'electrolytes', 'micronutrients'];
    return macros[Math.floor(Math.random() * macros.length)];
  }

  private static getRandomNutritionGoal(): string {
    const goals = ['build muscle', 'burn fat', 'boost energy', 'improve recovery', 'enhance performance', 'strengthen immunity', 'optimize health', 'maximize gains', 'support training', 'fuel workouts'];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  private static getRandomNutritionSupport(): string {
    const supports = ['Your body needs this!', 'This will help you succeed!', 'Perfect for your goals!', 'Your muscles will love this!', 'This is exactly what you need!', 'Your performance will improve!', 'This will fuel your workouts!', 'Your recovery will be faster!', 'This is the right choice!', 'You\'re making smart decisions!'];
    return supports[Math.floor(Math.random() * supports.length)];
  }

  private static getRandomNutritionPlan(): string {
    const plans = ['plan your meals', 'optimize your nutrition', 'fuel your body', 'nourish your muscles', 'boost your energy', 'enhance your performance', 'support your training', 'maximize your gains', 'improve your health', 'transform your body'];
    return plans[Math.floor(Math.random() * plans.length)];
  }

  private static getRandomNutritionResult(): string {
    const results = ['see amazing results', 'make incredible gains', 'get stronger than ever', 'build serious muscle', 'burn tons of fat', 'improve dramatically', 'boost your energy', 'enhance your performance', 'achieve your goals', 'transform completely'];
    return results[Math.floor(Math.random() * results.length)];
  }

  private static getRandomNutritionEncouragement(): string {
    const encouragements = ['You\'re doing incredible!', 'Keep making great choices!', 'Your body will thank you!', 'You\'re fueling your success!', 'Every meal counts!', 'Stay consistent!', 'You\'re crushing it!', 'Don\'t give up!', 'You\'re on fire!', 'Keep the momentum!'];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private static getRandomNutritionFocus(): string {
    const focuses = ['focus on quality', 'prioritize protein', 'balance your macros', 'time your meals', 'hydrate properly', 'choose whole foods', 'plan ahead', 'listen to your body', 'stay consistent', 'enjoy the process'];
    return focuses[Math.floor(Math.random() * focuses.length)];
  }

  private static getRandomNutritionAchievement(): string {
    const achievements = ['see amazing results', 'make incredible gains', 'get stronger than ever', 'build serious muscle', 'burn tons of fat', 'improve dramatically', 'boost your energy', 'enhance your performance', 'achieve your goals', 'transform completely'];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  private static getRandomNutritionMotivation(): string {
    const motivations = ['You\'ve got this!', 'Let\'s go!', 'Time to shine!', 'You\'re unstoppable!', 'Make it happen!', 'Push harder!', 'Stay strong!', 'Keep going!', 'You\'re amazing!', 'Believe in yourself!'];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  // Progress generators
  private static getRandomProgressAspect(): string {
    const aspects = ['strength', 'endurance', 'muscle mass', 'body fat', 'performance', 'energy', 'mobility', 'flexibility', 'power', 'speed'];
    return aspects[Math.floor(Math.random() * aspects.length)];
  }

  private static getRandomProgressState(): string {
    const states = ['improving', 'getting stronger', 'making gains', 'burning fat', 'building muscle', 'enhancing performance', 'boosting energy', 'increasing power', 'developing speed', 'transforming'];
    return states[Math.floor(Math.random() * states.length)];
  }

  private static getRandomProgressInsight(): string {
    const insights = ['This is amazing progress!', 'You\'re on the right track!', 'Keep up the great work!', 'Your dedication is paying off!', 'You\'re making incredible gains!', 'This is exactly what we want to see!', 'Your hard work is showing!', 'You\'re crushing your goals!', 'This is fantastic!', 'You\'re doing incredible!'];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private static getRandomProgressAction(): string {
    const actions = ['analyze your progress', 'track your improvements', 'celebrate your wins', 'set new goals', 'push harder', 'stay consistent', 'maintain momentum', 'build on success', 'keep improving', 'reach higher'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private static getRandomProgressResult(): string {
    const results = ['see even better results', 'make bigger gains', 'get stronger than ever', 'build more muscle', 'burn more fat', 'improve dramatically', 'boost your performance', 'enhance your energy', 'achieve your goals', 'transform completely'];
    return results[Math.floor(Math.random() * results.length)];
  }

  private static getRandomProgressEncouragement(): string {
    const encouragements = ['You\'re doing incredible!', 'Keep pushing forward!', 'You\'re stronger than you think!', 'Every day counts!', 'You\'re making progress!', 'Stay focused!', 'You\'re crushing it!', 'Don\'t give up!', 'You\'re on fire!', 'Keep the momentum!'];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private static getRandomProgressAchievement(): string {
    const achievements = ['made amazing progress', 'achieved incredible gains', 'gotten stronger than ever', 'built serious muscle', 'burned tons of fat', 'improved dramatically', 'boosted your performance', 'enhanced your energy', 'reached your goals', 'transformed completely'];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  private static getRandomProgressArea(): string {
    const areas = ['strength training', 'cardio workouts', 'muscle building', 'fat burning', 'performance improvement', 'energy enhancement', 'mobility work', 'flexibility training', 'power development', 'speed training'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private static getRandomProgressCelebration(): string {
    const celebrations = ['This is amazing!', 'You\'re crushing it!', 'Keep up the great work!', 'Your dedication is paying off!', 'You\'re making incredible gains!', 'This is exactly what we want to see!', 'Your hard work is showing!', 'You\'re on fire!', 'This is fantastic!', 'You\'re doing incredible!'];
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  }

  private static getRandomProgressFocus(): string {
    const focuses = ['focus on consistency', 'prioritize recovery', 'maintain momentum', 'build on success', 'push your limits', 'stay dedicated', 'keep improving', 'reach higher', 'achieve more', 'transform further'];
    return focuses[Math.floor(Math.random() * focuses.length)];
  }

  private static getRandomProgressGoal(): string {
    const goals = ['see even better results', 'make bigger gains', 'get stronger than ever', 'build more muscle', 'burn more fat', 'improve dramatically', 'boost your performance', 'enhance your energy', 'achieve your goals', 'transform completely'];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  private static getRandomProgressSupport(): string {
    const supports = ['I\'m here for you!', 'You\'ve got my support!', 'Let\'s do this together!', 'I believe in you!', 'You\'re not alone!', 'We\'re in this together!', 'You\'re doing great!', 'Keep it up!', 'You\'re amazing!', 'Stay strong!'];
    return supports[Math.floor(Math.random() * supports.length)];
  }

  private static getRandomProgressMetric(): string {
    const metrics = ['strength gains', 'muscle growth', 'fat loss', 'performance improvement', 'energy levels', 'endurance capacity', 'power output', 'speed development', 'mobility gains', 'flexibility improvement'];
    return metrics[Math.floor(Math.random() * metrics.length)];
  }

  private static getRandomProgressTrend(): string {
    const trends = ['incredible improvement', 'amazing gains', 'outstanding progress', 'fantastic results', 'remarkable growth', 'exceptional development', 'phenomenal advancement', 'extraordinary achievement', 'incredible transformation', 'amazing success'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private static getRandomProgressAdvice(): string {
    const advice = ['Keep up the great work!', 'Stay consistent!', 'Push harder!', 'Don\'t give up!', 'You\'re on fire!', 'Keep the momentum!', 'Stay focused!', 'You\'re crushing it!', 'Keep going!', 'You\'re amazing!'];
    return advice[Math.floor(Math.random() * advice.length)];
  }

  // Advice generators
  private static getRandomAdviceType(): string {
    const types = ['expert', 'proven', 'effective', 'powerful', 'game-changing', 'revolutionary', 'cutting-edge', 'advanced', 'professional', 'elite'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static getRandomAdviceContent(): string {
    const contents = ['consistency is key', 'form over weight', 'recovery is crucial', 'nutrition fuels performance', 'progressive overload works', 'rest days are essential', 'hydration matters', 'sleep is recovery', 'mindset drives results', 'patience pays off'];
    return contents[Math.floor(Math.random() * contents.length)];
  }

  private static getRandomAdviceEncouragement(): string {
    const encouragements = ['You\'ve got this!', 'Let\'s go!', 'Time to shine!', 'You\'re unstoppable!', 'Make it happen!', 'Push harder!', 'Stay strong!', 'Keep going!', 'You\'re amazing!', 'Believe in yourself!'];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private static getRandomAdviceSituation(): string {
    const situations = ['plateaus', 'low energy', 'poor recovery', 'inconsistent progress', 'motivation dips', 'form issues', 'overtraining', 'undereating', 'poor sleep', 'stress management'];
    return situations[Math.floor(Math.random() * situations.length)];
  }

  private static getRandomAdviceSolution(): string {
    const solutions = ['focus on form', 'increase rest', 'improve nutrition', 'boost recovery', 'stay consistent', 'track progress', 'set goals', 'find motivation', 'seek support', 'stay patient'];
    return solutions[Math.floor(Math.random() * solutions.length)];
  }

  private static getRandomAdviceSupport(): string {
    const supports = ['I\'m here for you!', 'You\'ve got my support!', 'Let\'s do this together!', 'I believe in you!', 'You\'re not alone!', 'We\'re in this together!', 'You\'re doing great!', 'Keep it up!', 'You\'re amazing!', 'Stay strong!'];
    return supports[Math.floor(Math.random() * supports.length)];
  }

  private static getRandomAdviceGoal(): string {
    const goals = ['building muscle', 'burning fat', 'getting stronger', 'improving performance', 'boosting energy', 'enhancing recovery', 'increasing power', 'developing speed', 'achieving goals', 'transforming your body'];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  private static getRandomAdviceKey(): string {
    const keys = ['consistency', 'patience', 'dedication', 'hard work', 'smart training', 'proper nutrition', 'adequate recovery', 'positive mindset', 'goal setting', 'progress tracking'];
    return keys[Math.floor(Math.random() * keys.length)];
  }

  private static getRandomAdviceMotivation(): string {
    const motivations = ['You\'ve got this!', 'Let\'s go!', 'Time to shine!', 'You\'re unstoppable!', 'Make it happen!', 'Push harder!', 'Stay strong!', 'Keep going!', 'You\'re amazing!', 'Believe in yourself!'];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  private static getRandomAdviceContext(): string {
    const contexts = ['training gets tough', 'progress slows down', 'motivation dips', 'energy is low', 'recovery is poor', 'form breaks down', 'goals seem far', 'results plateau', 'consistency wavers', 'doubt creeps in'];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  private static getRandomAdviceReminder(): string {
    const reminders = ['why you started', 'how far you\'ve come', 'what you\'re capable of', 'your goals and dreams', 'the progress you\'ve made', 'your strength and power', 'the person you\'re becoming', 'your dedication and commitment', 'the results you\'re getting', 'the transformation happening'];
    return reminders[Math.floor(Math.random() * reminders.length)];
  }

  private static getRandomAdviceObjective(): string {
    const objectives = ['succeed', 'achieve your goals', 'make progress', 'get stronger', 'build muscle', 'burn fat', 'improve performance', 'boost energy', 'enhance recovery', 'transform your body'];
    return objectives[Math.floor(Math.random() * objectives.length)];
  }

  private static getRandomAdviceFocus(): string {
    const focuses = ['consistency', 'patience', 'dedication', 'hard work', 'smart training', 'proper nutrition', 'adequate recovery', 'positive mindset', 'goal setting', 'progress tracking'];
    return focuses[Math.floor(Math.random() * focuses.length)];
  }

  // Motivation generators
  private static getRandomMotivationState(): string {
    const states = ['incredible', 'amazing', 'outstanding', 'fantastic', 'remarkable', 'exceptional', 'phenomenal', 'extraordinary', 'incredible', 'amazing'];
    return states[Math.floor(Math.random() * states.length)];
  }

  private static getRandomMotivationAction(): string {
    const actions = ['crushing it', 'dominating', 'conquering', 'mastering', 'excelling', 'achieving', 'pushing', 'driving', 'powering', 'fueling'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private static getRandomMotivationEncouragement(): string {
    const encouragements = ['You\'ve got this!', 'Let\'s go!', 'Time to shine!', 'You\'re unstoppable!', 'Make it happen!', 'Push harder!', 'Stay strong!', 'Keep going!', 'You\'re amazing!', 'Believe in yourself!'];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private static getRandomMotivationMoment(): string {
    const moments = ['rep', 'set', 'workout', 'day', 'week', 'month', 'challenge', 'obstacle', 'setback', 'victory'];
    return moments[Math.floor(Math.random() * moments.length)];
  }

  private static getRandomMotivationGoal(): string {
    const goals = ['your goals', 'success', 'greatness', 'your dreams', 'your potential', 'your best self', 'your transformation', 'your victory', 'your achievement', 'your destiny'];
    return goals[Math.floor(Math.random() * goals.length)];
  }

  private static getRandomMotivationSupport(): string {
    const supports = ['I\'m here for you!', 'You\'ve got my support!', 'Let\'s do this together!', 'I believe in you!', 'You\'re not alone!', 'We\'re in this together!', 'You\'re doing great!', 'Keep it up!', 'You\'re amazing!', 'Stay strong!'];
    return supports[Math.floor(Math.random() * supports.length)];
  }

  private static getRandomMotivationQuality(): string {
    const qualities = ['dedication', 'commitment', 'perseverance', 'determination', 'strength', 'courage', 'resilience', 'passion', 'drive', 'spirit'];
    return qualities[Math.floor(Math.random() * qualities.length)];
  }

  private static getRandomMotivationResult(): string {
    const results = ['inspiring', 'motivating', 'empowering', 'uplifting', 'encouraging', 'supportive', 'amazing', 'incredible', 'outstanding', 'fantastic'];
    return results[Math.floor(Math.random() * results.length)];
  }

  private static getRandomMotivationCelebration(): string {
    const celebrations = ['This is amazing!', 'You\'re crushing it!', 'Keep up the great work!', 'Your dedication is paying off!', 'You\'re making incredible gains!', 'This is exactly what we want to see!', 'Your hard work is showing!', 'You\'re on fire!', 'This is fantastic!', 'You\'re doing incredible!'];
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  }

  private static getRandomMotivationReason(): string {
    const reasons = ['you\'re capable of anything', 'you\'ve come too far to quit', 'you\'re stronger than you know', 'you\'re destined for greatness', 'you\'re meant to succeed', 'you\'re built for this', 'you\'re unstoppable', 'you\'re amazing', 'you\'re incredible', 'you\'re extraordinary'];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private static getRandomMotivationStrength(): string {
    const strengths = ['power', 'strength', 'courage', 'determination', 'will', 'spirit', 'heart', 'soul', 'mind', 'body'];
    return strengths[Math.floor(Math.random() * strengths.length)];
  }

  private static getRandomMotivationAchievement(): string {
    const achievements = ['achieve anything', 'conquer everything', 'master your goals', 'excel beyond limits', 'succeed beyond measure', 'triumph over challenges', 'overcome obstacles', 'reach your potential', 'fulfill your dreams', 'transform your life'];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  private static generateContextualSuggestions(intent: string, context: ConversationContext, analysis: any): string[] {
    const suggestionGenerators = {
      workout: () => [
        `Generate new ${this.getRandomWorkoutType()}`,
        `Modify your ${this.getRandomIntensity()} routine`,
        `Show ${this.getRandomBodyPart()} tips`,
        `Track your ${this.getRandomProgressAspect()}`
      ],
      nutrition: () => [
        `Create ${this.getRandomMealType()} plan`,
        `Track your ${this.getRandomMacro()} intake`,
        `Calculate your ${this.getRandomNutritionGoal()} macros`,
        `Get ${this.getRandomAdviceType()} nutrition advice`
      ],
      progress: () => [
        `View your ${this.getRandomProgressMetric()} progress`,
        `Set new ${this.getRandomProgressGoal()} goals`,
        `Track your ${this.getRandomProgressAchievement()}`,
        `Get ${this.getRandomAdviceType()} insights`
      ],
      advice: () => [
        `Get ${this.getRandomAdviceType()} tips`,
        `Learn ${this.getRandomAdviceContent()}`,
        `Improve your ${this.getRandomAdviceFocus()}`,
        `Stay ${this.getRandomMotivationState()}`
      ],
      motivation: () => [
        `Stay ${this.getRandomMotivationState()}`,
        `Get ${this.getRandomMotivationEncouragement()}`,
        `Push your ${this.getRandomMotivationAction()}`,
        `Believe in your ${this.getRandomMotivationStrength()}`
      ]
    };
    
    const generator = suggestionGenerators[intent as keyof typeof suggestionGenerators] || suggestionGenerators.advice;
    return generator();
  }

  private static determineSmartAction(intent: string, context: ConversationContext, analysis: any): string {
    const actionGenerators = {
      workout: () => `${this.getRandomAction()}_${this.getRandomWorkoutType()}`,
      nutrition: () => `${this.getRandomNutritionAction()}_${this.getRandomMealType()}`,
      progress: () => `${this.getRandomProgressAction()}_${this.getRandomProgressAspect()}`,
      advice: () => `${this.getRandomAdviceType()}_${this.getRandomAdviceContent()}`,
      motivation: () => `${this.getRandomMotivationAction()}_${this.getRandomMotivationGoal()}`
    };
    
    const generator = actionGenerators[intent as keyof typeof actionGenerators] || actionGenerators.advice;
    return generator();
  }

  private static getRandomSuggestions(intent: string): string[] {
    const suggestionSets = {
      workout: [
        ["Generate new workout", "Modify current workout", "Show workout tips", "Track my progress"],
        ["Create workout plan", "Get exercise advice", "Check my form", "Plan recovery"],
        ["Build strength", "Improve endurance", "Focus on technique", "Set new goals"],
        ["Start training", "Optimize routine", "Track performance", "Get motivated"]
      ],
      nutrition: [
        ["Create meal plan", "Track my food", "Calculate macros", "Get nutrition advice"],
        ["Plan meals", "Log nutrition", "Check macros", "Get diet tips"],
        ["Fuel my body", "Optimize diet", "Track calories", "Get healthy recipes"],
        ["Eat better", "Plan nutrition", "Track intake", "Get guidance"]
      ],
      progress: [
        ["View my progress", "Set new goals", "Track improvements", "Get insights"],
        ["Check results", "Plan next steps", "Analyze data", "Celebrate wins"],
        ["See growth", "Set targets", "Review performance", "Stay motivated"],
        ["Track success", "Plan ahead", "Measure gains", "Keep going"]
      ],
      advice: [
        ["Get expert tips", "Learn best practices", "Improve technique", "Stay consistent"],
        ["Ask questions", "Get guidance", "Learn more", "Improve skills"],
        ["Seek help", "Get support", "Learn techniques", "Stay focused"],
        ["Get wisdom", "Learn secrets", "Improve approach", "Stay dedicated"]
      ],
      motivation: [
        ["Stay motivated", "Get inspired", "Push harder", "Believe in yourself"],
        ["Keep going", "Stay strong", "Push limits", "Never give up"],
        ["Stay focused", "Keep pushing", "Stay dedicated", "Stay positive"],
        ["Stay committed", "Keep fighting", "Stay determined", "Stay resilient"]
      ]
    };
    
    const sets = suggestionSets[intent as keyof typeof suggestionSets] || suggestionSets.advice;
    return sets[Math.floor(Math.random() * sets.length)];
  }

  private static getRandomAction(intent: string): string {
    const actions = {
      workout: ['workout_help', 'generate_workout', 'modify_workout', 'workout_tips'],
      nutrition: ['nutrition_help', 'create_meal_plan', 'track_food', 'nutrition_advice'],
      progress: ['analyze_progress', 'view_progress', 'set_goals', 'track_improvements'],
      advice: ['provide_advice', 'give_tips', 'share_wisdom', 'offer_guidance'],
      motivation: ['motivate', 'inspire', 'encourage', 'support']
    };
    
    const actionList = actions[intent as keyof typeof actions] || actions.advice;
    return actionList[Math.floor(Math.random() * actionList.length)];
  }

  private static getVariedResponse(intent: string, context: ConversationContext, analysis: any): any {
    // Initialize response variations if not exists
    this.initializeResponseVariations();
    
    const variations = this.responseVariations.get(intent) || [];
    const baseResponse = this.getBaseResponse(intent, context);
    
    // Add variation to base response
    if (variations.length > 0) {
      const randomVariation = variations[Math.floor(Math.random() * variations.length)];
      baseResponse.content = this.applyVariation(baseResponse.content, randomVariation, context, analysis);
    }
    
    return baseResponse;
  }

  private static initializeResponseVariations() {
    if (this.responseVariations.size > 0) return;
    
    this.responseVariations.set('workout', [
      "Let's get you moving! 💪",
      "Time to crush your workout! 🔥", 
      "Ready to build some strength? 🏋️",
      "Let's make those gains! 💯",
      "Time to push your limits! 🚀",
      "Let's turn up the intensity! ⚡",
      "Ready to dominate today? 👑",
      "Let's build that power! 💥",
      "Time to sweat it out! 💦",
      "Let's get after it! 🎯"
    ]);
    
    this.responseVariations.set('nutrition', [
      "Let's fuel your body right! 🥗",
      "Time to optimize your nutrition! 🍎",
      "Let's get those macros dialed in! 📊",
      "Ready to eat for your goals? 🎯",
      "Let's nourish those muscles! 🥩",
      "Time to feed your gains! 🍗",
      "Let's fuel your performance! ⚡",
      "Ready to optimize your diet? 🥑",
      "Let's get those nutrients! 🌟",
      "Time to eat smart! 🧠"
    ]);
    
    this.responseVariations.set('progress', [
      "Let's see how you're doing! 📈",
      "Time to check your progress! 📊",
      "Let's analyze your results! 🔍",
      "Ready to see your improvements? 🎉",
      "Let's track your success! 🏆",
      "Time to measure your gains! 📏",
      "Let's review your journey! 🗺️",
      "Ready to see your growth? 🌱",
      "Let's celebrate your wins! 🎊",
      "Time to assess your performance! 📋"
    ]);
    
    this.responseVariations.set('advice', [
      "I've got some great tips for you! 💡",
      "Let me share some wisdom! 🧠",
      "Here's what I recommend! ⭐",
      "I have some insights to share! 🔍",
      "Let me give you some expert advice! 🎓",
      "I've got some proven strategies! 🎯",
      "Here are some game-changing tips! 🚀",
      "Let me share some secrets! 🤫",
      "I have some valuable insights! 💎",
      "Here's some expert guidance! 🧭"
    ]);
    
    this.responseVariations.set('motivation', [
      "You've got this! I believe in you! 💪",
      "Keep pushing forward! You're doing great! 🌟",
      "Every step counts! Keep going! 🚀",
      "You're stronger than you think! 💯",
      "You're crushing it! Keep it up! 🔥",
      "Your dedication is inspiring! 🌟",
      "You're on fire! Don't stop! 🔥",
      "You're making amazing progress! 🎉",
      "You're unstoppable! Keep going! ⚡",
      "You're doing incredible! Stay strong! 💪"
    ]);
  }

  private static applyVariation(baseContent: string, variation: string, context: ConversationContext, analysis: any): string {
    // Add variation based on user's communication style
    const style = context.userPreferences.communicationStyle;
    
    if (style === 'casual') {
      return `${variation} ${baseContent}`;
    } else if (style === 'technical') {
      return `${baseContent}\n\n${variation}`;
    } else if (style === 'motivational') {
      return `${variation} ${baseContent} You're doing amazing!`;
    } else {
      return `${variation} ${baseContent}`;
    }
  }

  private static getBaseResponse(intent: string, context: ConversationContext): any {
    // Handle combined intents
    if (intent.includes('_')) {
      return this.getCombinedResponse(intent, context);
    }
    
    switch (intent) {
      case 'workout':
        return this.getWorkoutResponse(context);
      case 'nutrition':
        return this.getNutritionResponse(context);
      case 'progress':
        return this.getProgressResponse(context);
      case 'advice':
        return this.getAdviceResponse(context);
      case 'motivation':
        return this.getMotivationResponse(context);
      case 'planning':
        return this.getPlanningResponse(context);
      default:
        return this.getGeneralResponse(context);
    }
  }

  private static getCombinedResponse(intent: string, context: ConversationContext): any {
    const intents = intent.split('_');
    
    if (intents.includes('workout') && intents.includes('nutrition')) {
      return {
        content: this.getWorkoutNutritionResponse(context),
        suggestions: [
          "Create workout + meal plan",
          "Track post-workout nutrition",
          "Optimize training nutrition",
          "Plan recovery meals"
        ],
        action: 'workout_nutrition_plan'
      };
    }
    
    // Default to primary intent
    return this.getBaseResponse(intents[0], context);
  }

  private static getWorkoutResponse(context: ConversationContext): any {
    if (!context.userProfile) {
      const responses = [
        "I'd love to help with your workouts! Please complete your profile first so I can give you personalized workout recommendations.",
        "Ready to start your fitness journey? Complete your profile and I'll create custom workouts just for you!",
        "Let's get you set up! Fill out your profile and I'll design workouts tailored to your goals.",
        "I'm excited to help you train! First, let's complete your profile so I can create the perfect workout plan."
      ];
      return {
        content: responses[Math.floor(Math.random() * responses.length)],
        suggestions: ["Complete my profile", "Get general workout tips", "Learn about exercises"],
        action: 'profile_setup'
      };
    }
    
    const recentWorkouts = context.workoutHistory.slice(-3);
    const workoutCount = recentWorkouts.length;
    const lastWorkout = recentWorkouts[recentWorkouts.length - 1];
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    let content = "";
    
    if (workoutCount === 0) {
      const responses = [
        `Welcome to your fitness journey! As a ${context.userProfile.targetPhysique}, I'll create personalized workouts to help you reach your goals. Let's start with a comprehensive workout plan!`,
        `Ready to transform your body? Your ${context.userProfile.targetPhysique} goals are achievable with the right training. Let's build your perfect workout routine!`,
        `Time to unleash your potential! I'll design workouts specifically for your ${context.userProfile.targetPhysique} aspirations. Let's get started!`,
        `Your fitness journey begins now! As a ${context.userProfile.targetPhysique}, I'll create workouts that push you to your limits. Ready to dominate?`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else if (daysSinceLastWorkout === 0) {
      const responses = [
        `Amazing work today! Your ${context.userProfile.targetPhysique} goals are within reach. Ready for your next challenge?`,
        `You crushed it! Your dedication to becoming a ${context.userProfile.targetPhysique} is inspiring. What's next?`,
        `Outstanding performance! You're one step closer to your ${context.userProfile.targetPhysique} goals. Let's keep this momentum!`,
        `Incredible effort! Your ${context.userProfile.targetPhysique} transformation is happening. Ready for more?`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else if (daysSinceLastWorkout === 1) {
      const responses = [
        `Perfect timing! Your consistency is paying off. Let me create an optimized session for your ${context.userProfile.targetPhysique} goals.`,
        `Right on schedule! I love your dedication. Time for another powerful workout designed for your ${context.userProfile.targetPhysique} aspirations.`,
        `Excellent timing! Your commitment is showing. Let's build on your progress with a targeted ${context.userProfile.targetPhysique} workout.`,
        `Perfect! Your discipline is impressive. Ready for another session that will push your ${context.userProfile.targetPhysique} goals forward?`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else if (daysSinceLastWorkout <= 3) {
      const responses = [
        `No worries about the ${daysSinceLastWorkout} day break! Let's get back on track with a motivating session for your ${context.userProfile.targetPhysique} goals.`,
        `A ${daysSinceLastWorkout} day pause is totally fine! Time to reignite your passion with a fresh workout designed for your ${context.userProfile.targetPhysique} aspirations.`,
        `Don't stress about the ${daysSinceLastWorkout} day gap! Let's bounce back stronger with a workout that will reignite your ${context.userProfile.targetPhysique} journey.`,
        `The ${daysSinceLastWorkout} day break is behind us! Let's get back to crushing your ${context.userProfile.targetPhysique} goals with renewed energy.`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else {
      const responses = [
        `Let's restart your momentum! A fresh, energizing session tailored to your ${context.userProfile.targetPhysique} goals will get you back on track.`,
        `Time to reignite your passion! I'll create a powerful workout that will remind you why you're pursuing your ${context.userProfile.targetPhysique} dreams.`,
        `Let's get back to greatness! A motivating session designed for your ${context.userProfile.targetPhysique} goals will jumpstart your journey again.`,
        `Ready to reclaim your power? Let's restart with a workout that will reignite your ${context.userProfile.targetPhysique} transformation.`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    }
    
    return {
      content,
      suggestions: [
        "Generate new workout",
        "Modify current workout", 
        "Show workout tips",
        "Track my progress"
      ],
      action: 'workout_help'
    };
  }

  private static getNutritionResponse(context: ConversationContext): any {
    if (!context.userProfile) {
      const responses = [
        "I'd love to help with your nutrition! Please complete your profile first so I can calculate your personalized macro targets.",
        "Ready to optimize your diet? Complete your profile and I'll create a nutrition plan tailored to your goals!",
        "Let's fuel your success! Fill out your profile and I'll design a meal plan that works for you.",
        "Time to eat smart! Complete your profile and I'll calculate your perfect macro targets."
      ];
      return {
        content: responses[Math.floor(Math.random() * responses.length)],
        suggestions: ["Complete my profile", "Get general nutrition tips", "Learn about macros"],
        action: 'profile_setup'
      };
    }
    
    const todayNutrition = context.nutritionLog.filter(n => 
      new Date(n.date).toDateString() === new Date().toDateString()
    );
    
    let content = "";
    
    if (todayNutrition.length === 0) {
      const responses = [
        `Let's fuel your ${context.userProfile.targetPhysique} goals! I'll help you track your nutrition and create a meal plan that supports your training. What would you like to log first?`,
        `Time to optimize your nutrition for your ${context.userProfile.targetPhysique} transformation! Let's track your food and create the perfect meal plan. What should we start with?`,
        `Ready to eat for your goals? I'll help you fuel your ${context.userProfile.targetPhysique} journey with smart nutrition tracking. What's first on your plate?`,
        `Let's get your nutrition dialed in! Your ${context.userProfile.targetPhysique} goals need proper fuel. What would you like to track first?`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else {
      const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
      const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);
      const totalCarbs = todayNutrition.reduce((sum, n) => sum + n.carbs, 0);
      const totalFat = todayNutrition.reduce((sum, n) => sum + n.fat, 0);
      
      const responses = [
        `Excellent nutrition tracking! You've logged ${totalCalories} calories (${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, ${totalFat.toFixed(1)}g fat). For your ${context.userProfile.targetPhysique} goals, I can help optimize your macro balance. What's next?`,
        `Great job on your nutrition! ${totalCalories} calories with ${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, and ${totalFat.toFixed(1)}g fat. Let's fine-tune this for your ${context.userProfile.targetPhysique} success!`,
        `Outstanding tracking! ${totalCalories} calories logged with solid macros (${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, ${totalFat.toFixed(1)}g fat). Ready to optimize for your ${context.userProfile.targetPhysique} goals?`,
        `Perfect nutrition logging! You're at ${totalCalories} calories with ${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, and ${totalFat.toFixed(1)}g fat. Let's make this work for your ${context.userProfile.targetPhysique} transformation!`
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    }
    
    return {
      content,
      suggestions: [
        "Create meal plan",
        "Track my food",
        "Calculate macros",
        "Get nutrition advice"
      ],
      action: 'nutrition_help'
    };
  }

  private static getProgressResponse(context: ConversationContext): any {
    const recentWorkouts = context.workoutHistory.slice(-7);
    const recentNutrition = context.nutritionLog.slice(-7);
    
    const workoutCount = recentWorkouts.length;
    const avgCalories = recentNutrition.length > 0 ? 
      recentNutrition.reduce((sum, n) => sum + n.calories, 0) / recentNutrition.length : 0;
    
    const consistency = workoutCount >= 5 ? 'Excellent' : workoutCount >= 3 ? 'Good' : 'Needs improvement';
    
    let content = `Here's your progress summary:\n\n**This Week:**\n• Workouts completed: ${workoutCount}\n• Average daily calories: ${Math.round(avgCalories)}\n• Consistency: ${consistency}\n\n`;
    
    if (context.userProfile) {
      content += `Your ${context.userProfile.targetPhysique} goals are progressing well! `;
    }
    
    content += "What would you like to focus on next?";
    
    return {
      content,
      suggestions: [
        "Show detailed analytics",
        "Set new goals",
        "Adjust my plan",
        "Celebrate achievements"
      ],
      action: 'progress_analysis'
    };
  }

  private static getAdviceResponse(context: ConversationContext): any {
    const advice = [
      "**Consistency is key** - Stick to your plan 80% of the time for optimal results",
      "**Progressive overload** - Gradually increase weight, reps, or intensity",
      "**Recovery matters** - Get 7-9 hours of quality sleep for muscle growth",
      "**Nutrition timing** - Eat protein within 2 hours post-workout",
      "**Track everything** - Monitor your progress to stay motivated"
    ];
    
    const personalizedAdvice = context.userProfile ? 
      `For your ${context.userProfile.targetPhysique} goals, here are my top recommendations:\n\n${advice.join('\n')}` :
      `Here are some proven fitness principles:\n\n${advice.join('\n')}`;
    
    return {
      content: personalizedAdvice,
      suggestions: [
        "Get workout tips",
        "Learn about nutrition",
        "Improve recovery",
        "Stay motivated"
      ],
      action: 'general_advice'
    };
  }

  private static getMotivationResponse(context: ConversationContext): any {
    const motivationalMessages = [
      "You've got this! Every step forward is progress, no matter how small.",
      "Remember why you started this journey. You're stronger than you think!",
      "Progress isn't always linear, but consistency will get you there.",
      "You're not just building muscle, you're building character and discipline.",
      "Every workout is an investment in your future self. Keep going!"
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    return {
      content: randomMessage,
      suggestions: [
        "Get more motivation",
        "Share my progress",
        "Set new goals",
        "Get support"
      ],
      action: 'motivation_support'
    };
  }

  private static getPlanningResponse(context: ConversationContext): any {
    return {
      content: "I'll help you create a structured plan that fits your lifestyle and goals. Let's organize your fitness journey!",
      suggestions: [
        "Create workout schedule",
        "Plan meal prep",
        "Set weekly goals",
        "Organize my routine"
      ],
      action: 'planning_help'
    };
  }

  private static getWorkoutNutritionResponse(context: ConversationContext): any {
    return {
      content: "Perfect! Let's create a comprehensive plan that combines your workouts with optimal nutrition for maximum results.",
      suggestions: [
        "Create workout + meal plan",
        "Track post-workout nutrition",
        "Optimize training nutrition",
        "Plan recovery meals"
      ],
      action: 'workout_nutrition_plan'
    };
  }

  private static getGeneralResponse(context: ConversationContext): any {
    return {
      content: `I'm your intelligent AI fitness coach! I learn from your patterns and adapt to your preferences. I can help with:\n\n• **Personalized workouts** - Tailored to your goals and preferences\n• **Smart nutrition planning** - Science-based macro calculations\n• **Progress tracking** - Analytics and insights\n• **Adaptive recommendations** - That improve over time\n\nWhat would you like to work on today?`,
      suggestions: [
        "Help with workouts",
        "Plan my meals",
        "Track my progress",
        "Get fitness advice"
      ],
      action: 'general_help'
    };
  }

  private static addDynamicPersonalization(response: any, patterns: any, context: ConversationContext, sentiment: string, emotionalState: string): any {
    let personalizedContent = response.content;
    
    // Add time-based personalization
    if (patterns.timePreference) {
      personalizedContent += `\n\nI notice you prefer ${patterns.timePreference} workouts. I'll keep that in mind for future recommendations!`;
    }
    
    // Add intensity personalization
    if (patterns.intensityPreference) {
      const intensity = patterns.intensityPreference === 'high' ? 'challenging' : 'moderate';
      personalizedContent += `\n\nBased on your preference for ${intensity} workouts, I'll adjust the intensity accordingly.`;
    }
    
    // Add goal-specific personalization
    if (patterns.goalFocus && context.userProfile) {
      const goal = patterns.goalFocus === 'muscle_gain' ? 'muscle building' : 
                   patterns.goalFocus === 'fat_loss' ? 'fat loss' : 'endurance training';
      personalizedContent += `\n\nI see you're focused on ${goal}. This aligns perfectly with your ${context.userProfile.targetPhysique} goals!`;
    }
    
    // Add emotional state personalization
    if (emotionalState === 'tired') {
      personalizedContent += `\n\nI understand you're feeling tired. Let's focus on recovery and lighter activities today.`;
    } else if (emotionalState === 'excited') {
      personalizedContent += `\n\nI love your energy! Let's channel that excitement into an amazing workout!`;
    } else if (emotionalState === 'frustrated') {
      personalizedContent += `\n\nI hear your frustration. Let's work through this together and find a solution.`;
    }
    
    // Add sentiment-based personalization
    if (sentiment === 'positive') {
      personalizedContent += `\n\nI love your positive attitude! That's exactly what drives results.`;
    } else if (sentiment === 'negative') {
      personalizedContent += `\n\nI understand this can be challenging, but you've got this! Let's work through it together.`;
    }
    
    return {
      ...response,
      content: personalizedContent
    };
  }

  private static generateContextualSuggestions(entities: any[], intent: string, context: ConversationContext, analysis: any): string[] {
    const suggestions: string[] = [];
    
    entities.forEach(entity => {
      if (entity.type === 'food') {
        suggestions.push(`Track ${entity.value.join(', ')} in nutrition log`);
        suggestions.push(`Calculate macros for ${entity.value.join(', ')}`);
      } else if (entity.type === 'exercise') {
        suggestions.push(`Add ${entity.value.join(', ')} to workout`);
        suggestions.push(`Get tips for ${entity.value.join(', ')}`);
      } else if (entity.type === 'number') {
        suggestions.push(`Set target of ${entity.value.join(', ')}`);
      }
    });
    
    // Add intent-specific suggestions
    if (intent === 'workout') {
      suggestions.push("Generate new workout", "Modify current workout", "Show workout tips");
    } else if (intent === 'nutrition') {
      suggestions.push("Create meal plan", "Track my food", "Calculate macros");
    } else if (intent === 'progress') {
      suggestions.push("Show detailed analytics", "Set new goals", "Adjust my plan");
    }
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  private static determineAction(intent: string, analysis: any): string {
    if (intent.includes('workout')) return 'workout_help';
    if (intent.includes('nutrition')) return 'nutrition_help';
    if (intent.includes('progress')) return 'progress_analysis';
    if (intent.includes('advice')) return 'general_advice';
    if (intent.includes('motivation')) return 'motivation_support';
    if (intent.includes('planning')) return 'planning_help';
    return 'general_help';
  }

  private static isPersonalized(patterns: any, context: ConversationContext): boolean {
    return Object.keys(patterns).length > 0 || context.userProfile !== null;
  }

  private static learnFromInteraction(sessionId: string, userMessage: string, response: AIResponse, analysis: any) {
    // Store conversation entry
    const context = this.conversationMemory.get(sessionId);
    if (context) {
      context.conversationHistory.push({
        timestamp: new Date(),
        userMessage,
        aiResponse: response.content,
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        entities: analysis.entities,
        satisfaction: 0.8 // Default satisfaction, could be improved with feedback
      });
      
      // Keep only last 50 conversations
      if (context.conversationHistory.length > 50) {
        context.conversationHistory = context.conversationHistory.slice(-50);
      }
    }
    
    // Update user preferences
    if (!this.userPatterns.has(sessionId)) {
      this.userPatterns.set(sessionId, this.getDefaultPreferences());
    }
    
    const preferences = this.userPatterns.get(sessionId)!;
    
    // Learn from patterns
    if (analysis.patterns.timePreference) {
      if (!preferences.preferredWorkoutTimes.includes(analysis.patterns.timePreference)) {
        preferences.preferredWorkoutTimes.push(analysis.patterns.timePreference);
      }
    }
    
    if (analysis.patterns.intensityPreference) {
      preferences.preferredIntensity = analysis.patterns.intensityPreference;
    }
    
    if (analysis.patterns.communicationStyle) {
      preferences.communicationStyle = analysis.patterns.communicationStyle;
    }
    
    // Learn from entities
    analysis.entities.forEach((entity: any) => {
      if (entity.type === 'exercise' && entity.value) {
        entity.value.forEach((exercise: string) => {
          if (!preferences.favoriteExercises.includes(exercise)) {
            preferences.favoriteExercises.push(exercise);
          }
        });
      }
      
      if (entity.type === 'food' && entity.value) {
        entity.value.forEach((food: string) => {
          if (!preferences.commonFoods.includes(food)) {
            preferences.commonFoods.push(food);
          }
        });
      }
    });
  }

  private static getLastWorkoutDate(workoutHistory: WorkoutSession[]): Date | undefined {
    if (workoutHistory.length === 0) return undefined;
    return new Date(Math.max(...workoutHistory.map(w => new Date(w.date).getTime())));
  }

  private static getLastNutritionDate(nutritionLog: NutritionEntry[]): Date | undefined {
    if (nutritionLog.length === 0) return undefined;
    return new Date(Math.max(...nutritionLog.map(n => new Date(n.date).getTime())));
  }
}
