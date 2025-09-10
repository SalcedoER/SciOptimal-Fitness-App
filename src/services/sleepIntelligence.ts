import { UserProfile, WorkoutSession } from '../store';

export interface SleepData {
  date: string;
  sleepHours: number;
  sleepQuality: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  caffeineIntake: number; // hours before bed
  notes?: string;
}

export interface RecoveryScore {
  overall: number; // 0-100
  sleep: number; // 0-100
  stress: number; // 0-100
  readiness: number; // 0-100
  recommendations: string[];
  workoutAdjustment: {
    intensity: 'low' | 'medium' | 'high';
    duration: 'short' | 'medium' | 'long';
    focus: string;
  };
}

export interface SleepInsight {
  type: 'sleep_duration' | 'sleep_quality' | 'stress_impact' | 'caffeine_effect' | 'recovery_trend';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export class SleepIntelligenceService {
  /**
   * Calculate recovery score based on sleep data
   */
  static calculateRecoveryScore(
    recentSleep: SleepData[],
    userProfile: UserProfile,
    recentWorkouts: WorkoutSession[]
  ): RecoveryScore {
    if (recentSleep.length === 0) {
      return {
        overall: 50,
        sleep: 50,
        stress: 50,
        readiness: 50,
        recommendations: ['Start tracking your sleep to get personalized recovery insights'],
        workoutAdjustment: {
          intensity: 'medium',
          duration: 'medium',
          focus: 'General fitness'
        }
      };
    }

    const latestSleep = recentSleep[recentSleep.length - 1];
    const avgSleep = recentSleep.reduce((sum, s) => sum + s.sleepHours, 0) / recentSleep.length;
    const avgQuality = recentSleep.reduce((sum, s) => sum + s.sleepQuality, 0) / recentSleep.length;
    const avgStress = recentSleep.reduce((sum, s) => sum + s.stressLevel, 0) / recentSleep.length;

    // Calculate sleep score (0-100)
    const sleepScore = this.calculateSleepScore(latestSleep.sleepHours, latestSleep.sleepQuality);
    
    // Calculate stress score (0-100, inverted)
    const stressScore = Math.max(0, 100 - (avgStress * 10));
    
    // Calculate readiness based on recent workout load
    const workoutLoad = this.calculateWorkoutLoad(recentWorkouts);
    const readinessScore = this.calculateReadinessScore(sleepScore, stressScore, workoutLoad);
    
    // Overall recovery score
    const overallScore = Math.round((sleepScore + stressScore + readinessScore) / 3);

    // Generate recommendations
    const recommendations = this.generateRecoveryRecommendations(
      latestSleep,
      avgSleep,
      avgQuality,
      avgStress,
      workoutLoad
    );

    // Determine workout adjustment
    const workoutAdjustment = this.determineWorkoutAdjustment(overallScore, latestSleep, workoutLoad);

    return {
      overall: overallScore,
      sleep: sleepScore,
      stress: stressScore,
      readiness: readinessScore,
      recommendations,
      workoutAdjustment
    };
  }

  /**
   * Calculate sleep score based on duration and quality
   */
  private static calculateSleepScore(hours: number, quality: number): number {
    // Optimal sleep duration is 7-9 hours
    let durationScore = 0;
    if (hours >= 7 && hours <= 9) {
      durationScore = 100;
    } else if (hours >= 6 && hours < 7) {
      durationScore = 80;
    } else if (hours > 9 && hours <= 10) {
      durationScore = 90;
    } else if (hours >= 5 && hours < 6) {
      durationScore = 60;
    } else if (hours > 10) {
      durationScore = 70; // Oversleeping can be counterproductive
    } else {
      durationScore = 30; // Less than 5 hours
    }

    // Quality score (1-10 scale)
    const qualityScore = quality * 10;

    // Weighted average: 60% duration, 40% quality
    return Math.round((durationScore * 0.6) + (qualityScore * 0.4));
  }

  /**
   * Calculate workout load from recent sessions
   */
  private static calculateWorkoutLoad(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;

    const recentWorkouts = workouts.slice(-7); // Last 7 days
    const totalLoad = recentWorkouts.reduce((sum, workout) => {
      const duration = workout.duration || 0;
      const rpe = workout.rpe || 5;
      return sum + (duration * rpe);
    }, 0);

    return totalLoad / 7; // Average daily load
  }

  /**
   * Calculate readiness score
   */
  private static calculateReadinessScore(
    sleepScore: number,
    stressScore: number,
    workoutLoad: number
  ): number {
    // Base readiness from sleep and stress
    let readiness = (sleepScore + stressScore) / 2;

    // Adjust based on workout load
    if (workoutLoad > 50) {
      readiness *= 0.8; // High load reduces readiness
    } else if (workoutLoad < 20) {
      readiness *= 1.1; // Low load increases readiness
    }

    return Math.min(100, Math.max(0, Math.round(readiness)));
  }

  /**
   * Generate recovery recommendations
   */
  private static generateRecoveryRecommendations(
    latestSleep: SleepData,
    avgSleep: number,
    avgQuality: number,
    avgStress: number,
    workoutLoad: number
  ): string[] {
    const recommendations: string[] = [];

    // Sleep duration recommendations
    if (latestSleep.sleepHours < 7) {
      recommendations.push('Aim for 7-9 hours of sleep for optimal recovery');
    } else if (latestSleep.sleepHours > 9) {
      recommendations.push('Consider if oversleeping is affecting your energy levels');
    }

    // Sleep quality recommendations
    if (avgQuality < 6) {
      recommendations.push('Improve sleep quality with a consistent bedtime routine');
      recommendations.push('Avoid screens 1 hour before bed');
    }

    // Stress recommendations
    if (avgStress > 7) {
      recommendations.push('High stress detected - try meditation or deep breathing');
      recommendations.push('Consider reducing workout intensity on high-stress days');
    }

    // Caffeine recommendations
    if (latestSleep.caffeineIntake < 6) {
      recommendations.push('Avoid caffeine within 6 hours of bedtime');
    }

    // Workout load recommendations
    if (workoutLoad > 50) {
      recommendations.push('High training load - consider a deload week');
    } else if (workoutLoad < 20) {
      recommendations.push('Low training load - you can increase intensity');
    }

    return recommendations;
  }

  /**
   * Determine workout adjustment based on recovery
   */
  private static determineWorkoutAdjustment(
    recoveryScore: number,
    latestSleep: SleepData,
    workoutLoad: number
  ): { intensity: 'low' | 'medium' | 'high'; duration: 'short' | 'medium' | 'long'; focus: string } {
    if (recoveryScore >= 80) {
      return {
        intensity: 'high',
        duration: 'long',
        focus: 'Strength and power training'
      };
    } else if (recoveryScore >= 60) {
      return {
        intensity: 'medium',
        duration: 'medium',
        focus: 'Hybrid training'
      };
    } else if (recoveryScore >= 40) {
      return {
        intensity: 'low',
        duration: 'short',
        focus: 'Mobility and light cardio'
      };
    } else {
      return {
        intensity: 'low',
        duration: 'short',
        focus: 'Recovery and stretching'
      };
    }
  }

  /**
   * Generate sleep insights
   */
  static generateSleepInsights(sleepData: SleepData[]): SleepInsight[] {
    if (sleepData.length < 3) return [];

    const insights: SleepInsight[] = [];
    const recentData = sleepData.slice(-7);
    const avgSleep = recentData.reduce((sum, s) => sum + s.sleepHours, 0) / recentData.length;
    const avgQuality = recentData.reduce((sum, s) => sum + s.sleepQuality, 0) / recentData.length;
    const avgStress = recentData.reduce((sum, s) => sum + s.stressLevel, 0) / recentData.length;

    // Sleep duration insight
    if (avgSleep < 7) {
      insights.push({
        type: 'sleep_duration',
        title: 'Insufficient Sleep Duration',
        description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep, below the recommended 7-9 hours.`,
        impact: 'negative',
        recommendation: 'Try going to bed 30 minutes earlier each night',
        priority: 'high'
      });
    } else if (avgSleep > 9) {
      insights.push({
        type: 'sleep_duration',
        title: 'Excessive Sleep Duration',
        description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep, which may indicate oversleeping.`,
        impact: 'neutral',
        recommendation: 'Check if you need this much sleep or if there are underlying issues',
        priority: 'medium'
      });
    }

    // Sleep quality insight
    if (avgQuality < 6) {
      insights.push({
        type: 'sleep_quality',
        title: 'Poor Sleep Quality',
        description: `Your sleep quality is averaging ${avgQuality.toFixed(1)}/10, indicating poor rest.`,
        impact: 'negative',
        recommendation: 'Improve sleep hygiene: consistent bedtime, cool room, no screens before bed',
        priority: 'high'
      });
    }

    // Stress impact insight
    if (avgStress > 7) {
      insights.push({
        type: 'stress_impact',
        title: 'High Stress Levels',
        description: `Your stress levels are averaging ${avgStress.toFixed(1)}/10, which affects recovery.`,
        impact: 'negative',
        recommendation: 'Practice stress management: meditation, deep breathing, or yoga',
        priority: 'high'
      });
    }

    // Recovery trend insight
    const firstHalf = sleepData.slice(-14, -7);
    const secondHalf = sleepData.slice(-7);
    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.sleepHours, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.sleepHours, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 0.5) {
      insights.push({
        type: 'recovery_trend',
        title: 'Improving Sleep Pattern',
        description: 'Your sleep duration has improved over the last week - great job!',
        impact: 'positive',
        recommendation: 'Maintain this positive trend for better recovery',
        priority: 'low'
      });
    } else if (secondHalfAvg < firstHalfAvg - 0.5) {
      insights.push({
        type: 'recovery_trend',
        title: 'Declining Sleep Pattern',
        description: 'Your sleep duration has decreased over the last week.',
        impact: 'negative',
        recommendation: 'Identify what changed and address the underlying cause',
        priority: 'medium'
      });
    }

    return insights;
  }

  /**
   * Get optimal bedtime based on wake-up time and sleep needs
   */
  static getOptimalBedtime(wakeUpTime: string, targetSleepHours: number = 8): string {
    const [hours, minutes] = wakeUpTime.split(':').map(Number);
    const wakeUpMinutes = hours * 60 + minutes;
    const bedtimeMinutes = wakeUpMinutes - (targetSleepHours * 60);
    
    // Handle negative bedtime (previous day)
    const adjustedBedtimeMinutes = bedtimeMinutes < 0 ? bedtimeMinutes + (24 * 60) : bedtimeMinutes;
    
    const bedtimeHours = Math.floor(adjustedBedtimeMinutes / 60);
    const bedtimeMins = adjustedBedtimeMinutes % 60;
    
    return `${bedtimeHours.toString().padStart(2, '0')}:${bedtimeMins.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate sleep debt
   */
  static calculateSleepDebt(sleepData: SleepData[], targetHours: number = 8): number {
    if (sleepData.length === 0) return 0;

    const totalSleep = sleepData.reduce((sum, s) => sum + s.sleepHours, 0);
    const totalTarget = sleepData.length * targetHours;
    
    return totalTarget - totalSleep; // Positive = debt, negative = surplus
  }
}
