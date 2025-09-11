// Advanced Natural Language Processing for fitness conversations
export class NaturalLanguageProcessor {
  
  // Advanced intent recognition with context
  static analyzeIntent(message: string, context: ConversationContext): IntentAnalysis {
    const messageLower = message.toLowerCase();
    
    // Extract entities (foods, exercises, numbers, etc.)
    const entities = this.extractEntities(message);
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(message);
    
    // Determine primary intent
    const primaryIntent = this.determinePrimaryIntent(messageLower, entities);
    
    // Determine secondary intents
    const secondaryIntents = this.determineSecondaryIntents(messageLower, entities);
    
    // Extract specific requests
    const specificRequests = this.extractSpecificRequests(message, entities);
    
    // Analyze urgency
    const urgency = this.analyzeUrgency(message, sentiment);
    
    // Determine response complexity needed
    const complexity = this.determineComplexity(message, entities, context);
    
    return {
      primaryIntent,
      secondaryIntents,
      entities,
      sentiment,
      specificRequests,
      urgency,
      complexity,
      confidence: this.calculateConfidence(message, entities, primaryIntent)
    };
  }

  private static extractEntities(message: string): Entity[] {
    const entities: Entity[] = [];
    const messageLower = message.toLowerCase();
    
    // Extract numbers
    const numbers = message.match(/\d+(\.\d+)?/g);
    if (numbers) {
      numbers.forEach(num => {
        entities.push({
          type: 'number',
          value: parseFloat(num),
          text: num,
          confidence: 0.9
        });
      });
    }
    
    // Extract exercises
    const exercisePatterns = {
      'squat': ['squat', 'squats', 'squatting'],
      'deadlift': ['deadlift', 'deadlifts', 'deadlifting'],
      'bench_press': ['bench', 'bench press', 'bench pressing'],
      'push_up': ['push up', 'push-ups', 'pushups'],
      'pull_up': ['pull up', 'pull-ups', 'pullups'],
      'plank': ['plank', 'planking'],
      'burpee': ['burpee', 'burpees'],
      'lunge': ['lunge', 'lunges', 'lunging'],
      'crunch': ['crunch', 'crunches', 'crunching'],
      'sit_up': ['sit up', 'sit-ups', 'situps']
    };
    
    Object.entries(exercisePatterns).forEach(([exercise, patterns]) => {
      patterns.forEach(pattern => {
        if (messageLower.includes(pattern)) {
          entities.push({
            type: 'exercise',
            value: exercise,
            text: pattern,
            confidence: 0.8
          });
        }
      });
    });
    
    // Extract foods
    const foodPatterns = {
      'chicken': ['chicken', 'chicken breast', 'chicken thigh'],
      'beef': ['beef', 'steak', 'ground beef'],
      'fish': ['fish', 'salmon', 'tuna', 'cod'],
      'egg': ['egg', 'eggs'],
      'rice': ['rice', 'white rice', 'brown rice'],
      'pasta': ['pasta', 'spaghetti', 'noodles'],
      'bread': ['bread', 'toast', 'sandwich'],
      'apple': ['apple', 'apples'],
      'banana': ['banana', 'bananas'],
      'broccoli': ['broccoli', 'broccolis']
    };
    
    Object.entries(foodPatterns).forEach(([food, patterns]) => {
      patterns.forEach(pattern => {
        if (messageLower.includes(pattern)) {
          entities.push({
            type: 'food',
            value: food,
            text: pattern,
            confidence: 0.8
          });
        }
      });
    });
    
    // Extract body parts
    const bodyPartPatterns = {
      'chest': ['chest', 'pecs', 'pectorals'],
      'back': ['back', 'lats', 'latissimus'],
      'legs': ['legs', 'quads', 'quadriceps', 'hamstrings'],
      'arms': ['arms', 'biceps', 'triceps'],
      'shoulders': ['shoulders', 'delts', 'deltoids'],
      'core': ['core', 'abs', 'abdominals', 'stomach']
    };
    
    Object.entries(bodyPartPatterns).forEach(([bodyPart, patterns]) => {
      patterns.forEach(pattern => {
        if (messageLower.includes(pattern)) {
          entities.push({
            type: 'body_part',
            value: bodyPart,
            text: pattern,
            confidence: 0.8
          });
        }
      });
    });
    
    // Extract time references
    const timePatterns = {
      'today': ['today', 'this morning', 'this afternoon', 'this evening'],
      'yesterday': ['yesterday'],
      'tomorrow': ['tomorrow'],
      'this_week': ['this week', 'this week'],
      'next_week': ['next week', 'next week']
    };
    
    Object.entries(timePatterns).forEach(([time, patterns]) => {
      patterns.forEach(pattern => {
        if (messageLower.includes(pattern)) {
          entities.push({
            type: 'time',
            value: time,
            text: pattern,
            confidence: 0.9
          });
        }
      });
    });
    
    return entities;
  }

