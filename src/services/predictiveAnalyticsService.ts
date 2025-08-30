// Predictive Analytics Service for SciOptimal
// Provides data-driven insights and predictions for performance optimization

export interface PerformancePrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: '1_week' | '2_weeks' | '1_month' | '3_months' | '6_months';
  confidence: number; // 0-100
  factors: string[];
  recommendations: string[];
  riskFactors: RiskFactor[];
}

export interface InjuryRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  preventionStrategies: string[];
  warningSigns: string[];
  recommendedActions: string[];
  nextAssessment: Date;
}

export interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  currentStatus: 'optimal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  scientificBasis: string;
  mitigation: string[];
}

export interface ProgressForecast {
  strength: StrengthForecast;
  bodyComposition: BodyCompositionForecast;
  endurance: EnduranceForecast;
  overallProgress: number;
  milestones: Milestone[];
  timeline: TimelineEvent[];
}

export interface StrengthForecast {
  exercises: ExerciseForecast[];
  overallStrength: number;
  plateauRisk: number;
  optimizationOpportunities: string[];
}

export interface ExerciseForecast {
  name: string;
  currentMax: number;
  predictedMax: number;
  timeframe: string;
  confidence: number;
  factors: string[];
}

export interface BodyCompositionForecast {
  weight: WeightPrediction;
  bodyFat: BodyFatPrediction;
  muscleMass: MuscleMassPrediction;
  recommendations: string[];
}

export interface WeightPrediction {
  current: number;
  predicted: number;
  timeframe: string;
  rate: number; // kg per week
  confidence: number;
}

export interface BodyFatPrediction {
  current: number;
  predicted: number;
  timeframe: string;
  rate: number; // % per week
  confidence: number;
}

export interface MuscleMassPrediction {
  current: number;
  predicted: number;
  timeframe: string;
  rate: number; // kg per week
  confidence: number;
}

export interface EnduranceForecast {
  cardioType: string;
  currentDuration: number;
  predictedDuration: number;
  timeframe: string;
  improvement: number;
  recommendations: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  currentProgress: number;
  targetValue: number;
  unit: string;
  confidence: number;
}

