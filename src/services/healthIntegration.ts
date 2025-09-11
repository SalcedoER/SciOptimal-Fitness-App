import { UserProfile } from '../store';

export interface HealthData {
  heartRate: {
    resting: number;
    max: number;
    current: number;
    zones: {
      fatBurn: { min: number; max: number };
      cardio: { min: number; max: number };
      peak: { min: number; max: number };
    };
  };
  steps: {
    today: number;
    weekly: number;
    goal: number;
  };
  calories: {
    burned: number;
    goal: number;
  };
  sleep: {
    duration: number;
    quality: number;
    deep: number;
    rem: number;
    light: number;
  };
  weight: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bloodGlucose?: number;
  hydration: {
    today: number;
    goal: number;
  };
}

export interface HealthInsight {
  type: 'heart_rate' | 'steps' | 'sleep' | 'weight' | 'hydration' | 'blood_pressure';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  trend: 'improving' | 'declining' | 'stable';
}

export interface DeviceConnection {
  name: string;
  type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health';
  connected: boolean;
  lastSync: Date;
  dataTypes: string[];
}

export class HealthIntegrationService {
  private static devices: DeviceConnection[] = [
    {
      name: 'Apple Health',
      type: 'apple_health',
      connected: false,
      lastSync: new Date(),
      dataTypes: ['heart_rate', 'steps', 'sleep', 'weight', 'blood_pressure']
    },
    {
      name: 'Google Fit',
      type: 'google_fit',
      connected: false,
      lastSync: new Date(),
      dataTypes: ['heart_rate', 'steps', 'sleep', 'weight']
    },
    {
      name: 'Fitbit',
      type: 'fitbit',
      connected: false,
      lastSync: new Date(),
      dataTypes: ['heart_rate', 'steps', 'sleep', 'weight', 'hydration']
    }
  ];

  /**
   * Get available health devices
   */
  static getAvailableDevices(): DeviceConnection[] {
    return this.devices;
  }

  /**
   * Connect to a health device
   */
  static async connectDevice(deviceType: string): Promise<boolean> {
    // Simulate device connection
    const device = this.devices.find(d => d.type === deviceType);
    if (device) {
      device.connected = true;
      device.lastSync = new Date();
      return true;
    }
    return false;
  }

  /**
   * Disconnect from a health device
   */
  static disconnectDevice(deviceType: string): boolean {
    const device = this.devices.find(d => d.type === deviceType);
    if (device) {
      device.connected = false;
      return true;
    }
    return false;
  }

  /**
   * Sync health data from connected devices
   */
  static async syncHealthData(): Promise<HealthData> {
    // Simulate syncing data from connected devices
    const connectedDevices = this.devices.filter(d => d.connected);
    
    if (connectedDevices.length === 0) {
      return this.getMockHealthData();
    }

    // In a real implementation, this would fetch data from actual health APIs
    return this.getMockHealthData();
  }

  /**
   * Get mock health data for demonstration
   */
  private static getMockHealthData(): HealthData {
    const restingHR = 65;
    const maxHR = 220 - 30; // Assuming 30 years old
    
    return {
      heartRate: {
        resting: restingHR,
        max: maxHR,
        current: 72,
        zones: {
          fatBurn: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
          cardio: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
          peak: { min: Math.round(maxHR * 0.8), max: maxHR }
        }
      },
      steps: {
        today: 8542,
        weekly: 59894,
        goal: 10000
      },
      calories: {
        burned: 2340,
        goal: 2500
      },
      sleep: {
        duration: 7.5,
        quality: 8.2,
        deep: 1.8,
        rem: 1.5,
        light: 4.2
      },
      weight: {
        current: 75.2,
        trend: 'down',
        change: -0.3
      },
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      bloodGlucose: 95,
      hydration: {
        today: 2.1,
        goal: 2.5
      }
    };
  }

