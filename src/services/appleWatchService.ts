// Apple Watch Integration Service for SciOptimal
// Provides real-time biometric data from Apple Watch and HealthKit

export interface AppleWatchData {
  heartRate: HeartRateData;
  heartRateVariability: HRVData;
  sleep: SleepData;
  activity: ActivityData;
  workouts: WorkoutData[];
  oxygenSaturation: OxygenData;
  ecg: ECGData;
  fallDetection: FallDetectionData;
  notifications: HealthNotification[];
}

export interface HeartRateData {
  current: number;
  resting: number;
  average: number;
  max: number;
  min: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  zones: HeartRateZone[];
  lastUpdated: Date;
  isActive: boolean;
}

export interface HeartRateZone {
  zone: 'rest' | 'fat_burn' | 'aerobic' | 'anaerobic' | 'peak';
  range: { min: number; max: number };
  timeInZone: number; // minutes
  percentage: number;
}

export interface HRVData {
  current: number;
  average: number;
  trend: 'improving' | 'declining' | 'stable';
  recoveryScore: number; // 0-100
  readiness: 'ready' | 'moderate' | 'not_ready';
  lastUpdated: Date;
  weeklyAverage: number;
  monthlyTrend: number[];
}

export interface SleepData {
  lastNight: SleepSession;
  weeklyAverage: SleepMetrics;
  sleepStages: SleepStage[];
  quality: SleepQualityMetrics;
  recommendations: SleepRecommendation[];
}

export interface SleepSession {
  startTime: Date;
  endTime: Date;
  duration: number; // hours
  deepSleep: number; // minutes
  lightSleep: number; // minutes
  remSleep: number; // minutes
  awake: number; // minutes
  totalSleep: number; // minutes
  efficiency: number; // 0-100
  heartRate: number;
  respiratoryRate: number;
}

export interface SleepMetrics {
  averageDuration: number;
  averageEfficiency: number;
  averageDeepSleep: number;
  consistency: number; // 0-100
  quality: number; // 0-100
}

export interface SleepStage {
  stage: 'deep' | 'light' | 'rem' | 'awake';
  startTime: Date;
  duration: number; // minutes
  heartRate: number;
}

export interface SleepQualityMetrics {
  overall: number; // 0-100
  deepSleepPercentage: number;
  remSleepPercentage: number;
  sleepLatency: number; // minutes to fall asleep
  wakeUps: number;
  sleepScore: number; // 0-100
}

export interface SleepRecommendation {
  type: 'timing' | 'environment' | 'routine' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  expectedBenefit: string;
}

export interface ActivityData {
  steps: number;
  distance: number; // meters
  calories: number;
  activeMinutes: number;
  exerciseMinutes: number;
  standHours: number;
  rings: ActivityRings;
  trends: ActivityTrends;
}

export interface ActivityRings {
  move: { current: number; goal: number; percentage: number };
  exercise: { current: number; goal: number; percentage: number };
  stand: { current: number; goal: number; percentage: number };
}

export interface ActivityTrends {
  weeklySteps: number[];
  weeklyCalories: number[];
  weeklyExercise: number[];
  improvement: number; // percentage
}

export interface WorkoutData {
  id: string;
  type: WorkoutType;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  calories: number;
  distance: number; // meters
  heartRate: HeartRateData;
  pace: number; // minutes per km
  power: number; // watts
  cadence: number; // steps per minute
  route: GPSPoint[];
  metrics: WorkoutMetrics;
}

export type WorkoutType = 
  | 'running' | 'walking' | 'cycling' | 'swimming' | 'strength_training'
  | 'yoga' | 'pilates' | 'dance' | 'hiking' | 'rowing' | 'elliptical'
  | 'stair_climbing' | 'mixed_cardio' | 'core_training' | 'flexibility';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  altitude: number;
  speed: number;
}

export interface WorkoutMetrics {
  averageHeartRate: number;
  maxHeartRate: number;
  averagePace: number;
  maxPace: number;
  elevationGain: number;
  caloriesPerMinute: number;
  efficiency: number; // 0-100
}

