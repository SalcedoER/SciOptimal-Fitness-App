import { AdvancedAIService } from './advancedAI';
import { SmartPatterns } from './smartPatterns';
import { NaturalLanguageProcessor } from './naturalLanguageProcessor';
import { UserProfile, WorkoutSession, NutritionEntry } from '../store';

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

export class IntelligentResponseGenerator {
  
  static async generateResponse(
    userMessage: string,
    userProfile: UserProfile | null,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[],
    sessionId: string = 'default'
  ): Promise<{
    content: string;
    suggestions: string[];
    action?: string;
    data?: any;
    confidence: number;
    personalized: boolean;
  }> {
    
    // Create conversation context
    const context: ConversationContext = {
      userProfile,
      recentMessages: SmartPatterns.getRecentMessages(sessionId) || [],
      currentGoals: userProfile ? [userProfile.targetPhysique] : [],
      workoutHistory,
      nutritionLog,
      mood: 'neutral',
      lastWorkoutDate: this.getLastWorkoutDate(workoutHistory),
      lastNutritionDate: this.getLastNutritionDate(nutritionLog)
    };
    
    // Analyze the user's message with advanced NLP
    const nlpAnalysis = NaturalLanguageProcessor.analyzeIntent(userMessage, context);
    
    // Get personalized patterns
    const userPatterns = SmartPatterns.getUserPatterns(sessionId);
    
    // Generate base response using advanced AI
    const baseResponse = AdvancedAIService.generateResponse(
      userMessage,
      userProfile,
      workoutHistory,
      nutritionLog,
      sessionId
    );
    
    // Enhance with personalized patterns
    const personalizedResponse = SmartPatterns.getPersonalizedResponse(
      sessionId,
      baseResponse.action || 'general_advice',
      nlpAnalysis.sentiment.sentiment,
      baseResponse.content
    );
    
    // Generate contextual suggestions
    const contextualSuggestions = this.generateContextualSuggestions(
      nlpAnalysis,
      context,
      userPatterns
    );
    
    // Add predictive insights
    const predictiveInsights = SmartPatterns.predictUserNeeds(sessionId);
    
    // Combine all suggestions
    const allSuggestions = [
      ...baseResponse.suggestions,
      ...contextualSuggestions,
      ...predictiveInsights
    ].slice(0, 6); // Limit to 6 suggestions
    
    // Learn from this interaction
    SmartPatterns.learnFromInteraction(
      sessionId,
      userMessage,
      personalizedResponse,
      baseResponse.action || 'general_advice',
      nlpAnalysis.sentiment.sentiment,
      nlpAnalysis.confidence
    );
    
    return {
      content: personalizedResponse,
      suggestions: allSuggestions,
      action: baseResponse.action,
      data: baseResponse.data,
      confidence: nlpAnalysis.confidence,
      personalized: userPatterns ? true : false
    };
  }
  
