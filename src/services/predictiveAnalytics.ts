import { UserProfile, WorkoutSession, NutritionEntry } from '../store';

export interface Prediction {
  type: 'goal_achievement' | 'plateau_warning' | 'overtraining_risk' | 'nutrition_optimization' | 'sleep_impact';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actionItems: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface TrendAnalysis {
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

export interface PerformancePrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  factors: string[];
}

export class PredictiveAnalyticsService {
  /**
   * Analyze workout performance trends
   */
  static analyzeWorkoutTrends(workoutHistory: WorkoutSession[]): TrendAnalysis[] {
    if (workoutHistory.length < 3) return [];

    const trends: TrendAnalysis[] = [];
    const recentWorkouts = workoutHistory.slice(-10); // Last 10 workouts
    const olderWorkouts = workoutHistory.slice(-20, -10); // Previous 10 workouts

    // Analyze workout frequency
    const recentFrequency = recentWorkouts.length / 7; // workouts per week
    const olderFrequency = olderWorkouts.length / 7;
    const frequencyChange = ((recentFrequency - olderFrequency) / olderFrequency) * 100;

    trends.push({
      metric: 'Workout Frequency',
      currentValue: recentFrequency,
      previousValue: olderFrequency,
      changePercent: frequencyChange,
      trend: frequencyChange > 5 ? 'increasing' : frequencyChange < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(frequencyChange) > 20 ? 'high' : Math.abs(frequencyChange) > 10 ? 'medium' : 'low'
    });

    // Analyze average workout duration
    const recentDuration = recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / recentWorkouts.length;
    const olderDuration = olderWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / olderWorkouts.length;
    const durationChange = ((recentDuration - olderDuration) / olderDuration) * 100;

    trends.push({
      metric: 'Average Workout Duration',
      currentValue: recentDuration,
      previousValue: olderDuration,
      changePercent: durationChange,
      trend: durationChange > 5 ? 'increasing' : durationChange < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(durationChange) > 15 ? 'high' : Math.abs(durationChange) > 8 ? 'medium' : 'low'
    });

    // Analyze average RPE
    const recentRPE = recentWorkouts.reduce((sum, w) => sum + (w.rpe || 0), 0) / recentWorkouts.length;
    const olderRPE = olderWorkouts.reduce((sum, w) => sum + (w.rpe || 0), 0) / olderWorkouts.length;
    const rpeChange = ((recentRPE - olderRPE) / olderRPE) * 100;

    trends.push({
      metric: 'Average RPE',
      currentValue: recentRPE,
      previousValue: olderRPE,
      changePercent: rpeChange,
      trend: rpeChange > 5 ? 'increasing' : rpeChange < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(rpeChange) > 10 ? 'high' : Math.abs(rpeChange) > 5 ? 'medium' : 'low'
    });

    return trends;
  }

  /**
   * Analyze nutrition trends
   */
  static analyzeNutritionTrends(nutritionLog: NutritionEntry[]): TrendAnalysis[] {
    if (nutritionLog.length < 7) return [];

    const trends: TrendAnalysis[] = [];
    const recentDays = 7;
    const recentNutrition = nutritionLog.slice(-recentDays);
    const olderNutrition = nutritionLog.slice(-recentDays * 2, -recentDays);

    // Analyze daily calorie intake
    const recentCalories = recentNutrition.reduce((sum, n) => sum + n.calories, 0) / recentDays;
    const olderCalories = olderNutrition.reduce((sum, n) => sum + n.calories, 0) / recentDays;
    const calorieChange = ((recentCalories - olderCalories) / olderCalories) * 100;

    trends.push({
      metric: 'Daily Calorie Intake',
      currentValue: recentCalories,
      previousValue: olderCalories,
      changePercent: calorieChange,
      trend: calorieChange > 5 ? 'increasing' : calorieChange < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(calorieChange) > 15 ? 'high' : Math.abs(calorieChange) > 8 ? 'medium' : 'low'
    });

    // Analyze protein intake
    const recentProtein = recentNutrition.reduce((sum, n) => sum + n.protein, 0) / recentDays;
    const olderProtein = olderNutrition.reduce((sum, n) => sum + n.protein, 0) / recentDays;
    const proteinChange = ((recentProtein - olderProtein) / olderProtein) * 100;

    trends.push({
      metric: 'Daily Protein Intake',
      currentValue: recentProtein,
      previousValue: olderProtein,
      changePercent: proteinChange,
      trend: proteinChange > 5 ? 'increasing' : proteinChange < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(proteinChange) > 20 ? 'high' : Math.abs(proteinChange) > 10 ? 'medium' : 'low'
    });

    return trends;
  }

