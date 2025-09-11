// Real-time adaptation and learning system
export class RealTimeAdaptation {
  private static adaptationModels: Map<string, AdaptationModel> = new Map();
  private static learningLoops: Map<string, LearningLoop> = new Map();
  
  interface AdaptationModel {
    id: string;
    type: 'workout' | 'nutrition' | 'recovery' | 'motivation';
    currentState: any;
    targetState: any;
    adaptationRules: AdaptationRule[];
    learningRate: number;
    lastAdapted: Date;
    successRate: number;
  }
  
  interface AdaptationRule {
    id: string;
    condition: (context: any) => boolean;
    action: (context: any) => any;
    weight: number;
    successCount: number;
    failureCount: number;
  }
  
  interface LearningLoop {
    id: string;
    type: 'reinforcement' | 'supervised' | 'unsupervised';
    data: any[];
    model: any;
    accuracy: number;
    lastUpdated: Date;
    iterations: number;
  }
  
  interface AdaptationContext {
    userProfile: any;
    currentWorkout: any;
    nutritionLog: any[];
    workoutHistory: any[];
    mood: string;
    energy: number;
    stress: number;
    timeOfDay: string;
    dayOfWeek: string;
  }
  
  // Initialize adaptation model
  static initializeAdaptationModel(
    sessionId: string,
    type: 'workout' | 'nutrition' | 'recovery' | 'motivation',
    initialState: any,
    targetState: any
  ): AdaptationModel {
    const model: AdaptationModel = {
      id: `adapt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      currentState: initialState,
      targetState,
      adaptationRules: this.createDefaultRules(type),
      learningRate: 0.1,
      lastAdapted: new Date(),
      successRate: 0.5
    };
    
    this.adaptationModels.set(sessionId, model);
    return model;
  }
  
  // Create default adaptation rules
  private static createDefaultRules(type: string): AdaptationRule[] {
    const rules: AdaptationRule[] = [];
    
    switch (type) {
      case 'workout':
        rules.push(
          {
            id: 'energy_low',
            condition: (context) => context.energy < 0.3,
            action: (context) => ({ intensity: 'low', duration: 'short', focus: 'recovery' }),
            weight: 0.8,
            successCount: 0,
            failureCount: 0
          },
          {
            id: 'energy_high',
            condition: (context) => context.energy > 0.7,
            action: (context) => ({ intensity: 'high', duration: 'long', focus: 'strength' }),
            weight: 0.8,
            successCount: 0,
            failureCount: 0
          },
          {
            id: 'stress_high',
            condition: (context) => context.stress > 0.7,
            action: (context) => ({ intensity: 'moderate', duration: 'medium', focus: 'cardio' }),
            weight: 0.7,
            successCount: 0,
            failureCount: 0
          }
        );
        break;
        
      case 'nutrition':
        rules.push(
          {
            id: 'protein_low',
            condition: (context) => this.calculateProteinIntake(context.nutritionLog) < 0.8,
            action: (context) => ({ focus: 'protein', suggestions: ['chicken', 'fish', 'eggs'] }),
            weight: 0.9,
            successCount: 0,
            failureCount: 0
          },
          {
            id: 'calories_high',
            condition: (context) => this.calculateCalorieIntake(context.nutritionLog) > 1.2,
            action: (context) => ({ focus: 'reduction', suggestions: ['vegetables', 'water', 'portion_control'] }),
            weight: 0.8,
            successCount: 0,
            failureCount: 0
          }
        );
        break;
        
      case 'recovery':
        rules.push(
          {
            id: 'sleep_poor',
            condition: (context) => context.sleepQuality < 0.5,
            action: (context) => ({ focus: 'sleep', suggestions: ['bedtime_routine', 'sleep_hygiene'] }),
            weight: 0.9,
            successCount: 0,
            failureCount: 0
          },
          {
            id: 'soreness_high',
            condition: (context) => context.soreness > 0.7,
            action: (context) => ({ focus: 'recovery', suggestions: ['stretching', 'massage', 'rest'] }),
            weight: 0.8,
            successCount: 0,
            failureCount: 0
          }
        );
        break;
        
      case 'motivation':
        rules.push(
          {
            id: 'mood_low',
            condition: (context) => context.mood === 'struggling',
            action: (context) => ({ focus: 'encouragement', suggestions: ['small_wins', 'support', 'celebration'] }),
            weight: 0.9,
            successCount: 0,
            failureCount: 0
          },
          {
            id: 'mood_high',
            condition: (context) => context.mood === 'excited',
            action: (context) => ({ focus: 'channeling', suggestions: ['challenging_goals', 'new_activities'] }),
            weight: 0.7,
            successCount: 0,
            failureCount: 0
          }
        );
        break;
    }
    
    return rules;
  }
  
  // Adapt based on current context
  static adapt(sessionId: string, context: AdaptationContext): any {
    const model = this.adaptationModels.get(sessionId);
    if (!model) return null;
    
    // Find applicable rules
    const applicableRules = model.adaptationRules.filter(rule => rule.condition(context));
    
    if (applicableRules.length === 0) {
      return { adapted: false, reason: 'no_applicable_rules' };
    }
    
    // Select best rule based on weight and success rate
    const bestRule = applicableRules.reduce((best, current) => {
      const currentScore = current.weight * (current.successCount / (current.successCount + current.failureCount + 1));
      const bestScore = best.weight * (best.successCount / (best.successCount + best.failureCount + 1));
      return currentScore > bestScore ? current : best;
    });
    
    // Apply adaptation
    const adaptation = bestRule.action(context);
    
    // Update model state
    model.currentState = { ...model.currentState, ...adaptation };
    model.lastAdapted = new Date();
    
    // Update rule success/failure counts
    this.updateRulePerformance(sessionId, bestRule.id, true);
    
    return {
      adapted: true,
      rule: bestRule.id,
      adaptation,
      confidence: this.calculateAdaptationConfidence(model, bestRule)
    };
  }
  
  // Update rule performance
  private static updateRulePerformance(sessionId: string, ruleId: string, success: boolean): void {
    const model = this.adaptationModels.get(sessionId);
    if (!model) return;
    
    const rule = model.adaptationRules.find(r => r.id === ruleId);
    if (!rule) return;
    
    if (success) {
      rule.successCount++;
    } else {
      rule.failureCount++;
    }
    
    // Update model success rate
    const totalRules = model.adaptationRules.length;
    const totalSuccess = model.adaptationRules.reduce((sum, r) => sum + r.successCount, 0);
    const totalAttempts = model.adaptationRules.reduce((sum, r) => sum + r.successCount + r.failureCount, 0);
    model.successRate = totalAttempts > 0 ? totalSuccess / totalAttempts : 0.5;
  }
  
  // Calculate adaptation confidence
  private static calculateAdaptationConfidence(model: AdaptationModel, rule: AdaptationRule): number {
    const ruleSuccessRate = rule.successCount / (rule.successCount + rule.failureCount + 1);
    const modelSuccessRate = model.successRate;
    const ruleWeight = rule.weight;
    
    return (ruleSuccessRate * 0.4 + modelSuccessRate * 0.3 + ruleWeight * 0.3);
  }
  
  // Initialize learning loop
  static initializeLearningLoop(
    sessionId: string,
    type: 'reinforcement' | 'supervised' | 'unsupervised',
    initialData: any[]
  ): LearningLoop {
    const loop: LearningLoop = {
      id: `loop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: initialData,
      model: this.createLearningModel(type),
      accuracy: 0.5,
      lastUpdated: new Date(),
      iterations: 0
    };
    
    this.learningLoops.set(sessionId, loop);
    return loop;
  }
  