export interface TimelineEvent {
  date: Date;
  event: string;
  type: 'milestone' | 'assessment' | 'adjustment' | 'goal';
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export class PredictiveAnalyticsService {
  
  // Predict strength gains based on current progress and training history
  predictStrengthGains(
    exerciseHistory: any[],
    currentPhase: string,
    userProfile: any
  ): StrengthForecast {
    const exercises: ExerciseForecast[] = [];
    let overallStrength = 0;
    let plateauRisk = 0;

    // Analyze each exercise
    exerciseHistory.forEach(exercise => {
      const prediction = this.predictExerciseProgress(exercise, currentPhase, userProfile);
      exercises.push(prediction);
      overallStrength += prediction.confidence;
    });

    overallStrength = Math.round(overallStrength / exercises.length);
    plateauRisk = this.calculatePlateauRisk(exerciseHistory, currentPhase);

    return {
      exercises,
      overallStrength,
      plateauRisk,
      optimizationOpportunities: this.generateStrengthOptimizations(exercises, userProfile)
    };
  }

  // Predict body composition changes
  predictBodyComposition(
    currentMetrics: any,
    nutritionHistory: any[],
    workoutHistory: any[],
    userProfile: any
  ): BodyCompositionForecast {
    const weightPrediction = this.predictWeightChange(currentMetrics, nutritionHistory, userProfile);
    const bodyFatPrediction = this.predictBodyFatChange(currentMetrics, workoutHistory, userProfile);
    const muscleMassPrediction = this.predictMuscleMassChange(currentMetrics, workoutHistory, userProfile);

    return {
      weight: weightPrediction,
      bodyFat: bodyFatPrediction,
      muscleMass: muscleMassPrediction,
      recommendations: this.generateBodyCompositionRecommendations(
        weightPrediction,
        bodyFatPrediction,
        muscleMassPrediction,
        userProfile
      )
    };
  }

  // Assess injury risk based on multiple factors
  assessInjuryRisk(
    workoutHistory: any[],
    sleepData: any[],
    stressLevel: number,
    previousInjuries: any[],
    userProfile: any
  ): InjuryRiskAssessment {
    const riskFactors: RiskFactor[] = [];
    let riskScore = 0;

    // Training load risk
    const trainingLoadRisk = this.assessTrainingLoadRisk(workoutHistory);
    riskFactors.push(trainingLoadRisk);
    riskScore += trainingLoadRisk.impact === 'high' ? 30 : trainingLoadRisk.impact === 'medium' ? 20 : 10;

    // Recovery risk
    const recoveryRisk = this.assessRecoveryRisk(sleepData, stressLevel);
    riskFactors.push(recoveryRisk);
    riskScore += recoveryRisk.impact === 'high' ? 25 : recoveryRisk.impact === 'medium' ? 15 : 5;

    // Form and technique risk
    const techniqueRisk = this.assessTechniqueRisk(workoutHistory, userProfile);
    riskFactors.push(techniqueRisk);
    riskScore += techniqueRisk.impact === 'high' ? 25 : techniqueRisk.impact === 'medium' ? 15 : 5;

    // Previous injury risk
    const injuryHistoryRisk = this.assessInjuryHistoryRisk(previousInjuries);
    riskFactors.push(injuryHistoryRisk);
    riskScore += injuryHistoryRisk.impact === 'high' ? 20 : injuryHistoryRisk.impact === 'medium' ? 10 : 0;

    const overallRisk = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';

    return {
      overallRisk,
      riskScore: Math.min(100, riskScore),
      riskFactors,
      preventionStrategies: this.generatePreventionStrategies(riskFactors),
      warningSigns: this.generateWarningSigns(riskFactors),
      recommendedActions: this.generateRecommendedActions(riskFactors, overallRisk),
      nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    };
  }

  // Generate comprehensive progress forecast
  generateProgressForecast(
    userProfile: any,
    progressHistory: any[],
    workoutHistory: any[],
    nutritionHistory: any[]
  ): ProgressForecast {
    const strength = this.predictStrengthGains(workoutHistory, 'current', userProfile);
    const bodyComposition = this.predictBodyComposition(
      progressHistory[progressHistory.length - 1] || {},
      nutritionHistory,
      workoutHistory,
      userProfile
    );
    const endurance = this.predictEnduranceProgress(workoutHistory, userProfile);

    const overallProgress = this.calculateOverallProgress(strength, bodyComposition, endurance);
    const milestones = this.generateMilestones(userProfile, overallProgress);
    const timeline = this.generateTimeline(milestones, userProfile);

    return {
      strength,
      bodyComposition,
      endurance,
      overallProgress,
      milestones,
      timeline
    };
  }

  // Private helper methods
  private predictExerciseProgress(exercise: any, phase: string, userProfile: any): ExerciseForecast {
    const currentMax = exercise.currentMax || 0;
    const experience = userProfile.experience || 'beginner';
    const phaseMultiplier = this.getPhaseMultiplier(phase);
    const experienceMultiplier = this.getExperienceMultiplier(experience);

    let predictedIncrease = 0;
    let timeframe = '';

    if (phase === 'strength') {
      predictedIncrease = currentMax * 0.1 * phaseMultiplier * experienceMultiplier;
      timeframe = '4 weeks';
    } else if (phase === 'hypertrophy') {
      predictedIncrease = currentMax * 0.05 * phaseMultiplier * experienceMultiplier;
      timeframe = '6 weeks';
    } else if (phase === 'endurance') {
      predictedIncrease = currentMax * 0.03 * phaseMultiplier * experienceMultiplier;
      timeframe = '8 weeks';
    }

    const confidence = Math.min(100, 85 + (userProfile.consistency || 0) * 0.15);

    return {
      name: exercise.name,
      currentMax,
      predictedMax: Math.round(currentMax + predictedIncrease),
      timeframe,
      confidence: Math.round(confidence),
      factors: this.getExerciseFactors(exercise, phase, userProfile)
    };
  }

  private calculatePlateauRisk(history: any[], phase: string): number {
    if (history.length < 4) return 20;

    const recentProgress = history.slice(-4);
    const progressRates = recentProgress.map((entry, index) => {
      if (index === 0) return 0;
      return entry.progress - recentProgress[index - 1].progress;
    });

    const avgProgress = progressRates.reduce((sum, rate) => sum + rate, 0) / progressRates.length;
    const consistency = progressRates.filter(rate => Math.abs(rate - avgProgress) < avgProgress * 0.2).length / progressRates.length;

    if (avgProgress < 0.01 && consistency > 0.8) return 80; // Plateau
    if (avgProgress < 0.02) return 60; // Slowing down
    if (avgProgress < 0.05) return 40; // Moderate progress
    return 20; // Good progress
  }

  private predictWeightChange(current: any, nutrition: any[], userProfile: any): WeightPrediction {
    const targetWeight = userProfile.goalWeight || current.weight;
    const currentWeight = current.weight || 70;
    const weeklyDeficit = this.calculateWeeklyDeficit(nutrition, userProfile);
    
    const weightDiff = targetWeight - currentWeight;
    const weeksToGoal = Math.abs(weightDiff) / (weeklyDeficit / 7700); // 7700 calories = 1kg
    
    const rate = weightDiff > 0 ? weeklyDeficit / 7700 : -weeklyDeficit / 7700;
    const confidence = Math.min(100, 70 + (userProfile.nutritionAdherence || 0) * 0.3);

    return {
      current: currentWeight,
      predicted: targetWeight,
      timeframe: `${Math.ceil(weeksToGoal)} weeks`,
      rate: Math.round(rate * 100) / 100,
      confidence: Math.round(confidence)
    };
  }

  private predictBodyFatChange(current: any, workouts: any[], userProfile: any): BodyFatPrediction {
    const currentBF = current.bodyFat || 20;
    const targetBF = userProfile.targetBodyFat || 15;
    const weeklyCalorieBurn = this.calculateWeeklyCalorieBurn(workouts, userProfile);
    
    const bfDiff = targetBF - currentBF;
    const weeklyBFChange = weeklyCalorieBurn / 3500; // 3500 calories = 1lb fat
    
    const weeksToGoal = Math.abs(bfDiff) / weeklyBFChange;
    const confidence = Math.min(100, 75 + (userProfile.workoutConsistency || 0) * 0.25);

    return {
      current: currentBF,
      predicted: targetBF,
      timeframe: `${Math.ceil(weeksToGoal)} weeks`,
      rate: Math.round(weeklyBFChange * 100) / 100,
      confidence: Math.round(confidence)
    };
  }

  private predictMuscleMassChange(current: any, workouts: any[], userProfile: any): MuscleMassPrediction {
    const currentMass = current.muscleMass || 50;
    const experience = userProfile.experience || 'beginner';
    const consistency = userProfile.workoutConsistency || 0;
    
    let weeklyGain = 0;
    if (experience === 'beginner') weeklyGain = 0.5;
    else if (experience === 'intermediate') weeklyGain = 0.25;
    else weeklyGain = 0.1;

    // Adjust for consistency
    weeklyGain *= (consistency / 100);
    
    const targetMass = currentMass + (weeklyGain * 12); // 12 weeks projection
    const confidence = Math.min(100, 80 + consistency * 0.2);

    return {
      current: currentMass,
      predicted: Math.round(targetMass * 10) / 10,
      timeframe: '12 weeks',
      rate: Math.round(weeklyGain * 100) / 100,
      confidence: Math.round(confidence)
    };
  }

  private predictEnduranceProgress(workouts: any[], userProfile: any): EnduranceForecast {
    const cardioWorkouts = workouts.filter(w => w.type === 'cardio');
    if (cardioWorkouts.length === 0) {
      return {
        cardioType: 'general',
        currentDuration: 20,
        predictedDuration: 30,
        timeframe: '8 weeks',
        improvement: 50,
        recommendations: ['Start with 20-minute cardio sessions', 'Gradually increase duration by 5 minutes weekly']
      };
    }

    const recentCardio = cardioWorkouts.slice(-3);
    const avgDuration = recentCardio.reduce((sum, w) => sum + w.duration, 0) / recentCardio.length;
    const predictedDuration = Math.round(avgDuration * 1.3); // 30% improvement
    const improvement = Math.round(((predictedDuration - avgDuration) / avgDuration) * 100);

    return {
      cardioType: 'mixed',
      currentDuration: Math.round(avgDuration),
      predictedDuration,
      timeframe: '8 weeks',
      improvement,
      recommendations: [
        'Maintain current cardio frequency',
        'Increase duration gradually',
        'Mix high and low intensity sessions'
      ]
    };
  }

  private assessTrainingLoadRisk(workoutHistory: any[]): RiskFactor {
    if (workoutHistory.length < 3) {
      return {
        factor: 'Insufficient training data',
        impact: 'medium',
        currentStatus: 'warning',
        trend: 'stable',
        scientificBasis: 'Need at least 3 weeks of data for accurate risk assessment',
        mitigation: ['Continue logging workouts', 'Monitor for signs of overtraining']
      };
    }

    const recentWorkouts = workoutHistory.slice(-3);
    const avgRPE = recentWorkouts.reduce((sum, w) => sum + w.rpe, 0) / recentWorkouts.length;
    const frequency = recentWorkouts.length;

    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    let impact: 'high' | 'medium' | 'low' = 'low';
    let mitigation: string[] = [];

    if (avgRPE > 9 && frequency > 2) {
      status = 'critical';
      impact = 'high';
      mitigation = ['Reduce workout intensity', 'Add rest days', 'Focus on recovery'];
    } else if (avgRPE > 8 || frequency > 3) {
      status = 'warning';
      impact = 'medium';
      mitigation = ['Monitor fatigue levels', 'Ensure adequate recovery', 'Consider deload week'];
    }

    return {
      factor: 'Training load and intensity',
      impact,
      currentStatus: status,
      trend: 'stable',
      scientificBasis: 'High RPE combined with high frequency increases injury risk',
      mitigation
    };
  }

  private assessRecoveryRisk(sleepData: any[], stressLevel: number): RiskFactor {
    const recentSleep = sleepData.slice(-7);
    const avgSleepQuality = recentSleep.reduce((sum, s) => sum + s.quality, 0) / recentSleep.length;
    const avgSleepDuration = recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length;

    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    let impact: 'high' | 'medium' | 'low' = 'low';
    let mitigation: string[] = [];

    if (avgSleepQuality < 5 || avgSleepDuration < 6) {
      status = 'critical';
      impact = 'high';
      mitigation = ['Prioritize sleep hygiene', 'Reduce evening screen time', 'Create consistent sleep schedule'];
    } else if (avgSleepQuality < 7 || avgSleepDuration < 7) {
      status = 'warning';
      impact = 'medium';
      mitigation = ['Improve sleep environment', 'Limit caffeine after 2 PM', 'Practice relaxation techniques'];
    }

    if (stressLevel > 7) {
      status = status === 'optimal' ? 'warning' : 'critical';
      impact = impact === 'low' ? 'medium' : 'high';
      mitigation.push('Practice stress management', 'Consider meditation or yoga', 'Seek professional help if needed');
    }

    return {
      factor: 'Recovery and stress management',
      impact,
      currentStatus: status,
      trend: 'stable',
      scientificBasis: 'Poor sleep quality and high stress significantly increase injury risk',
      mitigation
    };
  }

  private assessTechniqueRisk(workoutHistory: any[], userProfile: any): RiskFactor {
    const experience = userProfile.experience || 'beginner';
    const hasCoach = userProfile.hasCoach || false;

    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    let impact: 'high' | 'medium' | 'low' = 'low';
    let mitigation: string[] = [];

    if (experience === 'beginner' && !hasCoach) {
      status = 'warning';
      impact = 'medium';
      mitigation = ['Consider hiring a coach', 'Focus on form over weight', 'Use lighter weights initially'];
    } else if (experience === 'beginner') {
      status = 'optimal';
      impact = 'low';
      mitigation = ['Continue working with coach', 'Focus on proper form', 'Progress gradually'];
    }

    return {
      factor: 'Exercise technique and experience',
      impact,
      currentStatus: status,
      trend: 'stable',
      scientificBasis: 'Proper form is crucial for injury prevention, especially for beginners',
      mitigation
    };
  }

  private assessInjuryHistoryRisk(previousInjuries: any[]): RiskFactor {
    if (previousInjuries.length === 0) {
      return {
        factor: 'Previous injuries',
        impact: 'low',
        currentStatus: 'optimal',
        trend: 'stable',
        scientificBasis: 'No previous injuries reduces current risk',
        mitigation: ['Maintain current prevention strategies', 'Continue proper warm-up routine']
      };
    }

    const recentInjuries = previousInjuries.filter(i => 
      new Date(i.date).getTime() > Date.now() - 365 * 24 * 60 * 60 * 1000
    );

    if (recentInjuries.length > 0) {
      return {
        factor: 'Previous injuries',
        impact: 'high',
        currentStatus: 'warning',
        trend: 'stable',
        scientificBasis: 'Recent injuries increase risk of re-injury',
        mitigation: [
          'Complete full rehabilitation',
          'Gradually return to previous activity level',
          'Focus on injury prevention exercises',
          'Consider physical therapy consultation'
        ]
      };
    }

    return {
      factor: 'Previous injuries',
      impact: 'medium',
      currentStatus: 'optimal',
      trend: 'stable',
      scientificBasis: 'Past injuries with full recovery have minimal impact on current risk',
      mitigation: ['Maintain injury prevention routine', 'Listen to body signals']
    };
  }

  private generatePreventionStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies: string[] = [];
    
    riskFactors.forEach(factor => {
      if (factor.impact === 'high' || factor.currentStatus === 'critical') {
        strategies.push(...factor.mitigation);
      }
    });

    // Add general prevention strategies
    strategies.push(
      'Always warm up properly before workouts',
      'Maintain proper form during exercises',
      'Listen to your body and don\'t ignore pain',
      'Include rest days in your training schedule',
      'Stay hydrated and maintain proper nutrition'
    );

    return [...new Set(strategies)]; // Remove duplicates
  }

