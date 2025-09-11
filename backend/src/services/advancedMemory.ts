// Advanced memory and learning system for long-term AI improvement
export class AdvancedMemory {
  private static memoryBank: Map<string, MemoryBank> = new Map();
  private static learningModels: Map<string, LearningModel> = new Map();
  
  interface MemoryBank {
    shortTerm: ShortTermMemory[];
    longTerm: LongTermMemory[];
    episodic: EpisodicMemory[];
    semantic: SemanticMemory[];
    procedural: ProceduralMemory[];
  }
  
  interface ShortTermMemory {
    id: string;
    timestamp: Date;
    content: string;
    importance: number;
    context: any;
    decayRate: number;
  }
  
  interface LongTermMemory {
    id: string;
    timestamp: Date;
    content: string;
    importance: number;
    context: any;
    associations: string[];
    retrievalStrength: number;
  }
  
  interface EpisodicMemory {
    id: string;
    timestamp: Date;
    event: string;
    context: any;
    emotions: string[];
    participants: string[];
    location: string;
    significance: number;
  }
  
  interface SemanticMemory {
    id: string;
    concept: string;
    definition: string;
    properties: { [key: string]: any };
    relationships: { [key: string]: string[] };
    confidence: number;
  }
  
  interface ProceduralMemory {
    id: string;
    skill: string;
    steps: string[];
    successRate: number;
    lastUsed: Date;
    improvement: number;
  }
  
  interface LearningModel {
    id: string;
    type: 'pattern' | 'preference' | 'behavior' | 'goal';
    data: any;
    accuracy: number;
    lastUpdated: Date;
    predictions: Prediction[];
  }
  
  interface Prediction {
    id: string;
    input: any;
    output: any;
    confidence: number;
    timestamp: Date;
    actual?: any;
    accuracy?: number;
  }
  
  // Store new memory
  static storeMemory(
    sessionId: string,
    type: 'short' | 'long' | 'episodic' | 'semantic' | 'procedural',
    content: any,
    importance: number = 0.5,
    context: any = {}
  ): string {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory = this.memoryBank.get(sessionId)!;
    const id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const memoryEntry = {
      id,
      timestamp: new Date(),
      content,
      importance,
      context,
      ...(type === 'short' ? { decayRate: 0.1 } : {}),
      ...(type === 'long' ? { associations: [], retrievalStrength: 1.0 } : {}),
      ...(type === 'episodic' ? { 
        event: content.event || content,
        emotions: content.emotions || [],
        participants: content.participants || [],
        location: content.location || '',
        significance: content.significance || importance
      } : {}),
      ...(type === 'semantic' ? {
        concept: content.concept || content,
        definition: content.definition || '',
        properties: content.properties || {},
        relationships: content.relationships || {},
        confidence: content.confidence || 0.8
      } : {}),
      ...(type === 'procedural' ? {
        skill: content.skill || content,
        steps: content.steps || [],
        successRate: content.successRate || 0.5,
        lastUsed: new Date(),
        improvement: content.improvement || 0
      } : {})
    };
    
    memory[`${type}Term` as keyof MemoryBank].push(memoryEntry as any);
    
    // Trigger learning updates
    this.updateLearningModels(sessionId, type, memoryEntry);
    
    return id;
  }
  
  // Retrieve relevant memories
  static retrieveMemories(
    sessionId: string,
    query: string,
    type?: 'short' | 'long' | 'episodic' | 'semantic' | 'procedural',
    limit: number = 10
  ): any[] {
    const memory = this.memoryBank.get(sessionId);
    if (!memory) return [];
    
    const memories = type ? memory[`${type}Term` as keyof MemoryBank] : [
      ...memory.shortTerm,
      ...memory.longTerm,
      ...memory.episodic,
      ...memory.semantic,
      ...memory.procedural
    ];
    
    // Score memories based on relevance
    const scoredMemories = memories.map(mem => ({
      ...mem,
      relevanceScore: this.calculateRelevance(mem, query)
    }));
    
    // Sort by relevance and return top results
    return scoredMemories
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(({ relevanceScore, ...mem }) => mem);
  }
  
