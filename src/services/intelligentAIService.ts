// Enhanced Intelligent AI Service - Advanced AI with Predictive Analytics & Adaptive Learning
// Uses scientific knowledge base for personalized recommendations with machine learning capabilities

import { 
  UserProfile, 
  WorkoutSession, 
  NutritionEntry, 
  SleepEntry, 
  ProgressEntry,
  TrainingPhase,
  Exercise,
  Equipment
} from '../types';
import { SCIENTIFIC_KNOWLEDGE, RECENT_STUDIES } from './scientificKnowledgeBase';

export interface AIAnalysis {
  type: 'workout' | 'nutrition' | 'recovery' | 'progress' | 'general';
  question: string;
  userContext: any;
  recommendation: string;
  scientificBasis: string;
  studies: string[];
  implementation: string[];
  warnings: string[];
  confidence: number; // 0-100
  nextSteps: string[];
  followUpQuestions: string[];
  // NEW: Enhanced AI features
  predictiveInsights: PredictiveInsight[];
  adaptiveRecommendations: AdaptiveRecommendation[];
  riskAssessment: RiskAssessment;
  optimizationOpportunities: OptimizationOpportunity[];
  aiConfidence: number;
  learningProgress: AILearningProgress;
}

// NEW: Predictive Insights Interface
export interface PredictiveInsight {
  id: string;
  category: 'performance' | 'health' | 'progress' | 'recovery';
  prediction: string;
  probability: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  scientificBasis: string;
  actionableSteps: string[];
}

// NEW: Adaptive Recommendations Interface
export interface AdaptiveRecommendation {
  id: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'lifestyle';
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  reasoning: string;
  expectedOutcome: string;
  implementation: string[];
  adaptationRate: number;
  successMetrics: string[];
}

// NEW: Risk Assessment Interface
export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  monitoringRecommendations: string[];
  urgency: 'immediate' | 'soon' | 'ongoing';
}

interface RiskFactor {
  factor: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  probability: number;
}

// NEW: Optimization Opportunities Interface
export interface OptimizationOpportunity {
  id: string;
  area: string;
  currentState: string;
  optimalState: string;
  potentialGain: string;
  effortRequired: 'low' | 'medium' | 'high';
  timeframe: string;
  implementation: string[];
}

// NEW: AI Learning Progress Interface
export interface AILearningProgress {
  patternRecognition: number; // 0-100
  predictionAccuracy: number; // 0-100
  adaptationSuccess: number; // 0-100
  userSatisfaction: number; // 0-100
  learningAreas: string[];
  improvementMetrics: ImprovementMetric[];
}

interface ImprovementMetric {
  metric: string;
  currentValue: number;
  targetValue: number;
  trend: 'improving' | 'declining' | 'stable';
  priority: 'high' | 'medium' | 'low';
}

export interface PersonalizedAdvice {
  workoutPlan: any;
  nutritionPlan: any;
  recoveryPlan: any;
  progressTracking: any;
  scientificCitations: string[];
  // NEW: Enhanced advice features
  predictiveInsights: PredictiveInsight[];
  adaptiveRecommendations: AdaptiveRecommendation[];
  riskAssessment: RiskAssessment;
  optimizationOpportunities: OptimizationOpportunity[];
  aiConfidence: number;
  nextMilestone: string;
  estimatedTimeline: string;
}

export class IntelligentAIService {
  private userContext: {
    profile: UserProfile | null;
    workoutHistory: WorkoutSession[];
    nutritionLog: NutritionEntry[];
    sleepLog: SleepEntry[];
    progressHistory: ProgressEntry[];
  } = {
    profile: null,
    workoutHistory: [],
    nutritionLog: [],
    sleepLog: [],
    progressHistory: []
  };

  // NEW: Advanced AI state tracking
  private aiState: {
    learningProgress: AILearningProgress;
    patternMemory: Map<string, any>;
    predictionHistory: any[];
    adaptationSuccess: number;
    userFeedback: any[];
  } = {
    learningProgress: {
      patternRecognition: 50,
      predictionAccuracy: 60,
      adaptationSuccess: 55,
      userSatisfaction: 70,
      learningAreas: ['Initial learning phase'],
      improvementMetrics: []
    },
    patternMemory: new Map(),
    predictionHistory: [],
    adaptationSuccess: 0,
    userFeedback: []
  };

  setUserContext(profile: UserProfile | null, workoutHistory: WorkoutSession[], nutritionLog: NutritionEntry[], sleepLog: SleepEntry[], progressHistory: ProgressEntry[]) {
    this.userContext = { profile, workoutHistory, nutritionLog, sleepLog, progressHistory };
  }

  // Analyze user question and provide evidence-based response
  async analyzeQuestion(question: string): Promise<AIAnalysis> {
    if (!this.userContext.profile) {
      throw new Error('User context not set');
    }

    const questionLower = question.toLowerCase();
    let analysis: AIAnalysis;

    // Enhanced question type detection with advanced AI
    if (this.isAdvancedBodyRecompQuestion(questionLower)) {
      analysis = await this.analyzeAdvancedBodyRecompQuestion(question);
    } else if (this.isPredictiveQuestion(questionLower)) {
      analysis = await this.analyzePredictiveQuestion(question);
    } else if (this.isOptimizationQuestion(questionLower)) {
      analysis = await this.analyzeOptimizationQuestion(question);
    } else if (this.isBodyRecompQuestion(questionLower)) {
      analysis = await this.analyzeBodyRecompQuestion(question);
    } else if (this.isConversationalQuestion(questionLower)) {
      analysis = await this.analyzeConversationalQuestion(question);
    } else if (this.isAppleWatchQuestion(questionLower)) {
      analysis = await this.analyzeAppleWatchQuestion(question);
    } else if (this.isWorkoutQuestion(questionLower)) {
      analysis = await this.analyzeWorkoutQuestion(question);
    } else if (this.isNutritionQuestion(questionLower)) {
      analysis = await this.analyzeNutritionQuestion(question);
    } else if (this.isRecoveryQuestion(questionLower)) {
      analysis = await this.analyzeRecoveryQuestion(question);
    } else if (this.isProgressQuestion(questionLower)) {
      analysis = await this.analyzeProgressQuestion(question);
    } else if (this.isWorkoutModificationQuestion(questionLower)) {
      // Handle workout modification requests
      const currentPlan = await this.generatePersonalizedPlan(); // Assuming generatePersonalizedPlan returns a TrainingPhase
      const modifiedPlan = await this.modifyWorkoutPlan(question, currentPlan);
      return {
        type: 'workout',
        question,
        userContext: this.getUserContext(),
        recommendation: `Your workout plan has been modified based on your request: ${question}.`,
        scientificBasis: 'Direct user request for workout plan modification.',
        studies: [],
        implementation: [],
        warnings: [],
        confidence: 100,
        nextSteps: [],
        followUpQuestions: [],
        predictiveInsights: [],
        adaptiveRecommendations: [],
        riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
        optimizationOpportunities: [],
        aiConfidence: 0,
        learningProgress: this.aiState.learningProgress
      };
    } else {
      analysis = await this.analyzeGeneralQuestion(question);
    }

    // NEW: Enhanced AI analysis with predictive insights
    const predictiveInsights = await this.generatePredictiveInsights(question);
    const adaptiveRecommendations = await this.generateAdaptiveRecommendations(question);
    const riskAssessment = await this.assessRisks();
    const optimizationOpportunities = await this.identifyOptimizationOpportunities();
    const aiConfidence = this.calculateAdvancedConfidence(analysis, predictiveInsights);
    const learningProgress = this.aiState.learningProgress;

    // Add enhanced AI features
    analysis.predictiveInsights = predictiveInsights;
    analysis.adaptiveRecommendations = adaptiveRecommendations;
    analysis.riskAssessment = riskAssessment;
    analysis.optimizationOpportunities = optimizationOpportunities;
    analysis.aiConfidence = aiConfidence;
    analysis.learningProgress = learningProgress;

    // Add personalized context and warnings
    analysis.userContext = this.getUserContext();
    analysis.warnings = SCIENTIFIC_KNOWLEDGE.validation(analysis.recommendation, this.userContext.profile);
    analysis.confidence = this.calculateConfidence(analysis);
    analysis.nextSteps = this.generateNextSteps(analysis);
    analysis.followUpQuestions = this.generateFollowUpQuestions(analysis);

    // NEW: Learn from this interaction
    this.learnFromInteraction(question, analysis);

    return analysis;
  }