  private generateWarningSigns(riskFactors: RiskFactor[]): string[] {
    const warningSigns: string[] = [];
    
    riskFactors.forEach(factor => {
      if (factor.impact === 'high' || factor.currentStatus === 'critical') {
        if (factor.factor.includes('Training load')) {
          warningSigns.push('Persistent fatigue', 'Decreased performance', 'Increased resting heart rate');
        } else if (factor.factor.includes('Recovery')) {
          warningSigns.push('Poor sleep quality', 'Increased stress levels', 'Slow recovery between workouts');
        } else if (factor.factor.includes('Technique')) {
          warningSigns.push('Form breakdown during sets', 'Pain during exercises', 'Compensatory movements');
        }
      }
    });

    return warningSigns;
  }

  private generateRecommendedActions(riskFactors: RiskFactor[], overallRisk: string): string[] {
    const actions: string[] = [];

    if (overallRisk === 'high') {
      actions.push(
        'Immediately reduce training intensity',
        'Schedule rest days',
        'Consult with healthcare professional',
        'Focus on recovery and mobility work'
      );
    } else if (overallRisk === 'medium') {
      actions.push(
        'Monitor symptoms closely',
        'Reduce training volume by 20%',
        'Add more recovery days',
        'Focus on technique improvement'
      );
    } else {
      actions.push(
        'Continue current training plan',
        'Maintain prevention strategies',
        'Monitor for any changes'
      );
    }

    return actions;
  }

