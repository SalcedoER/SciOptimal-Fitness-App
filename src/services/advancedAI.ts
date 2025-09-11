import { UserProfile, WorkoutSession, NutritionEntry } from '../store';

interface AIResponse {
  content: string;
  suggestions: string[];
  action?: 'generate_workout' | 'create_meal_plan' | 'track_food' | 'analyze_progress' | 'provide_advice';
  data?: any;
}

interface ConversationContext {
  userProfile: UserProfile | null;
  recentMessages: string[];
  currentGoals: string[];
  workoutHistory: WorkoutSession[];
  nutritionLog: NutritionEntry[];
  mood: 'motivated' | 'struggling' | 'neutral' | 'excited';
  lastWorkoutDate?: Date;
  lastNutritionDate?: Date;
}

export class AdvancedAIService {
  private static conversationMemory: Map<string, ConversationContext> = new Map();
  
  // Advanced keyword patterns with context understanding
  private static patterns = {
    // Workout patterns
    workout: {
      generate: /(generate|create|make|new|fresh|different)\s+(workout|exercise|training|routine)/i,
      modify: /(modify|change|adjust|update|tweak|fix)\s+(workout|exercise|training|routine)/i,
      harder: /(harder|tougher|more\s+intense|challenge|push)/i,
      easier: /(easier|lighter|less\s+intense|gentle|moderate)/i,
      specific: /(legs?|chest|back|arms?|shoulders?|core|cardio|strength|muscle)/i
    },
    
    // Nutrition patterns
    nutrition: {
      track: /(track|log|add|record|enter)\s+(food|meal|nutrition|calories|macros)/i,
      meal_plan: /(meal\s+plan|food\s+plan|diet\s+plan|nutrition\s+plan|eating\s+plan)/i,
      macros: /(macros?|calories?|protein|carbs?|fats?|nutrition\s+targets?)/i,
      specific_food: /(chicken|beef|fish|salmon|eggs?|rice|pasta|bread|vegetables?|fruits?)/i
    },
    
    // Progress patterns
    progress: {
      how_am_i: /(how\s+am\s+i\s+doing|progress|improvement|gains?|results?)/i,
      analytics: /(analytics|stats?|data|insights?|trends?|patterns?)/i,
      goals: /(goals?|targets?|objectives?|aims?|targets?)/i,
      motivation: /(motivation|motivate|encourage|support|help)/i
    },
    
    // Emotional patterns
    emotion: {
      frustrated: /(frustrated|stuck|plateau|not\s+working|giving\s+up|tired)/i,
      excited: /(excited|pumped|ready|motivated|energized|great)/i,
      confused: /(confused|lost|don't\s+know|help|guidance|advice)/i,
      proud: /(proud|accomplished|achieved|success|win|victory)/i
    }
  };

  static generateResponse(
    userMessage: string, 
    userProfile: UserProfile | null,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[],
    sessionId: string = 'default'
  ): AIResponse {
    const context = this.getOrCreateContext(sessionId, userProfile, workoutHistory, nutritionLog);
    const message = userMessage.toLowerCase();
    
    // Update conversation memory
    context.recentMessages.push(userMessage);
    if (context.recentMessages.length > 10) {
      context.recentMessages = context.recentMessages.slice(-10);
    }
    
    // Analyze emotional state
    const mood = this.analyzeMood(message, context);
    context.mood = mood;
    
    // Determine intent and generate response
    const intent = this.determineIntent(message, context);
    return this.generateContextualResponse(intent, message, context);
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
    context.lastWorkoutDate = this.getLastWorkoutDate(workoutHistory);
    context.lastNutritionDate = this.getLastNutritionDate(nutritionLog);
    
    return context;
  }

  private static analyzeMood(message: string, context: ConversationContext): 'motivated' | 'struggling' | 'neutral' | 'excited' {
    const frustratedWords = ['frustrated', 'stuck', 'plateau', 'not working', 'giving up', 'tired', 'hard', 'difficult'];
    const excitedWords = ['excited', 'pumped', 'ready', 'motivated', 'energized', 'great', 'awesome', 'amazing'];
    const proudWords = ['proud', 'accomplished', 'achieved', 'success', 'win', 'victory', 'crushed', 'nailed'];
    
    const messageLower = message.toLowerCase();
    
    if (frustratedWords.some(word => messageLower.includes(word))) {
      return 'struggling';
    }
    if (excitedWords.some(word => messageLower.includes(word))) {
      return 'excited';
    }
    if (proudWords.some(word => messageLower.includes(word))) {
      return 'motivated';
    }
    
    return 'neutral';
  }

  private static determineIntent(message: string, context: ConversationContext): string {
    // Check for workout intent
    if (this.patterns.workout.generate.test(message)) return 'generate_workout';
    if (this.patterns.workout.modify.test(message)) return 'generate_workout';
    if (this.patterns.workout.harder.test(message)) return 'harder_workout';
    if (this.patterns.workout.easier.test(message)) return 'easier_workout';
    
    // Check for nutrition intent
    if (this.patterns.nutrition.track.test(message)) return 'track_food';
    if (this.patterns.nutrition.meal_plan.test(message)) return 'create_meal_plan';
    if (this.patterns.nutrition.macros.test(message)) return 'analyze_macros';
    
    // Check for progress intent
    if (this.patterns.progress.how_am_i.test(message)) return 'analyze_progress';
    if (this.patterns.progress.analytics.test(message)) return 'show_analytics';
    
    // Check for emotional support
    if (this.patterns.emotion.frustrated.test(message)) return 'provide_support';
    if (this.patterns.emotion.excited.test(message)) return 'celebrate';
    
    // Default to general advice
    return 'general_advice';
  }

  private static generateContextualResponse(intent: string, message: string, context: ConversationContext): AIResponse {
    const mood = context.mood;
    const userProfile = context.userProfile;
    const recentMessages = context.recentMessages;
    
    switch (intent) {
      case 'generate_workout':
        return this.generateWorkoutResponse(context, mood);
      
      case 'generate_workout':
        return this.modifyWorkoutResponse(context, mood);
      
      case 'harder_workout':
        return this.harderWorkoutResponse(context, mood);
      
      case 'easier_workout':
        return this.easierWorkoutResponse(context, mood);
      
      case 'track_food':
        return this.trackFoodResponse(context, mood);
      
      case 'create_meal_plan':
        return this.createMealPlanResponse(context, mood);
      
      case 'analyze_macros':
        return this.analyzeMacrosResponse(context, mood);
      
      case 'analyze_progress':
        return this.analyzeProgressResponse(context, mood);
      
      case 'show_analytics':
        return this.showAnalyticsResponse(context, mood);
      
      case 'provide_support':
        return this.provideSupportResponse(context, mood);
      
      case 'celebrate':
        return this.celebrateResponse(context, mood);
      
      default:
        return this.generalAdviceResponse(context, mood);
    }
  }

  private static generateWorkoutResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const lastWorkout = context.lastWorkoutDate;
    const daysSinceWorkout = lastWorkout ? Math.floor((Date.now() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    let content = '';
    let suggestions: string[] = [];
    
    if (mood === 'struggling') {
      content = `I can see you're feeling a bit frustrated. Let's get you a workout that will boost your confidence! 💪\n\n`;
    } else if (mood === 'excited') {
      content = `I love your energy! Let's channel that excitement into an amazing workout! 🔥\n\n`;
    } else {
      content = `Perfect timing for a new workout! Let me create something tailored just for you. 🎯\n\n`;
    }
    
    if (daysSinceWorkout > 3) {
      content += `It's been ${daysSinceWorkout} days since your last workout - let's get you back on track with a solid session!`;
    } else if (daysSinceWorkout === 0) {
      content += `I see you worked out today - great job! Let me create a different type of workout to keep things fresh.`;
    } else {
      content += `Building on your momentum from ${daysSinceWorkout} days ago - let's keep the progress going!`;
    }
    
    content += `\n\n**Your ${userProfile?.targetPhysique || 'fitness'} workout is ready!**`;
    
    suggestions = [
      "Make it harder",
      "Make it easier", 
      "Focus on upper body",
      "Focus on legs",
      "Add cardio",
      "Create meal plan"
    ];
    
    return {
      content,
      suggestions,
      action: 'generate_workout'
    };
  }

  private static trackFoodResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const lastNutrition = context.lastNutritionDate;
    const hoursSinceLastMeal = lastNutrition ? Math.floor((Date.now() - lastNutrition.getTime()) / (1000 * 60 * 60)) : 24;
    
    let content = '';
    
    if (mood === 'struggling') {
      content = `I understand tracking food can feel overwhelming sometimes. Let's make it simple and supportive! 🤗\n\n`;
    } else if (mood === 'excited') {
      content = `Awesome! I love that you're focused on your nutrition! Let's track this properly! 🍎\n\n`;
    } else {
      content = `Great! Let's get your nutrition dialed in. I'm here to help make it easy! 📊\n\n`;
    }
    
    if (hoursSinceLastMeal > 6) {
      content += `It's been ${hoursSinceLastMeal} hours since your last meal - you're probably ready for some fuel! `;
    } else if (hoursSinceLastMeal < 2) {
      content += `I see you just ate recently - are you having a snack or logging something else? `;
    } else {
      content += `Perfect timing to log your meal! `;
    }
    
    content += `\n\n**Tell me what you ate and I'll calculate the macros for you!**\n\n`;
    
    if (userProfile) {
      const todayCalories = context.nutritionLog
        .filter(entry => new Date(entry.date).toDateString() === new Date().toDateString())
        .reduce((sum, entry) => sum + entry.calories, 0);
      
      content += `**Today's Progress:**\n• Calories: ${todayCalories} (target: ${Math.round(userProfile.weight * 25)})\n• Meals logged: ${context.nutritionLog.filter(entry => new Date(entry.date).toDateString() === new Date().toDateString()).length}\n\n`;
    }
    
    const suggestions = [
      "I had chicken and rice",
      "Add my protein shake", 
      "Log my breakfast",
      "Upload food photo",
      "Create meal plan",
      "Check my macros"
    ];
    
    return {
      content,
      suggestions,
      action: 'track_food'
    };
  }

  private static analyzeProgressResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const recentWorkouts = context.workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.date) > weekAgo;
    });
    
    const recentNutrition = context.nutritionLog.filter(n => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(n.date) > weekAgo;
    });
    
    let content = '';
    
    if (mood === 'struggling') {
      content = `I can see you're feeling a bit down about your progress. Let me show you what you've actually accomplished - you might be surprised! 💪\n\n`;
    } else if (mood === 'excited') {
      content = `I love your positive energy! Let's see what amazing progress you've made! 🎉\n\n`;
    } else {
      content = `Let me give you a comprehensive look at your progress! 📈\n\n`;
    }
    
    content += `**Your Progress This Week:**\n`;
    content += `• Workouts completed: ${recentWorkouts.length}\n`;
    content += `• Nutrition entries: ${recentNutrition.length}\n`;
    content += `• Average daily calories: ${Math.round(recentNutrition.reduce((sum, n) => sum + n.calories, 0) / Math.max(recentNutrition.length, 1))}\n\n`;
    
    if (recentWorkouts.length >= 3) {
      content += `🔥 **You're crushing it!** ${recentWorkouts.length} workouts this week shows amazing consistency!\n\n`;
    } else if (recentWorkouts.length === 0) {
      content += `💪 **Ready to get back on track?** Let's start with a great workout today!\n\n`;
    } else {
      content += `👍 **Good momentum!** ${recentWorkouts.length} workouts is a solid start - let's build on this!\n\n`;
    }
    
    // Analyze trends
    const avgWorkoutDuration = recentWorkouts.length > 0 
      ? Math.round(recentWorkouts.reduce((sum, w) => sum + (w.duration || 45), 0) / recentWorkouts.length)
      : 0;
    
    if (avgWorkoutDuration > 0) {
      content += `**Workout Analysis:**\n`;
      content += `• Average duration: ${avgWorkoutDuration} minutes\n`;
      content += `• Consistency: ${recentWorkouts.length >= 3 ? 'Excellent' : recentWorkouts.length >= 1 ? 'Good' : 'Needs improvement'}\n\n`;
    }
    
    const suggestions = [
      "Show detailed analytics",
      "What should I focus on?",
      "Generate new workout",
      "Create meal plan",
      "I need motivation"
    ];
    
    return {
      content,
      suggestions,
      action: 'analyze_progress'
    };
  }

  private static provideSupportResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const recentWorkouts = context.workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.date) > weekAgo;
    });
    
    let content = '';
    
    content += `I can hear that you're feeling frustrated, and that's completely normal! Every fitness journey has ups and downs. 🤗\n\n`;
    
    if (recentWorkouts.length > 0) {
      content += `**But look what you've accomplished:**\n`;
      content += `• ${recentWorkouts.length} workouts this week - that's dedication!\n`;
      content += `• You're showing up for yourself, even when it's hard\n`;
      content += `• Every workout counts, no matter how small\n\n`;
    }
    
    content += `**Here's what I want you to remember:**\n`;
    content += `• Progress isn't always linear - plateaus are normal\n`;
    content += `• You're stronger than you think you are\n`;
    content += `• Small steps lead to big changes\n`;
    content += `• I'm here to support you every step of the way\n\n`;
    
    content += `**Let's take it one step at a time:**\n`;
    content += `• What's one small thing you can do today?\n`;
    content += `• Maybe just a 10-minute walk or some stretching?\n`;
    content += `• Or we can adjust your plan to make it more manageable?\n\n`;
    
    const suggestions = [
      "Give me a simple workout",
      "Help me with my nutrition",
      "Show me my progress",
      "Make my plan easier",
      "I need motivation"
    ];
    
    return {
      content,
      suggestions,
      action: 'provide_advice'
    };
  }

  private static celebrateResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const recentWorkouts = context.workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.date) > weekAgo;
    });
    
    let content = '';
    
    content += `YES! I love your energy! 🔥💪🎉\n\n`;
    content += `Your enthusiasm is contagious! This is exactly the mindset that leads to amazing results!\n\n`;
    
    if (recentWorkouts.length > 0) {
      content += `**You're already crushing it:**\n`;
      content += `• ${recentWorkouts.length} workouts this week - incredible!\n`;
      content += `• That positive energy is your secret weapon\n`;
      content += `• You're building unstoppable momentum\n\n`;
    }
    
    content += `**Let's channel this energy into something amazing:**\n`;
    content += `• Ready for a challenging workout?\n`;
    content += `• Want to try something new and exciting?\n`;
    content += `• Let's set some ambitious goals!\n\n`;
    
    content += `**Remember:** This energy you're feeling right now? That's what champions are made of! 🏆\n\n`;
    
    const suggestions = [
      "Give me a hard workout!",
      "Let's try something new",
      "Set ambitious goals",
      "Show me my progress",
      "I'm ready for anything!"
    ];
    
    return {
      content,
      suggestions,
      action: 'generate_workout'
    };
  }

  private static generalAdviceResponse(context: ConversationContext, mood: string): AIResponse {
    const userProfile = context.userProfile;
    const recentMessages = context.recentMessages;
    
    let content = '';
    
    if (mood === 'struggling') {
      content += `I can sense you might be feeling a bit overwhelmed. That's okay - we all have those moments! 🤗\n\n`;
    } else if (mood === 'excited') {
      content += `I love your energy! Let's put that enthusiasm to good use! 🔥\n\n`;
    } else {
      content += `I'm here to help you with whatever you need! 💪\n\n`;
    }
    
    content += `**Here's what I can help you with:**\n`;
    content += `• **Workouts** - Generate, modify, or get advice on training\n`;
    content += `• **Nutrition** - Track food, create meal plans, analyze macros\n`;
    content += `• **Progress** - Analyze your data and provide insights\n`;
    content += `• **Motivation** - Support, encouragement, and goal setting\n`;
    content += `• **Questions** - Answer any fitness or nutrition questions\n\n`;
    
    if (userProfile) {
      content += `**Based on your ${userProfile.targetPhysique} goals, I can:**\n`;
      content += `• Create personalized workout plans\n`;
      content += `• Calculate your exact nutrition targets\n`;
      content += `• Track your progress toward your goals\n`;
      content += `• Adapt your plan as you improve\n\n`;
    }
    
    content += `**What would you like to focus on today?**\n\n`;
    
    const suggestions = [
      "Generate new workout",
      "Track my food",
      "Create meal plan",
      "Show my progress",
      "I need motivation",
      "Ask a question"
    ];
    
    return {
      content,
      suggestions,
      action: 'provide_advice'
    };
  }

  private static getLastWorkoutDate(workoutHistory: WorkoutSession[]): Date | undefined {
    if (workoutHistory.length === 0) return undefined;
    return new Date(Math.max(...workoutHistory.map(w => new Date(w.date).getTime())));
  }

  private static getLastNutritionDate(nutritionLog: NutritionEntry[]): Date | undefined {
    if (nutritionLog.length === 0) return undefined;
    return new Date(Math.max(...nutritionLog.map(n => new Date(n.date).getTime())));
  }

  // Additional response methods for other intents...
  private static modifyWorkoutResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "I'd be happy to modify your workout! What specific changes would you like to make?",
      suggestions: ["Make it harder", "Make it easier", "Change the focus", "Add cardio", "Remove exercises"],
      action: 'generate_workout'
    };
  }

  private static harderWorkoutResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "Perfect! Let's challenge you with a more intense workout! 💪",
      suggestions: ["Generate hard workout", "Add more sets", "Increase intensity", "Add cardio", "Focus on strength"],
      action: 'generate_workout'
    };
  }

  private static easierWorkoutResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "No problem! Let's create a more manageable workout that still gets results! 👍",
      suggestions: ["Generate easy workout", "Reduce intensity", "Focus on form", "Add rest days", "Gentle cardio"],
      action: 'generate_workout'
    };
  }

  private static createMealPlanResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "I'll create a personalized meal plan based on your goals and preferences! 🍎",
      suggestions: ["Create meal plan", "High protein plan", "Weight loss plan", "Muscle building plan", "Balanced plan"],
      action: 'create_meal_plan'
    };
  }

  private static analyzeMacrosResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "Let me analyze your current macro intake and provide personalized recommendations! 📊",
      suggestions: ["Show my macros", "Analyze today's food", "Create macro targets", "Track protein", "Balance carbs"],
      action: 'analyze_progress'
    };
  }

  private static showAnalyticsResponse(context: ConversationContext, mood: string): AIResponse {
    return {
      content: "Here's a detailed analysis of your fitness data and trends! 📈",
      suggestions: ["Show trends", "Analyze progress", "Set new goals", "Identify patterns", "Get insights"],
      action: 'analyze_progress'
    };
  }
}
