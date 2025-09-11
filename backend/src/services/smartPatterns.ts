// Advanced pattern recognition and learning system
export class SmartPatterns {
  private static userPatterns: Map<string, UserPattern> = new Map();
  private static conversationHistory: Map<string, ConversationEntry[]> = new Map();
  
  interface UserPattern {
    preferredWorkoutTimes: string[];
    favoriteExercises: string[];
    commonFoods: string[];
    moodPatterns: MoodPattern[];
    responsePreferences: ResponsePreference[];
    goalProgress: GoalProgress[];
  }
  
  interface MoodPattern {
    timeOfDay: string;
    dayOfWeek: string;
    mood: string;
    triggers: string[];
  }
  
  interface ResponsePreference {
    context: string;
    preferredTone: 'motivational' | 'technical' | 'casual' | 'supportive';
    preferredLength: 'short' | 'medium' | 'detailed';
    preferredFormat: 'bullet' | 'paragraph' | 'step-by-step';
  }
  
  interface GoalProgress {
    goal: string;
    startDate: Date;
    currentValue: number;
    targetValue: number;
    progress: number;
    estimatedCompletion: Date;
  }
  
  interface ConversationEntry {
    timestamp: Date;
    userMessage: string;
    aiResponse: string;
    context: string;
    mood: string;
    satisfaction: number; // 0-1 scale
  }

  // Learn from user interactions
  static learnFromInteraction(
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    context: string,
    mood: string,
    satisfaction: number = 0.5
  ) {
    const entry: ConversationEntry = {
      timestamp: new Date(),
      userMessage,
      aiResponse,
      context,
      mood,
      satisfaction
    };
    
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    
    this.conversationHistory.get(sessionId)!.push(entry);
    
    // Keep only last 100 conversations
    const history = this.conversationHistory.get(sessionId)!;
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    // Update user patterns
    this.updateUserPatterns(sessionId, entry);
  }

  private static updateUserPatterns(sessionId: string, entry: ConversationEntry) {
    if (!this.userPatterns.has(sessionId)) {
      this.userPatterns.set(sessionId, {
        preferredWorkoutTimes: [],
        favoriteExercises: [],
        commonFoods: [],
        moodPatterns: [],
        responsePreferences: [],
        goalProgress: []
      });
    }
    
    const pattern = this.userPatterns.get(sessionId)!;
    
    // Extract workout preferences
    if (entry.context.includes('workout')) {
      const exercises = this.extractExercises(entry.userMessage);
      exercises.forEach(exercise => {
        if (!pattern.favoriteExercises.includes(exercise)) {
          pattern.favoriteExercises.push(exercise);
        }
      });
    }
    
    // Extract food preferences
    if (entry.context.includes('nutrition') || entry.context.includes('food')) {
      const foods = this.extractFoods(entry.userMessage);
      foods.forEach(food => {
        if (!pattern.commonFoods.includes(food)) {
          pattern.commonFoods.push(food);
        }
      });
    }
    
    // Track mood patterns
    const timeOfDay = this.getTimeOfDay(entry.timestamp);
    const dayOfWeek = this.getDayOfWeek(entry.timestamp);
    
    pattern.moodPatterns.push({
      timeOfDay,
      dayOfWeek,
      mood: entry.mood,
      triggers: this.extractTriggers(entry.userMessage)
    });
    
    // Learn response preferences
    const responsePreference: ResponsePreference = {
      context: entry.context,
      preferredTone: this.analyzeTonePreference(entry.aiResponse),
      preferredLength: this.analyzeLengthPreference(entry.aiResponse),
      preferredFormat: this.analyzeFormatPreference(entry.aiResponse)
    };
    
    // Update or add response preference
    const existingPreference = pattern.responsePreferences.find(p => p.context === entry.context);
    if (existingPreference) {
      // Update existing preference based on satisfaction
      if (entry.satisfaction > 0.7) {
        existingPreference.preferredTone = responsePreference.preferredTone;
        existingPreference.preferredLength = responsePreference.preferredLength;
        existingPreference.preferredFormat = responsePreference.preferredFormat;
      }
    } else {
      pattern.responsePreferences.push(responsePreference);
    }
  }