  private static analyzeSentiment(message: string): SentimentAnalysis {
    const messageLower = message.toLowerCase();
    
    // Positive words
    const positiveWords = [
      'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful',
      'love', 'like', 'enjoy', 'excited', 'pumped', 'motivated', 'ready',
      'crushed', 'nailed', 'killed', 'dominated', 'smashed', 'destroyed'
    ];
    
    // Negative words
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'dislike', 'frustrated', 'angry',
      'tired', 'exhausted', 'sore', 'hurt', 'pain', 'struggling', 'stuck',
      'plateau', 'not working', 'giving up', 'quitting', 'failing'
    ];
    
    // Neutral words
    const neutralWords = [
      'okay', 'fine', 'alright', 'decent', 'average', 'normal', 'regular'
    ];
    
    const positiveCount = positiveWords.filter(word => messageLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => messageLower.includes(word)).length;
    const neutralCount = neutralWords.filter(word => messageLower.includes(word)).length;
    
    const totalWords = positiveCount + negativeCount + neutralCount;
    
    if (totalWords === 0) {
      return { sentiment: 'neutral', confidence: 0.5, intensity: 0.5 };
    }
    
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;
    const neutralRatio = neutralCount / totalWords;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (positiveRatio > negativeRatio && positiveRatio > neutralRatio) {
      sentiment = 'positive';
      confidence = positiveRatio;
    } else if (negativeRatio > positiveRatio && negativeRatio > neutralRatio) {
      sentiment = 'negative';
      confidence = negativeRatio;
    } else {
      sentiment = 'neutral';
      confidence = neutralRatio;
    }
    
    // Calculate intensity based on strong words
    const strongWords = [
      'amazing', 'incredible', 'fantastic', 'terrible', 'awful', 'hate',
      'love', 'crushed', 'dominated', 'struggling', 'failing'
    ];
    
    const strongWordCount = strongWords.filter(word => messageLower.includes(word)).length;
    const intensity = Math.min(0.5 + (strongWordCount * 0.1), 1.0);
    