  // Create learning model
  private static createLearningModel(type: string): any {
    switch (type) {
      case 'reinforcement':
        return {
          qTable: {},
          epsilon: 0.1,
          alpha: 0.1,
          gamma: 0.9
        };
      case 'supervised':
        return {
          weights: {},
          bias: 0,
          learningRate: 0.01
        };
      case 'unsupervised':
        return {
          clusters: [],
          centroids: [],
          k: 3
        };
      default:
        return {};
    }
  }
  
  // Update learning loop
  static updateLearningLoop(sessionId: string, newData: any): void {
    const loop = this.learningLoops.get(sessionId);
    if (!loop) return;
    
    // Add new data
    loop.data.push(newData);
    
    // Keep only recent data (last 1000 entries)
    if (loop.data.length > 1000) {
      loop.data = loop.data.slice(-1000);
    }
    
    // Update model based on type
    switch (loop.type) {
      case 'reinforcement':
        this.updateReinforcementModel(loop, newData);
        break;
      case 'supervised':
        this.updateSupervisedModel(loop, newData);
        break;
      case 'unsupervised':
        this.updateUnsupervisedModel(loop, newData);
        break;
    }
    
    loop.iterations++;
    loop.lastUpdated = new Date();
    
    // Calculate accuracy
    loop.accuracy = this.calculateLearningAccuracy(loop);
  }
  
  // Update reinforcement learning model
  private static updateReinforcementModel(loop: LearningLoop, newData: any): void {
    const model = loop.model;
    const { state, action, reward, nextState } = newData;
    
    if (!state || !action || reward === undefined) return;
    
    const stateKey = JSON.stringify(state);
    const nextStateKey = JSON.stringify(nextState);
    
    if (!model.qTable[stateKey]) {
      model.qTable[stateKey] = {};
    }
    
    if (!model.qTable[stateKey][action]) {
      model.qTable[stateKey][action] = 0;
    }
    
    // Q-learning update
    const currentQ = model.qTable[stateKey][action];
    const maxNextQ = nextStateKey && model.qTable[nextStateKey] ? 
      Math.max(...Object.values(model.qTable[nextStateKey])) : 0;
    
    const newQ = currentQ + model.alpha * (reward + model.gamma * maxNextQ - currentQ);
    model.qTable[stateKey][action] = newQ;
  }
  