  // Calculate memory relevance
  private static calculateRelevance(memory: any, query: string): number {
    const queryLower = query.toLowerCase();
    const contentLower = memory.content?.toString().toLowerCase() || '';
    
    // Basic text similarity
    const textSimilarity = this.calculateTextSimilarity(contentLower, queryLower);
    
    // Context similarity
    const contextSimilarity = this.calculateContextSimilarity(memory.context, query);
    
    // Temporal relevance (newer memories are more relevant)
    const temporalRelevance = this.calculateTemporalRelevance(memory.timestamp);
    
    // Importance weighting
    const importanceWeight = memory.importance || 0.5;
    
    // Combine scores
    return (textSimilarity * 0.4 + contextSimilarity * 0.3 + temporalRelevance * 0.2 + importanceWeight * 0.1);
  }
  
  // Calculate text similarity
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return commonWords.length / totalWords;
  }
  
  // Calculate context similarity
  private static calculateContextSimilarity(context: any, query: string): number {
    if (!context) return 0;
    
    const contextStr = JSON.stringify(context).toLowerCase();
    const queryLower = query.toLowerCase();
    
    return this.calculateTextSimilarity(contextStr, queryLower);
  }
  
  // Calculate temporal relevance
  private static calculateTemporalRelevance(timestamp: Date): number {
    const now = new Date();
    const hoursAgo = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    // Exponential decay: more recent = more relevant
    return Math.exp(-hoursAgo / 24); // Decay over 24 hours
  }
  
  // Update learning models
  private static updateLearningModels(sessionId: string, type: string, memory: any): void {
    if (!this.learningModels.has(sessionId)) {
      this.learningModels.set(sessionId, {
        id: sessionId,
        type: 'pattern',
        data: {},
        accuracy: 0.5,
        lastUpdated: new Date(),
        predictions: []
      });
    }
    
    const model = this.learningModels.get(sessionId)!;
    
    // Update based on memory type
    switch (type) {
      case 'short':
        this.updatePatternModel(model, memory);
        break;
      case 'long':
        this.updatePreferenceModel(model, memory);
        break;
      case 'episodic':
        this.updateBehaviorModel(model, memory);
        break;
      case 'semantic':
        this.updateSemanticModel(model, memory);
        break;
      case 'procedural':
        this.updateProceduralModel(model, memory);
        break;
    }
    
    model.lastUpdated = new Date();
  }
  
  // Update pattern learning model
  private static updatePatternModel(model: LearningModel, memory: any): void {
    // Extract patterns from short-term memory
    const patterns = this.extractPatterns(memory.content);
    
    if (!model.data.patterns) {
      model.data.patterns = {};
    }
    
    patterns.forEach(pattern => {
      if (!model.data.patterns[pattern]) {
        model.data.patterns[pattern] = 0;
      }
      model.data.patterns[pattern]++;
    });
    
    // Update accuracy based on pattern predictions
    this.updateModelAccuracy(model);
  }
  
  // Update preference learning model
  private static updatePreferenceModel(model: LearningModel, memory: any): void {
    // Extract preferences from long-term memory
    const preferences = this.extractPreferences(memory.content);
    
    if (!model.data.preferences) {
      model.data.preferences = {};
    }
    
    Object.entries(preferences).forEach(([key, value]) => {
      if (!model.data.preferences[key]) {
        model.data.preferences[key] = [];
      }
      model.data.preferences[key].push(value);
    });
    
    // Update accuracy based on preference predictions
    this.updateModelAccuracy(model);
  }
  
  // Update behavior learning model
  private static updateBehaviorModel(model: LearningModel, memory: any): void {
    // Extract behaviors from episodic memory
    const behaviors = this.extractBehaviors(memory);
    
    if (!model.data.behaviors) {
      model.data.behaviors = {};
    }
    
    behaviors.forEach(behavior => {
      if (!model.data.behaviors[behavior]) {
        model.data.behaviors[behavior] = 0;
      }
      model.data.behaviors[behavior]++;
    });
    
    // Update accuracy based on behavior predictions
    this.updateModelAccuracy(model);
  }
  
  // Update semantic learning model
  private static updateSemanticModel(model: LearningModel, memory: any): void {
    // Extract semantic knowledge
    const knowledge = this.extractSemanticKnowledge(memory);
    
    if (!model.data.knowledge) {
      model.data.knowledge = {};
    }
    
    Object.entries(knowledge).forEach(([concept, definition]) => {
      model.data.knowledge[concept] = definition;
    });
    
    // Update accuracy based on knowledge predictions
    this.updateModelAccuracy(model);
  }
  
  // Update procedural learning model
  private static updateProceduralModel(model: LearningModel, memory: any): void {
    // Extract procedural knowledge
    const procedures = this.extractProcedures(memory);
    
    if (!model.data.procedures) {
      model.data.procedures = {};
    }
    
    procedures.forEach(procedure => {
      if (!model.data.procedures[procedure.skill]) {
        model.data.procedures[procedure.skill] = {
          steps: procedure.steps,
          successRate: procedure.successRate,
          lastUsed: procedure.lastUsed,
          improvement: procedure.improvement
        };
      } else {
        // Update existing procedure
        const existing = model.data.procedures[procedure.skill];
        existing.successRate = (existing.successRate + procedure.successRate) / 2;
        existing.improvement = Math.max(existing.improvement, procedure.improvement);
        existing.lastUsed = new Date();
      }
    });
    
    // Update accuracy based on procedure predictions
    this.updateModelAccuracy(model);
  }
  
  // Extract patterns from content
  private static extractPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    // Time patterns
    if (content.includes('morning') || content.includes('AM')) patterns.push('morning_user');
    if (content.includes('evening') || content.includes('PM')) patterns.push('evening_user');
    
    // Workout patterns
    if (content.includes('workout') || content.includes('exercise')) patterns.push('workout_focused');
    if (content.includes('cardio') || content.includes('running')) patterns.push('cardio_preference');
    if (content.includes('strength') || content.includes('weight')) patterns.push('strength_preference');
    
    // Nutrition patterns
    if (content.includes('food') || content.includes('meal')) patterns.push('nutrition_focused');
    if (content.includes('protein') || content.includes('macros')) patterns.push('macro_focused');
    
    // Mood patterns
    if (content.includes('excited') || content.includes('pumped')) patterns.push('high_energy');
    if (content.includes('tired') || content.includes('exhausted')) patterns.push('low_energy');
    
    return patterns;
  }
  
  // Extract preferences from content
  private static extractPreferences(content: string): { [key: string]: any } {
    const preferences: { [key: string]: any } = {};
    
    // Workout preferences
    if (content.includes('morning')) preferences.workout_time = 'morning';
    if (content.includes('evening')) preferences.workout_time = 'evening';
    if (content.includes('hard')) preferences.workout_intensity = 'high';
    if (content.includes('easy')) preferences.workout_intensity = 'low';
    
    // Nutrition preferences
    if (content.includes('chicken')) preferences.protein_source = 'chicken';
    if (content.includes('fish')) preferences.protein_source = 'fish';
    if (content.includes('rice')) preferences.carb_source = 'rice';
    if (content.includes('pasta')) preferences.carb_source = 'pasta';
    
    return preferences;
  }
  
  // Extract behaviors from episodic memory
  private static extractBehaviors(memory: any): string[] {
    const behaviors: string[] = [];
    
    if (memory.emotions?.includes('excited')) behaviors.push('high_energy_behavior');
    if (memory.emotions?.includes('frustrated')) behaviors.push('struggling_behavior');
    if (memory.significance > 0.8) behaviors.push('high_impact_behavior');
    
    return behaviors;
  }
  
  // Extract semantic knowledge
  private static extractSemanticKnowledge(memory: any): { [key: string]: any } {
    const knowledge: { [key: string]: any } = {};
    
    if (memory.concept) {
      knowledge[memory.concept] = {
        definition: memory.definition,
        properties: memory.properties,
        relationships: memory.relationships,
        confidence: memory.confidence
      };
    }
    
    return knowledge;
  }
  
  // Extract procedures
  private static extractProcedures(memory: any): any[] {
    const procedures: any[] = [];
    
    if (memory.skill) {
      procedures.push({
        skill: memory.skill,
        steps: memory.steps,
        successRate: memory.successRate,
        lastUsed: memory.lastUsed,
        improvement: memory.improvement
      });
    }
    
    return procedures;
  }
  
  // Update model accuracy
  private static updateModelAccuracy(model: LearningModel): void {
    // Calculate accuracy based on prediction success
    const recentPredictions = model.predictions.filter(p => 
      p.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    if (recentPredictions.length > 0) {
      const accuracy = recentPredictions.reduce((sum, pred) => 
        sum + (pred.accuracy || 0), 0) / recentPredictions.length;
      model.accuracy = accuracy;
    }
  }
  
  // Make predictions based on learned models
  static makePrediction(sessionId: string, input: any): Prediction {
    const model = this.learningModels.get(sessionId);
    if (!model) {
      return {
        id: `pred_${Date.now()}`,
        input,
        output: null,
        confidence: 0,
        timestamp: new Date()
      };
    }
    
    const prediction = this.generatePrediction(model, input);
    
    // Store prediction for later accuracy evaluation
    model.predictions.push(prediction);
    
    // Keep only recent predictions
    if (model.predictions.length > 100) {
      model.predictions = model.predictions.slice(-100);
    }
    
    return prediction;
  }
  
  // Generate prediction based on model
  private static generatePrediction(model: LearningModel, input: any): Prediction {
    const id = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let output: any = null;
    let confidence = 0;
    
    switch (model.type) {
      case 'pattern':
        output = this.predictFromPatterns(model.data, input);
        confidence = 0.8;
        break;
      case 'preference':
        output = this.predictFromPreferences(model.data, input);
        confidence = 0.7;
        break;
      case 'behavior':
        output = this.predictFromBehaviors(model.data, input);
        confidence = 0.6;
        break;
      case 'goal':
        output = this.predictFromGoals(model.data, input);
        confidence = 0.9;
        break;
    }
    
    return {
      id,
      input,
      output,
      confidence,
      timestamp: new Date()
    };
  }
  
  // Predict from patterns
  private static predictFromPatterns(data: any, input: any): any {
    const patterns = data.patterns || {};
    const inputStr = JSON.stringify(input).toLowerCase();
    
    const matchingPatterns = Object.entries(patterns)
      .filter(([pattern]) => inputStr.includes(pattern))
      .sort(([,a], [,b]) => (b as number) - (a as number));
    
    return matchingPatterns.length > 0 ? matchingPatterns[0][0] : null;
  }
  
  // Predict from preferences
  private static predictFromPreferences(data: any, input: any): any {
    const preferences = data.preferences || {};
    const inputStr = JSON.stringify(input).toLowerCase();
    
    const matchingPreferences = Object.entries(preferences)
      .filter(([key]) => inputStr.includes(key))
      .map(([key, values]) => ({ key, values }));
    
    return matchingPreferences.length > 0 ? matchingPreferences[0] : null;
  }
  
  // Predict from behaviors
  private static predictFromBehaviors(data: any, input: any): any {
    const behaviors = data.behaviors || {};
    const inputStr = JSON.stringify(input).toLowerCase();
    
    const matchingBehaviors = Object.entries(behaviors)
      .filter(([behavior]) => inputStr.includes(behavior))
      .sort(([,a], [,b]) => (b as number) - (a as number));
    
    return matchingBehaviors.length > 0 ? matchingBehaviors[0][0] : null;
  }
  
  // Predict from goals
  private static predictFromGoals(data: any, input: any): any {
    const goals = data.goals || {};
    const inputStr = JSON.stringify(input).toLowerCase();
    
    const matchingGoals = Object.entries(goals)
      .filter(([goal]) => inputStr.includes(goal))
      .map(([goal, progress]) => ({ goal, progress }));
    
    return matchingGoals.length > 0 ? matchingGoals[0] : null;
  }
  
  // Get memory statistics
  static getMemoryStats(sessionId: string): any {
    const memory = this.memoryBank.get(sessionId);
    const model = this.learningModels.get(sessionId);
    
    if (!memory) return null;
    
    return {
      totalMemories: Object.values(memory).reduce((sum, arr) => sum + arr.length, 0),
      shortTerm: memory.shortTerm.length,
      longTerm: memory.longTerm.length,
      episodic: memory.episodic.length,
      semantic: memory.semantic.length,
      procedural: memory.procedural.length,
      modelAccuracy: model?.accuracy || 0,
      lastUpdated: model?.lastUpdated || new Date(),
      predictions: model?.predictions.length || 0
    };
  }
  
  // Clean up old memories
  static cleanupMemories(sessionId: string): void {
    const memory = this.memoryBank.get(sessionId);
    if (!memory) return;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Clean up old short-term memories
    memory.shortTerm = memory.shortTerm.filter(mem => 
      mem.timestamp > oneWeekAgo || mem.importance > 0.8
    );
    
    // Clean up old episodic memories
    memory.episodic = memory.episodic.filter(mem => 
      mem.timestamp > oneWeekAgo || mem.significance > 0.8
    );
  }
}
