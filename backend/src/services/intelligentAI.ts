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
    const randomSeed = Date.now() % 1000;
    
    if (workoutCount === 0) {
      const responses = [
        `Welcome to your fitness journey! As a ${context.userProfile.targetPhysique}, I'll create personalized workouts to help you reach your goals. Let's start with a comprehensive workout plan!`,
        `Time to unleash your potential! Your ${context.userProfile.targetPhysique} goals are achievable with the right training approach. Let me design workouts that maximize your genetic potential.`,
        `Your transformation starts now! I'll create a personalized training program specifically designed for your ${context.userProfile.targetPhysique} aspirations. Ready to dominate?`,
        `Let's build something incredible! Your ${context.userProfile.targetPhysique} journey begins with a strategic training plan tailored to your unique physique.`,
        `Ready to revolutionize your fitness? Your ${context.userProfile.targetPhysique} goals demand a systematic approach. I'll craft workouts that push your limits!`,
        `Your ${context.userProfile.targetPhysique} transformation awaits! I'll design a progressive training system that builds strength, power, and athleticism.`,
        `Let's ignite your potential! As someone targeting a ${context.userProfile.targetPhysique} physique, I'll create workouts that challenge and inspire you.`,
        `Time to level up! Your ${context.userProfile.targetPhysique} goals require dedication and smart training. I'll guide you every step of the way.`,
        `Your fitness evolution begins today! I'll create a comprehensive program specifically for your ${context.userProfile.targetPhysique} aspirations.`,
        `Let's make it happen! Your ${context.userProfile.targetPhysique} goals are within reach with the right training strategy. Ready to commit?`,
        `Welcome to greatness! I'll design workouts that transform you into the ${context.userProfile.targetPhysique} athlete you want to become.`,
        `Your journey to becoming a ${context.userProfile.targetPhysique} starts here! I'll create a training plan that maximizes your potential.`,
        `Ready to dominate? Your ${context.userProfile.targetPhysique} goals need a systematic approach. Let me design the perfect program for you.`,
        `Let's build your legacy! I'll create workouts that push you toward your ${context.userProfile.targetPhysique} aspirations.`,
        `Time to unlock your potential! Your ${context.userProfile.targetPhysique} transformation begins with smart, progressive training.`
      ];
      return responses[randomSeed % responses.length];
    }
    
    const lastWorkout = recentWorkouts[recentWorkouts.length - 1];
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    if (daysSinceLastWorkout === 0) {
      const responses = [
        `Great job completing your workout today! Your ${context.userProfile.targetPhysique} goals are within reach. Would you like me to plan your next session or help with recovery?`,
        `Excellent work today! Your dedication to becoming a ${context.userProfile.targetPhysique} is inspiring. What's next on your agenda?`,
        `Outstanding performance! You're one step closer to your ${context.userProfile.targetPhysique} goals. Ready for your next challenge?`,
        `Amazing effort! Your ${context.userProfile.targetPhysique} transformation is happening. How are you feeling?`,
        `Fantastic session today! Your commitment to your ${context.userProfile.targetPhysique} goals is paying off. What's your next move?`,
        `Incredible work! You're crushing your ${context.userProfile.targetPhysique} journey. Ready to keep the momentum going?`,
        `Outstanding dedication! Your ${context.userProfile.targetPhysique} transformation is progressing beautifully. How can I help next?`,
        `Phenomenal effort today! Your ${context.userProfile.targetPhysique} goals are getting closer with each session. What's next?`,
        `Brilliant work! Your ${context.userProfile.targetPhysique} aspirations are becoming reality. Ready for more?`,
        `Exceptional performance! Your ${context.userProfile.targetPhysique} journey is accelerating. How are you feeling?`,
        `Magnificent session! Your ${context.userProfile.targetPhysique} goals are within your grasp. What's the plan?`,
        `Tremendous effort! Your ${context.userProfile.targetPhysique} transformation is on fire. Ready to continue?`,
        `Spectacular work today! Your ${context.userProfile.targetPhysique} journey is gaining serious momentum. Next steps?`,
        `Incredible dedication! Your ${context.userProfile.targetPhysique} goals are getting stronger. How can I assist?`,
        `Outstanding commitment! Your ${context.userProfile.targetPhysique} transformation is unstoppable. What's next?`
      ];
      return responses[randomSeed % responses.length];
    } else if (daysSinceLastWorkout === 1) {
      const responses = [
        `Perfect timing for your next workout! I've noticed you're consistent with your training. Let me create an optimized session for your ${context.userProfile.targetPhysique} goals.`,
        `Excellent timing! Your dedication is paying off. Time for another powerful workout designed for your ${context.userProfile.targetPhysique} aspirations.`,
        `Right on schedule! Your ${context.userProfile.targetPhysique} goals need this consistency. Ready to train?`,
        `Perfect! Your discipline is impressive. Let's build on your progress with a targeted ${context.userProfile.targetPhysique} workout.`,
        `Ideal timing! Your consistency is building serious momentum toward your ${context.userProfile.targetPhysique} goals. Let's keep it going!`,
        `Outstanding schedule adherence! Your ${context.userProfile.targetPhysique} transformation is accelerating. Ready for another session?`,
        `Perfect rhythm! Your training consistency is paying dividends for your ${context.userProfile.targetPhysique} aspirations.`,
        `Excellent discipline! Your ${context.userProfile.targetPhysique} journey is gaining serious traction. Time to push forward!`,
        `Fantastic timing! Your commitment to your ${context.userProfile.targetPhysique} goals is inspiring. Let's continue!`,
        `Brilliant consistency! Your ${context.userProfile.targetPhysique} transformation is on track. Ready for more?`,
        `Outstanding routine! Your ${context.userProfile.targetPhysique} goals are getting closer with each session.`,
        `Perfect dedication! Your ${context.userProfile.targetPhysique} journey is building serious momentum.`,
        `Excellent progress! Your ${context.userProfile.targetPhysique} aspirations are becoming reality. Let's keep going!`,
        `Incredible consistency! Your ${context.userProfile.targetPhysique} transformation is unstoppable.`,
        `Magnificent timing! Your ${context.userProfile.targetPhysique} goals are within reach. Ready to dominate?`
      ];
      return responses[randomSeed % responses.length];
    } else {
      const responses = [
        `I see it's been ${daysSinceLastWorkout} days since your last workout. No worries! Let's get back on track with a motivating session designed for your ${context.userProfile.targetPhysique} goals.`,
        `A ${daysSinceLastWorkout} day break is totally fine! Time to reignite your passion with a fresh workout designed for your ${context.userProfile.targetPhysique} aspirations.`,
        `Don't stress about the ${daysSinceLastWorkout} day gap! Your ${context.userProfile.targetPhysique} journey continues today. Let's ease back in.`,
        `The ${daysSinceLastWorkout} day pause is behind us! Time to get back to crushing your ${context.userProfile.targetPhysique} goals.`,
        `No judgment here! A ${daysSinceLastWorkout} day break happens to everyone. Let's restart your ${context.userProfile.targetPhysique} journey with fresh energy!`,
        `Life happens! Those ${daysSinceLastWorkout} days off are behind you. Time to reignite your ${context.userProfile.targetPhysique} transformation!`,
        `Don't worry about the ${daysSinceLastWorkout} day gap! Your ${context.userProfile.targetPhysique} goals are still waiting. Let's get back to it!`,
        `A ${daysSinceLastWorkout} day break is actually good for recovery! Now let's channel that energy into your ${context.userProfile.targetPhysique} goals.`,
        `The ${daysSinceLastWorkout} day rest is over! Your ${context.userProfile.targetPhysique} journey is calling. Ready to answer?`,
        `No problem with the ${daysSinceLastWorkout} day pause! Let's jump back into your ${context.userProfile.targetPhysique} transformation with renewed focus!`,
        `Those ${daysSinceLastWorkout} days are history! Your ${context.userProfile.targetPhysique} aspirations are still alive. Let's revive them!`,
        `A ${daysSinceLastWorkout} day break won't stop your ${context.userProfile.targetPhysique} progress! Time to get back on the horse!`,
        `The ${daysSinceLastWorkout} day gap is nothing! Your ${context.userProfile.targetPhysique} goals are still achievable. Let's go!`,
        `Don't let ${daysSinceLastWorkout} days define you! Your ${context.userProfile.targetPhysique} transformation continues now!`,
        `A ${daysSinceLastWorkout} day rest is actually beneficial! Now let's use that energy for your ${context.userProfile.targetPhysique} goals!`
      ];
      return responses[randomSeed % responses.length];
    }
  }

  private static getNutritionResponse(context: ConversationContext): string {
    if (!context.userProfile) {
      return "I'd love to help with your nutrition! Please complete your profile first so I can calculate your personalized macro targets.";
    }
    
    const todayNutrition = context.nutritionLog.filter(n => 
      new Date(n.date).toDateString() === new Date().toDateString()
    );
    const randomSeed = Date.now() % 1000;
    
    if (todayNutrition.length === 0) {
      const responses = [
        `Let's fuel your ${context.userProfile.targetPhysique} goals! I'll help you track your nutrition and create a meal plan that supports your training. What would you like to log first?`,
        `Time to optimize your nutrition for ${context.userProfile.targetPhysique} success! I'll guide you through macro tracking and meal planning. Ready to start?`,
        `Your ${context.userProfile.targetPhysique} transformation needs proper fuel! Let's create a nutrition plan that maximizes your results. What's on your plate?`,
        `Nutrition is the foundation of your ${context.userProfile.targetPhysique} goals! I'll help you track macros and plan meals. What would you like to log?`,
        `Ready to supercharge your ${context.userProfile.targetPhysique} journey? Let's optimize your nutrition for maximum results!`,
        `Your ${context.userProfile.targetPhysique} goals demand smart nutrition! I'll help you fuel your transformation properly.`,
        `Let's revolutionize your eating for ${context.userProfile.targetPhysique} success! What's your first meal today?`,
        `Time to master your nutrition game! Your ${context.userProfile.targetPhysique} transformation starts with smart eating.`,
        `Your ${context.userProfile.targetPhysique} aspirations need proper nutrition! Let's create a winning meal strategy.`,
        `Ready to fuel greatness? Your ${context.userProfile.targetPhysique} goals require strategic nutrition planning.`,
        `Let's optimize your eating for ${context.userProfile.targetPhysique} dominance! What's on the menu?`,
        `Your ${context.userProfile.targetPhysique} transformation begins with nutrition! Let's track your macros smartly.`,
        `Time to eat like a ${context.userProfile.targetPhysique} champion! I'll guide your nutrition journey.`,
        `Let's fuel your ${context.userProfile.targetPhysique} success story! What's your nutrition plan today?`,
        `Your ${context.userProfile.targetPhysique} goals need elite nutrition! Let's create a meal strategy that works.`
      ];
      return responses[randomSeed % responses.length];
    }
    
    const totalCalories = todayNutrition.reduce((sum, n) => sum + n.calories, 0);
    const totalProtein = todayNutrition.reduce((sum, n) => sum + n.protein, 0);
    
    const responses = [
      `Great job tracking your nutrition today! You've logged ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein. For your ${context.userProfile.targetPhysique} goals, I can help optimize your macro balance. What would you like to add next?`,
      `Excellent nutrition tracking! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein logged. Your ${context.userProfile.targetPhysique} goals are getting the fuel they need. What's next?`,
      `Outstanding macro tracking! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein so far. Your ${context.userProfile.targetPhysique} transformation is well-fueled. Ready for more?`,
      `Perfect nutrition logging! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein recorded. Your ${context.userProfile.targetPhysique} goals are being supported. What else?`,
      `Fantastic nutrition discipline! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein tracked. Your ${context.userProfile.targetPhysique} journey is properly fueled!`,
      `Incredible macro management! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein logged. Your ${context.userProfile.targetPhysique} goals are thriving!`,
      `Brilliant nutrition tracking! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein recorded. Your ${context.userProfile.targetPhysique} transformation is accelerating!`,
      `Outstanding eating habits! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein logged. Your ${context.userProfile.targetPhysique} aspirations are well-supported!`,
      `Magnificent nutrition logging! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein tracked. Your ${context.userProfile.targetPhysique} goals are getting stronger!`,
      `Phenomenal macro tracking! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein recorded. Your ${context.userProfile.targetPhysique} journey is on fire!`,
      `Spectacular nutrition discipline! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein logged. Your ${context.userProfile.targetPhysique} transformation is unstoppable!`,
      `Tremendous eating consistency! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein tracked. Your ${context.userProfile.targetPhysique} goals are within reach!`,
      `Exceptional nutrition management! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein logged. Your ${context.userProfile.targetPhysique} aspirations are flourishing!`,
      `Incredible macro mastery! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein recorded. Your ${context.userProfile.targetPhysique} journey is gaining serious momentum!`,
      `Outstanding nutritional commitment! ${totalCalories} calories and ${totalProtein.toFixed(1)}g protein tracked. Your ${context.userProfile.targetPhysique} goals are becoming reality!`
    ];
    return responses[randomSeed % responses.length];
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
    const randomSeed = Date.now() % 1000;
    const responses = [
      `I'm your intelligent AI fitness coach! I learn from your patterns and adapt to your preferences. I can help with:\n\n• **Personalized workouts** - Tailored to your goals and preferences\n• **Smart nutrition planning** - Science-based macro calculations\n• **Progress tracking** - Analytics and insights\n• **Adaptive recommendations** - That improve over time\n\nWhat would you like to work on today?`,
      `Welcome to your AI-powered fitness journey! I'm here to revolutionize your training with:\n\n• **Dynamic workout generation** - Based on your real-time data\n• **Intelligent nutrition coaching** - Doctor-level macro precision\n• **Advanced progress analytics** - Deep insights into your performance\n• **Adaptive learning** - I get smarter with every interaction\n\nReady to transform your fitness?`,
      `Your personal AI fitness revolution starts here! I offer:\n\n• **Smart workout creation** - Perfectly calibrated to your goals\n• **Precision nutrition guidance** - Science-backed macro optimization\n• **Comprehensive progress tracking** - Real-time performance insights\n• **Continuous adaptation** - I evolve with your fitness journey\n\nWhat's your first move?`,
      `I'm your cutting-edge AI fitness companion! Together we'll master:\n\n• **Intelligent training programs** - Customized for your unique goals\n• **Advanced nutrition science** - Precision macro calculations\n• **Deep performance analytics** - Uncover hidden patterns\n• **Evolving recommendations** - Always improving, always adapting\n\nLet's begin your transformation!`,
      `Ready to experience the future of fitness? I provide:\n\n• **AI-powered workouts** - Dynamically generated for optimal results\n• **Scientific nutrition planning** - Evidence-based macro strategies\n• **Comprehensive progress insights** - Track every aspect of your journey\n• **Adaptive intelligence** - I learn and grow with you\n\nWhat shall we tackle first?`,
      `Your intelligent fitness revolution awaits! I specialize in:\n\n• **Dynamic workout optimization** - Real-time program adjustments\n• **Precision nutrition coaching** - Doctor-level accuracy\n• **Advanced performance tracking** - Deep dive into your data\n• **Continuous learning** - I adapt to your unique patterns\n\nReady to dominate your goals?`,
      `Welcome to the next generation of fitness coaching! I deliver:\n\n• **Smart workout generation** - AI-crafted for maximum impact\n• **Scientific nutrition guidance** - Research-backed macro strategies\n• **Comprehensive progress analysis** - Uncover your true potential\n• **Adaptive intelligence** - I evolve with your fitness journey\n\nWhat's our first mission?`,
      `I'm your AI fitness transformation partner! Together we'll achieve:\n\n• **Intelligent training design** - Perfectly tailored to your aspirations\n• **Precision nutrition mastery** - Science-based macro optimization\n• **Advanced progress insights** - Deep performance analytics\n• **Continuous adaptation** - I get smarter with every interaction\n\nLet's start your journey!`,
      `Your personal AI fitness revolution begins now! I offer:\n\n• **Dynamic workout creation** - AI-powered for optimal results\n• **Scientific nutrition planning** - Evidence-based macro strategies\n• **Comprehensive progress tracking** - Real-time performance insights\n• **Adaptive learning** - I evolve with your fitness goals\n\nWhat shall we conquer first?`,
      `Ready to experience AI-powered fitness at its finest? I provide:\n\n• **Intelligent workout optimization** - Customized for your unique goals\n• **Precision nutrition coaching** - Doctor-level macro accuracy\n• **Advanced performance analytics** - Uncover hidden patterns\n• **Continuous evolution** - I adapt to your fitness journey\n\nLet's begin your transformation!`
    ];
    return responses[randomSeed % responses.length];
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