  /**
   * Generate predictions based on current data
   */
  static generatePredictions(
    userProfile: UserProfile,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[]
  ): Prediction[] {
    const predictions: Prediction[] = [];

    // Goal achievement prediction
    const goalPrediction = this.predictGoalAchievement(userProfile, workoutHistory, nutritionLog);
    if (goalPrediction) predictions.push(goalPrediction);

    // Plateau warning
    const plateauWarning = this.detectPlateau(workoutHistory);
    if (plateauWarning) predictions.push(plateauWarning);

    // Overtraining risk
    const overtrainingRisk = this.assessOvertrainingRisk(workoutHistory);
    if (overtrainingRisk) predictions.push(overtrainingRisk);

    // Nutrition optimization
    const nutritionOptimization = this.analyzeNutritionOptimization(userProfile, nutritionLog);
    if (nutritionOptimization) predictions.push(nutritionOptimization);

    return predictions;
  }

  /**
   * Predict when user will achieve their goal
   */
  private static predictGoalAchievement(
    userProfile: UserProfile,
    workoutHistory: WorkoutSession[],
    nutritionLog: NutritionEntry[]
  ): Prediction | null {
    if (!userProfile.goalWeight || workoutHistory.length < 4) return null;

    const currentWeight = userProfile.weight;
    const goalWeight = userProfile.goalWeight;
    const weightDifference = Math.abs(currentWeight - goalWeight);

    if (weightDifference < 1) return null; // Already at goal

    // Calculate average weekly weight change based on recent data
    const recentWorkouts = workoutHistory.slice(-8); // Last 8 workouts (2 weeks)
    const workoutFrequency = recentWorkouts.length / 2; // workouts per week

    // Estimate weight change rate based on workout frequency and nutrition
    const avgCalories = nutritionLog.slice(-7).reduce((sum, n) => sum + n.calories, 0) / 7;
    const tdee = this.calculateTDEE(userProfile);
    const calorieDeficit = tdee - avgCalories;

    // Rough estimation: 1kg = 7700 calories
    const weeklyWeightChange = (calorieDeficit * 7) / 7700;
    const weeksToGoal = Math.abs(weightDifference / weeklyWeightChange);

    if (weeksToGoal > 52 || weeksToGoal < 1) return null; // Unrealistic timeframe

    return {
      type: 'goal_achievement',
      title: 'Goal Achievement Prediction',
      description: `Based on your current progress, you're on track to reach your goal weight in ${Math.round(weeksToGoal)} weeks.`,
      confidence: Math.min(0.9, Math.max(0.6, 1 - (Math.abs(weeklyWeightChange) - 0.5) / 2)),
      timeframe: `${Math.round(weeksToGoal)} weeks`,
      actionItems: [
        'Maintain current workout frequency',
        'Keep tracking nutrition consistently',
        'Monitor progress weekly'
      ],
      priority: 'medium'
    };
  }

  /**
   * Detect potential plateau
   */
  private static detectPlateau(workoutHistory: WorkoutSession[]): Prediction | null {
    if (workoutHistory.length < 6) return null;

    const recentWorkouts = workoutHistory.slice(-6);
    const olderWorkouts = workoutHistory.slice(-12, -6);

    // Check if workout frequency has decreased
    const recentFrequency = recentWorkouts.length / 3; // per week
    const olderFrequency = olderWorkouts.length / 3;
    const frequencyDrop = ((olderFrequency - recentFrequency) / olderFrequency) * 100;

    if (frequencyDrop > 25) {
      return {
        type: 'plateau_warning',
        title: 'Workout Frequency Drop Detected',
        description: `Your workout frequency has decreased by ${Math.round(frequencyDrop)}% in the last 3 weeks. This may lead to a plateau.`,
        confidence: 0.8,
        timeframe: 'Last 3 weeks',
        actionItems: [
          'Increase workout frequency to 3-4 times per week',
          'Try new exercises to break monotony',
          'Focus on progressive overload'
        ],
        priority: 'high'
      };
    }

    return null;
  }

