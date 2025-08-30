// Biometric Analytics Service for SciOptimal
// Processes Apple Watch data to provide advanced health insights

import { AppleWatchData, HeartRateData, HRVData, SleepData, ActivityData } from './appleWatchService';

export interface BiometricInsight {
  id: string;
  type: 'health' | 'performance' | 'recovery' | 'risk' | 'optimization';
  category: 'heart_rate' | 'hrv' | 'sleep' | 'activity' | 'oxygen' | 'ecg';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  scientificBasis: string;
  recommendations: string[];
  expectedOutcome: string;
  timeToEffect: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  isActionable: boolean;
}

export interface HealthScore {
  overall: number; // 0-100
  cardiovascular: number;
  recovery: number;
  sleep: number;
  activity: number;
  stress: number;
  trends: HealthTrend[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface HealthTrend {
  metric: string;
  current: number;
  previous: number;
  change: number; // percentage
  trend: 'improving' | 'declining' | 'stable';
  significance: 'low' | 'medium' | 'high';
}

export interface RecoveryReadiness {
  score: number; // 0-100
  status: 'ready' | 'moderate' | 'not_ready';
  factors: RecoveryFactor[];
  recommendations: string[];
  nextAssessment: Date;
}

export interface RecoveryFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  score: number; // 0-100
  description: string;
  trend: 'improving' | 'declining' | 'stable';
}

export interface StressAnalysis {
  currentLevel: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  sources: StressSource[];
  management: StressManagement[];
  recommendations: string[];
}

export interface StressSource {
  source: string;
  impact: number; // 0-100
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  controllability: 'low' | 'medium' | 'high';
}

export interface StressManagement {
  technique: string;
  effectiveness: number; // 0-100
  frequency: string;
  lastUsed: Date;
}

export interface PerformancePrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  mitigation: string[];
  monitoring: string[];
  nextAssessment: Date;
}

export interface RiskFactor {
  factor: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  impact: number; // 0-100
  description: string;
  mitigation: string[];
}

export class BiometricAnalyticsService {
  private insights: BiometricInsight[] = [];
  private healthScore: HealthScore | null = null;
  private recoveryReadiness: RecoveryReadiness | null = null;
  private stressAnalysis: StressAnalysis | null = null;

  // Analyze Apple Watch data and generate insights
  analyzeBiometricData(watchData: AppleWatchData): {
    insights: BiometricInsight[];
    healthScore: HealthScore;
    recoveryReadiness: RecoveryReadiness;
    stressAnalysis: StressAnalysis;
    performancePredictions: PerformancePrediction[];
    riskAssessment: RiskAssessment;
  } {
    // Generate insights for each biometric category
    const heartRateInsights = this.analyzeHeartRate(watchData.heartRate);
    const hrvInsights = this.analyzeHRV(watchData.heartRateVariability);
    const sleepInsights = this.analyzeSleep(watchData.sleep);
    const activityInsights = this.analyzeActivity(watchData.activity);
    const oxygenInsights = this.analyzeOxygen(watchData.oxygenSaturation);
    const ecgInsights = this.analyzeECG(watchData.ecg);

    // Combine all insights
    this.insights = [
      ...heartRateInsights,
      ...hrvInsights,
      ...sleepInsights,
      ...activityInsights,
      ...oxygenInsights,
      ...ecgInsights
    ];

    // Calculate overall health metrics
    this.healthScore = this.calculateHealthScore(watchData);
    this.recoveryReadiness = this.calculateRecoveryReadiness(watchData);
    this.stressAnalysis = this.analyzeStress(watchData);
    
    const performancePredictions = this.predictPerformance(watchData);
    const riskAssessment = this.assessRisk(watchData);

    return {
      insights: this.insights,
      healthScore: this.healthScore,
      recoveryReadiness: this.recoveryReadiness,
      stressAnalysis: this.stressAnalysis,
      performancePredictions,
      riskAssessment
    };
  }