  private generateStrengthOptimizations(exercises: ExerciseForecast[], userProfile: any): string[] {
    const optimizations: string[] = [];
    
    const plateauExercises = exercises.filter(e => e.confidence < 70);
    if (plateauExercises.length > 0) {
      optimizations.push(
        'Consider deload week for plateaued exercises',
        'Change exercise variations',
        'Adjust rep ranges and intensity'
      );
    }

    const highConfidenceExercises = exercises.filter(e => e.confidence > 85);
    if (highConfidenceExercises.length > 0) {
      optimizations.push(
        'Increase weight on high-confidence exercises',
        'Add volume to progressing movements',
        'Consider advanced techniques (drop sets, supersets)'
      );
    }

    return optimizations;
  }

  private generateBodyCompositionRecommendations(
    weight: WeightPrediction,
    bodyFat: BodyFatPrediction,
    muscleMass: MuscleMassPrediction,
    userProfile: any
  ): string[] {
    const recommendations: string[] = [];

    if (weight.rate < 0) {
      recommendations.push(
        'Maintain caloric deficit for weight loss',
        'Focus on protein intake to preserve muscle',
        'Continue resistance training during weight loss'
      );
    } else if (weight.rate > 0) {
      recommendations.push(
        'Ensure adequate protein for muscle building',
        'Monitor body fat percentage',
        'Adjust caloric surplus based on progress'
      );
    }

    if (muscleMass.rate < 0.1) {
      recommendations.push(
        'Increase training volume',
        'Ensure adequate protein intake (1.6-2.2g/kg)',
        'Consider progressive overload principles'
      );
    }

    return recommendations;
  }

