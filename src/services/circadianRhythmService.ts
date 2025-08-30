// Advanced Circadian Rhythm Optimization Service
// Provides personalized training timing based on sleep patterns and chronotype

export interface Chronotype {
  type: 'early_bird' | 'night_owl' | 'intermediate';
  peakPerformanceWindow: {
    start: string; // 24-hour format
    end: string;
    intensity: 'high' | 'medium' | 'low';
  };
  optimalTrainingTimes: {
    strength: string[];
    cardio: string[];
    flexibility: string[];
    recovery: string[];
  };
  sleepOptimization: {
    recommendedBedtime: string;
    recommendedWakeTime: string;
    sleepDuration: number;
    lightExposure: string[];
  };
}

export interface CircadianAnalysis {
  chronotype: Chronotype;
  currentSleepPattern: SleepPattern;
  recommendations: CircadianRecommendation[];
  performancePrediction: PerformancePrediction;
  optimizationScore: number; // 0-100
}

export interface SleepPattern {
  averageBedtime: string;
  averageWakeTime: string;
  averageDuration: number;
  consistency: number; // 0-100
  quality: number; // 0-100
  lightExposure: {
    morning: number; // minutes
    evening: number; // minutes
  };
}

export interface CircadianRecommendation {
  type: 'training_timing' | 'sleep_optimization' | 'light_exposure' | 'meal_timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  scientificBasis: string;
  implementation: string[];
  expectedBenefit: string;
}

export interface PerformancePrediction {
  optimalTrainingTime: string;
  expectedPerformance: number; // 0-100
  factors: string[];
  recommendations: string[];
}

export class CircadianRhythmService {
  private userChronotype: Chronotype | null = null;
  private sleepData: SleepPattern[] = [];

  // Determine user chronotype based on sleep patterns
  analyzeChronotype(sleepData: SleepPattern[]): Chronotype {
    if (sleepData.length < 7) {
      return this.getDefaultChronotype();
    }

    const avgBedtime = this.calculateAverageBedtime(sleepData);
    const avgWakeTime = this.calculateAverageWakeTime(sleepData);
    
    let chronotype: Chronotype;
    
    if (avgBedtime <= '22:00' && avgWakeTime <= '06:00') {
      chronotype = this.createEarlyBirdChronotype();
    } else if (avgBedtime >= '00:00' && avgWakeTime >= '08:00') {
      chronotype = this.createNightOwlChronotype();
    } else {
      chronotype = this.createIntermediateChronotype();
    }

    // Customize based on actual sleep data
    chronotype.sleepOptimization.recommendedBedtime = avgBedtime;
    chronotype.sleepOptimization.recommendedWakeTime = avgWakeTime;
    chronotype.sleepOptimization.sleepDuration = this.calculateOptimalSleepDuration(sleepData);

    return chronotype;
  }