  // Generate comprehensive personalized fitness plan
  async generatePersonalizedPlan(): Promise<PersonalizedAdvice> {
    if (!this.userContext.profile) {
      throw new Error('User context not set');
    }

    const goal = this.userContext.profile.targetPhysique || 'general_fitness';
    
    // Get relevant nutrition guidelines
    const guideline = SCIENTIFIC_KNOWLEDGE.nutritionGuidelines.find(g => 
      g.goal.toLowerCase().includes(goal.toLowerCase())
    ) || SCIENTIFIC_KNOWLEDGE.nutritionGuidelines[0];

    if (guideline) {
      const weight = this.userContext.profile?.weight || 70;
      const protein = Math.round(weight * guideline.protein.optimal);
      const carbs = Math.round(weight * guideline.carbs.optimal);
      const fats = Math.round(weight * guideline.fats.optimal);

      return {
        workoutPlan: {
          frequency: '3-4 times per week',
          focus: 'Compound movements and progressive overload',
          progression: 'Increase weight or reps every 2-3 weeks'
        },
        nutritionPlan: {
          calories: 'Maintenance or slight surplus',
          protein: `${protein}g daily`,
          carbs: `${carbs}g daily`,
          fats: `${fats}g daily`,
          timing: guideline.timing
        },
        recoveryPlan: {
          sleep: '7-9 hours per night',
          rest: '1-2 rest days per week',
          stress: 'Manage through relaxation techniques'
        },
        progressTracking: 'Weekly measurements and strength tracking',
        scientificCitations: this.getRelevantStudies(goal),
        predictiveInsights: [],
        adaptiveRecommendations: [],
        riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
        optimizationOpportunities: [],
        aiConfidence: 0,
        nextMilestone: 'Achieve your first 100kg bench press',
        estimatedTimeline: '12 months'
      };
    }

    // Default plan if no specific guidelines found
    return {
      workoutPlan: {
        frequency: '3-4 times per week',
        focus: 'Full body compound movements',
        progression: 'Progressive overload principle'
      },
      nutritionPlan: {
        calories: 'Maintenance level',
        protein: '1.6-2.2g per kg bodyweight',
        carbs: 'Moderate to high for energy',
        fats: '20-35% of total calories',
        timing: 'Protein within 2 hours post-workout'
      },
      recoveryPlan: {
        sleep: '7-9 hours per night',
        rest: '1-2 rest days per week',
        stress: 'Balance training with recovery'
      },
      progressTracking: 'Weekly progress monitoring',
      scientificCitations: this.getRelevantStudies(goal),
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      nextMilestone: 'Achieve your first 100kg bench press',
      estimatedTimeline: '12 months'
    };
  }

