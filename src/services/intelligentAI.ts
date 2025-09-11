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
}

export class IntelligentAI {
  private static conversationMemory: Map<string, ConversationContext> = new Map();
  private static userPatterns: Map<string, any> = new Map();

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
    
    // Analyze user intent and sentiment
    const analysis = this.analyzeMessage(userMessage, context);
    
    // Generate personalized response based on analysis
    const response = this.generatePersonalizedResponse(analysis, context);
    
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
        lastNutritionDate: this.getLastNutritionDate(nutritionLog)
      });
    }
    
    const context = this.conversationMemory.get(sessionId)!;
    context.userProfile = userProfile;
    context.workoutHistory = workoutHistory;
    context.nutritionLog = nutritionLog;
    context.currentGoals = userProfile ? [userProfile.targetPhysique] : [];
    
    return context;
  }

  private static analyzeMessage(message: string, context: ConversationContext) {
    const lowerMessage = message.toLowerCase();
    
    // Intent analysis
    let intent = 'general';
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('gym')) {
      intent = 'workout';
    } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('meal') || lowerMessage.includes('nutrition')) {
      intent = 'nutrition';
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing') || lowerMessage.includes('analytics')) {
      intent = 'progress';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('tips')) {
      intent = 'advice';
    }
    
    // Sentiment analysis
    let sentiment = 'neutral';
    if (lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('amazing') || lowerMessage.includes('love')) {
      sentiment = 'positive';
    } else if (lowerMessage.includes('bad') || lowerMessage.includes('terrible') || lowerMessage.includes('hate') || lowerMessage.includes('difficult')) {
      sentiment = 'negative';
    }
    
    // Entity extraction
    const entities = this.extractEntities(lowerMessage);
    
    // Pattern recognition
    const patterns = this.recognizePatterns(message, context);
    
    return {
      intent,
      sentiment,
      entities,
      patterns,
      confidence: this.calculateConfidence(intent, entities, context)
    };
  }

  private static extractEntities(message: string) {
    const entities: any[] = [];
    
    // Extract numbers
    const numbers = message.match(/\d+/g);
    if (numbers) {
      entities.push({ type: 'number', value: numbers.map(Number) });
    }
    
    // Extract food items
    const foodKeywords = ['chicken', 'rice', 'eggs', 'protein', 'carbs', 'calories', 'breakfast', 'lunch', 'dinner'];
    const foundFoods = foodKeywords.filter(food => message.includes(food));
    if (foundFoods.length > 0) {
      entities.push({ type: 'food', value: foundFoods });
    }
    
    // Extract exercises
    const exerciseKeywords = ['squat', 'deadlift', 'bench', 'press', 'curl', 'row', 'pull', 'push'];
    const foundExercises = exerciseKeywords.filter(exercise => message.includes(exercise));
    if (foundExercises.length > 0) {
      entities.push({ type: 'exercise', value: foundExercises });
    }
    
    return entities;
  }

  private static recognizePatterns(message: string, context: ConversationContext) {
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
    }
    
    return patterns;
  }

  private static calculateConfidence(intent: string, entities: any[], context: ConversationContext): number {
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
    
    return Math.min(confidence, 0.95);
  }

  private static generatePersonalizedResponse(analysis: any, context: ConversationContext): AIResponse {
    const { intent, sentiment, entities, patterns, confidence } = analysis;
    
    // Generate base response based on intent
    let response = this.getBaseResponse(intent, context);
    
    // Personalize based on patterns and context
    response = this.personalizeResponse(response, patterns, context, sentiment);
    
    // Add entity-specific suggestions
    response.suggestions = this.generateEntitySuggestions(entities, intent, context);
    
    return {
      ...response,
      confidence,
      personalized: this.isPersonalized(patterns, context)
    };
  }

  private static getBaseResponse(intent: string, context: ConversationContext) {
    switch (intent) {
      case 'workout':
        return {
          content: this.getWorkoutResponse(context),
          suggestions: [
            "Generate new workout",
            "Modify current workout", 
            "Show workout tips",
            "Track my progress"
          ],
          action: 'workout_help'
        };
        
      case 'nutrition':
        return {
          content: this.getNutritionResponse(context),
          suggestions: [
            "Create meal plan",
            "Track my food",
            "Calculate macros",
            "Get nutrition advice"
          ],
          action: 'nutrition_help'
        };
        
      case 'progress':
        return {
          content: this.getProgressResponse(context),
          suggestions: [
            "Show detailed analytics",
            "Set new goals",
            "Adjust my plan",
            "Celebrate achievements"
          ],
          action: 'progress_analysis'
        };
        
      case 'advice':
        return {
          content: this.getAdviceResponse(context),
          suggestions: [
            "Get workout tips",
            "Learn about nutrition",
            "Improve recovery",
            "Stay motivated"
          ],
          action: 'general_advice'
        };
        
      default:
        return {
          content: this.getGeneralResponse(context),
          suggestions: [
            "Help with workouts",
            "Plan my meals",
            "Track my progress",
            "Get fitness advice"
          ],
          action: 'general_help'
        };
    }
  }

  private static getWorkoutResponse(context: ConversationContext): string {
    if (!context.userProfile) {
      return "I'd love to help with your workouts! Please complete your profile first so I can give you personalized workout recommendations.";
    }
    
    const recentWorkouts = context.workoutHistory.slice(-3);
    const workoutCount = recentWorkouts.length;
    
    if (workoutCount === 0) {
      return `Welcome to your fitness journey! As a ${context.userProfile.targetPhysique}, I'll create personalized workouts to help you reach your goals. Let's start with a comprehensive workout plan!`;
    }
    
    const lastWorkout = recentWorkouts[recentWorkouts.length - 1];
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    if (daysSinceLastWorkout === 0) {
      return `Great job completing your workout today! Your ${context.userProfile.targetPhysique} goals are within reach. Would you like me to plan your next session or help with recovery?`;
    } else if (daysSinceLastWorkout === 1) {
      return `Perfect timing for your next workout! I've noticed you're consistent with your training. Let me create an optimized session for your ${context.userProfile.targetPhysique} goals.`;
    } else {
      return `I see it's been ${daysSinceLastWorkout} days since your last workout. No worries! Let's get back on track with a motivating session designed for your ${context.userProfile.targetPhysique} goals.`;
    }
  }

  private static getNutritionResponse(context: ConversationContext): string {
    if (!context.userProfile) {
      return "I'd love to help with your nutrition! Please complete your profile first so I can calculate your personalized macro targets.";
    }
    
    const todayNutrition = context.nutritionLog.filter(n => 
      new Date(n.date).toDateString() === new Date().toDateString()
    );
    
    if (todayNutrition.length === 0) {
      return `Let's fuel your ${context.userProfile.targetPhysique} goals! I'll help you track your nutrition and create a meal plan that supports your training. What would you like to log first?`;
    }
    
    const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
    const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);
    
    return `Great job tracking your nutrition today! You've logged ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein. For your ${context.userProfile.targetPhysique} goals, I can help optimize your macro balance. What would you like to add next?`;
  }

  private static getProgressResponse(context: ConversationContext): string {
    const recentWorkouts = context.workoutHistory.slice(-7);
    const recentNutrition = context.nutritionLog.slice(-7);
    
    const workoutCount = recentWorkouts.length;
    const avgCalories = recentNutrition.length > 0 ? 
      recentNutrition.reduce((sum, n) => sum + n.calories, 0) / recentNutrition.length : 0;
    
    return `Here's your progress summary:\n\n**This Week:**\n• Workouts completed: ${workoutCount}\n• Average daily calories: ${Math.round(avgCalories)}\n• Consistency: ${workoutCount >= 3 ? 'Excellent' : workoutCount >= 2 ? 'Good' : 'Needs improvement'}\n\n${context.userProfile ? `Your ${context.userProfile.targetPhysique} goals are progressing well!` : 'Keep up the great work!'} What would you like to focus on next?`;
  }

  private static getAdviceResponse(context: ConversationContext): string {
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
    
    return personalizedAdvice;
  }

  private static getGeneralResponse(context: ConversationContext): string {
    return `I'm your intelligent AI fitness coach! I learn from your patterns and adapt to your preferences. I can help with:\n\n• **Personalized workouts** - Tailored to your goals and preferences\n• **Smart nutrition planning** - Science-based macro calculations\n• **Progress tracking** - Analytics and insights\n• **Adaptive recommendations** - That improve over time\n\nWhat would you like to work on today?`;
  }

  private static personalizeResponse(response: any, patterns: any, context: ConversationContext, sentiment: string): any {
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
      const goal = patterns.goalFocus === 'muscle_gain' ? 'muscle building' : 'fat loss';
      personalizedContent += `\n\nI see you're focused on ${goal}. This aligns perfectly with your ${context.userProfile.targetPhysique} goals!`;
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

  private static generateEntitySuggestions(entities: any[], intent: string, context: ConversationContext): string[] {
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
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  private static isPersonalized(patterns: any, context: ConversationContext): boolean {
    return Object.keys(patterns).length > 0 || context.userProfile !== null;
  }

  private static learnFromInteraction(sessionId: string, userMessage: string, response: AIResponse, analysis: any) {
    // Store patterns for future personalization
    if (!this.userPatterns.has(sessionId)) {
      this.userPatterns.set(sessionId, {
        preferredIntents: [],
        commonEntities: [],
        sentimentHistory: [],
        interactionCount: 0
      });
    }
    
    const patterns = this.userPatterns.get(sessionId)!;
    patterns.interactionCount++;
    
    // Learn from intents
    if (!patterns.preferredIntents.includes(analysis.intent)) {
      patterns.preferredIntents.push(analysis.intent);
    }
    
    // Learn from entities
    analysis.entities.forEach((entity: any) => {
      if (!patterns.commonEntities.some((e: any) => e.type === entity.type && e.value === entity.value)) {
        patterns.commonEntities.push(entity);
      }
    });
    
    // Learn from sentiment
    patterns.sentimentHistory.push(analysis.sentiment);
    if (patterns.sentimentHistory.length > 20) {
      patterns.sentimentHistory = patterns.sentimentHistory.slice(-20);
    }
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