  // Generate personalized circadian recommendations
  generateCircadianRecommendations(
    chronotype: Chronotype,
    sleepPattern: SleepPattern,
    currentGoals: string[]
  ): CircadianRecommendation[] {
    const recommendations: CircadianRecommendation[] = [];

    // Training timing recommendations
    if (currentGoals.includes('strength') || currentGoals.includes('muscle_gain')) {
      recommendations.push({
        type: 'training_timing',
        priority: 'high',
        title: 'Optimize Strength Training Timing',
        description: `Schedule your strength training during your peak performance window (${chronotype.peakPerformanceWindow.start} - ${chronotype.peakPerformanceWindow.end}) for maximum gains.`,
        scientificBasis: 'Research shows strength training during peak circadian performance windows can increase muscle protein synthesis by 15-20%.',
        implementation: [
          `Move strength training to ${chronotype.optimalTrainingTimes.strength[0]}`,
          'Ensure adequate sleep the night before',
          'Consume protein-rich meal 2-3 hours before training'
        ],
        expectedBenefit: '15-20% increase in strength gains and muscle protein synthesis'
      });
    }

    // Sleep optimization recommendations
    if (sleepPattern.consistency < 80) {
      recommendations.push({
        type: 'sleep_optimization',
        priority: 'high',
        title: 'Improve Sleep Consistency',
        description: 'Your sleep schedule varies significantly, which can negatively impact performance and recovery.',
        scientificBasis: 'Sleep consistency is more important than sleep duration for athletic performance and recovery.',
        implementation: [
          `Go to bed at ${chronotype.sleepOptimization.recommendedBedtime} ±30 minutes`,
          `Wake up at ${chronotype.sleepOptimization.recommendedWakeTime} ±30 minutes`,
          'Avoid screens 1 hour before bedtime',
          'Create a relaxing bedtime routine'
        ],
        expectedBenefit: 'Improved recovery, better performance, and enhanced muscle growth'
      });
    }

    // Light exposure recommendations
    if (sleepPattern.lightExposure.morning < 30) {
      recommendations.push({
        type: 'light_exposure',
        priority: 'medium',
        title: 'Increase Morning Light Exposure',
        description: 'Getting natural light exposure in the morning helps regulate your circadian rhythm and improves sleep quality.',
        scientificBasis: 'Morning light exposure suppresses melatonin production and advances your circadian phase, leading to better sleep.',
        implementation: [
          'Spend 20-30 minutes outside within 1 hour of waking',
          'Open curtains immediately upon waking',
          'Consider a light therapy lamp if natural light is limited',
          'Take morning walks or exercise outdoors'
        ],
        expectedBenefit: 'Better sleep quality, improved mood, and enhanced daytime alertness'
      });
    }

    // Meal timing recommendations
    if (chronotype.type === 'early_bird') {
      recommendations.push({
        type: 'meal_timing',
        priority: 'medium',
        title: 'Optimize Meal Timing for Early Bird Schedule',
        description: 'As an early bird, your metabolism peaks earlier in the day. Adjust meal timing accordingly.',
        scientificBasis: 'Early birds have earlier peaks in cortisol and metabolism, making morning nutrition more critical.',
        implementation: [
          'Consume 30% of daily calories at breakfast',
          'Eat dinner at least 3 hours before bedtime',
          'Include protein in every meal, especially breakfast',
          'Consider intermittent fasting with early eating window'
        ],
        expectedBenefit: 'Better energy throughout the day, improved metabolism, and enhanced recovery'
      });
    }

    return recommendations;
  }

  // Predict performance based on circadian rhythm
  predictPerformance(
    chronotype: Chronotype,
    proposedTime: string,
    sleepQuality: number
  ): PerformancePrediction {
    const time = new Date(`2000-01-01 ${proposedTime}`);
    const peakStart = new Date(`2000-01-01 ${chronotype.peakPerformanceWindow.start}`);
    const peakEnd = new Date(`2000-01-01 ${chronotype.peakPerformanceWindow.end}`);

    let performanceScore = 50; // Base score
    let factors: string[] = [];
    let recommendations: string[] = [];

    // Time-based scoring
    if (time >= peakStart && time <= peakEnd) {
      performanceScore += 30;
      factors.push('Training during peak performance window');
    } else if (Math.abs(time.getTime() - peakStart.getTime()) < 2 * 60 * 60 * 1000) {
      performanceScore += 15;
      factors.push('Training near peak performance window');
    } else {
      performanceScore -= 20;
      factors.push('Training outside optimal time window');
      recommendations.push(`Consider moving training to ${chronotype.peakPerformanceWindow.start} - ${chronotype.peakPerformanceWindow.end}`);
    }

    // Sleep quality impact
    if (sleepQuality >= 8) {
      performanceScore += 15;
      factors.push('Excellent sleep quality');
    } else if (sleepQuality >= 6) {
      performanceScore += 5;
      factors.push('Good sleep quality');
    } else {
      performanceScore -= 10;
      factors.push('Poor sleep quality');
      recommendations.push('Prioritize sleep hygiene and consistency');
    }

    // Chronotype-specific adjustments
    if (chronotype.type === 'early_bird' && time.getHours() < 12) {
      performanceScore += 10;
      factors.push('Early bird advantage in morning training');
    } else if (chronotype.type === 'night_owl' && time.getHours() >= 18) {
      performanceScore += 10;
      factors.push('Night owl advantage in evening training');
    }

    performanceScore = Math.max(0, Math.min(100, performanceScore));

    return {
      optimalTrainingTime: chronotype.peakPerformanceWindow.start,
      expectedPerformance: performanceScore,
      factors,
      recommendations
    };
  }