  // Update supervised learning model
  private static updateSupervisedModel(loop: LearningLoop, newData: any): void {
    const model = loop.model;
    const { input, output } = newData;
    
    if (!input || output === undefined) return;
    
    // Simple linear regression update
    const features = Object.keys(input);
    const prediction = this.predictSupervised(model, input);
    const error = output - prediction;
    
    features.forEach(feature => {
      if (!model.weights[feature]) {
        model.weights[feature] = 0;
      }
      model.weights[feature] += model.learningRate * error * input[feature];
    });
    
    model.bias += model.learningRate * error;
  }
  
  // Update unsupervised learning model
  private static updateUnsupervisedModel(loop: LearningLoop, newData: any): void {
    const model = loop.model;
    const { input } = newData;
    
    if (!input) return;
    
    // Simple k-means update
    if (model.clusters.length === 0) {
      // Initialize clusters
      for (let i = 0; i < model.k; i++) {
        model.clusters.push([]);
        model.centroids.push(this.randomCentroid(input));
      }
    }
    
    // Find closest centroid
    let closestCentroid = 0;
    let minDistance = Infinity;
    
    model.centroids.forEach((centroid, index) => {
      const distance = this.calculateDistance(input, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        closestCentroid = index;
      }
    });
    
    // Add to cluster
    model.clusters[closestCentroid].push(input);
    
    // Update centroid
    model.centroids[closestCentroid] = this.calculateCentroid(model.clusters[closestCentroid]);
  }
  
  // Predict using supervised model
  private static predictSupervised(model: any, input: any): number {
    let prediction = model.bias;
    
    Object.entries(input).forEach(([feature, value]) => {
      prediction += (model.weights[feature] || 0) * value;
    });
    
    return prediction;
  }
  
  // Calculate learning accuracy
  private static calculateLearningAccuracy(loop: LearningLoop): number {
    if (loop.data.length < 10) return 0.5;
    
    // Simple accuracy calculation based on recent predictions
    const recentData = loop.data.slice(-100);
    let correctPredictions = 0;
    
    recentData.forEach(data => {
      if (loop.type === 'supervised' && data.expected !== undefined) {
        const prediction = this.predictSupervised(loop.model, data.input);
        if (Math.abs(prediction - data.expected) < 0.1) {
          correctPredictions++;
        }
      }
    });
    
    return recentData.length > 0 ? correctPredictions / recentData.length : 0.5;
  }
  
  // Get adaptation insights
  static getAdaptationInsights(sessionId: string): any {
    const model = this.adaptationModels.get(sessionId);
    const loop = this.learningLoops.get(sessionId);
    
    if (!model && !loop) return null;
    
    return {
      adaptation: model ? {
        type: model.type,
        successRate: model.successRate,
        lastAdapted: model.lastAdapted,
        ruleCount: model.adaptationRules.length,
        topRules: model.adaptationRules
          .sort((a, b) => (b.successCount / (b.successCount + b.failureCount + 1)) - (a.successCount / (a.successCount + a.failureCount + 1)))
          .slice(0, 3)
      } : null,
      learning: loop ? {
        type: loop.type,
        accuracy: loop.accuracy,
        iterations: loop.iterations,
        lastUpdated: loop.lastUpdated,
        dataPoints: loop.data.length
      } : null
    };
  }
  
  // Helper methods
  private static calculateProteinIntake(nutritionLog: any[]): number {
    const today = new Date().toDateString();
    const todayNutrition = nutritionLog.filter(n => new Date(n.date).toDateString() === today);
    const totalProtein = todayNutrition.reduce((sum, n) => sum + (n.protein || 0), 0);
    return totalProtein / 150; // Assuming 150g is target
  }
  
  private static calculateCalorieIntake(nutritionLog: any[]): number {
    const today = new Date().toDateString();
    const todayNutrition = nutritionLog.filter(n => new Date(n.date).toDateString() === today);
    const totalCalories = todayNutrition.reduce((sum, n) => sum + (n.calories || 0), 0);
    return totalCalories / 2000; // Assuming 2000 is target
  }
  
  private static randomCentroid(input: any): any {
    const centroid: any = {};
    Object.keys(input).forEach(key => {
      centroid[key] = Math.random() * 2 - 1; // Random value between -1 and 1
    });
    return centroid;
  }
  
  private static calculateDistance(point1: any, point2: any): number {
    const keys = Object.keys(point1);
    let sum = 0;
    keys.forEach(key => {
      const diff = (point1[key] || 0) - (point2[key] || 0);
      sum += diff * diff;
    });
    return Math.sqrt(sum);
  }
  
  private static calculateCentroid(cluster: any[]): any {
    if (cluster.length === 0) return {};
    
    const centroid: any = {};
    const keys = Object.keys(cluster[0]);
    
    keys.forEach(key => {
      const sum = cluster.reduce((acc, point) => acc + (point[key] || 0), 0);
      centroid[key] = sum / cluster.length;
    });
    
    return centroid;
  }
}