  private static generateContextualSuggestions(
    nlpAnalysis: any,
    context: ConversationContext,
    userPatterns: any
  ): string[] {
    const suggestions: string[] = [];
    
    // Add suggestions based on entities found
    nlpAnalysis.entities.forEach((entity: any) => {
      if (entity.type === 'exercise') {
        suggestions.push(`Focus on ${entity.value} today`);
        suggestions.push(`Add more ${entity.value} to your routine`);
      }
      if (entity.type === 'food') {
        suggestions.push(`Track your ${entity.value} intake`);
        suggestions.push(`Add ${entity.value} to your meal plan`);
      }
      if (entity.type === 'body_part') {
        suggestions.push(`Work on your ${entity.value}`);
        suggestions.push(`Strengthen your ${entity.value}`);
      }
    });
    
    // Add suggestions based on sentiment
    if (nlpAnalysis.sentiment.sentiment === 'negative') {
      suggestions.push('I\'m here to support you');
      suggestions.push('Let\'s start with something simple');
      suggestions.push('You\'re doing great, keep going!');
    } else if (nlpAnalysis.sentiment.sentiment === 'positive') {
      suggestions.push('Channel that energy into a workout!');
      suggestions.push('Let\'s set some ambitious goals!');
      suggestions.push('You\'re unstoppable!');
    }
    
    // Add suggestions based on urgency
    if (nlpAnalysis.urgency === 'high') {
      suggestions.push('I\'ll help you right away!');
      suggestions.push('Let\'s solve this quickly');
    }
    
    // Add suggestions based on complexity
    if (nlpAnalysis.complexity === 'complex') {
      suggestions.push('I\'ll provide detailed analysis');
      suggestions.push('Let me break this down for you');
    } else if (nlpAnalysis.complexity === 'simple') {
      suggestions.push('Keep it simple and effective');
      suggestions.push('Focus on the basics');
    }
    
    // Add personalized suggestions from patterns
    if (userPatterns) {
      const personalizedSuggestions = SmartPatterns.getPersonalizedSuggestions(
        'default',
        nlpAnalysis.primaryIntent
      );
      suggestions.push(...personalizedSuggestions);
    }
    
    return suggestions;
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

// Enhanced conversation memory system
export class ConversationMemory {
  private static memory: Map<string, ConversationMemoryEntry[]> = new Map();
  
  interface ConversationMemoryEntry {
    timestamp: Date;
    userMessage: string;
    aiResponse: string;
    context: string;
    mood: string;
    satisfaction: number;
    entities: any[];
    intent: string;
  }
  
  static storeInteraction(
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    context: string,
    mood: string,
    satisfaction: number,
    entities: any[],
    intent: string
  ) {
    if (!this.memory.has(sessionId)) {
      this.memory.set(sessionId, []);
    }
    
    const entry: ConversationMemoryEntry = {
      timestamp: new Date(),
      userMessage,
      aiResponse,
      context,
      mood,
      satisfaction,
      entities,
      intent
    };
    
    this.memory.get(sessionId)!.push(entry);
    
    // Keep only last 50 interactions
    const interactions = this.memory.get(sessionId)!;
    if (interactions.length > 50) {
      interactions.splice(0, interactions.length - 50);
    }
  }
  
  static getConversationHistory(sessionId: string): ConversationMemoryEntry[] {
    return this.memory.get(sessionId) || [];
  }
  
  static getRecentContext(sessionId: string, limit: number = 5): ConversationMemoryEntry[] {
    const history = this.getConversationHistory(sessionId);
    return history.slice(-limit);
  }
  
  static analyzeConversationTrends(sessionId: string): {
    averageSatisfaction: number;
    commonIntents: string[];
    moodTrends: string[];
    improvementAreas: string[];
  } {
    const history = this.getConversationHistory(sessionId);
    
    if (history.length === 0) {
      return {
        averageSatisfaction: 0.5,
        commonIntents: [],
        moodTrends: [],
        improvementAreas: []
      };
    }
    
    const averageSatisfaction = history.reduce((sum, entry) => sum + entry.satisfaction, 0) / history.length;
    
    const intentCounts: { [key: string]: number } = {};
    history.forEach(entry => {
      intentCounts[entry.intent] = (intentCounts[entry.intent] || 0) + 1;
    });
    
    const commonIntents = Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([intent]) => intent);
    
    const moodTrends = history.map(entry => entry.mood);
    
    const improvementAreas = history
      .filter(entry => entry.satisfaction < 0.5)
      .map(entry => entry.intent)
      .filter((intent, index, arr) => arr.indexOf(intent) === index);
    
    return {
      averageSatisfaction,
      commonIntents,
      moodTrends,
      improvementAreas
    };
  }
}

// Advanced suggestion engine
export class SuggestionEngine {
  static generateSmartSuggestions(
    context: ConversationContext,
    nlpAnalysis: any,
    userPatterns: any
  ): string[] {
    const suggestions: string[] = [];
    
    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) {
      suggestions.push('Start your day with a morning workout!');
      suggestions.push('Log your breakfast for better tracking');
    } else if (hour >= 12 && hour < 14) {
      suggestions.push('Perfect time for a lunch workout!');
      suggestions.push('Track your lunch to stay on target');
    } else if (hour >= 17 && hour < 20) {
      suggestions.push('Evening workout time - let\'s go!');
      suggestions.push('Plan your dinner for optimal recovery');
    }
    
    // Goal-based suggestions
    if (context.userProfile?.targetPhysique) {
      const goal = context.userProfile.targetPhysique.toLowerCase();
      if (goal.includes('muscle') || goal.includes('strength')) {
        suggestions.push('Focus on compound movements today');
        suggestions.push('Increase your protein intake');
      } else if (goal.includes('lean') || goal.includes('fat')) {
        suggestions.push('Add some cardio to your routine');
        suggestions.push('Track your calorie deficit');
      } else if (goal.includes('endurance') || goal.includes('cardio')) {
        suggestions.push('Try interval training today');
        suggestions.push('Focus on your breathing');
      }
    }
    
    // Progress-based suggestions
    const recentWorkouts = context.workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.date) > weekAgo;
    });
    
    if (recentWorkouts.length === 0) {
      suggestions.push('Let\'s get back on track with a workout!');
      suggestions.push('Start with something simple and build momentum');
    } else if (recentWorkouts.length >= 3) {
      suggestions.push('You\'re crushing it! Keep the momentum going!');
      suggestions.push('Time to increase the intensity?');
    }
    
    // Nutrition-based suggestions
    const todayNutrition = context.nutritionLog.filter(n => 
      new Date(n.date).toDateString() === new Date().toDateString()
    );
    
    if (todayNutrition.length === 0) {
      suggestions.push('Start tracking your meals today');
      suggestions.push('Log your first meal to begin');
    } else if (todayNutrition.length < 3) {
      suggestions.push('Keep logging your meals for better insights');
      suggestions.push('Add your next meal to complete the day');
    }
    
    // Mood-based suggestions
    if (context.mood === 'struggling') {
      suggestions.push('Let\'s start with something manageable');
      suggestions.push('I\'m here to support you every step');
      suggestions.push('Small steps lead to big changes');
    } else if (context.mood === 'excited') {
      suggestions.push('Channel that energy into a challenging workout!');
      suggestions.push('Let\'s set some ambitious goals!');
      suggestions.push('You\'re unstoppable right now!');
    }
    
    // Entity-based suggestions
    nlpAnalysis.entities.forEach((entity: any) => {
      if (entity.type === 'exercise') {
        suggestions.push(`Master your ${entity.value} form`);
        suggestions.push(`Increase ${entity.value} intensity`);
      }
      if (entity.type === 'food') {
        suggestions.push(`Optimize your ${entity.value} portions`);
        suggestions.push(`Try different ${entity.value} preparations`);
      }
    });
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }
}