  // Get personalized response based on learned patterns
  static getPersonalizedResponse(
    sessionId: string,
    context: string,
    mood: string,
    baseResponse: string
  ): string {
    const pattern = this.userPatterns.get(sessionId);
    if (!pattern) return baseResponse;
    
    const preference = pattern.responsePreferences.find(p => p.context === context);
    if (!preference) return baseResponse;
    
    return this.adaptResponse(baseResponse, preference, mood);
  }

  private static adaptResponse(
    response: string,
    preference: ResponsePreference,
    mood: string
  ): string {
    let adaptedResponse = response;
    
    // Adapt tone
    if (preference.preferredTone === 'motivational') {
      adaptedResponse = this.addMotivationalElements(adaptedResponse);
    } else if (preference.preferredTone === 'technical') {
      adaptedResponse = this.addTechnicalElements(adaptedResponse);
    } else if (preference.preferredTone === 'casual') {
      adaptedResponse = this.addCasualElements(adaptedResponse);
    } else if (preference.preferredTone === 'supportive') {
      adaptedResponse = this.addSupportiveElements(adaptedResponse);
    }
    
    // Adapt length
    if (preference.preferredLength === 'short') {
      adaptedResponse = this.shortenResponse(adaptedResponse);
    } else if (preference.preferredLength === 'detailed') {
      adaptedResponse = this.expandResponse(adaptedResponse);
    }
    
    // Adapt format
    if (preference.preferredFormat === 'bullet') {
      adaptedResponse = this.convertToBullets(adaptedResponse);
    } else if (preference.preferredFormat === 'step-by-step') {
      adaptedResponse = this.convertToSteps(adaptedResponse);
    }
    
    return adaptedResponse;
  }

  // Predict user needs based on patterns
  static predictUserNeeds(sessionId: string): string[] {
    const pattern = this.userPatterns.get(sessionId);
    if (!pattern) return [];
    
    const predictions: string[] = [];
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const dayOfWeek = this.getDayOfWeek(now);
    
    // Predict based on mood patterns
    const recentMoods = pattern.moodPatterns
      .filter(m => m.timeOfDay === timeOfDay && m.dayOfWeek === dayOfWeek)
      .slice(-5);
    
    if (recentMoods.length > 0) {
      const avgMood = this.calculateAverageMood(recentMoods);
      if (avgMood < 0.3) {
        predictions.push("You might need some motivation today");
        predictions.push("Let's start with something manageable");
      } else if (avgMood > 0.7) {
        predictions.push("You're in a great mood - perfect for a challenging workout!");
        predictions.push("Let's channel that energy into something amazing!");
      }
    }
    
    // Predict based on workout patterns
    const workoutTimes = pattern.preferredWorkoutTimes;
    if (workoutTimes.length > 0) {
      const mostCommonTime = this.getMostCommon(workoutTimes);
      if (timeOfDay === mostCommonTime) {
        predictions.push("It's your usual workout time - ready to get started?");
      }
    }
    
    // Predict based on food patterns
    const commonFoods = pattern.commonFoods;
    if (commonFoods.length > 0) {
      predictions.push(`How about some ${commonFoods[0]} for your next meal?`);
    }
    
    return predictions;
  }

  // Get personalized suggestions based on patterns
  static getPersonalizedSuggestions(sessionId: string, context: string): string[] {
    const pattern = this.userPatterns.get(sessionId);
    if (!pattern) return [];
    
    const suggestions: string[] = [];
    
    if (context === 'workout') {
      // Suggest favorite exercises
      pattern.favoriteExercises.slice(0, 3).forEach(exercise => {
        suggestions.push(`Add ${exercise} to your workout`);
      });
      
      // Suggest based on time patterns
      const workoutTimes = pattern.preferredWorkoutTimes;
      if (workoutTimes.length > 0) {
        suggestions.push(`Workout at ${workoutTimes[0]} (your preferred time)`);
      }
    }
    
    if (context === 'nutrition') {
      // Suggest common foods
      pattern.commonFoods.slice(0, 3).forEach(food => {
        suggestions.push(`Add ${food} to your meal`);
      });
    }
    
    return suggestions;
  }