  /**
   * Assess overtraining risk
   */
  private static assessOvertrainingRisk(workoutHistory: WorkoutSession[]): Prediction | null {
    if (workoutHistory.length < 7) return null;

    const recentWorkouts = workoutHistory.slice(-7);
    const avgRPE = recentWorkouts.reduce((sum, w) => sum + (w.rpe || 0), 0) / recentWorkouts.length;
    const workoutFrequency = recentWorkouts.length / 7;

    // High frequency + high RPE = overtraining risk
    if (workoutFrequency > 5 && avgRPE > 8) {
      return {
        type: 'overtraining_risk',
        title: 'Overtraining Risk Detected',
        description: `You're working out ${Math.round(workoutFrequency)} times per week with an average RPE of ${avgRPE.toFixed(1)}. Consider adding rest days.`,
        confidence: 0.75,
        timeframe: 'Current week',
        actionItems: [
          'Add 1-2 rest days this week',
          'Reduce workout intensity (RPE 6-7)',
          'Focus on recovery and sleep'
        ],
        priority: 'high'
      };
    }

    return null;
  }

  /**
   * Analyze nutrition optimization opportunities
   */
  private static analyzeNutritionOptimization(
    userProfile: UserProfile,
    nutritionLog: NutritionEntry[]
  ): Prediction | null {
    if (nutritionLog.length < 7) return null;

    const recentNutrition = nutritionLog.slice(-7);
    const avgProtein = recentNutrition.reduce((sum, n) => sum + n.protein, 0) / 7;
    const avgCalories = recentNutrition.reduce((sum, n) => sum + n.calories, 0) / 7;

    const targetProtein = userProfile.weight * 2; // 2g per kg
    const proteinDeficit = targetProtein - avgProtein;

    if (proteinDeficit > 20) {
      return {
        type: 'nutrition_optimization',
        title: 'Protein Intake Optimization',
        description: `Your protein intake is ${Math.round(proteinDeficit)}g below the recommended ${Math.round(targetProtein)}g per day for your goals.`,
        confidence: 0.9,
        timeframe: 'Last 7 days',
        actionItems: [
          'Add protein-rich foods to each meal',
          'Consider a protein shake post-workout',
          'Include lean meats, eggs, or legumes'
        ],
        priority: 'medium'
      };
    }

    return null;
  }

  /**
   * Calculate TDEE (simplified)
   */
  private static calculateTDEE(userProfile: UserProfile): number {
    const bmr = 10 * userProfile.weight + 6.25 * (userProfile.height * 2.54) - 5 * userProfile.age + 5;
    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725
    };
    return bmr * (activityMultipliers[userProfile.activityLevel] || 1.55);
  }

  /**
   * Generate performance predictions
   */
  static generatePerformancePredictions(
    userProfile: UserProfile,
    workoutHistory: WorkoutSession[]
  ): PerformancePrediction[] {
    const predictions: PerformancePrediction[] = [];

    if (workoutHistory.length < 4) return predictions;

    // Predict workout frequency for next month
    const recentFrequency = workoutHistory.slice(-14).length / 2; // workouts per week
    const predictedFrequency = recentFrequency * 0.95; // Slight decrease assumption

    predictions.push({
      metric: 'Workout Frequency',
      currentValue: recentFrequency,
      predictedValue: predictedFrequency,
      timeframe: 'Next 4 weeks',
      confidence: 0.7,
      factors: ['Current consistency', 'Historical patterns', 'Seasonal trends']
    });

    // Predict strength gains (simplified)
    const recentRPE = workoutHistory.slice(-4).reduce((sum, w) => sum + (w.rpe || 0), 0) / 4;
    const predictedRPE = Math.min(10, recentRPE + 0.5); // Gradual improvement

    predictions.push({
      metric: 'Average RPE',
      currentValue: recentRPE,
      predictedValue: predictedRPE,
      timeframe: 'Next 4 weeks',
      confidence: 0.6,
      factors: ['Progressive overload', 'Recovery optimization', 'Consistency']
    });

    return predictions;
  }
}