  // Calculate circadian optimization score
  calculateOptimizationScore(
    chronotype: Chronotype,
    sleepPattern: SleepPattern,
    adherence: number
  ): number {
    let score = 50; // Base score

    // Sleep consistency (30% weight)
    score += (sleepPattern.consistency / 100) * 30;

    // Sleep quality (25% weight)
    score += (sleepPattern.quality / 100) * 25;

    // Adherence to recommendations (25% weight)
    score += (adherence / 100) * 25;

    // Light exposure optimization (20% weight)
    const lightScore = Math.min(100, (sleepPattern.lightExposure.morning / 30) * 100);
    score += (lightScore / 100) * 20;

    return Math.round(score);
  }

  // Private helper methods
  private getDefaultChronotype(): Chronotype {
    return this.createIntermediateChronotype();
  }

  private createEarlyBirdChronotype(): Chronotype {
    return {
      type: 'early_bird',
      peakPerformanceWindow: {
        start: '06:00',
        end: '10:00',
        intensity: 'high'
      },
      optimalTrainingTimes: {
        strength: ['06:00', '07:00', '08:00'],
        cardio: ['06:30', '07:30', '08:30'],
        flexibility: ['05:30', '06:30', '07:30'],
        recovery: ['20:00', '21:00']
      },
      sleepOptimization: {
        recommendedBedtime: '21:30',
        recommendedWakeTime: '05:30',
        sleepDuration: 8,
        lightExposure: ['05:30-07:00', 'Avoid evening bright light']
      }
    };
  }

  private createNightOwlChronotype(): Chronotype {
    return {
      type: 'night_owl',
      peakPerformanceWindow: {
        start: '18:00',
        end: '22:00',
        intensity: 'high'
      },
      optimalTrainingTimes: {
        strength: ['18:00', '19:00', '20:00'],
        cardio: ['18:30', '19:30', '20:30'],
        flexibility: ['17:30', '18:30', '19:30'],
        recovery: ['22:00', '23:00']
      },
      sleepOptimization: {
        recommendedBedtime: '00:30',
        recommendedWakeTime: '08:30',
        sleepDuration: 8,
        lightExposure: ['08:30-10:00', 'Minimize evening blue light']
      }
    };
  }

  private createIntermediateChronotype(): Chronotype {
    return {
      type: 'intermediate',
      peakPerformanceWindow: {
        start: '08:00',
        end: '12:00',
        intensity: 'high'
      },
      optimalTrainingTimes: {
        strength: ['08:00', '09:00', '10:00', '17:00', '18:00'],
        cardio: ['08:30', '09:30', '10:30', '17:30', '18:30'],
        flexibility: ['07:30', '08:30', '09:30', '16:30', '17:30'],
        recovery: ['19:00', '20:00', '21:00']
      },
      sleepOptimization: {
        recommendedBedtime: '22:30',
        recommendedWakeTime: '06:30',
        sleepDuration: 8,
        lightExposure: ['06:30-08:00', 'Moderate evening light exposure']
      }
    };
  }

  private calculateAverageBedtime(sleepData: SleepPattern[]): string {
    const bedtimes = sleepData.map(s => new Date(`2000-01-01 ${s.averageBedtime}`));
    const avgTime = bedtimes.reduce((sum, time) => sum + time.getTime(), 0) / bedtimes.length;
    const avgDate = new Date(avgTime);
    return avgDate.toTimeString().slice(0, 5);
  }

  private calculateAverageWakeTime(sleepData: SleepPattern[]): string {
    const wakeTimes = sleepData.map(s => new Date(`2000-01-01 ${s.averageWakeTime}`));
    const avgTime = wakeTimes.reduce((sum, time) => sum + time.getTime(), 0) / wakeTimes.length;
    const avgDate = new Date(avgTime);
    return avgDate.toTimeString().slice(0, 5);
  }

  private calculateOptimalSleepDuration(sleepData: SleepPattern[]): number {
    const durations = sleepData.map(s => s.averageDuration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    return Math.round(avgDuration);
  }
}

export default new CircadianRhythmService();