  private generateMilestones(userProfile: any, overallProgress: number): Milestone[] {
    const milestones: Milestone[] = [];
    const goals = userProfile.goals || [];

    goals.forEach((goal: string, index: number) => {
      const milestone: Milestone = {
        id: `milestone_${index}`,
        title: `Achieve ${goal}`,
        description: `Reach your ${goal} goal`,
        targetDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000), // 30 days per milestone
        currentProgress: Math.min(overallProgress, (index + 1) * 25),
        targetValue: 100,
        unit: '%',
        confidence: Math.max(60, 100 - (index * 10))
      };
      milestones.push(milestone);
    });

    return milestones;
  }

  private generateTimeline(milestones: Milestone[], userProfile: any): TimelineEvent[] {
    const timeline: TimelineEvent[] = [];

    // Add milestone events
    milestones.forEach(milestone => {
      timeline.push({
        date: milestone.targetDate,
        event: milestone.title,
        type: 'milestone',
        description: milestone.description,
        importance: 'high'
      });
    });

    // Add assessment events
    const assessmentInterval = 14; // Every 2 weeks
    for (let i = 1; i <= 6; i++) {
      timeline.push({
        date: new Date(Date.now() + i * assessmentInterval * 24 * 60 * 60 * 1000),
        event: 'Progress Assessment',
        type: 'assessment',
        description: 'Review progress and adjust training plan',
        importance: 'medium'
      });
    }

    return timeline.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private calculateOverallProgress(strength: StrengthForecast, bodyComposition: BodyCompositionForecast, endurance: EnduranceForecast): number {
    const strengthProgress = strength.overallStrength;
    const bodyCompProgress = (bodyComposition.weight.confidence + bodyComposition.muscleMass.confidence) / 2;
    const enduranceProgress = endurance.improvement;

    return Math.round((strengthProgress + bodyCompProgress + enduranceProgress) / 3);
  }

  private getPhaseMultiplier(phase: string): number {
    const multipliers: { [key: string]: number } = {
      'strength': 1.2,
      'hypertrophy': 1.0,
      'endurance': 0.8,
      'power': 1.1,
      'maintenance': 0.5
    };
    return multipliers[phase] || 1.0;
  }

  private getExperienceMultiplier(experience: string): number {
    const multipliers: { [key: string]: number } = {
      'beginner': 1.5,
      'intermediate': 1.0,
      'advanced': 0.7,
      'elite': 0.5
    };
    return multipliers[experience] || 1.0;
  }

  private getExerciseFactors(exercise: any, phase: string, userProfile: any): string[] {
    const factors: string[] = [];
    
    if (phase === 'strength') factors.push('Progressive overload', 'Low rep ranges', 'Long rest periods');
    if (phase === 'hypertrophy') factors.push('Moderate rep ranges', 'Moderate rest periods', 'Volume focus');
    if (phase === 'endurance') factors.push('High rep ranges', 'Short rest periods', 'Cardiovascular focus');
    
    if (userProfile.experience === 'beginner') factors.push('Form focus', 'Gradual progression');
    if (userProfile.consistency > 80) factors.push('High consistency', 'Regular progression');
    
    return factors;
  }

  private calculateWeeklyDeficit(nutrition: any[], userProfile: any): number {
    if (nutrition.length === 0) return 500; // Default 500 calorie deficit
    
    const recentNutrition = nutrition.slice(-7);
    const avgCalories = recentNutrition.reduce((sum, n) => sum + n.calories, 0) / recentNutrition.length;
    const tdee = userProfile.tdee || 2000;
    
    return Math.max(0, tdee - avgCalories);
  }

  private calculateWeeklyCalorieBurn(workouts: any[], userProfile: any): number {
    if (workouts.length === 0) return 0;
    
    const recentWorkouts = workouts.slice(-7);
    return recentWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  }
}

export default new PredictiveAnalyticsService();