  // Helper methods
  private static extractExercises(message: string): string[] {
    const exerciseKeywords = [
      'squat', 'deadlift', 'bench', 'press', 'row', 'pull', 'push',
      'curl', 'extension', 'lunge', 'plank', 'crunch', 'sit-up',
      'burpee', 'jump', 'run', 'walk', 'bike', 'swim'
    ];
    
    return exerciseKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private static extractFoods(message: string): string[] {
    const foodKeywords = [
      'chicken', 'beef', 'fish', 'salmon', 'egg', 'milk', 'cheese',
      'rice', 'pasta', 'bread', 'potato', 'apple', 'banana', 'orange',
      'broccoli', 'spinach', 'carrot', 'tomato', 'onion', 'garlic'
    ];
    
    return foodKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private static extractTriggers(message: string): string[] {
    const triggerWords = [
      'tired', 'stressed', 'excited', 'motivated', 'frustrated',
      'hungry', 'thirsty', 'sore', 'energized', 'focused'
    ];
    
    return triggerWords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private static getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 6) return 'early_morning';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private static getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  private static analyzeTonePreference(response: string): 'motivational' | 'technical' | 'casual' | 'supportive' {
    const motivationalWords = ['amazing', 'incredible', 'crush', 'dominate', 'champion', 'fire', 'energy'];
    const technicalWords = ['calories', 'protein', 'macros', 'BMR', 'TDEE', 'metabolism', 'scientific'];
    const casualWords = ['cool', 'awesome', 'nice', 'yeah', 'sure', 'okay', 'great'];
    const supportiveWords = ['support', 'help', 'together', 'believe', 'proud', 'encourage', 'care'];
    
    const responseLower = response.toLowerCase();
    
    const motivationalCount = motivationalWords.filter(word => responseLower.includes(word)).length;
    const technicalCount = technicalWords.filter(word => responseLower.includes(word)).length;
    const casualCount = casualWords.filter(word => responseLower.includes(word)).length;
    const supportiveCount = supportiveWords.filter(word => responseLower.includes(word)).length;
    
    const counts = { motivational: motivationalCount, technical: technicalCount, casual: casualCount, supportive: supportiveCount };
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0] as any;
  }

  private static analyzeLengthPreference(response: string): 'short' | 'medium' | 'detailed' {
    const wordCount = response.split(' ').length;
    if (wordCount < 50) return 'short';
    if (wordCount < 150) return 'medium';
    return 'detailed';
  }

  private static analyzeFormatPreference(response: string): 'bullet' | 'paragraph' | 'step-by-step' {
    if (response.includes('•') || response.includes('-')) return 'bullet';
    if (response.includes('1.') || response.includes('Step')) return 'step-by-step';
    return 'paragraph';
  }

  private static addMotivationalElements(response: string): string {
    const motivationalElements = ['💪', '🔥', '🎯', '🚀', '💯', 'Let\'s go!', 'You\'ve got this!', 'Crush it!'];
    const randomElement = motivationalElements[Math.floor(Math.random() * motivationalElements.length)];
    return `${randomElement} ${response}`;
  }

  private static addTechnicalElements(response: string): string {
    return `**Scientific Analysis:**\n${response}\n\n*Based on research and data analysis*`;
  }

  private static addCasualElements(response: string): string {
    return `Hey! ${response} 😊`;
  }

  private static addSupportiveElements(response: string): string {
    return `I'm here to support you! ${response} 🤗`;
  }

  private static shortenResponse(response: string): string {
    const sentences = response.split('.');
    return sentences.slice(0, 2).join('.') + '.';
  }

  private static expandResponse(response: string): string {
    return `${response}\n\n**Additional Details:**\nThis approach is based on scientific research and proven methods for optimal results.`;
  }

  private static convertToBullets(response: string): string {
    const sentences = response.split('.');
    return sentences.map(sentence => `• ${sentence.trim()}`).join('\n');
  }

  private static convertToSteps(response: string): string {
    const sentences = response.split('.');
    return sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n');
  }

  private static calculateAverageMood(moods: MoodPattern[]): number {
    const moodValues = { 'struggling': 0.2, 'neutral': 0.5, 'motivated': 0.7, 'excited': 0.9 };
    const total = moods.reduce((sum, mood) => sum + (moodValues[mood.mood] || 0.5), 0);
    return total / moods.length;
  }

  private static getMostCommon(array: string[]): string {
    const counts: { [key: string]: number } = {};
    array.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
  }
}