  // Analyze heart rate data
  private analyzeHeartRate(heartRate: HeartRateData): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    // Resting heart rate analysis
    if (heartRate.resting > 70) {
      insights.push({
        id: `hr_${Date.now()}_1`,
        type: 'health',
        category: 'heart_rate',
        title: 'Elevated Resting Heart Rate',
        description: `Your resting heart rate of ${heartRate.resting} BPM is above the optimal range (60-70 BPM).`,
        severity: 'medium',
        confidence: 85,
        scientificBasis: 'Elevated resting heart rate is associated with increased cardiovascular risk and reduced fitness.',
        recommendations: [
          'Increase cardiovascular exercise frequency',
          'Practice stress management techniques',
          'Ensure adequate sleep and recovery',
          'Consider consulting a healthcare provider if consistently elevated'
        ],
        expectedOutcome: 'Gradual reduction in resting heart rate over 4-8 weeks',
        timeToEffect: '4-8 weeks',
        priority: 'medium',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Heart rate variability analysis
    if (heartRate.trend === 'decreasing') {
      insights.push({
        id: `hr_${Date.now()}_2`,
        type: 'recovery',
        category: 'heart_rate',
        title: 'Declining Heart Rate Trend',
        description: 'Your heart rate trend is decreasing, which may indicate overtraining or insufficient recovery.',
        severity: 'medium',
        confidence: 75,
        scientificBasis: 'Decreasing heart rate trend can indicate autonomic nervous system fatigue.',
        recommendations: [
          'Reduce training intensity for 1-2 weeks',
          'Focus on active recovery activities',
          'Ensure adequate sleep and nutrition',
          'Monitor for signs of overtraining'
        ],
        expectedOutcome: 'Stabilization of heart rate and improved recovery',
        timeToEffect: '1-2 weeks',
        priority: 'high',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Heart rate zones optimization
    const aerobicZone = heartRate.zones.find(z => z.zone === 'aerobic');
    if (aerobicZone && aerobicZone.percentage < 10) {
      insights.push({
        id: `hr_${Date.now()}_3`,
        type: 'optimization',
        category: 'heart_rate',
        title: 'Low Aerobic Zone Training',
        description: `Only ${aerobicZone.percentage.toFixed(1)}% of your time is spent in the aerobic zone.`,
        severity: 'low',
        confidence: 80,
        scientificBasis: 'Aerobic training improves cardiovascular fitness and fat metabolism.',
        recommendations: [
          'Increase moderate-intensity cardio sessions',
          'Aim for 20-30 minutes in aerobic zone daily',
          'Use heart rate zones to guide training intensity',
          'Gradually build aerobic capacity'
        ],
        expectedOutcome: 'Improved cardiovascular fitness and fat metabolism',
        timeToEffect: '3-6 weeks',
        priority: 'low',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Analyze HRV data
  private analyzeHRV(hrv: HRVData): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    // Recovery readiness
    if (hrv.readiness === 'not_ready') {
      insights.push({
        id: `hrv_${Date.now()}_1`,
        type: 'recovery',
        category: 'hrv',
        title: 'Recovery Not Ready',
        description: `Your HRV of ${hrv.current}ms indicates you're not ready for intense training.`,
        severity: 'high',
        confidence: 90,
        scientificBasis: 'Low HRV indicates autonomic nervous system stress and reduced recovery capacity.',
        recommendations: [
          'Focus on light recovery activities',
          'Prioritize sleep and stress management',
          'Reduce training intensity',
          'Consider a rest day'
        ],
        expectedOutcome: 'Improved recovery and readiness for training',
        timeToEffect: '1-3 days',
        priority: 'high',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // HRV trend analysis
    if (hrv.trend === 'declining') {
      insights.push({
        id: `hrv_${Date.now()}_2`,
        type: 'health',
        category: 'hrv',
        title: 'Declining HRV Trend',
        description: 'Your HRV trend is declining, indicating increased stress or reduced recovery.',
        severity: 'medium',
        confidence: 80,
        scientificBasis: 'Declining HRV is associated with increased stress and reduced recovery capacity.',
        recommendations: [
          'Implement stress management techniques',
          'Ensure adequate sleep (7-9 hours)',
          'Practice mindfulness or meditation',
          'Consider reducing training load'
        ],
        expectedOutcome: 'Stabilization and improvement of HRV',
        timeToEffect: '1-2 weeks',
        priority: 'medium',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Analyze sleep data
  private analyzeSleep(sleep: SleepData): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    // Sleep duration analysis
    if (sleep.lastNight.duration < 7) {
      insights.push({
        id: `sleep_${Date.now()}_1`,
        type: 'recovery',
        category: 'sleep',
        title: 'Insufficient Sleep Duration',
        description: `You slept only ${sleep.lastNight.duration} hours, below the recommended 7-9 hours.`,
        severity: 'medium',
        confidence: 90,
        scientificBasis: 'Insufficient sleep impairs recovery, performance, and overall health.',
        recommendations: [
          'Aim for 7-9 hours of sleep per night',
          'Establish consistent sleep schedule',
          'Create optimal sleep environment',
          'Avoid screens 1 hour before bedtime'
        ],
        expectedOutcome: 'Improved recovery, performance, and overall health',
        timeToEffect: '1-2 weeks',
        priority: 'high',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Sleep quality analysis
    if (sleep.quality.sleepScore < 70) {
      insights.push({
        id: `sleep_${Date.now()}_2`,
        type: 'recovery',
        category: 'sleep',
        title: 'Poor Sleep Quality',
        description: `Your sleep quality score is ${sleep.quality.sleepScore}/100, indicating poor sleep quality.`,
        severity: 'medium',
        confidence: 85,
        scientificBasis: 'Poor sleep quality reduces recovery efficiency and performance.',
        recommendations: [
          'Optimize sleep environment (dark, quiet, cool)',
          'Establish relaxing bedtime routine',
          'Limit caffeine after 2 PM',
          'Consider sleep hygiene improvements'
        ],
        expectedOutcome: 'Improved sleep quality and recovery',
        timeToEffect: '1-3 weeks',
        priority: 'medium',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Deep sleep optimization
    const deepSleepPercentage = (sleep.lastNight.deepSleep / sleep.lastNight.totalSleep) * 100;
    if (deepSleepPercentage < 20) {
      insights.push({
        id: `sleep_${Date.now()}_3`,
        type: 'optimization',
        category: 'sleep',
        title: 'Low Deep Sleep Percentage',
        description: `Deep sleep represents only ${deepSleepPercentage.toFixed(1)}% of your total sleep.`,
        severity: 'low',
        confidence: 75,
        scientificBasis: 'Deep sleep is crucial for physical recovery and growth hormone release.',
        recommendations: [
          'Ensure adequate total sleep duration',
          'Maintain consistent sleep schedule',
          'Avoid alcohol before bedtime',
          'Create optimal sleep environment'
        ],
        expectedOutcome: 'Increased deep sleep percentage and better recovery',
        timeToEffect: '2-4 weeks',
        priority: 'low',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Analyze activity data
  private analyzeActivity(activity: ActivityData): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    // Step count analysis
    if (activity.steps < 8000) {
      insights.push({
        id: `activity_${Date.now()}_1`,
        type: 'health',
        category: 'activity',
        title: 'Low Daily Step Count',
        description: `You've taken ${activity.steps} steps today, below the recommended 10,000 steps.`,
        severity: 'low',
        confidence: 85,
        scientificBasis: 'Regular walking improves cardiovascular health and overall fitness.',
        recommendations: [
          'Aim for 10,000 steps daily',
          'Take walking breaks throughout the day',
          'Use stairs instead of elevators',
          'Park further from destinations'
        ],
        expectedOutcome: 'Improved cardiovascular health and daily activity',
        timeToEffect: '2-4 weeks',
        priority: 'low',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Exercise minutes analysis
    if (activity.exerciseMinutes < 30) {
      insights.push({
        id: `activity_${Date.now()}_2`,
        type: 'performance',
        category: 'activity',
        title: 'Insufficient Exercise Time',
        description: `You've exercised for ${activity.exerciseMinutes} minutes today, below the recommended 30 minutes.`,
        severity: 'medium',
        confidence: 90,
        scientificBasis: 'Regular exercise improves fitness, health, and longevity.',
        recommendations: [
          'Aim for 30 minutes of moderate exercise daily',
          'Break exercise into shorter sessions if needed',
          'Find activities you enjoy',
          'Schedule exercise time in your calendar'
        ],
        expectedOutcome: 'Improved fitness, health, and overall wellbeing',
        timeToEffect: '3-6 weeks',
        priority: 'medium',
        timestamp: new Date(),
        isActionable: true
      });
    }

    // Activity ring optimization
    const moveRing = activity.rings.move;
    if (moveRing.percentage < 50) {
      insights.push({
        id: `activity_${Date.now()}_3`,
        type: 'optimization',
        category: 'activity',
        title: 'Low Activity Ring Completion',
        description: `You've completed only ${moveRing.percentage}% of your move goal today.`,
        severity: 'low',
        confidence: 80,
        scientificBasis: 'Regular physical activity improves health and fitness.',
        recommendations: [
          'Increase daily physical activity',
          'Set realistic activity goals',
          'Track progress consistently',
          'Find enjoyable physical activities'
        ],
        expectedOutcome: 'Improved daily activity levels and health',
        timeToEffect: '1-2 weeks',
        priority: 'low',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Analyze oxygen saturation
  private analyzeOxygen(oxygen: any): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    if (oxygen.current < 95) {
      insights.push({
        id: `oxygen_${Date.now()}_1`,
        type: 'health',
        category: 'oxygen',
        title: 'Low Oxygen Saturation',
        description: `Your oxygen saturation is ${oxygen.current}%, below the normal range (95-100%).`,
        severity: 'high',
        confidence: 90,
        scientificBasis: 'Low oxygen saturation can indicate respiratory or cardiovascular issues.',
        recommendations: [
          'Consult a healthcare provider immediately',
          'Monitor oxygen levels regularly',
          'Avoid strenuous activity',
          'Consider altitude or environmental factors'
        ],
        expectedOutcome: 'Proper diagnosis and treatment of underlying cause',
        timeToEffect: 'Immediate medical attention required',
        priority: 'high',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Analyze ECG data
  private analyzeECG(ecg: any): BiometricInsight[] {
    const insights: BiometricInsight[] = [];

    if (ecg.result === 'atrial_fibrillation') {
      insights.push({
        id: `ecg_${Date.now()}_1`,
        type: 'health',
        category: 'ecg',
        title: 'Atrial Fibrillation Detected',
        description: 'Your ECG shows signs of atrial fibrillation, a serious heart rhythm disorder.',
        severity: 'critical',
        confidence: 95,
        scientificBasis: 'Atrial fibrillation requires immediate medical attention and treatment.',
        recommendations: [
          'Seek immediate medical attention',
          'Do not drive or operate machinery',
          'Follow healthcare provider instructions',
          'Monitor symptoms closely'
        ],
        expectedOutcome: 'Proper medical evaluation and treatment',
        timeToEffect: 'Immediate medical attention required',
        priority: 'high',
        timestamp: new Date(),
        isActionable: true
      });
    }

    return insights;
  }

  // Calculate overall health score
  private calculateHealthScore(watchData: AppleWatchData): HealthScore {
    const scores = {
      cardiovascular: this.calculateCardiovascularScore(watchData),
      recovery: this.calculateRecoveryScore(watchData),
      sleep: this.calculateSleepScore(watchData),
      activity: this.calculateActivityScore(watchData),
      stress: this.calculateStressScore(watchData)
    };

    const overall = Math.round(
      Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
    );

    const trends = this.calculateHealthTrends(watchData);
    const recommendations = this.generateHealthRecommendations(scores);

    return {
      overall,
      ...scores,
      trends,
      recommendations,
      lastUpdated: new Date()
    };
  }

  // Calculate cardiovascular score
  private calculateCardiovascularScore(watchData: AppleWatchData): number {
    let score = 50;

    // Heart rate factors
    if (watchData.heartRate.resting <= 60) score += 20;
    else if (watchData.heartRate.resting <= 70) score += 15;
    else if (watchData.heartRate.resting <= 80) score += 10;
    else score -= 10;

    // HRV factors
    if (watchData.heartRateVariability.current > 50) score += 15;
    else if (watchData.heartRateVariability.current > 40) score += 10;
    else score -= 10;

    // Oxygen saturation
    if (watchData.oxygenSaturation.current >= 98) score += 15;
    else if (watchData.oxygenSaturation.current >= 95) score += 10;
    else score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  // Calculate recovery score
  private calculateRecoveryScore(watchData: AppleWatchData): number {
    let score = 50;

    // HRV readiness
    if (watchData.heartRateVariability.readiness === 'ready') score += 25;
    else if (watchData.heartRateVariability.readiness === 'moderate') score += 15;
    else score -= 15;

    // Sleep quality
    if (watchData.sleep.quality.sleepScore >= 80) score += 20;
    else if (watchData.sleep.quality.sleepScore >= 70) score += 10;
    else score -= 15;

    // Sleep duration
    if (watchData.sleep.lastNight.duration >= 7) score += 10;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Calculate sleep score
  private calculateSleepScore(watchData: AppleWatchData): number {
    let score = 50;

    // Sleep duration
    if (watchData.sleep.lastNight.duration >= 8) score += 20;
    else if (watchData.sleep.lastNight.duration >= 7) score += 15;
    else if (watchData.sleep.lastNight.duration >= 6) score += 10;
    else score -= 15;

    // Sleep efficiency
    if (watchData.sleep.lastNight.efficiency >= 90) score += 20;
    else if (watchData.sleep.lastNight.efficiency >= 80) score += 15;
    else if (watchData.sleep.lastNight.efficiency >= 70) score += 10;
    else score -= 15;

    // Sleep quality
    if (watchData.sleep.quality.sleepScore >= 80) score += 10;
    else if (watchData.sleep.quality.sleepScore >= 70) score += 5;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Calculate activity score
  private calculateActivityScore(watchData: AppleWatchData): number {
    let score = 50;

    // Steps
    if (watchData.activity.steps >= 10000) score += 20;
    else if (watchData.activity.steps >= 8000) score += 15;
    else if (watchData.activity.steps >= 6000) score += 10;
    else score -= 10;

    // Exercise minutes
    if (watchData.activity.exerciseMinutes >= 45) score += 20;
    else if (watchData.activity.exerciseMinutes >= 30) score += 15;
    else if (watchData.activity.exerciseMinutes >= 20) score += 10;
    else score -= 10;

    // Activity rings
    const ringCompletion = (
      watchData.activity.rings.move.percentage +
      watchData.activity.rings.exercise.percentage +
      watchData.activity.rings.stand.percentage
    ) / 3;

    if (ringCompletion >= 80) score += 10;
    else if (ringCompletion >= 60) score += 5;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Calculate stress score
  private calculateStressScore(watchData: AppleWatchData): number {
    let score = 50;

    // HRV trend
    if (watchData.heartRateVariability.trend === 'improving') score += 20;
    else if (watchData.heartRateVariability.trend === 'stable') score += 10;
    else score -= 20;

    // Heart rate trend
    if (watchData.heartRate.trend === 'stable') score += 15;
    else if (watchData.heartRate.trend === 'decreasing') score -= 15;

    // Sleep quality
    if (watchData.sleep.quality.sleepScore >= 80) score += 15;
    else if (watchData.sleep.quality.sleepScore >= 70) score += 10;
    else score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  // Calculate health trends
  private calculateHealthTrends(watchData: AppleWatchData): HealthTrend[] {
    const trends: HealthTrend[] = [];

    // This would typically compare current data with historical data
    // For now, using mock trend data
    trends.push({
      metric: 'Resting Heart Rate',
      current: watchData.heartRate.resting,
      previous: watchData.heartRate.resting + 2,
      change: -3.2,
      trend: 'improving',
      significance: 'medium'
    });

    trends.push({
      metric: 'HRV',
      current: watchData.heartRateVariability.current,
      previous: watchData.heartRateVariability.current - 3,
      change: 7.1,
      trend: 'improving',
      significance: 'high'
    });

    return trends;
  }

  // Generate health recommendations
  private generateHealthRecommendations(scores: any): string[] {
    const recommendations: string[] = [];

    if (scores.cardiovascular < 70) {
      recommendations.push('Focus on cardiovascular health through regular exercise and stress management');
    }

    if (scores.recovery < 70) {
      recommendations.push('Prioritize recovery through adequate sleep and stress reduction');
    }

    if (scores.sleep < 70) {
      recommendations.push('Improve sleep quality through better sleep hygiene and consistent schedule');
    }

    if (scores.activity < 70) {
      recommendations.push('Increase daily physical activity and exercise frequency');
    }

    if (scores.stress < 70) {
      recommendations.push('Implement stress management techniques and recovery practices');
    }

    return recommendations;
  }

  // Calculate recovery readiness
  private calculateRecoveryReadiness(watchData: AppleWatchData): RecoveryReadiness {
    const factors: RecoveryFactor[] = [];

    // HRV factor
    factors.push({
      factor: 'Heart Rate Variability',
      impact: watchData.heartRateVariability.readiness === 'ready' ? 'positive' : 'negative',
      score: watchData.heartRateVariability.recoveryScore,
      description: `HRV indicates ${watchData.heartRateVariability.readiness} recovery status`,
      trend: watchData.heartRateVariability.trend
    });

    // Sleep factor
    factors.push({
      factor: 'Sleep Quality',
      impact: watchData.sleep.quality.sleepScore >= 70 ? 'positive' : 'negative',
      score: watchData.sleep.quality.sleepScore,
      description: `Sleep quality score: ${watchData.sleep.quality.sleepScore}/100`,
      trend: 'stable'
    });

    // Activity factor
    const activityScore = this.calculateActivityScore(watchData);
    factors.push({
      factor: 'Activity Level',
      impact: activityScore >= 70 ? 'positive' : 'negative',
      score: activityScore,
      description: `Daily activity score: ${activityScore}/100`,
      trend: 'stable'
    });

    const overallScore = Math.round(
      factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length
    );

    let status: 'ready' | 'moderate' | 'not_ready';
    if (overallScore >= 75) status = 'ready';
    else if (overallScore >= 60) status = 'moderate';
    else status = 'not_ready';

    const recommendations = this.generateRecoveryRecommendations(factors, status);

    return {
      score: overallScore,
      status,
      factors,
      recommendations,
      nextAssessment: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }

  // Generate recovery recommendations
  private generateRecoveryRecommendations(factors: RecoveryFactor[], status: string): string[] {
    const recommendations: string[] = [];

    if (status === 'not_ready') {
      recommendations.push('Focus on light recovery activities and stress management');
      recommendations.push('Ensure adequate sleep and nutrition');
      recommendations.push('Consider a rest day or very light training');
    } else if (status === 'moderate') {
      recommendations.push('Moderate training intensity with focus on recovery');
      recommendations.push('Monitor for signs of fatigue or overtraining');
      recommendations.push('Maintain good sleep and nutrition habits');
    } else {
      recommendations.push('Ready for normal training intensity');
      recommendations.push('Maintain current recovery practices');
      recommendations.push('Continue monitoring recovery metrics');
    }

    return recommendations;
  }

  // Analyze stress levels
  private analyzeStress(watchData: AppleWatchData): StressAnalysis {
    const currentLevel = this.calculateStressScore(watchData);
    
    let trend: 'increasing' | 'decreasing' | 'stable';
    if (watchData.heartRateVariability.trend === 'declining') trend = 'increasing';
    else if (watchData.heartRateVariability.trend === 'improving') trend = 'decreasing';
    else trend = 'stable';

    const sources: StressSource[] = [
      {
        source: 'Training Load',
        impact: 60,
        frequency: 'frequent',
        controllability: 'high'
      },
      {
        source: 'Sleep Quality',
        impact: 40,
        frequency: 'constant',
        controllability: 'medium'
      }
    ];

    const management: StressManagement[] = [
      {
        technique: 'Deep Breathing',
        effectiveness: 75,
        frequency: 'Daily',
        lastUsed: new Date()
      },
      {
        technique: 'Meditation',
        effectiveness: 80,
        frequency: '3x per week',
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    const recommendations = this.generateStressRecommendations(currentLevel, trend);

    return {
      currentLevel,
      trend,
      sources,
      management,
      recommendations
    };
  }

  // Generate stress recommendations
  private generateStressRecommendations(level: number, trend: string): string[] {
    const recommendations: string[] = [];

    if (level > 70) {
      recommendations.push('Implement daily stress management practices');
      recommendations.push('Consider reducing training load temporarily');
      recommendations.push('Prioritize sleep and recovery');
      recommendations.push('Practice mindfulness or meditation');
    } else if (level > 50) {
      recommendations.push('Maintain current stress management practices');
      recommendations.push('Monitor stress levels regularly');
      recommendations.push('Ensure adequate recovery between sessions');
    } else {
      recommendations.push('Continue current stress management routine');
      recommendations.push('Maintain good work-life balance');
    }

    return recommendations;
  }

  // Predict performance based on biometric data
  private predictPerformance(watchData: AppleWatchData): PerformancePrediction[] {
    const predictions: PerformancePrediction[] = [];

    // Cardiovascular performance prediction
    if (watchData.heartRateVariability.readiness === 'ready') {
      predictions.push({
        metric: 'Cardiovascular Performance',
        currentValue: 75,
        predictedValue: 85,
        timeframe: 'Next workout',
        confidence: 80,
        factors: ['High HRV', 'Good sleep quality', 'Low stress levels'],
        recommendations: ['Maintain current training intensity', 'Focus on proper form', 'Monitor for signs of fatigue']
      });
    }

    // Strength performance prediction
    if (watchData.sleep.quality.sleepScore >= 80) {
      predictions.push({
        metric: 'Strength Performance',
        currentValue: 70,
        predictedValue: 80,
        timeframe: 'Next strength session',
        confidence: 75,
        factors: ['Good sleep quality', 'Adequate recovery time', 'Stable heart rate'],
        recommendations: ['Aim for progressive overload', 'Maintain proper form', 'Ensure adequate rest between sets']
      });
    }

    return predictions;
  }

  // Assess health risks
  private assessRisk(watchData: AppleWatchData): RiskAssessment {
    const riskFactors: RiskFactor[] = [];

    // Heart rate risk
    if (watchData.heartRate.resting > 80) {
      riskFactors.push({
        factor: 'Elevated Resting Heart Rate',
        risk: 'medium',
        impact: 60,
        description: 'Resting heart rate above normal range',
        mitigation: ['Increase cardiovascular exercise', 'Reduce stress', 'Improve sleep quality']
      });
    }

    // Oxygen saturation risk
    if (watchData.oxygenSaturation.current < 95) {
      riskFactors.push({
        factor: 'Low Oxygen Saturation',
        risk: 'high',
        impact: 80,
        description: 'Oxygen levels below normal range',
        mitigation: ['Seek medical attention', 'Monitor levels regularly', 'Avoid strenuous activity']
      });
    }

    // Sleep risk
    if (watchData.sleep.quality.sleepScore < 60) {
      riskFactors.push({
        factor: 'Poor Sleep Quality',
        risk: 'medium',
        impact: 50,
        description: 'Sleep quality significantly below optimal',
        mitigation: ['Improve sleep hygiene', 'Establish consistent schedule', 'Create optimal environment']
      });
    }

    // Calculate overall risk
    let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let riskScore = 0;

    riskFactors.forEach(factor => {
      if (factor.risk === 'critical') riskScore += 25;
      else if (factor.risk === 'high') riskScore += 20;
      else if (factor.risk === 'medium') riskScore += 15;
      else riskScore += 5;
    });

    if (riskScore >= 60) overallRisk = 'critical';
    else if (riskScore >= 40) overallRisk = 'high';
    else if (riskScore >= 20) overallRisk = 'medium';

    const mitigation = this.generateRiskMitigation(riskFactors);
    const monitoring = this.generateRiskMonitoring(riskFactors);

    return {
      overallRisk,
      riskScore: Math.min(100, riskScore),
      riskFactors,
      mitigation,
      monitoring,
      nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    };
  }

  // Generate risk mitigation strategies
  private generateRiskMitigation(riskFactors: RiskFactor[]): string[] {
    const mitigation: string[] = [];

    riskFactors.forEach(factor => {
      mitigation.push(...factor.mitigation);
    });

    // Add general risk mitigation
    mitigation.push('Regular health check-ups');
    mitigation.push('Maintain healthy lifestyle habits');
    mitigation.push('Monitor biometric data regularly');

    return [...new Set(mitigation)]; // Remove duplicates
  }

  // Generate risk monitoring strategies
  private generateRiskMonitoring(riskFactors: RiskFactor[]): string[] {
    const monitoring: string[] = [];

    riskFactors.forEach(factor => {
      if (factor.risk === 'high' || factor.risk === 'critical') {
        monitoring.push(`Monitor ${factor.factor} daily`);
      } else {
        monitoring.push(`Monitor ${factor.factor} weekly`);
      }
    });

    monitoring.push('Track trends over time');
    monitoring.push('Document any changes or symptoms');
    monitoring.push('Consult healthcare provider if concerns arise');

    return monitoring;
  }

  // Get all insights
  getInsights(): BiometricInsight[] {
    return this.insights;
  }

  // Get health score
  getHealthScore(): HealthScore | null {
    return this.healthScore;
  }

  // Get recovery readiness
  getRecoveryReadiness(): RecoveryReadiness | null {
    return this.recoveryReadiness;
  }

  // Get stress analysis
  getStressAnalysis(): StressAnalysis | null {
    return this.stressAnalysis;
  }

  // Get insights by category
  getInsightsByCategory(category: string): BiometricInsight[] {
    return this.insights.filter(insight => insight.category === category);
  }

  // Get insights by severity
  getInsightsBySeverity(severity: string): BiometricInsight[] {
    return this.insights.filter(insight => insight.severity === severity);
  }

  // Get actionable insights
  getActionableInsights(): BiometricInsight[] {
    return this.insights.filter(insight => insight.isActionable);
  }

  // Get high priority insights
  getHighPriorityInsights(): BiometricInsight[] {
    return this.insights.filter(insight => insight.priority === 'high');
  }
}

export default new BiometricAnalyticsService();

