// Advanced memory and learning system for long-term AI improvement

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

export class AdvancedMemory {
  private static memoryBank: Map<string, MemoryBank> = new Map();
  private static learningModels: Map<string, LearningModel> = new Map();
  
  // Store different types of memories
  static storeShortTermMemory(sessionId: string, content: string, importance: number = 0.5, context: any = {}): void {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory: ShortTermMemory = {
      id: `st_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      content,
      importance,
      context,
      decayRate: 0.1
    };
    
    this.memoryBank.get(sessionId)!.shortTerm.push(memory);
  }
  
  static storeLongTermMemory(sessionId: string, content: string, importance: number = 0.8, context: any = {}, associations: string[] = []): void {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory: LongTermMemory = {
      id: `lt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      content,
      importance,
      context,
      associations,
      retrievalStrength: 1.0
    };
    
    this.memoryBank.get(sessionId)!.longTerm.push(memory);
  }
  
  static storeEpisodicMemory(sessionId: string, event: string, context: any = {}, emotions: string[] = [], participants: string[] = [], location: string = '', significance: number = 0.5): void {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory: EpisodicMemory = {
      id: `ep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      event,
      context,
      emotions,
      participants,
      location,
      significance
    };
    
    this.memoryBank.get(sessionId)!.episodic.push(memory);
  }
  
  static storeSemanticMemory(sessionId: string, concept: string, definition: string, properties: { [key: string]: any } = {}, relationships: { [key: string]: string[] } = {}, confidence: number = 0.8): void {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory: SemanticMemory = {
      id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      concept,
      definition,
      properties,
      relationships,
      confidence
    };
    
    this.memoryBank.get(sessionId)!.semantic.push(memory);
  }
  
  static storeProceduralMemory(sessionId: string, skill: string, steps: string[], successRate: number = 0.5, improvement: number = 0.1): void {
    if (!this.memoryBank.has(sessionId)) {
      this.memoryBank.set(sessionId, {
        shortTerm: [],
        longTerm: [],
        episodic: [],
        semantic: [],
        procedural: []
      });
    }
    
    const memory: ProceduralMemory = {
      id: `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      skill,
      steps,
      successRate,
      lastUsed: new Date(),
      improvement
    };
    
    this.memoryBank.get(sessionId)!.procedural.push(memory);
  }
  
  // Retrieve memories with context
  static getRelevantMemories(sessionId: string, query: string, type?: 'shortTerm' | 'longTerm' | 'episodic' | 'semantic' | 'procedural'): any[] {
    if (!this.memoryBank.has(sessionId)) return [];
    
    const bank = this.memoryBank.get(sessionId)!;
    const queryLower = query.toLowerCase();
    const results: any[] = [];
    
    if (!type || type === 'shortTerm') {
      results.push(...bank.shortTerm.filter(m => 
        m.content.toLowerCase().includes(queryLower) || 
        JSON.stringify(m.context).toLowerCase().includes(queryLower)
      ));
    }
    
    if (!type || type === 'longTerm') {
      results.push(...bank.longTerm.filter(m => 
        m.content.toLowerCase().includes(queryLower) || 
        m.associations.some(a => a.toLowerCase().includes(queryLower))
      ));
    }
    
    if (!type || type === 'episodic') {
      results.push(...bank.episodic.filter(m => 
        m.event.toLowerCase().includes(queryLower) || 
        m.emotions.some(e => e.toLowerCase().includes(queryLower))
      ));
    }
    
    if (!type || type === 'semantic') {
      results.push(...bank.semantic.filter(m => 
        m.concept.toLowerCase().includes(queryLower) || 
        m.definition.toLowerCase().includes(queryLower)
      ));
    }
    
    if (!type || type === 'procedural') {
      results.push(...bank.procedural.filter(m => 
        m.skill.toLowerCase().includes(queryLower) || 
        m.steps.some(s => s.toLowerCase().includes(queryLower))
      ));
    }
    
    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, query);
      const bScore = this.calculateRelevanceScore(b, query);
      return bScore - aScore;
    });
  }
  
  private static calculateRelevanceScore(memory: any, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    if (memory.content && memory.content.toLowerCase().includes(queryLower)) score += 2;
    if (memory.event && memory.event.toLowerCase().includes(queryLower)) score += 2;
    if (memory.concept && memory.concept.toLowerCase().includes(queryLower)) score += 2;
    if (memory.skill && memory.skill.toLowerCase().includes(queryLower)) score += 2;
    
    if (memory.importance) score += memory.importance;
    if (memory.confidence) score += memory.confidence;
    if (memory.significance) score += memory.significance;
    if (memory.successRate) score += memory.successRate;
    
    return score;
  }
  
  // Learning and pattern recognition
  static learnFromInteraction(sessionId: string, input: any, output: any, success: boolean = true): void {
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
    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      input,
      output,
      confidence: 0.8,
      timestamp: new Date(),
      actual: output,
      accuracy: success ? 1.0 : 0.0
    };
    
    model.predictions.push(prediction);
    model.lastUpdated = new Date();
    
    // Update accuracy
    const recentPredictions = model.predictions.slice(-10);
    const accuracy = recentPredictions.reduce((sum, p) => sum + (p.accuracy || 0), 0) / recentPredictions.length;
    model.accuracy = accuracy;
  }
  
  static getLearnedPatterns(sessionId: string): any {
    if (!this.learningModels.has(sessionId)) return {};
    
    const model = this.learningModels.get(sessionId)!;
    return {
      accuracy: model.accuracy,
      recentPredictions: model.predictions.slice(-5),
      lastUpdated: model.lastUpdated
    };
  }
  
  // Memory consolidation and cleanup
  static consolidateMemories(sessionId: string): void {
    if (!this.memoryBank.has(sessionId)) return;
    
    const bank = this.memoryBank.get(sessionId)!;
    const now = new Date();
    
    // Move important short-term memories to long-term
    const importantShortTerm = bank.shortTerm.filter(m => 
      m.importance > 0.7 && 
      (now.getTime() - m.timestamp.getTime()) > 24 * 60 * 60 * 1000 // 24 hours
    );
    
    importantShortTerm.forEach(m => {
      this.storeLongTermMemory(sessionId, m.content, m.importance, m.context, []);
      bank.shortTerm = bank.shortTerm.filter(sm => sm.id !== m.id);
    });
    
    // Clean up old short-term memories
    bank.shortTerm = bank.shortTerm.filter(m => 
      (now.getTime() - m.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
    );
  }
  
  // Get memory statistics
  static getMemoryStats(sessionId: string): any {
    if (!this.memoryBank.has(sessionId)) {
      return {
        shortTerm: 0,
        longTerm: 0,
        episodic: 0,
        semantic: 0,
        procedural: 0,
        total: 0
      };
    }
    
    const bank = this.memoryBank.get(sessionId)!;
    return {
      shortTerm: bank.shortTerm.length,
      longTerm: bank.longTerm.length,
      episodic: bank.episodic.length,
      semantic: bank.semantic.length,
      procedural: bank.procedural.length,
      total: bank.shortTerm.length + bank.longTerm.length + bank.episodic.length + bank.semantic.length + bank.procedural.length
    };
  }
}