export interface OxygenData {
  current: number; // percentage
  average: number;
  trend: 'stable' | 'declining' | 'improving';
  lastUpdated: Date;
  isNormal: boolean;
}

export interface ECGData {
  isAvailable: boolean;
  lastReading: Date;
  result: 'normal' | 'atrial_fibrillation' | 'inconclusive' | 'poor_recording';
  heartRate: number;
  symptoms: string[];
}

export interface FallDetectionData {
  isEnabled: boolean;
  lastFall: Date | null;
  fallCount: number;
  location: GPSPoint | null;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface HealthNotification {
  id: string;
  type: 'heart_rate' | 'irregular_rhythm' | 'high_heart_rate' | 'low_heart_rate' | 'fall' | 'ecg';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export interface AppleWatchConnection {
  isConnected: boolean;
  batteryLevel: number;
  isCharging: boolean;
  lastSync: Date;
  connectionStrength: 'excellent' | 'good' | 'fair' | 'poor';
  permissions: HealthKitPermissions;
}

export interface HealthKitPermissions {
  heartRate: boolean;
  sleep: boolean;
  activity: boolean;
  workouts: boolean;
  oxygenSaturation: boolean;
  ecg: boolean;
  fallDetection: boolean;
  notifications: boolean;
}

export class AppleWatchService {
  private isConnected: boolean = false;
  private connection: AppleWatchConnection | null = null;
  private healthKit: any = null;
  private watchData: AppleWatchData | null = null;
  private updateCallbacks: ((data: AppleWatchData) => void)[] = [];

  constructor() {
    this.initializeHealthKit();
  }

  // Initialize HealthKit connection
  private async initializeHealthKit(): Promise<void> {
    try {
      // Check if HealthKit is available
      if (typeof HealthKit !== 'undefined') {
        this.healthKit = HealthKit;
        await this.requestPermissions();
        this.startDataCollection();
      } else {
        console.log('HealthKit not available - using mock data for development');
        this.useMockData();
      }
    } catch (error) {
      console.error('Failed to initialize HealthKit:', error);
      this.useMockData();
    }
  }

  // Request HealthKit permissions
  private async requestPermissions(): Promise<void> {
    if (!this.healthKit) return;

    const permissions = [
      'heartRate',
      'sleepAnalysis',
      'stepCount',
      'activeEnergyBurned',
      'appleExerciseTime',
      'appleStandTime',
      'oxygenSaturation',
      'electrocardiogram',
      'fallDetection'
    ];

    try {
      await this.healthKit.requestAuthorization(permissions);
      this.connection = {
        isConnected: true,
        batteryLevel: 85,
        isCharging: false,
        lastSync: new Date(),
        connectionStrength: 'excellent',
        permissions: {
          heartRate: true,
          sleep: true,
          activity: true,
          workouts: true,
          oxygenSaturation: true,
          ecg: true,
          fallDetection: true,
          notifications: true
        }
      };
    } catch (error) {
      console.error('Failed to get HealthKit permissions:', error);
    }
  }

  // Start collecting data from Apple Watch
  private startDataCollection(): void {
    if (!this.healthKit) return;

    // Set up observers for different health data types
    this.setupHeartRateObserver();
    this.setupSleepObserver();
    this.setupActivityObserver();
    this.setupWorkoutObserver();

    // Start periodic data collection
    setInterval(() => {
      this.collectCurrentData();
    }, 30000); // Every 30 seconds
  }

  // Set up heart rate monitoring
  private setupHeartRateObserver(): void {
    if (!this.healthKit) return;

    this.healthKit.observeHeartRate((data: any) => {
      this.updateHeartRateData(data);
    });
  }

  // Set up sleep monitoring
  private setupSleepObserver(): void {
    if (!this.healthKit) return;

    this.healthKit.observeSleepAnalysis((data: any) => {
      this.updateSleepData(data);
    });
  }

  // Set up activity monitoring
  private setupActivityObserver(): void {
    if (!this.healthKit) return;

    this.healthKit.observeStepCount((data: any) => {
      this.updateActivityData(data);
    });
  }

  // Set up workout monitoring
  private setupWorkoutObserver(): void {
    if (!this.healthKit) return;

    this.healthKit.observeWorkouts((data: any) => {
      this.updateWorkoutData(data);
    });
  }

  // Collect current data from Apple Watch
  private async collectCurrentData(): Promise<void> {
    if (!this.healthKit || !this.connection?.isConnected) return;

    try {
      const currentData = await this.healthKit.getCurrentData();
      this.processHealthKitData(currentData);
    } catch (error) {
      console.error('Failed to collect current data:', error);
    }
  }

  // Process data from HealthKit
  private processHealthKitData(data: any): void {
    // Process and update watch data
    this.watchData = this.transformHealthKitData(data);
    
    // Notify subscribers
    this.notifyDataUpdate();
  }

  // Transform HealthKit data to our format
  private transformHealthKitData(data: any): AppleWatchData {
    return {
      heartRate: this.transformHeartRateData(data.heartRate),
      heartRateVariability: this.transformHRVData(data.heartRateVariability),
      sleep: this.transformSleepData(data.sleep),
      activity: this.transformActivityData(data.activity),
      workouts: this.transformWorkoutData(data.workouts),
      oxygenSaturation: this.transformOxygenData(data.oxygenSaturation),
      ecg: this.transformECGData(data.ecg),
      fallDetection: this.transformFallDetectionData(data.fallDetection),
      notifications: this.transformNotifications(data.notifications)
    };
  }

  // Transform heart rate data
  private transformHeartRateData(data: any): HeartRateData {
    return {
      current: data.current || 0,
      resting: data.resting || 0,
      average: data.average || 0,
      max: data.max || 0,
      min: data.min || 0,
      trend: this.calculateHeartRateTrend(data.history),
      zones: this.calculateHeartRateZones(data.history),
      lastUpdated: new Date(),
      isActive: data.isActive || false
    };
  }

  // Transform HRV data
  private transformHRVData(data: any): HRVData {
    return {
      current: data.current || 0,
      average: data.average || 0,
      trend: this.calculateHRVTrend(data.history),
      recoveryScore: this.calculateRecoveryScore(data.current, data.average),
      readiness: this.calculateReadiness(data.current, data.average),
      lastUpdated: new Date(),
      weeklyAverage: data.weeklyAverage || 0,
      monthlyTrend: data.monthlyTrend || []
    };
  }

  // Transform sleep data
  private transformSleepData(data: any): SleepData {
    return {
      lastNight: this.transformSleepSession(data.lastNight),
      weeklyAverage: this.transformSleepMetrics(data.weeklyAverage),
      sleepStages: this.transformSleepStages(data.sleepStages),
      quality: this.transformSleepQuality(data.quality),
      recommendations: this.generateSleepRecommendations(data)
    };
  }

  // Transform activity data
  private transformActivityData(data: any): ActivityData {
    return {
      steps: data.steps || 0,
      distance: data.distance || 0,
      calories: data.calories || 0,
      activeMinutes: data.activeMinutes || 0,
      exerciseMinutes: data.exerciseMinutes || 0,
      standHours: data.standHours || 0,
      rings: this.transformActivityRings(data.rings),
      trends: this.transformActivityTrends(data.trends)
    };
  }

  // Transform workout data
  private transformWorkoutData(data: any[]): WorkoutData[] {
    return data.map(workout => ({
      id: workout.id,
      type: workout.type,
      startTime: new Date(workout.startTime),
      endTime: new Date(workout.endTime),
      duration: workout.duration,
      calories: workout.calories,
      distance: workout.distance,
      heartRate: this.transformHeartRateData(workout.heartRate),
      pace: workout.pace,
      power: workout.power,
      cadence: workout.cadence,
      route: this.transformGPSRoute(workout.route),
      metrics: this.transformWorkoutMetrics(workout.metrics)
    }));
  }

  // Transform oxygen saturation data
  private transformOxygenData(data: any): OxygenData {
    return {
      current: data.current || 0,
      average: data.average || 0,
      trend: this.calculateOxygenTrend(data.history),
      lastUpdated: new Date(),
      isNormal: data.current >= 95
    };
  }

  // Transform ECG data
  private transformECGData(data: any): ECGData {
    return {
      isAvailable: data.isAvailable || false,
      lastReading: data.lastReading ? new Date(data.lastReading) : new Date(),
      result: data.result || 'normal',
      heartRate: data.heartRate || 0,
      symptoms: data.symptoms || []
    };
  }

  // Transform fall detection data
  private transformFallDetectionData(data: any): FallDetectionData {
    return {
      isEnabled: data.isEnabled || false,
      lastFall: data.lastFall ? new Date(data.lastFall) : null,
      fallCount: data.fallCount || 0,
      location: data.location ? this.transformGPSPoint(data.location) : null,
      severity: data.severity || 'mild'
    };
  }

  // Transform notifications
  private transformNotifications(data: any[]): HealthNotification[] {
    return data.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
      timestamp: new Date(notification.timestamp),
      isRead: notification.isRead || false,
      actionRequired: notification.actionRequired || false
    }));
  }

  // Transform activity rings
  private transformActivityRings(data: any): ActivityRings {
    return {
      move: {
        current: data.move?.current || 0,
        goal: data.move?.goal || 500,
        percentage: data.move?.percentage || 0
      },
      exercise: {
        current: data.exercise?.current || 0,
        goal: data.exercise?.goal || 30,
        percentage: data.exercise?.percentage || 0
      },
      stand: {
        current: data.stand?.current || 0,
        goal: data.stand?.goal || 12,
        percentage: data.stand?.percentage || 0
      }
    };
  }

  // Transform activity trends
  private transformActivityTrends(data: any): ActivityTrends {
    return {
      weeklySteps: data.weeklySteps || [],
      weeklyCalories: data.weeklyCalories || [],
      weeklyExercise: data.weeklyExercise || [],
      improvement: this.calculateActivityImprovement(data)
    };
  }

  // Transform sleep session
  private transformSleepSession(data: any): SleepSession {
    return {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      duration: data.duration || 0,
      deepSleep: data.deepSleep || 0,
      lightSleep: data.lightSleep || 0,
      remSleep: data.remSleep || 0,
      awake: data.awake || 0,
      totalSleep: data.totalSleep || 0,
      efficiency: data.efficiency || 0,
      heartRate: data.heartRate || 0,
      respiratoryRate: data.respiratoryRate || 0
    };
  }

  // Transform sleep metrics
  private transformSleepMetrics(data: any): SleepMetrics {
    return {
      averageDuration: data.averageDuration || 0,
      averageEfficiency: data.averageEfficiency || 0,
      averageDeepSleep: data.averageDeepSleep || 0,
      consistency: data.consistency || 0,
      quality: data.quality || 0
    };
  }

  // Transform sleep stages
  private transformSleepStages(data: any[]): SleepStage[] {
    return data.map(stage => ({
      stage: stage.stage,
      startTime: new Date(stage.startTime),
      duration: stage.duration,
      heartRate: stage.heartRate
    }));
  }

  // Transform sleep quality
  private transformSleepQuality(data: any): SleepQualityMetrics {
    return {
      overall: data.overall || 0,
      deepSleepPercentage: data.deepSleepPercentage || 0,
      remSleepPercentage: data.remSleepPercentage || 0,
      sleepLatency: data.sleepLatency || 0,
      wakeUps: data.wakeUps || 0,
      sleepScore: this.calculateSleepScore(data)
    };
  }

  // Transform GPS route
  private transformGPSRoute(route: any[]): GPSPoint[] {
    return route.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      timestamp: new Date(point.timestamp),
      altitude: point.altitude || 0,
      speed: point.speed || 0
    }));
  }

  // Transform GPS point
  private transformGPSPoint(point: any): GPSPoint {
    return {
      latitude: point.latitude,
      longitude: point.longitude,
      timestamp: new Date(point.timestamp),
      altitude: point.altitude || 0,
      speed: point.speed || 0
    };
  }

  // Transform workout metrics
  private transformWorkoutMetrics(data: any): WorkoutMetrics {
    return {
      averageHeartRate: data.averageHeartRate || 0,
      maxHeartRate: data.maxHeartRate || 0,
      averagePace: data.averagePace || 0,
      maxPace: data.maxPace || 0,
      elevationGain: data.elevationGain || 0,
      caloriesPerMinute: data.caloriesPerMinute || 0,
      efficiency: this.calculateWorkoutEfficiency(data)
    };
  }

  // Calculate heart rate trend
  private calculateHeartRateTrend(history: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-5);
    const trend = recent.reduce((acc, val, i) => {
      if (i === 0) return 0;
      return acc + (val - recent[i - 1]);
    }, 0);
    
    if (trend > 5) return 'increasing';
    if (trend < -5) return 'decreasing';
    return 'stable';
  }

  // Calculate heart rate zones
  private calculateHeartRateZones(history: number[]): HeartRateZone[] {
    const zones = [
      { zone: 'rest', range: { min: 0, max: 90 } },
      { zone: 'fat_burn', range: { min: 90, max: 120 } },
      { zone: 'aerobic', range: { min: 120, max: 150 } },
      { zone: 'anaerobic', range: { min: 150, max: 180 } },
      { zone: 'peak', range: { min: 180, max: 220 } }
    ];

    return zones.map(zone => {
      const timeInZone = history.filter(hr => 
        hr >= zone.range.min && hr < zone.range.max
      ).length;
      
      return {
        ...zone,
        timeInZone: timeInZone,
        percentage: (timeInZone / history.length) * 100
      };
    });
  }

  // Calculate HRV trend
  private calculateHRVTrend(history: number[]): 'improving' | 'declining' | 'stable' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-7);
    const trend = recent.reduce((acc, val, i) => {
      if (i === 0) return 0;
      return acc + (val - recent[i - 1]);
    }, 0);
    
    if (trend > 2) return 'improving';
    if (trend < -2) return 'declining';
    return 'stable';
  }

  // Calculate recovery score
  private calculateRecoveryScore(current: number, average: number): number {
    if (current > average * 1.2) return 100;
    if (current > average * 1.1) return 85;
    if (current > average * 1.0) return 70;
    if (current > average * 0.9) return 55;
    return 40;
  }

  // Calculate readiness
  private calculateReadiness(current: number, average: number): 'ready' | 'moderate' | 'not_ready' {
    const ratio = current / average;
    if (ratio > 1.1) return 'ready';
    if (ratio > 0.9) return 'moderate';
    return 'not_ready';
  }

  // Calculate oxygen trend
  private calculateOxygenTrend(history: number[]): 'stable' | 'declining' | 'improving' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-5);
    const trend = recent.reduce((acc, val, i) => {
      if (i === 0) return 0;
      return acc + (val - recent[i - 1]);
    }, 0);
    
    if (trend > 0.5) return 'improving';
    if (trend < -0.5) return 'declining';
    return 'stable';
  }

  // Calculate activity improvement
  private calculateActivityImprovement(data: any): number {
    if (!data.weeklySteps || data.weeklySteps.length < 2) return 0;
    
    const current = data.weeklySteps[data.weeklySteps.length - 1];
    const previous = data.weeklySteps[data.weeklySteps.length - 2];
    
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Calculate sleep score
  private calculateSleepScore(data: any): number {
    let score = 50;
    
    if (data.overall > 80) score += 20;
    if (data.deepSleepPercentage > 20) score += 15;
    if (data.remSleepPercentage > 20) score += 10;
    if (data.sleepLatency < 15) score += 5;
    if (data.wakeUps < 2) score += 10;
    
    return Math.min(100, score);
  }

  // Calculate workout efficiency
  private calculateWorkoutEfficiency(data: any): number {
    let efficiency = 50;
    
    if (data.averageHeartRate > 120) efficiency += 20;
    if (data.caloriesPerMinute > 8) efficiency += 15;
    if (data.duration > 30) efficiency += 15;
    
    return Math.min(100, efficiency);
  }

  // Generate sleep recommendations
  private generateSleepRecommendations(data: any): SleepRecommendation[] {
    const recommendations: SleepRecommendation[] = [];
    
    if (data.quality.overall < 70) {
      recommendations.push({
        type: 'environment',
        priority: 'high',
        title: 'Improve Sleep Environment',
        description: 'Your sleep quality is below optimal levels',
        action: 'Ensure room is dark, quiet, and cool (65-68°F)',
        expectedBenefit: 'Improved sleep quality and recovery'
      });
    }
    
    if (data.quality.sleepLatency > 20) {
      recommendations.push({
        type: 'routine',
        priority: 'medium',
        title: 'Optimize Bedtime Routine',
        description: 'You take longer than average to fall asleep',
        action: 'Create a relaxing 30-minute bedtime routine',
        expectedBenefit: 'Faster sleep onset and better sleep quality'
      });
    }
    
    return recommendations;
  }

  // Update heart rate data
  private updateHeartRateData(data: any): void {
    if (this.watchData) {
      this.watchData.heartRate = this.transformHeartRateData(data);
      this.notifyDataUpdate();
    }
  }

  // Update sleep data
  private updateSleepData(data: any): void {
    if (this.watchData) {
      this.watchData.sleep = this.transformSleepData(data);
      this.notifyDataUpdate();
    }
  }

  // Update activity data
  private updateActivityData(data: any): void {
    if (this.watchData) {
      this.watchData.activity = this.transformActivityData(data);
      this.notifyDataUpdate();
    }
  }

  // Update workout data
  private updateWorkoutData(data: any): void {
    if (this.watchData) {
      this.watchData.workouts = this.transformWorkoutData(data);
      this.notifyDataUpdate();
    }
  }

  // Use mock data for development
  private useMockData(): void {
    this.watchData = this.generateMockData();
    this.connection = {
      isConnected: false,
      batteryLevel: 0,
      isCharging: false,
      lastSync: new Date(),
      connectionStrength: 'poor',
      permissions: {
        heartRate: false,
        sleep: false,
        activity: false,
        workouts: false,
        oxygenSaturation: false,
        ecg: false,
        fallDetection: false,
        notifications: false
      }
    };
  }

  // Generate mock data for development
  private generateMockData(): AppleWatchData {
    return {
      heartRate: {
        current: 72,
        resting: 58,
        average: 68,
        max: 185,
        min: 52,
        trend: 'stable',
        zones: [
          { zone: 'rest', range: { min: 0, max: 90 }, timeInZone: 480, percentage: 80 },
          { zone: 'fat_burn', range: { min: 90, max: 120 }, timeInZone: 90, percentage: 15 },
          { zone: 'aerobic', range: { min: 120, max: 150 }, timeInZone: 30, percentage: 5 },
          { zone: 'anaerobic', range: { min: 150, max: 180 }, timeInZone: 0, percentage: 0 },
          { zone: 'peak', range: { min: 180, max: 220 }, timeInZone: 0, percentage: 0 }
        ],
        lastUpdated: new Date(),
        isActive: false
      },
      heartRateVariability: {
        current: 45,
        average: 42,
        trend: 'improving',
        recoveryScore: 75,
        readiness: 'ready',
        lastUpdated: new Date(),
        weeklyAverage: 43,
        monthlyTrend: [40, 41, 42, 43, 44, 45, 46]
      },
      sleep: {
        lastNight: {
          startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
          endTime: new Date(),
          duration: 8,
          deepSleep: 120,
          lightSleep: 300,
          remSleep: 90,
          awake: 30,
          totalSleep: 480,
          efficiency: 85,
          heartRate: 58,
          respiratoryRate: 14
        },
        weeklyAverage: {
          averageDuration: 7.5,
          averageEfficiency: 82,
          averageDeepSleep: 110,
          consistency: 78,
          quality: 80
        },
        sleepStages: [
          { stage: 'deep', startTime: new Date(Date.now() - 7 * 60 * 60 * 1000), duration: 120, heartRate: 58 },
          { stage: 'light', startTime: new Date(Date.now() - 5 * 60 * 60 * 1000), duration: 300, heartRate: 62 },
          { stage: 'rem', startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), duration: 90, heartRate: 65 }
        ],
        quality: {
          overall: 80,
          deepSleepPercentage: 25,
          remSleepPercentage: 19,
          sleepLatency: 12,
          wakeUps: 1,
          sleepScore: 78
        },
        recommendations: [
          {
            type: 'routine',
            priority: 'medium',
            title: 'Optimize Bedtime Routine',
            description: 'Consider extending your bedtime routine',
            action: 'Add 10 minutes to your current routine',
            expectedBenefit: 'Improved sleep onset and quality'
          }
        ]
      },
      activity: {
        steps: 8420,
        distance: 6500,
        calories: 320,
        activeMinutes: 45,
        exerciseMinutes: 28,
        standHours: 10,
        rings: {
          move: { current: 320, goal: 500, percentage: 64 },
          exercise: { current: 28, goal: 30, percentage: 93 },
          stand: { current: 10, goal: 12, percentage: 83 }
        },
        trends: {
          weeklySteps: [6500, 7200, 6800, 7500, 8000, 7800, 8420],
          weeklyCalories: [280, 310, 290, 330, 350, 340, 320],
          weeklyExercise: [25, 28, 26, 30, 32, 30, 28],
          improvement: 29.5
        }
      },
      workouts: [],
      oxygenSaturation: {
        current: 98,
        average: 97,
        trend: 'stable',
        lastUpdated: new Date(),
        isNormal: true
      },
      ecg: {
        isAvailable: true,
        lastReading: new Date(Date.now() - 24 * 60 * 60 * 1000),
        result: 'normal',
        heartRate: 72,
        symptoms: []
      },
      fallDetection: {
        isEnabled: true,
        lastFall: null,
        fallCount: 0,
        location: null,
        severity: 'mild'
      },
      notifications: []
    };
  }

  // Subscribe to data updates
  subscribe(callback: (data: AppleWatchData) => void): () => void {
    this.updateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  // Notify subscribers of data updates
  private notifyDataUpdate(): void {
    if (this.watchData) {
      this.updateCallbacks.forEach(callback => callback(this.watchData!));
    }
  }

  // Get current Apple Watch data
  getCurrentData(): AppleWatchData | null {
    return this.watchData;
  }

  // Get connection status
  getConnectionStatus(): AppleWatchConnection | null {
    return this.connection;
  }

  // Check if Apple Watch is connected
  isAppleWatchConnected(): boolean {
    return this.connection?.isConnected || false;
  }

  // Get battery level
  getBatteryLevel(): number {
    return this.connection?.batteryLevel || 0;
  }

  // Get last sync time
  getLastSync(): Date | null {
    return this.connection?.lastSync || null;
  }

  // Force data refresh
  async refreshData(): Promise<void> {
    if (this.healthKit) {
      await this.collectCurrentData();
    }
  }

  // Start workout tracking
  async startWorkout(type: WorkoutType): Promise<void> {
    if (!this.healthKit) return;
    
    try {
      await this.healthKit.startWorkout(type);
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  }

  // Stop workout tracking
  async stopWorkout(): Promise<void> {
    if (!this.healthKit) return;
    
    try {
      await this.healthKit.stopWorkout();
    } catch (error) {
      console.error('Failed to stop workout:', error);
    }
  }

  // Pause workout tracking
  async pauseWorkout(): Promise<void> {
    if (!this.healthKit) return;
    
    try {
      await this.healthKit.pauseWorkout();
    } catch (error) {
      console.error('Failed to pause workout:', error);
    }
  }

  // Resume workout tracking
  async resumeWorkout(): Promise<void> {
    if (!this.healthKit) return;
    
    try {
      await this.healthKit.resumeWorkout();
    } catch (error) {
      console.error('Failed to resume workout:', error);
    }
  }
}

export default new AppleWatchService();