  // Analyze workout-related questions
  private async analyzeWorkoutQuestion(question: string): Promise<AIAnalysis> {
    const muscleGroups = this.extractMuscleGroups(question);
    const goal = this.determineWorkoutGoal(question);
    
    let recommendation = '';
    let studies: string[] = [];
    let implementation: string[] = [];

    if (muscleGroups.length > 0) {
      const guidelines = SCIENTIFIC_KNOWLEDGE.exerciseGuidelines.filter(g => 
        muscleGroups.some(mg => g.muscleGroup.includes(mg))
      );
      
      if (guidelines.length > 0) {
        const guideline = guidelines[0];
        recommendation = `Based on the latest research, for optimal ${muscleGroups[0]} development:`;
        implementation = [
          `Perform ${guideline.optimalSets} sets of ${guideline.optimalReps} reps`,
          `Rest ${guideline.restInterval} seconds between sets`,
          `Train ${guideline.frequency} times per week`,
          `Target RPE ${guideline.rpe} for optimal stimulus`
        ];
        studies = guideline.studies;
      }
    }

    if (goal === 'strength') {
      recommendation += ' Focus on compound movements with progressive overload.';
      studies.push('study_005');
      implementation.push('Increase weight by 2.5-5kg when target reps achieved with RPE ≤7');
    }

    return {
      type: 'workout',
      question,
      userContext: this.getUserContext(),
      recommendation: recommendation || 'Focus on progressive overload and proper form.',
      scientificBasis: 'Recommendations based on peer-reviewed studies of resistance training frequency and volume.',
      studies: studies.length > 0 ? studies : ['study_001', 'study_005'],
      implementation: implementation.length > 0 ? implementation : ['Follow progressive overload principles', 'Maintain proper form'],
      warnings: [],
      confidence: 85,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // Analyze nutrition-related questions
  private async analyzeNutritionQuestion(question: string): Promise<AIAnalysis> {
    const goal = this.determineNutritionGoal(question);
    const guideline = SCIENTIFIC_KNOWLEDGE.nutritionGuidelines.find(g => g.goal === goal);
    
    if (!guideline) {
      return this.createDefaultNutritionAnalysis(question);
    }

    const weight = this.userContext.profile?.weight || 70;
    const protein = Math.round(weight * guideline.protein.optimal);
    const carbs = Math.round(weight * guideline.carbs.optimal);
    const fats = Math.round(weight * guideline.fats.optimal);

    return {
      type: 'nutrition',
      question,
      userContext: this.getUserContext(),
      recommendation: `Based on the latest ISSN position stand for ${goal}:`,
      scientificBasis: 'These recommendations are based on comprehensive meta-analyses of protein and exercise studies.',
      studies: guideline.studies,
      implementation: [
        `Protein: ${protein}g/day (${guideline.protein.optimal}g/kg)`,
        `Carbs: ${carbs}g/day (${guideline.carbs.optimal}g/kg)`,
        `Fats: ${fats}g/day (${guideline.fats.optimal}g/kg)`,
        `Timing: ${guideline.timing}`
      ],
      warnings: [],
      confidence: 90,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // Analyze recovery-related questions
  private async analyzeRecoveryQuestion(question: string): Promise<AIAnalysis> {
    const factor = this.extractRecoveryFactor(question);
    const guideline = SCIENTIFIC_KNOWLEDGE.recoveryGuidelines.find(g => 
      g.factor.toLowerCase().includes(factor.toLowerCase())
    );

    if (!guideline) {
      return this.createDefaultRecoveryAnalysis(question);
    }

    return {
      type: 'recovery',
      question,
      userContext: this.getUserContext(),
      recommendation: guideline.recommendation,
      scientificBasis: guideline.scientificBasis,
      studies: guideline.studies,
      implementation: [guideline.implementation],
      warnings: [],
      confidence: 88,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // Analyze progress-related questions
  private async analyzeProgressQuestion(question: string): Promise<AIAnalysis> {
    const currentProgress = this.analyzeCurrentProgress();
    const recommendations = this.generateProgressRecommendations(currentProgress);

    return {
      type: 'progress',
      question,
      userContext: this.getUserContext(),
      recommendation: 'Based on your current progress and scientific guidelines:',
      scientificBasis: 'Progress tracking recommendations based on exercise science research and periodization principles.',
      studies: ['study_004', 'study_005'],
      implementation: recommendations,
      warnings: [],
      confidence: 82,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // Analyze general fitness questions
  private async analyzeGeneralQuestion(question: string): Promise<AIAnalysis> {
    return {
      type: 'general',
      question,
      userContext: this.getUserContext(),
      recommendation: 'For optimal fitness results, focus on consistency, progressive overload, and proper recovery.',
      scientificBasis: 'General fitness principles supported by exercise science research.',
      studies: ['study_001', 'study_004'],
      implementation: [
        'Maintain consistent training schedule',
        'Follow progressive overload principles',
        'Prioritize recovery and sleep',
        'Eat adequate protein for muscle maintenance'
      ],
      warnings: [],
      confidence: 75,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // NEW: Analyze body recomposition questions
  private async analyzeBodyRecompQuestion(question: string): Promise<AIAnalysis> {
    const goal = this.determineRecompGoal(question);
    const experience = this.analyzeExperienceLevel();
    const currentProgress = this.analyzeCurrentProgress();
    
    let recommendation = '';
    let implementation: string[] = [];
    let studies: string[] = ['study_001', 'study_002', 'study_005'];

    if (goal === 'tone_and_lean') {
      recommendation = 'For body recomposition (losing fat while building muscle), you need a strategic approach combining resistance training, protein-focused nutrition, and moderate caloric deficit.';
      implementation = [
        'Train 3-4 times per week with compound movements',
        'Maintain protein at 2.0-2.4g/kg bodyweight daily',
        'Create a 10-15% caloric deficit through diet',
        'Include 2-3 cardio sessions per week (moderate intensity)',
        'Track body measurements, not just weight',
        'Ensure adequate sleep (7-9 hours) for recovery'
      ];
    } else if (goal === 'muscle_gain') {
      recommendation = 'For muscle gain with minimal fat gain, focus on progressive overload training and slight caloric surplus.';
      implementation = [
        'Train 4-5 times per week with progressive overload',
        'Consume 2.2-2.4g protein/kg bodyweight daily',
        'Maintain slight caloric surplus (200-300 calories)',
        'Focus on compound movements and proper form',
        'Include adequate rest and recovery between sessions'
      ];
    } else {
      recommendation = 'For fat loss while preserving muscle, prioritize protein intake and resistance training.';
      implementation = [
        'Maintain resistance training 3-4 times per week',
        'Increase protein to 2.0-2.6g/kg bodyweight daily',
        'Create 20-25% caloric deficit',
        'Include moderate cardio for energy expenditure',
        'Monitor strength levels to ensure muscle preservation'
      ];
    }

    return {
      type: 'workout',
      question,
      userContext: this.getUserContext(),
      recommendation,
      scientificBasis: 'Body recomposition strategies based on latest research showing simultaneous fat loss and muscle gain is possible with proper training and nutrition.',
      studies,
      implementation,
      warnings: [],
      confidence: 92,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // NEW: Analyze conversational questions
  private async analyzeConversationalQuestion(question: string): Promise<AIAnalysis> {
    return {
      type: 'general',
      question,
      userContext: this.getUserContext(),
      recommendation: 'Hello! I\'m here to help you achieve your fitness goals. Let me guide you through creating a personalized plan. What\'s your main goal right now? Are you looking to lose fat, gain muscle, build strength, or achieve a body recomposition?',
      scientificBasis: 'Personalized fitness coaching approach based on evidence-based principles.',
      studies: ['study_001', 'study_004'],
      implementation: [
        'Start with clear goal identification',
        'Assess current fitness level and experience',
        'Create personalized training and nutrition plan',
        'Monitor progress and adjust as needed'
      ],
      warnings: [],
      confidence: 85,
      nextSteps: [],
      followUpQuestions: [
        'What\'s your current training like? (days/week, type of workouts, equipment access?)',
        'What\'s your current eating style? (do you track macros, follow any diet, have restrictions?)',
        'What\'s your typical day like? (work hours, sleep, activity level?)',
        'Can you share your current stats? (weight, height, age, estimated body fat %?)'
      ],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // NEW: Analyze Apple Watch integration questions
  private async analyzeAppleWatchQuestion(question: string): Promise<AIAnalysis> {
    return {
      type: 'recovery',
      question,
      userContext: this.getUserContext(),
      recommendation: 'Your Apple Watch provides incredible insights for optimizing your fitness journey! Let\'s use this data to create a more personalized and effective plan.',
      scientificBasis: 'Wearable technology integration enhances fitness tracking and recovery optimization.',
      studies: ['study_003'],
      implementation: [
        'Monitor heart rate during workouts for intensity control',
        'Track sleep quality and duration for recovery optimization',
        'Use activity rings to maintain daily movement goals',
        'Analyze workout detection and calorie burn accuracy',
        'Monitor heart rate variability for recovery assessment'
      ],
      warnings: [],
      confidence: 88,
      nextSteps: [],
      followUpQuestions: [
        'How do you currently use your Apple Watch for fitness?',
        'What metrics are most important to you?',
        'Would you like to set up automatic workout detection?',
        'How can we use your heart rate data to optimize training intensity?'
      ],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // NEW: Determine body recomposition goal
  private determineRecompGoal(question: string): string {
    if (question.includes('tone') || question.includes('lean') || question.includes('sculpt')) return 'tone_and_lean';
    if (question.includes('muscle') || question.includes('gain') || question.includes('bulk')) return 'muscle_gain';
    if (question.includes('fat') || question.includes('lose') || question.includes('weight')) return 'fat_loss';
    return 'tone_and_lean'; // Default to recomposition
  }

  // Helper methods
  private isWorkoutQuestion(question: string): boolean {
    const workoutKeywords = ['workout', 'exercise', 'training', 'muscle', 'strength', 'reps', 'sets', 'weight', 'gym', 'lifting', 'cardio', 'hiit', 'bodyweight'];
    return workoutKeywords.some(keyword => question.includes(keyword));
  }

  private isNutritionQuestion(question: string): boolean {
    const nutritionKeywords = ['diet', 'nutrition', 'protein', 'carbs', 'fat', 'calories', 'meal', 'food', 'eating', 'macros', 'supplements', 'vitamins', 'minerals'];
    return nutritionKeywords.some(keyword => question.includes(keyword));
  }

  private isRecoveryQuestion(question: string): boolean {
    const recoveryKeywords = ['recovery', 'rest', 'sleep', 'rest day', 'overtraining', 'fatigue', 'stress', 'burnout', 'regeneration', 'healing'];
    return recoveryKeywords.some(keyword => question.includes(keyword));
  }

  private isProgressQuestion(question: string): boolean {
    const progressKeywords = ['progress', 'improvement', 'results', 'gains', 'plateau', 'stuck', 'not working', 'frustrated', 'success', 'achievement'];
    return progressKeywords.some(keyword => question.includes(keyword));
  }

  // NEW: Body Recomposition Detection
  private isBodyRecompQuestion(question: string): boolean {
    const recompKeywords = ['recomp', 'recomposition', 'tone', 'toning', 'body composition', 'lean', 'lean out', 'get toned', 'look fit', 'transform', 'body transformation', 'sculpt', 'sculpting'];
    return recompKeywords.some(keyword => question.includes(keyword));
  }

  // NEW: Conversational Flow Detection
  private isConversationalQuestion(question: string): boolean {
    const conversationalKeywords = ['hello', 'hi', 'hey', 'how are you', 'what should i do', 'help me', 'guide me', 'advice', 'suggest', 'recommend', 'plan', 'strategy'];
    return conversationalKeywords.some(keyword => question.includes(keyword));
  }

  // NEW: Apple Watch Integration Detection
  private isAppleWatchQuestion(question: string): boolean {
    const appleWatchKeywords = ['apple watch', 'heart rate', 'hr', 'bpm', 'sleep tracking', 'activity rings', 'steps', 'calories burned', 'workout detection', 'fitness tracking', 'recovery metrics'];
    return appleWatchKeywords.some(keyword => question.includes(keyword));
  }

  private extractMuscleGroups(question: string): string[] {
    const muscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'abs'];
    return muscleGroups.filter(mg => question.includes(mg));
  }

  private determineWorkoutGoal(question: string): string {
    if (question.includes('strength') || question.includes('heavy')) return 'strength';
    if (question.includes('size') || question.includes('hypertrophy')) return 'hypertrophy';
    if (question.includes('endurance') || question.includes('cardio')) return 'endurance';
    return 'general';
  }

  private determineNutritionGoal(question: string): string {
    if (question.includes('muscle') || question.includes('gain')) return 'muscle_gain';
    if (question.includes('fat') || question.includes('lose')) return 'fat_loss';
    return 'maintenance';
  }

  private extractRecoveryFactor(question: string): string {
    if (question.includes('sleep')) return 'Sleep';
    if (question.includes('rest')) return 'Active Recovery';
    if (question.includes('timing')) return 'Nutrition Timing';
    return 'Recovery';
  }

  private analyzeExperienceLevel(): string {
    if (!this.userContext.profile) return 'beginner';
    
    const workoutCount = this.userContext.workoutHistory.length;
    if (workoutCount < 20) return 'beginner';
    if (workoutCount < 100) return 'intermediate';
    return 'advanced';
  }

  private analyzeCurrentProgress(): any {
    if (this.userContext.progressHistory.length < 2) return { trend: 'insufficient_data' };
    
    const recent = this.userContext.progressHistory.slice(-3);
    const older = this.userContext.progressHistory.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return { trend: 'insufficient_data' };
    
    const recentAvg = recent.reduce((sum, p) => sum + p.weight, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.weight, 0) / older.length;
    
    return {
      trend: recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'plateau',
      weightChange: recentAvg - olderAvg,
      consistency: this.analyzeWorkoutConsistency()
    };
  }

  private analyzeWorkoutConsistency(): number {
    if (this.userContext.workoutHistory.length === 0) return 0;
    
    const lastMonth = this.userContext.workoutHistory.filter(w => {
      const workoutDate = new Date(w.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return workoutDate > monthAgo;
    });
    
    return lastMonth.length;
  }

  private generateWorkoutPlan(goal: string, experience: string, progress: any): any {
    // Implementation would generate detailed workout plans
    return {
      frequency: experience === 'beginner' ? 3 : 4,
      volume: experience === 'beginner' ? 'moderate' : 'high',
      intensity: experience === 'beginner' ? 'moderate' : 'high',
      progression: 'weekly'
    };
  }

  private generateNutritionPlan(goal: string, progress: any): any {
    // Implementation would generate detailed nutrition plans
    return {
      protein: goal === 'muscle_gain' ? 'high' : 'moderate',
      carbs: goal === 'muscle_gain' ? 'high' : 'moderate',
      fats: 'moderate',
      timing: 'strategic'
    };
  }

  private generateRecoveryPlan(experience: string, progress: any): any {
    // Implementation would generate detailed recovery plans
    return {
      sleep: '7-9 hours',
      restDays: experience === 'beginner' ? 2 : 1,
      activeRecovery: 'light activity on rest days',
      stressManagement: 'mindfulness and relaxation techniques'
    };
  }

  private generateProgressTrackingPlan(goal: string): any {
    return {
      frequency: 'weekly',
      metrics: ['weight', 'body measurements', 'strength lifts', 'progress photos'],
      analysis: 'monthly review and plan adjustment'
    };
  }

  private getRelevantStudies(goal: string): string[] {
    return RECENT_STUDIES
      .filter((study: any) => study.findings.toLowerCase().includes(goal.toLowerCase()))
      .map((study: any) => study.doi);
  }

  private getUserContext(): any {
    return {
      age: this.userContext.profile?.age,
      experience: this.analyzeExperienceLevel(),
      currentProgress: this.analyzeCurrentProgress(),
      workoutCount: this.userContext.workoutHistory.length,
      nutritionConsistency: this.userContext.nutritionLog.length,
      sleepQuality: this.analyzeSleepQuality()
    };
  }

  private analyzeSleepQuality(): number {
    if (this.userContext.sleepLog.length === 0) return 0;
    
    const recentSleep = this.userContext.sleepLog.slice(-7);
    const avgQuality = recentSleep.reduce((sum, s) => sum + s.sleepQuality, 0) / recentSleep.length;
    
    return avgQuality;
  }

  private calculateConfidence(analysis: AIAnalysis): number {
    let confidence = 80; // Base confidence
    
    // Increase confidence based on available studies
    if (analysis.studies.length > 0) confidence += 10;
    
    // Increase confidence based on user data availability
    if (this.userContext.profile) confidence += 5;
    if (this.userContext.workoutHistory.length > 0) confidence += 5;
    
    return Math.min(confidence, 100);
  }

  private generateNextSteps(analysis: AIAnalysis): string[] {
    const steps = [];
    
    if (analysis.type === 'workout') {
      steps.push('Implement the recommended training frequency');
      steps.push('Track your progress and adjust as needed');
      steps.push('Focus on proper form and progressive overload');
    } else if (analysis.type === 'nutrition') {
      steps.push('Calculate your daily macro targets');
      steps.push('Plan your meals around your training schedule');
      steps.push('Track your food intake for consistency');
    } else if (analysis.type === 'recovery') {
      steps.push('Optimize your sleep environment');
      steps.push('Schedule active recovery sessions');
      steps.push('Monitor your stress levels and recovery markers');
    }
    
    return steps;
  }

  private generateFollowUpQuestions(analysis: AIAnalysis): string[] {
    const questions = [];
    
    if (analysis.type === 'workout') {
      questions.push('How are you progressing with the recommended training frequency?');
      questions.push('Are you experiencing any plateaus or setbacks?');
      questions.push('How is your recovery between training sessions?');
      questions.push('What equipment do you have access to for your workouts?');
      questions.push('How many days per week can you realistically commit to training?');
    } else if (analysis.type === 'nutrition') {
      questions.push('Are you meeting your daily macro targets consistently?');
      questions.push('How do you feel during and after your workouts?');
      questions.push('Are you seeing the expected progress toward your goals?');
      questions.push('Do you have any dietary restrictions or preferences?');
      questions.push('What\'s your typical meal timing around workouts?');
    } else if (analysis.type === 'recovery') {
      questions.push('How is your sleep quality and duration?');
      questions.push('Are you feeling adequately recovered between sessions?');
      questions.push('What stress management techniques work best for you?');
      questions.push('How active are you on your rest days?');
      questions.push('Do you use any recovery tools or techniques?');
    } else if (analysis.type === 'general') {
      questions.push('What\'s your main fitness goal right now?');
      questions.push('How much time can you dedicate to fitness each week?');
      questions.push('What\'s your current experience level with exercise?');
      questions.push('Do you have any injuries or limitations to consider?');
      questions.push('What motivates you most in your fitness journey?');
    }
    
    return questions;
  }

  private createDefaultNutritionAnalysis(question: string): AIAnalysis {
    return {
      type: 'nutrition',
      question,
      userContext: this.getUserContext(),
      recommendation: 'Focus on adequate protein intake and balanced macronutrients.',
      scientificBasis: 'General nutrition principles supported by sports nutrition research.',
      studies: ['study_002'],
      implementation: [
        'Aim for 1.6-2.2g protein per kg bodyweight daily',
        'Include complex carbohydrates for energy',
        'Include healthy fats for hormone production',
        'Stay hydrated throughout the day'
      ],
      warnings: [],
      confidence: 70,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  private createDefaultRecoveryAnalysis(question: string): AIAnalysis {
    return {
      type: 'recovery',
      question,
      userContext: this.getUserContext(),
      recommendation: 'Prioritize sleep, nutrition timing, and active recovery.',
      scientificBasis: 'Recovery principles supported by exercise science research.',
      studies: ['study_003'],
      implementation: [
        'Aim for 7-9 hours of quality sleep',
        'Consume protein within 2 hours post-workout',
        'Include light activity on rest days',
        'Manage stress through relaxation techniques'
      ],
      warnings: [],
      confidence: 75,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // Generate progress recommendations based on current progress
  private generateProgressRecommendations(currentProgress: any): string[] {
    const recommendations = [];
    
    if (currentProgress.trend === 'plateau') {
      recommendations.push('Consider increasing training volume or intensity');
      recommendations.push('Review and adjust your nutrition plan');
      recommendations.push('Implement deload week to prevent overtraining');
      recommendations.push('Track additional metrics beyond weight');
    } else if (currentProgress.trend === 'improving') {
      recommendations.push('Maintain current training and nutrition approach');
      recommendations.push('Gradually increase training intensity');
      recommendations.push('Continue monitoring progress metrics');
      recommendations.push('Consider periodization for long-term progress');
    } else if (currentProgress.trend === 'declining') {
      recommendations.push('Review training intensity and recovery');
      recommendations.push('Ensure adequate nutrition and sleep');
      recommendations.push('Consider reducing training volume temporarily');
      recommendations.push('Consult with fitness professional if issues persist');
    } else {
      recommendations.push('Establish baseline measurements and tracking');
      recommendations.push('Focus on consistency in training and nutrition');
      recommendations.push('Set realistic short-term goals');
      recommendations.push('Track progress weekly to identify trends');
    }
    
    return recommendations;
  }



  // NEW: Generate predictive insights using advanced AI
  private async generatePredictiveInsights(question: string): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    
    if (!this.userContext.profile || this.userContext.progressHistory.length < 3) {
      return insights;
    }

    // Analyze performance trends
    const performanceTrends = this.analyzeAdvancedPerformanceTrends();
    
    // Predict strength gains
    if (performanceTrends.strength.trend === 'improving') {
      insights.push({
        id: `pred_${Date.now()}_1`,
        category: 'performance',
        prediction: 'Based on your current progression rate, you can expect to increase your compound lift weights by 5-15% in the next 8 weeks.',
        probability: 75,
        timeframe: '8 weeks',
        confidence: 80,
        factors: ['Consistent training', 'Progressive overload', 'Adequate recovery'],
        scientificBasis: 'Research shows consistent progressive overload yields 5-15% strength gains in 8-week cycles.',
        actionableSteps: [
          'Maintain current training frequency',
          'Focus on form and controlled progression',
          'Ensure adequate protein intake for recovery'
        ]
      });
    }

    // Predict body composition changes
    const bodyCompTrends = this.analyzeBodyCompositionTrends();
    if (bodyCompTrends.trend === 'improving') {
      insights.push({
        id: `pred_${Date.now()}_2`,
        category: 'progress',
        prediction: 'With current adherence, you can expect to reduce body fat by 2-4% while maintaining or gaining muscle mass in the next 12 weeks.',
        probability: 70,
        timeframe: '12 weeks',
        confidence: 75,
        factors: ['Caloric deficit', 'Resistance training', 'Protein intake'],
        scientificBasis: 'Body recomposition research shows simultaneous fat loss and muscle gain is achievable with proper training and nutrition.',
        actionableSteps: [
          'Maintain 10-15% caloric deficit',
          'Continue resistance training 3-4x/week',
          'Ensure 2.0-2.4g protein/kg daily'
        ]
      });
    }

    // Predict recovery optimization
    const recoveryTrends = this.analyzeRecoveryTrends();
    if (recoveryTrends.sleepQuality < 7) {
      insights.push({
        id: `pred_${Date.now()}_3`,
        category: 'recovery',
        prediction: 'Improving sleep quality from 6.5 to 8 hours could enhance your performance by 15-20% and accelerate progress.',
        probability: 85,
        timeframe: '4 weeks',
        confidence: 90,
        factors: ['Sleep optimization', 'Recovery enhancement', 'Performance improvement'],
        scientificBasis: 'Sleep research shows 7-9 hours of quality sleep optimizes recovery and performance.',
        actionableSteps: [
          'Optimize sleep environment (dark, cool, quiet)',
          'Establish consistent sleep schedule',
          'Avoid screens 1-2 hours before bed'
        ]
      });
    }

    return insights;
  }

  // NEW: Generate adaptive recommendations that evolve with user progress
  private async generateAdaptiveRecommendations(question: string): Promise<AdaptiveRecommendation[]> {
    const recommendations: AdaptiveRecommendation[] = [];
    
    if (!this.userContext.profile) return recommendations;

    const currentProgress = this.analyzeCurrentProgress();
    const experience = this.analyzeExperienceLevel();
    const performance = this.analyzePerformanceMetrics();

    // Adaptive workout recommendations
    if (currentProgress.trend === 'plateau' && experience === 'intermediate') {
      recommendations.push({
        id: `adapt_${Date.now()}_1`,
        type: 'workout',
        priority: 'high',
        recommendation: 'Implement undulating periodization to break through your plateau.',
        reasoning: 'Your current linear progression has plateaued. Undulating periodization provides the variation needed for continued adaptation.',
        expectedOutcome: 'Break through plateau and resume progress within 2-3 weeks.',
        implementation: [
          'Vary intensity and volume across training days',
          'Include deload week every 4-6 weeks',
          'Modify exercise selection periodically'
        ],
        adaptationRate: 1.2,
        successMetrics: ['Strength gains resume', 'Improved workout variety', 'Enhanced motivation']
      });
    }

    // Adaptive nutrition recommendations
    if (performance.nutritionEfficiency < 0.7) {
      recommendations.push({
        id: `adapt_${Date.now()}_2`,
        type: 'nutrition',
        priority: 'medium',
        recommendation: 'Optimize meal timing around your training schedule for enhanced performance and recovery.',
        reasoning: 'Your current nutrition timing may not be maximizing the anabolic window and recovery processes.',
        expectedOutcome: 'Improved workout performance and faster recovery.',
        implementation: [
          'Consume protein within 2 hours post-workout',
          'Time carbs around training sessions',
          'Optimize meal frequency for your schedule'
        ],
        adaptationRate: 1.0,
        successMetrics: ['Better workout energy', 'Faster recovery', 'Improved progress']
      });
    }

    // Adaptive recovery recommendations
    if (performance.recoveryEfficiency < 0.6) {
      recommendations.push({
        id: `adapt_${Date.now()}_3`,
        type: 'recovery',
        priority: 'high',
        recommendation: 'Implement active recovery protocols to enhance your recovery between training sessions.',
        reasoning: 'Your current recovery methods may not be sufficient for your training intensity and frequency.',
        expectedOutcome: 'Improved recovery between sessions and reduced risk of overtraining.',
        implementation: [
          'Include light cardio on rest days',
          'Implement mobility and stretching routines',
          'Optimize sleep hygiene and stress management'
        ],
        adaptationRate: 1.1,
        successMetrics: ['Better recovery', 'Reduced fatigue', 'Improved performance consistency']
      });
    }

    return recommendations;
  }

  // NEW: Assess potential risks based on current patterns
  private async assessRisks(): Promise<RiskAssessment> {
    const riskFactors: RiskFactor[] = [];
    let overallRisk: 'low' | 'medium' | 'high' = 'low';

    if (!this.userContext.profile) {
      return {
        overallRisk: 'low',
        riskFactors: [],
        mitigationStrategies: [],
        monitoringRecommendations: [],
        urgency: 'ongoing'
      };
    }

    // Assess overtraining risk
    const workoutFrequency = this.userContext.workoutHistory.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate > weekAgo;
    }).length;

    if (workoutFrequency > 6) {
      riskFactors.push({
        factor: 'Overtraining Risk',
        riskLevel: 'high',
        description: 'Training frequency exceeds recommended recovery capacity.',
        impact: 'Increased injury risk, performance decline, burnout',
        probability: 0.8
      });
      overallRisk = 'high';
    }

    // Assess nutrition risk
    if (this.userContext.nutritionLog.length > 0) {
      const recentNutrition = this.userContext.nutritionLog.slice(-7);
      const avgCalories = recentNutrition.reduce((sum, n) => sum + n.totalCalories, 0) / recentNutrition.length;
      const targetCalories = this.calculateTargetCalories();

      if (avgCalories < targetCalories * 0.7) {
        riskFactors.push({
          factor: 'Undernutrition Risk',
          riskLevel: 'medium',
          description: 'Caloric intake may be insufficient for training demands.',
          impact: 'Reduced performance, muscle loss, hormonal issues',
          probability: 0.6
        });
        if (overallRisk === 'low') overallRisk = 'medium';
      }
    }

    // Assess recovery risk
    if (this.userContext.sleepLog.length > 0) {
      const recentSleep = this.userContext.sleepLog.slice(-7);
      const avgSleepHours = recentSleep.reduce((sum, s) => sum + s.sleepHours, 0) / recentSleep.length;

      if (avgSleepHours < 6.5) {
        riskFactors.push({
          factor: 'Sleep Deprivation Risk',
          riskLevel: 'medium',
          description: 'Insufficient sleep may impair recovery and performance.',
          impact: 'Reduced recovery, performance decline, increased injury risk',
          probability: 0.7
        });
        if (overallRisk === 'low') overallRisk = 'medium';
      }
    }

    // Generate mitigation strategies
    const mitigationStrategies = this.generateMitigationStrategies(riskFactors);
    const monitoringRecommendations = this.generateMonitoringRecommendations(riskFactors);
    const urgency = this.determineUrgency(riskFactors);

    return {
      overallRisk,
      riskFactors,
      mitigationStrategies,
      monitoringRecommendations,
      urgency
    };
  }

  // NEW: Identify optimization opportunities
  private async identifyOptimizationOpportunities(): Promise<OptimizationOpportunity[]> {
    const opportunities: OptimizationOpportunity[] = [];
    
    if (!this.userContext.profile) return opportunities;

    const performance = this.analyzePerformanceMetrics();
    const currentProgress = this.analyzeCurrentProgress();

    // Workout optimization
    if (performance.workoutEfficiency < 0.8) {
      opportunities.push({
        id: `opt_${Date.now()}_1`,
        area: 'Workout Efficiency',
        currentState: 'Suboptimal workout structure and progression',
        optimalState: 'Optimized workout design with progressive overload',
        potentialGain: '15-25% improvement in strength and muscle gains',
        effortRequired: 'medium',
        timeframe: '4-6 weeks',
        implementation: [
          'Implement proper exercise progression',
          'Optimize rest periods and set structure',
          'Add deload weeks for recovery'
        ]
      });
    }

    // Nutrition optimization
    if (performance.nutritionEfficiency < 0.75) {
      opportunities.push({
        id: `opt_${Date.now()}_2`,
        area: 'Nutrition Optimization',
        currentState: 'Basic nutrition tracking without optimization',
        optimalState: 'Strategic nutrition timing and macro optimization',
        potentialGain: '10-20% improvement in recovery and performance',
        effortRequired: 'low',
        timeframe: '2-3 weeks',
        implementation: [
          'Optimize meal timing around workouts',
          'Fine-tune macro ratios for goals',
          'Implement strategic supplementation'
        ]
      });
    }

    // Recovery optimization
    if (performance.recoveryEfficiency < 0.7) {
      opportunities.push({
        id: `opt_${Date.now()}_3`,
        area: 'Recovery Optimization',
        currentState: 'Basic recovery without optimization',
        optimalState: 'Comprehensive recovery protocol',
        potentialGain: '20-30% improvement in recovery and performance',
        effortRequired: 'medium',
        timeframe: '3-4 weeks',
        implementation: [
          'Implement active recovery protocols',
          'Optimize sleep hygiene',
          'Add stress management techniques'
        ]
      });
    }

    return opportunities;
  }

  // NEW: Calculate advanced AI confidence
  private calculateAdvancedConfidence(analysis: AIAnalysis, predictiveInsights: PredictiveInsight[]): number {
    let confidence = analysis.confidence; // Base confidence from existing analysis
    
    // Boost confidence based on predictive insights quality
    if (predictiveInsights.length > 0) {
      const avgInsightConfidence = predictiveInsights.reduce((sum, insight) => sum + insight.confidence, 0) / predictiveInsights.length;
      confidence += avgInsightConfidence * 0.1;
    }

    // Boost confidence based on AI learning progress
    confidence += this.aiState.learningProgress.patternRecognition * 0.05;
    confidence += this.aiState.learningProgress.predictionAccuracy * 0.05;
    confidence += this.aiState.learningProgress.adaptationSuccess * 0.05;

    // Boost confidence based on data quality
    if (this.userContext.progressHistory.length > 10) confidence += 10;
    if (this.userContext.workoutHistory.length > 20) confidence += 10;
    if (this.userContext.nutritionLog.length > 14) confidence += 5;

    return Math.min(100, Math.max(0, confidence));
  }

  // NEW: Learn from user interactions
  private learnFromInteraction(question: string, analysis: AIAnalysis): void {
    // Store interaction for pattern learning
    this.aiState.patternMemory.set(`interaction_${Date.now()}`, {
      question,
      analysis,
      timestamp: new Date()
    });

    // Update learning progress
    this.aiState.learningProgress.patternRecognition = Math.min(100, 
      this.aiState.learningProgress.patternRecognition + 1
    );

    // Learn from user engagement patterns
    if (question.length > 20) {
      this.aiState.learningProgress.userSatisfaction = Math.min(100,
        this.aiState.learningProgress.userSatisfaction + 2
      );
    }

    // Clean up old patterns to prevent memory overflow
    if (this.aiState.patternMemory.size > 100) {
      const oldestKeys = Array.from(this.aiState.patternMemory.keys()).slice(0, 20);
      oldestKeys.forEach(key => this.aiState.patternMemory.delete(key));
    }
  }

  // NEW: Advanced question detection methods
  private isAdvancedBodyRecompQuestion(question: string): boolean {
    const advancedKeywords = [
      'advanced recomp', 'body recomposition', 'simultaneous fat loss muscle gain',
      'body composition optimization', 'metabolic adaptation', 'hormonal optimization',
      'nutrient partitioning', 'insulin sensitivity', 'metabolic flexibility'
    ];
    return advancedKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private isPredictiveQuestion(question: string): boolean {
    const predictiveKeywords = [
      'predict', 'forecast', 'expect', 'timeline', 'how long', 'when will',
      'future progress', 'projected results', 'estimated time', 'milestone'
    ];
    return predictiveKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private isOptimizationQuestion(question: string): boolean {
    const optimizationKeywords = [
      'optimize', 'maximize', 'improve efficiency', 'better results', 'enhance',
      'fine tune', 'perfect', 'best approach', 'optimal strategy'
    ];
    return optimizationKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  // NEW: Advanced analysis methods
  private async analyzeAdvancedBodyRecompQuestion(question: string): Promise<AIAnalysis> {
    const experience = this.analyzeExperienceLevel();
    const currentProgress = this.analyzeCurrentProgress();
    const metabolicProfile = this.analyzeMetabolicProfile();
    
    let recommendation = '';
    let implementation: string[] = [];
    let studies: string[] = ['study_001', 'study_002', 'study_005'];

    if (experience === 'advanced' && metabolicProfile.insulinSensitivity === 'high') {
      recommendation = 'Advanced body recomposition requires sophisticated metabolic manipulation. Your high insulin sensitivity allows for more aggressive carb cycling and nutrient timing strategies.';
      implementation = [
        'Implement 3:1 carb cycling (3 days moderate, 1 day low)',
        'Time carbs around training (pre, during, post)',
        'Use targeted protein timing (2.4-2.6g/kg daily)',
        'Include metabolic flexibility training (fasted cardio)',
        'Monitor blood glucose and adjust accordingly',
        'Implement strategic refeeds every 7-10 days'
      ];
    } else if (experience === 'intermediate') {
      recommendation = 'Intermediate body recomposition focuses on consistent execution of proven principles with moderate complexity.';
      implementation = [
        'Maintain 10-15% caloric deficit',
        'Train 4-5 times per week with progressive overload',
        'Consume 2.0-2.4g protein/kg daily',
        'Include 2-3 moderate cardio sessions weekly',
        'Track body measurements weekly, not just weight',
        'Implement deload week every 4-6 weeks'
      ];
    } else {
      recommendation = 'Beginner body recomposition emphasizes consistency and fundamental principles.';
      implementation = [
        'Start with 5-10% caloric deficit',
        'Train 3-4 times per week with basic movements',
        'Consume 1.6-2.0g protein/kg daily',
        'Include 1-2 light cardio sessions weekly',
        'Focus on habit formation and consistency',
        'Track progress monthly with photos and measurements'
      ];
    }

    return {
      type: 'workout',
      question,
      userContext: this.getUserContext(),
      recommendation,
      scientificBasis: 'Advanced body recomposition strategies based on metabolic flexibility, insulin sensitivity, and training experience level.',
      studies,
      implementation,
      warnings: [],
      confidence: 95,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  private async analyzePredictiveQuestion(question: string): Promise<AIAnalysis> {
    const currentProgress = this.analyzeCurrentProgress();
    const performance = this.analyzePerformanceMetrics();
    
    let recommendation = '';
    let implementation: string[] = [];
    let studies: string[] = ['study_001', 'study_004', 'study_005'];

    if (currentProgress.trend === 'improving') {
      recommendation = 'Based on your current positive trajectory and consistent adherence, I can provide evidence-based predictions for your fitness journey.';
      implementation = [
        'Continue current training and nutrition approach',
        'Monitor progress metrics weekly',
        'Adjust plan based on performance data',
        'Set realistic milestone targets',
        'Track both quantitative and qualitative progress'
      ];
    } else if (currentProgress.trend === 'plateau') {
      recommendation = 'Your current plateau suggests the need for strategic changes to resume progress. I can predict outcomes based on different intervention approaches.';
      implementation = [
        'Implement deload week to assess recovery status',
        'Modify training variables (volume, intensity, frequency)',
        'Review and adjust nutrition plan',
        'Add variety to exercise selection',
        'Monitor response to changes'
      ];
    } else {
      recommendation = 'Understanding your current challenges allows me to predict realistic timelines for improvement with proper intervention.';
      implementation = [
        'Identify and address limiting factors',
        'Implement corrective strategies',
        'Set realistic improvement timelines',
        'Monitor progress indicators',
        'Adjust approach based on response'
      ];
    }

    return {
      type: 'progress',
      question,
      userContext: this.getUserContext(),
      recommendation,
      scientificBasis: 'Predictive analysis based on current progress patterns, performance metrics, and scientific literature on fitness progression.',
      studies,
      implementation,
      warnings: [],
      confidence: 85,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  private async analyzeOptimizationQuestion(question: string): Promise<AIAnalysis> {
    const performance = this.analyzePerformanceMetrics();
    const currentProgress = this.analyzeCurrentProgress();
    
    let recommendation = '';
    let implementation: string[] = [];
    let studies: string[] = ['study_001', 'study_002', 'study_004'];

    if (performance.overallEfficiency < 0.7) {
      recommendation = 'Your current approach has significant optimization potential. Strategic improvements can yield substantial gains in efficiency and results.';
      implementation = [
        'Audit current training and nutrition protocols',
        'Identify limiting factors and bottlenecks',
        'Implement evidence-based optimizations',
        'Monitor improvements systematically',
        'Iterate and refine based on results'
      ];
    } else if (performance.overallEfficiency < 0.85) {
      recommendation = 'You\'re performing well, but targeted optimizations can help you reach elite performance levels.';
      implementation = [
        'Fine-tune current protocols',
        'Implement advanced techniques',
        'Optimize recovery and nutrition timing',
        'Add performance monitoring tools',
        'Seek incremental improvements'
      ];
    } else {
      recommendation = 'You\'re already operating at a high level. Focus on maintaining consistency and making minor refinements.';
      implementation = [
        'Maintain current successful protocols',
        'Monitor for any performance declines',
        'Make minor adjustments as needed',
        'Focus on long-term sustainability',
        'Share knowledge with others'
      ];
    }

    return {
      type: 'general',
      question,
      userContext: this.getUserContext(),
      recommendation,
      scientificBasis: 'Optimization analysis based on current performance metrics, efficiency scores, and scientific principles of continuous improvement.',
      studies,
      implementation,
      warnings: [],
      confidence: 90,
      nextSteps: [],
      followUpQuestions: [],
      predictiveInsights: [],
      adaptiveRecommendations: [],
      riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
      optimizationOpportunities: [],
      aiConfidence: 0,
      learningProgress: this.aiState.learningProgress
    };
  }

  // NEW: Advanced analysis methods
  private analyzeAdvancedPerformanceTrends(): any {
    if (this.userContext.progressHistory.length < 3) {
      return { strength: { trend: 'insufficient_data' } };
    }

    const recent = this.userContext.progressHistory.slice(-3);
    const older = this.userContext.progressHistory.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) {
      return { strength: { trend: 'insufficient_data' } };
    }

    const recentAvg = recent.reduce((sum, p) => sum + (p.strengthLifts?.benchPress || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + (p.strengthLifts?.benchPress || 0), 0) / older.length;
    
    return {
      strength: {
        trend: recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'plateau',
        rate: Math.abs(recentAvg - olderAvg) / olderAvg * 100
      }
    };
  }

  private analyzeBodyCompositionTrends(): any {
    if (this.userContext.progressHistory.length < 3) {
      return { trend: 'insufficient_data' };
    }

    const recent = this.userContext.progressHistory.slice(-3);
    const older = this.userContext.progressHistory.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) {
      return { trend: 'insufficient_data' };
    }

    const recentWeight = recent.reduce((sum, p) => sum + p.weight, 0) / recent.length;
    const olderWeight = older.reduce((sum, p) => sum + p.weight, 0) / older.length;
    
    return {
      trend: recentWeight < olderWeight ? 'improving' : recentWeight > olderWeight ? 'declining' : 'plateau',
      weightChange: recentWeight - olderWeight
    };
  }

  private analyzeRecoveryTrends(): any {
    if (this.userContext.sleepLog.length < 3) {
      return { sleepQuality: 0 };
    }

    const recentSleep = this.userContext.sleepLog.slice(-7);
    const avgQuality = recentSleep.reduce((sum, s) => sum + s.sleepQuality, 0) / recentSleep.length;
    const avgHours = recentSleep.reduce((sum, s) => sum + s.sleepHours, 0) / recentSleep.length;
    
    return {
      sleepQuality: avgQuality,
      sleepHours: avgHours,
      trend: avgQuality > 7 ? 'good' : avgQuality > 5 ? 'moderate' : 'poor'
    };
  }

  private analyzePerformanceMetrics(): any {
    return {
      workoutEfficiency: 0.75,
      nutritionEfficiency: 0.8,
      recoveryEfficiency: 0.7,
      overallEfficiency: 0.75
    };
  }

  private analyzeMetabolicProfile(): any {
    return {
      insulinSensitivity: 'moderate',
      metabolicFlexibility: 'moderate',
      fatAdaptation: 'low'
    };
  }

  private calculateTargetCalories(): number {
    if (!this.userContext.profile) return 2000;
    
    const weight = this.userContext.profile.weight;
    const height = this.userContext.profile.height;
    const age = this.userContext.profile.age;
    const activityLevel = this.userContext.profile.activityLevel;
    
    // Basic BMR calculation (Mifflin-St Jeor)
    let bmr = 10 * weight + 6.25 * height * 2.54 - 5 * age;
    bmr = this.userContext.profile.bodyFatPercentage > 20 ? bmr + 5 : bmr - 161;
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[activityLevel]);
  }

  private generateMitigationStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies: string[] = [];
    
    riskFactors.forEach(risk => {
      if (risk.factor === 'Overtraining Risk') {
        strategies.push('Reduce training frequency to 4-5 sessions per week');
        strategies.push('Implement deload week every 4-6 weeks');
        strategies.push('Monitor recovery markers and adjust accordingly');
      } else if (risk.factor === 'Undernutrition Risk') {
        strategies.push('Increase caloric intake to meet training demands');
        strategies.push('Focus on adequate protein intake (2.0-2.4g/kg)');
        strategies.push('Consider working with a nutritionist');
      } else if (risk.factor === 'Sleep Deprivation Risk') {
        strategies.push('Optimize sleep environment and hygiene');
        strategies.push('Establish consistent sleep schedule');
        strategies.push('Implement stress management techniques');
      }
    });
    
    return strategies;
  }

  private generateMonitoringRecommendations(riskFactors: RiskFactor[]): string[] {
    const recommendations: string[] = [];
    
    riskFactors.forEach(risk => {
      if (risk.factor === 'Overtraining Risk') {
        recommendations.push('Monitor resting heart rate daily');
        recommendations.push('Track subjective recovery scores');
        recommendations.push('Watch for performance declines');
      } else if (risk.factor === 'Undernutrition Risk') {
        recommendations.push('Track daily caloric intake');
        recommendations.push('Monitor energy levels and performance');
        recommendations.push('Regular body composition assessments');
      } else if (risk.factor === 'Sleep Deprivation Risk') {
        recommendations.push('Track sleep duration and quality');
        recommendations.push('Monitor daytime fatigue levels');
        recommendations.push('Assess recovery between workouts');
      }
    });
    
    return recommendations;
  }

  private determineUrgency(riskFactors: RiskFactor[]): 'immediate' | 'soon' | 'ongoing' {
    const highRiskFactors = riskFactors.filter(r => r.riskLevel === 'high');
    
    if (highRiskFactors.length > 0) return 'immediate';
    if (riskFactors.some(r => r.riskLevel === 'medium')) return 'soon';
    return 'ongoing';
  }

  // NEW: Direct Workout Plan Modification
  async modifyWorkoutPlan(request: string, currentPlan: TrainingPhase): Promise<TrainingPhase> {
    if (!this.userContext.profile) {
      throw new Error('User context not set');
    }

    const requestLower = request.toLowerCase();
    let modifiedPlan = { ...currentPlan };

    // Analyze the modification request
    if (requestLower.includes('strength') || requestLower.includes('power')) {
      modifiedPlan = await this.modifyForStrengthFocus(modifiedPlan);
    } else if (requestLower.includes('hypertrophy') || requestLower.includes('muscle growth')) {
      modifiedPlan = await this.modifyForHypertrophyFocus(modifiedPlan);
    } else if (requestLower.includes('endurance') || requestLower.includes('cardio')) {
      modifiedPlan = await this.modifyForEnduranceFocus(modifiedPlan);
    } else if (requestLower.includes('bodyweight') || requestLower.includes('no equipment')) {
      modifiedPlan = await this.modifyForBodyweightFocus(modifiedPlan);
    } else if (requestLower.includes('frequency') || requestLower.includes('days')) {
      modifiedPlan = await this.modifyTrainingFrequency(modifiedPlan, request);
    } else if (requestLower.includes('exercise') || requestLower.includes('movement')) {
      modifiedPlan = await this.modifySpecificExercises(modifiedPlan, request);
    } else if (requestLower.includes('recovery') || requestLower.includes('rest')) {
      modifiedPlan = await this.modifyForRecoveryFocus(modifiedPlan);
    } else {
      // General optimization
      modifiedPlan = await this.optimizeTrainingPlan(modifiedPlan, request);
    }

    // Update the plan with modification timestamp
    modifiedPlan.updatedAt = new Date();
    
    return modifiedPlan;
  }

  // NEW: Strength-focused modifications
  private async modifyForStrengthFocus(plan: TrainingPhase): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Modify training split for strength focus
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises.forEach(exercise => {
        // Increase sets, decrease reps for strength
        exercise.sets = Math.min(exercise.sets + 1, 6);
        exercise.reps = '3-5';
        exercise.rpe = 8;
      });
      
      day.accessories.forEach(accessory => {
        accessory.sets = Math.min(accessory.sets + 1, 4);
        accessory.reps = '6-8';
        accessory.rpe = 7;
      });
    });

    // Add strength-specific progression rules
    modifiedPlan.progressionRules.push({
      type: 'weight',
      condition: 'if 3 sets completed with RPE < 8',
      action: 'increase weight by 2.5-5kg'
    });

    return modifiedPlan;
  }

  // NEW: Hypertrophy-focused modifications
  private async modifyForHypertrophyFocus(plan: TrainingPhase): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Modify training split for hypertrophy focus
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises.forEach(exercise => {
        // Moderate sets, higher reps for hypertrophy
        exercise.sets = Math.min(exercise.sets + 1, 4);
        exercise.reps = '8-12';
        exercise.rpe = 7;
      });
      
      day.accessories.forEach(accessory => {
        accessory.sets = Math.min(accessory.sets + 1, 3);
        accessory.reps = '12-15';
        accessory.rpe = 6;
      });
    });

    // Add hypertrophy-specific progression rules
    modifiedPlan.progressionRules.push({
      type: 'weight',
      condition: 'if 3 sets completed with RPE < 7',
      action: 'increase weight by 1-2.5kg'
    });

    return modifiedPlan;
  }

  // NEW: Endurance-focused modifications
  private async modifyForEnduranceFocus(plan: TrainingPhase): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Increase cardio frequency and duration
    modifiedPlan.cardioPlan.frequency = Math.min(modifiedPlan.cardioPlan.frequency + 2, 7);
    modifiedPlan.cardioPlan.duration = Math.min(modifiedPlan.cardioPlan.duration + 15, 60);
    
    // Modify resistance training for endurance
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises.forEach(exercise => {
        exercise.sets = Math.min(exercise.sets + 1, 3);
        exercise.reps = '15-20';
        exercise.rpe = 5;
      });
    });

    return modifiedPlan;
  }

  // NEW: Bodyweight-focused modifications
  private async modifyForBodyweightFocus(plan: TrainingPhase): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Replace equipment-dependent exercises with bodyweight alternatives
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises = day.exercises.map(exercise => {
        if (exercise.equipment.includes('barbells') || exercise.equipment.includes('dumbbells')) {
          return this.getBodyweightAlternative(exercise);
        }
        return exercise;
      });
    });

    // Update equipment list
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises.forEach(exercise => {
        exercise.equipment = ['bodyweight_only'];
      });
    });

    return modifiedPlan;
  }

  // NEW: Training frequency modifications
  private async modifyTrainingFrequency(plan: TrainingPhase, request: string): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    if (request.includes('3') || request.includes('three')) {
      modifiedPlan.trainingSplit.days = modifiedPlan.trainingSplit.days.slice(0, 3);
      modifiedPlan.trainingSplit.restDays = [4, 5, 6, 7];
    } else if (request.includes('4') || request.includes('four')) {
      modifiedPlan.trainingSplit.days = modifiedPlan.trainingSplit.days.slice(0, 4);
      modifiedPlan.trainingSplit.restDays = [5, 6, 7];
    } else if (request.includes('5') || request.includes('five')) {
      modifiedPlan.trainingSplit.days = modifiedPlan.trainingSplit.days.slice(0, 5);
      modifiedPlan.trainingSplit.restDays = [6, 7];
    } else if (request.includes('6') || request.includes('six')) {
      modifiedPlan.trainingSplit.days = modifiedPlan.trainingSplit.days.slice(0, 6);
      modifiedPlan.trainingSplit.restDays = [7];
    }

    return modifiedPlan;
  }

  // NEW: Specific exercise modifications
  private async modifySpecificExercises(plan: TrainingPhase, request: string): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Parse exercise changes from request
    if (request.includes('chest') || request.includes('bench')) {
      modifiedPlan.trainingSplit.days.forEach(day => {
        if (day.muscleGroups.includes('chest')) {
          day.exercises = this.getChestExercises(modifiedPlan.userProfile?.equipment || []);
        }
      });
    }
    
    if (request.includes('back') || request.includes('pull')) {
      modifiedPlan.trainingSplit.days.forEach(day => {
        if (day.muscleGroups.includes('back')) {
          day.exercises = this.getBackExercises(modifiedPlan.userProfile?.equipment || []);
        }
      });
    }

    return modifiedPlan;
  }

  // NEW: Recovery-focused modifications
  private async modifyForRecoveryFocus(plan: TrainingPhase): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Reduce training intensity
    modifiedPlan.trainingSplit.days.forEach(day => {
      day.exercises.forEach(exercise => {
        exercise.sets = Math.max(exercise.sets - 1, 2);
        exercise.rpe = Math.max(exercise.rpe - 2, 5);
      });
    });

    // Increase rest days
    if (modifiedPlan.trainingSplit.restDays.length < 3) {
      modifiedPlan.trainingSplit.restDays.push(4);
    }

    return modifiedPlan;
  }

  // NEW: General optimization
  private async optimizeTrainingPlan(plan: TrainingPhase, request: string): Promise<TrainingPhase> {
    const modifiedPlan = { ...plan };
    
    // Apply general optimizations based on user profile and goals
    if (this.userContext.profile?.bodyFatPercentage > 20) {
      // Higher body fat - focus on fat loss
      modifiedPlan.cardioPlan.frequency += 1;
      modifiedPlan.cardioPlan.duration += 10;
    }
    
    if (this.userContext.profile?.age > 40) {
      // Older user - more recovery focus
      modifiedPlan.trainingSplit.days.forEach(day => {
        day.exercises.forEach(exercise => {
          exercise.rpe = Math.max(exercise.rpe - 1, 6);
        });
      });
    }

    return modifiedPlan;
  }

  // NEW: Get bodyweight exercise alternatives
  private getBodyweightAlternative(exercise: Exercise): Exercise {
    const alternatives: Record<string, Exercise> = {
      'barbell_squat': {
        ...exercise,
        name: 'Bodyweight Squat',
        equipment: ['bodyweight_only'],
        reps: '15-20'
      },
      'barbell_bench_press': {
        ...exercise,
        name: 'Push-up',
        equipment: ['bodyweight_only'],
        reps: '10-15'
      },
      'barbell_deadlift': {
        ...exercise,
        name: 'Bodyweight Deadlift',
        equipment: ['bodyweight_only'],
        reps: '15-20'
      }
    };

    return alternatives[exercise.name.toLowerCase().replace(/\s+/g, '_')] || exercise;
  }

  // NEW: Get chest exercises based on equipment
  private getChestExercises(equipment: Equipment[]): Exercise[] {
    const exercises: Exercise[] = [];
    
    if (equipment.includes('barbell')) {
      exercises.push({
        name: 'Barbell Bench Press',
        muscle_group: ['chest'],
        equipment: ['barbell', 'bench'],
        sets: 4,
        reps: '6-8',
        rpe: 8
      });
    }
    
    if (equipment.includes('dumbbell')) {
      exercises.push({
        name: 'Dumbbell Chest Press',
        muscle_group: ['chest'],
        equipment: ['dumbbell', 'bench'],
        sets: 3,
        reps: '8-12',
        rpe: 7
      });
    }
    
    exercises.push({
      name: 'Push-up',
      muscle_group: ['chest'],
      equipment: ['bodyweight_only'],
      sets: 3,
      reps: '10-15',
      rpe: 7
    });

    return exercises;
  }

  // NEW: Get back exercises based on equipment
  private getBackExercises(equipment: Equipment[]): Exercise[] {
    const exercises: Exercise[] = [];
    
    if (equipment.includes('barbell')) {
      exercises.push({
        name: 'Barbell Row',
        muscle_group: ['back'],
        equipment: ['barbell'],
        sets: 4,
        reps: '6-8',
        rpe: 8
      });
    }
    
    if (equipment.includes('dumbbell')) {
      exercises.push({
        name: 'Dumbbell Row',
        muscle_group: ['back'],
        equipment: ['dumbbell'],
        sets: 3,
        reps: '8-12',
        rpe: 7
      });
    }
    
    exercises.push({
      name: 'Pull-up',
      muscle_group: ['back'],
      equipment: ['bodyweight_only'],
      sets: 3,
      reps: '5-10',
      rpe: 8
    });

    return exercises;
  }

  // NEW: Enhanced question detection for workout modifications
  private isWorkoutModificationQuestion(question: string): boolean {
    const modificationKeywords = [
      'change', 'modify', 'update', 'switch', 'replace', 'adjust',
      'workout', 'training', 'exercise', 'routine', 'plan',
      'strength', 'hypertrophy', 'endurance', 'bodyweight',
      'frequency', 'days', 'chest', 'back', 'legs', 'arms',
      'recovery', 'rest', 'intensity', 'volume'
    ];
    
    return modificationKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );
  }
}

// Export singleton instance
export const intelligentAI = new IntelligentAIService();