    return { sentiment, confidence, intensity };
  }

  private static determinePrimaryIntent(message: string, entities: Entity[]): string {
    const messageLower = message.toLowerCase();
    
    // Workout intents
    if (messageLower.includes('workout') || messageLower.includes('exercise') || messageLower.includes('gym')) {
      if (messageLower.includes('generate') || messageLower.includes('create') || messageLower.includes('new')) {
        return 'generate_workout';
      }
      if (messageLower.includes('modify') || messageLower.includes('change') || messageLower.includes('adjust')) {
        return 'modify_workout';
      }
      if (messageLower.includes('harder') || messageLower.includes('tougher') || messageLower.includes('challenge')) {
        return 'harder_workout';
      }
      if (messageLower.includes('easier') || messageLower.includes('lighter') || messageLower.includes('gentle')) {
        return 'easier_workout';
      }
      return 'workout_advice';
    }
    
    // Nutrition intents
    if (messageLower.includes('food') || messageLower.includes('meal') || messageLower.includes('eat') || messageLower.includes('nutrition')) {
      if (messageLower.includes('track') || messageLower.includes('log') || messageLower.includes('add')) {
        return 'track_food';
      }
      if (messageLower.includes('plan') || messageLower.includes('create') || messageLower.includes('meal plan')) {
        return 'create_meal_plan';
      }
      if (messageLower.includes('macros') || messageLower.includes('calories') || messageLower.includes('protein')) {
        return 'analyze_macros';
      }
      return 'nutrition_advice';
    }
    
    // Progress intents
    if (messageLower.includes('progress') || messageLower.includes('how am i') || messageLower.includes('doing')) {
      return 'analyze_progress';
    }
    
    // Motivation intents
    if (messageLower.includes('motivation') || messageLower.includes('encourage') || messageLower.includes('support')) {
      return 'provide_motivation';
    }
    
    // Question intents
    if (messageLower.includes('what') || messageLower.includes('how') || messageLower.includes('why') || messageLower.includes('?')) {
      return 'answer_question';
    }
    
    // Default to general advice
    return 'general_advice';
  }

  private static determineSecondaryIntents(message: string, entities: Entity[]): string[] {
    const intents: string[] = [];
    const messageLower = message.toLowerCase();
    
    // Check for secondary intents
    if (messageLower.includes('motivation') || messageLower.includes('encourage')) {
      intents.push('provide_motivation');
    }
    
    if (messageLower.includes('explain') || messageLower.includes('tell me about')) {
      intents.push('provide_explanation');
    }
    
    if (messageLower.includes('schedule') || messageLower.includes('when') || messageLower.includes('time')) {
      intents.push('schedule_advice');
    }
    
    if (messageLower.includes('goal') || messageLower.includes('target') || messageLower.includes('aim')) {
      intents.push('goal_setting');
    }
    
    return intents;
  }

  private static extractSpecificRequests(message: string, entities: Entity[]): SpecificRequest[] {
    const requests: SpecificRequest[] = [];
    const messageLower = message.toLowerCase();
    
    // Extract exercise requests
    const exerciseEntities = entities.filter(e => e.type === 'exercise');
    exerciseEntities.forEach(exercise => {
      requests.push({
        type: 'exercise',
        value: exercise.value,
        confidence: exercise.confidence
      });
    });
    
    // Extract food requests
    const foodEntities = entities.filter(e => e.type === 'food');
    foodEntities.forEach(food => {
      requests.push({
        type: 'food',
        value: food.value,
        confidence: food.confidence
      });
    });
    
    // Extract body part requests
    const bodyPartEntities = entities.filter(e => e.type === 'body_part');
    bodyPartEntities.forEach(bodyPart => {
      requests.push({
        type: 'body_part',
        value: bodyPart.value,
        confidence: bodyPart.confidence
      });
    });
    
    // Extract quantity requests
    const numberEntities = entities.filter(e => e.type === 'number');
    numberEntities.forEach(number => {
      requests.push({
        type: 'quantity',
        value: number.value,
        confidence: number.confidence
      });
    });
    
    return requests;
  }

  private static analyzeUrgency(message: string, sentiment: SentimentAnalysis): 'low' | 'medium' | 'high' {
    const messageLower = message.toLowerCase();
    
    // High urgency indicators
    const highUrgencyWords = ['urgent', 'asap', 'immediately', 'now', 'quick', 'fast', 'emergency'];
    const highUrgencyCount = highUrgencyWords.filter(word => messageLower.includes(word)).length;
    
    // Medium urgency indicators
    const mediumUrgencyWords = ['soon', 'today', 'this week', 'important', 'priority'];
    const mediumUrgencyCount = mediumUrgencyWords.filter(word => messageLower.includes(word)).length;
    
    // Negative sentiment increases urgency
    const sentimentUrgency = sentiment.sentiment === 'negative' ? 1 : 0;
    
    const totalUrgency = highUrgencyCount * 3 + mediumUrgencyCount * 2 + sentimentUrgency;
    
    if (totalUrgency >= 3) return 'high';
    if (totalUrgency >= 1) return 'medium';
    return 'low';
  }

  private static determineComplexity(message: string, entities: Entity[], context: ConversationContext): 'simple' | 'moderate' | 'complex' {
    const messageLower = message.toLowerCase();
    
    // Complex indicators
    const complexWords = ['explain', 'detailed', 'comprehensive', 'analysis', 'breakdown', 'scientific'];
    const complexCount = complexWords.filter(word => messageLower.includes(word)).length;
    
    // Entity complexity
    const entityComplexity = entities.length * 0.1;
    
    // Question complexity
    const questionComplexity = messageLower.includes('?') ? 0.3 : 0;
    
    // Context complexity
    const contextComplexity = context.recentMessages.length > 5 ? 0.2 : 0;
    
    const totalComplexity = complexCount + entityComplexity + questionComplexity + contextComplexity;
    
    if (totalComplexity >= 1.5) return 'complex';
    if (totalComplexity >= 0.5) return 'moderate';
    return 'simple';
  }

  private static calculateConfidence(message: string, entities: Entity[], primaryIntent: string): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on entities
    confidence += entities.length * 0.1;
    
    // Increase confidence based on intent clarity
    const intentWords = {
      'generate_workout': ['workout', 'generate', 'create', 'new'],
      'track_food': ['food', 'track', 'log', 'add'],
      'analyze_progress': ['progress', 'how am i', 'doing']
    };
    
    const intentWordCount = intentWords[primaryIntent]?.filter(word => 
      message.toLowerCase().includes(word)
    ).length || 0;
    
    confidence += intentWordCount * 0.15;
    
    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }

  // Generate contextual response based on analysis
  static generateContextualResponse(analysis: IntentAnalysis, context: ConversationContext): string {
    const { primaryIntent, sentiment, urgency, complexity, entities } = analysis;
    
    let response = '';
    
    // Add urgency-based opening
    if (urgency === 'high') {
      response += 'I understand this is urgent! ';
    } else if (urgency === 'medium') {
      response += 'I\'ll help you with this right away! ';
    }
    
    // Add sentiment-based opening
    if (sentiment.sentiment === 'negative') {
      response += 'I can see you\'re feeling frustrated. ';
    } else if (sentiment.sentiment === 'positive') {
      response += 'I love your positive energy! ';
    }
    
    // Generate main response based on intent
    response += this.generateIntentResponse(primaryIntent, entities, complexity);
    
    // Add complexity-based closing
    if (complexity === 'complex') {
      response += '\n\nI\'ve provided a detailed analysis above. Let me know if you need clarification on any part!';
    } else if (complexity === 'simple') {
      response += '\n\nLet me know if you need more details!';
    }
    
    return response;
  }

  private static generateIntentResponse(intent: string, entities: Entity[], complexity: string): string {
    switch (intent) {
      case 'generate_workout':
        return this.generateWorkoutResponse(entities, complexity);
      case 'track_food':
        return this.generateFoodTrackingResponse(entities, complexity);
      case 'analyze_progress':
        return this.generateProgressResponse(entities, complexity);
      default:
        return this.generateGeneralResponse(entities, complexity);
    }
  }

  private static generateWorkoutResponse(entities: Entity[], complexity: string): string {
    const exerciseEntities = entities.filter(e => e.type === 'exercise');
    const bodyPartEntities = entities.filter(e => e.type === 'body_part');
    
    let response = 'I\'ll create a personalized workout for you! ';
    
    if (exerciseEntities.length > 0) {
      response += `I\'ll include ${exerciseEntities.map(e => e.value).join(', ')}. `;
    }
    
    if (bodyPartEntities.length > 0) {
      response += `I\'ll focus on your ${bodyPartEntities.map(e => e.value).join(', ')}. `;
    }
    
    if (complexity === 'complex') {
      response += 'I\'ll provide detailed explanations for each exercise, including proper form, sets, reps, and rest periods.';
    } else {
      response += 'I\'ll give you a clear, easy-to-follow workout plan.';
    }
    
    return response;
  }

  private static generateFoodTrackingResponse(entities: Entity[], complexity: string): string {
    const foodEntities = entities.filter(e => e.type === 'food');
    const quantityEntities = entities.filter(e => e.type === 'number');
    
    let response = 'I\'ll help you track your nutrition! ';
    
    if (foodEntities.length > 0) {
      response += `I can see you mentioned ${foodEntities.map(e => e.value).join(', ')}. `;
    }
    
    if (quantityEntities.length > 0) {
      response += `I\'ll calculate the macros for ${quantityEntities.map(e => e.value).join(', ')} servings. `;
    }
    
    if (complexity === 'complex') {
      response += 'I\'ll provide detailed macro breakdowns, including protein, carbs, fats, and micronutrients.';
    } else {
      response += 'I\'ll give you a simple macro summary.';
    }
    
    return response;
  }

  private static generateProgressResponse(entities: Entity[], complexity: string): string {
    let response = 'I\'ll analyze your progress and provide insights! ';
    
    if (complexity === 'complex') {
      response += 'I\'ll give you a comprehensive analysis including trends, patterns, and predictions.';
    } else {
      response += 'I\'ll give you a clear overview of how you\'re doing.';
    }
    
    return response;
  }

  private static generateGeneralResponse(entities: Entity[], complexity: string): string {
    let response = 'I\'m here to help with your fitness journey! ';
    
    if (complexity === 'complex') {
      response += 'I\'ll provide detailed, science-based advice tailored to your needs.';
    } else {
      response += 'I\'ll give you clear, actionable advice.';
    }
    
    return response;
  }
}

// Type definitions
interface ConversationContext {
  recentMessages: string[];
  userProfile: any;
  workoutHistory: any[];
  nutritionLog: any[];
}

interface Entity {
  type: 'exercise' | 'food' | 'body_part' | 'number' | 'time';
  value: string | number;
  text: string;
  confidence: number;
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  intensity: number;
}

interface SpecificRequest {
  type: 'exercise' | 'food' | 'body_part' | 'quantity';
  value: string | number;
  confidence: number;
}

interface IntentAnalysis {
  primaryIntent: string;
  secondaryIntents: string[];
  entities: Entity[];
  sentiment: SentimentAnalysis;
  specificRequests: SpecificRequest[];
  urgency: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
  confidence: number;
}