  /**
   * Analyze health data and generate insights
   */
  static analyzeHealthData(healthData: HealthData, userProfile: UserProfile): HealthInsight[] {
    const insights: HealthInsight[] = [];

    // Heart rate insights
    if (healthData.heartRate.resting > 80) {
      insights.push({
        type: 'heart_rate',
        title: 'Elevated Resting Heart Rate',
        description: `Your resting heart rate is ${healthData.heartRate.resting} BPM, which is above the optimal range.`,
        recommendation: 'Consider adding more cardio to your routine and managing stress levels.',
        priority: 'medium',
        trend: 'declining'
      });
    } else if (healthData.heartRate.resting < 60) {
      insights.push({
        type: 'heart_rate',
        title: 'Excellent Resting Heart Rate',
        description: `Your resting heart rate is ${healthData.heartRate.resting} BPM, indicating good cardiovascular fitness.`,
        recommendation: 'Keep up the great work with your current training routine!',
        priority: 'low',
        trend: 'improving'
      });
    }

    // Steps insights
    const stepPercentage = (healthData.steps.today / healthData.steps.goal) * 100;
    if (stepPercentage < 70) {
      insights.push({
        type: 'steps',
        title: 'Low Daily Activity',
        description: `You've taken ${healthData.steps.today} steps today, below your goal of ${healthData.steps.goal}.`,
        recommendation: 'Try to take a 10-minute walk or add more movement to your day.',
        priority: 'medium',
        trend: 'declining'
      });
    } else if (stepPercentage > 120) {
      insights.push({
        type: 'steps',
        title: 'Excellent Daily Activity',
        description: `You've exceeded your step goal with ${healthData.steps.today} steps!`,
        recommendation: 'Great job! Consider setting a higher goal to continue challenging yourself.',
        priority: 'low',
        trend: 'improving'
      });
    }

    // Sleep insights
    if (healthData.sleep.duration < 7) {
      insights.push({
        type: 'sleep',
        title: 'Insufficient Sleep',
        description: `You slept ${healthData.sleep.duration} hours last night, below the recommended 7-9 hours.`,
        recommendation: 'Aim for 7-9 hours of sleep for optimal recovery and performance.',
        priority: 'high',
        trend: 'declining'
      });
    } else if (healthData.sleep.quality < 6) {
      insights.push({
        type: 'sleep',
        title: 'Poor Sleep Quality',
        description: `Your sleep quality was ${healthData.sleep.quality}/10, indicating poor rest.`,
        recommendation: 'Improve sleep hygiene: consistent bedtime, cool room, no screens before bed.',
        priority: 'high',
        trend: 'declining'
      });
    }

    // Weight insights
    if (userProfile.goalWeight) {
      const weightDiff = healthData.weight.current - userProfile.goalWeight;
      if (Math.abs(weightDiff) < 1) {
        insights.push({
          type: 'weight',
          title: 'Near Goal Weight',
          description: `You're within 1kg of your goal weight!`,
          recommendation: 'Focus on maintaining your current weight and building muscle.',
          priority: 'low',
          trend: 'stable'
        });
      } else if (weightDiff > 0) {
        insights.push({
          type: 'weight',
          title: 'Above Goal Weight',
          description: `You're ${weightDiff.toFixed(1)}kg above your goal weight.`,
          recommendation: 'Consider adjusting your nutrition or increasing cardio.',
          priority: 'medium',
          trend: 'declining'
        });
      }
    }

    // Hydration insights
    const hydrationPercentage = (healthData.hydration.today / healthData.hydration.goal) * 100;
    if (hydrationPercentage < 80) {
      insights.push({
        type: 'hydration',
        title: 'Low Hydration',
        description: `You've consumed ${healthData.hydration.today}L of water today, below your goal of ${healthData.hydration.goal}L.`,
        recommendation: 'Drink more water throughout the day, especially during and after workouts.',
        priority: 'medium',
        trend: 'declining'
      });
    }

    // Blood pressure insights
    if (healthData.bloodPressure) {
      const { systolic, diastolic } = healthData.bloodPressure;
      if (systolic > 140 || diastolic > 90) {
        insights.push({
          type: 'blood_pressure',
          title: 'High Blood Pressure',
          description: `Your blood pressure is ${systolic}/${diastolic} mmHg, which is elevated.`,
          recommendation: 'Consult with a healthcare provider and consider lifestyle changes.',
          priority: 'high',
          trend: 'declining'
        });
      } else if (systolic < 90 || diastolic < 60) {
        insights.push({
          type: 'blood_pressure',
          title: 'Low Blood Pressure',
          description: `Your blood pressure is ${systolic}/${diastolic} mmHg, which is low.`,
          recommendation: 'Monitor for symptoms and consult a healthcare provider if concerned.',
          priority: 'medium',
          trend: 'stable'
        });
      }
    }

    return insights;
  }

  /**
   * Get workout recommendations based on health data
   */
  static getWorkoutRecommendations(healthData: HealthData): {
    intensity: 'low' | 'medium' | 'high';
    duration: number;
    focus: string[];
    avoid: string[];
  } {
    const recommendations = {
      intensity: 'medium' as 'low' | 'medium' | 'high',
      duration: 45,
      focus: [] as string[],
      avoid: [] as string[]
    };

    // Adjust based on heart rate
    if (healthData.heartRate.resting > 80) {
      recommendations.intensity = 'low';
      recommendations.focus.push('recovery');
      recommendations.avoid.push('high-intensity');
    }

    // Adjust based on sleep
    if (healthData.sleep.duration < 6 || healthData.sleep.quality < 5) {
      recommendations.intensity = 'low';
      recommendations.duration = 30;
      recommendations.focus.push('mobility', 'light-cardio');
      recommendations.avoid.push('heavy-lifting', 'high-intensity');
    }

    // Adjust based on steps
    if (healthData.steps.today < 5000) {
      recommendations.focus.push('cardio', 'walking');
    }

    // Adjust based on hydration
    if (healthData.hydration.today < healthData.hydration.goal * 0.8) {
      recommendations.avoid.push('long-duration');
      recommendations.duration = Math.min(recommendations.duration, 30);
    }

    return recommendations;
  }

  /**
   * Calculate health score
   */
  static calculateHealthScore(healthData: HealthData): number {
    let score = 0;
    let factors = 0;

    // Heart rate score (0-25 points)
    if (healthData.heartRate.resting >= 60 && healthData.heartRate.resting <= 80) {
      score += 25;
    } else if (healthData.heartRate.resting < 60) {
      score += 20; // Very good
    } else if (healthData.heartRate.resting <= 90) {
      score += 15; // Acceptable
    } else {
      score += 5; // Poor
    }
    factors++;

    // Steps score (0-25 points)
    const stepPercentage = (healthData.steps.today / healthData.steps.goal) * 100;
    if (stepPercentage >= 100) {
      score += 25;
    } else if (stepPercentage >= 80) {
      score += 20;
    } else if (stepPercentage >= 60) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    // Sleep score (0-25 points)
    if (healthData.sleep.duration >= 7 && healthData.sleep.duration <= 9 && healthData.sleep.quality >= 7) {
      score += 25;
    } else if (healthData.sleep.duration >= 6 && healthData.sleep.quality >= 6) {
      score += 20;
    } else if (healthData.sleep.duration >= 5) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    // Hydration score (0-25 points)
    const hydrationPercentage = (healthData.hydration.today / healthData.hydration.goal) * 100;
    if (hydrationPercentage >= 100) {
      score += 25;
    } else if (hydrationPercentage >= 80) {
      score += 20;
    } else if (hydrationPercentage >= 60) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    return Math.round(score / factors);
  }
}

