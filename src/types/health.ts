// Apple Watch & Health Data Integration Types
export interface HealthData {
  heartRate: HeartRateData[];
  steps: StepsData[];
  sleep: SleepData[];
  workouts: WorkoutData[];
  heartRateVariability: HRVData[];
  activeEnergy: EnergyData[];
  restingHeartRate: number;
  vo2Max: number;
  lastSync: Date;
}

export interface HeartRateData {
  timestamp: Date;
  value: number; // BPM
  source: 'Apple Watch' | 'iPhone' | 'Manual';
  context: 'resting' | 'active' | 'recovery' | 'workout';
}

export interface StepsData {
  date: Date;
  count: number;
  distance: number; // meters
  floors: number;
  activeMinutes: number;
}

export interface SleepData {
  date: Date;
  bedtime: Date;
  wakeTime: Date;
  duration: number; // hours
  deepSleep: number; // hours
  lightSleep: number; // hours
  remSleep: number; // hours
  awake: number; // hours
  efficiency: number; // percentage
}

export interface WorkoutData {
  id: string;
  type: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  calories: number;
  averageHeartRate: number;
  maxHeartRate: number;
  distance?: number;
  elevation?: number;
  pace?: number; // min/km
}

export interface HRVData {
  timestamp: Date;
  value: number; // milliseconds
  source: 'Apple Watch' | 'Manual';
}

export interface EnergyData {
  date: Date;
  active: number; // calories
  resting: number; // calories
  total: number; // calories
}

// AI Optimization Types
export interface OptimizationInsight {
  id: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'progression' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  expectedImpact: number; // 0-100
  confidence: number; // 0-100
  dataPoints: string[];
  actionRequired: boolean;
  timestamp: Date;
}

export interface AdaptivePlan {
  id: string;
  name: string;
  phase: 'bulk' | 'cut' | 'maintenance' | 'recomp';
  duration: number; // weeks
  currentWeek: number;
  adjustments: PlanAdjustment[];
  performanceMetrics: PerformanceMetrics;
  nextOptimization: Date;
}

export interface PlanAdjustment {
  id: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'progression' | 'timing';
  reason: string;
  oldValue: any;
  newValue: any;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

export interface PerformanceMetrics {
  strength: StrengthMetrics;
  endurance: EnduranceMetrics;
  recovery: RecoveryMetrics;
  nutrition: NutritionMetrics;
  consistency: ConsistencyMetrics;
}

export interface StrengthMetrics {
  progressionRate: number; // % per week
  volumeProgression: number; // % per week
  intensityProgression: number; // % per week
  plateauRisk: number; // 0-100
  recommendedDeload: boolean;
}

export interface EnduranceMetrics {
  vo2Max: number;
  lactateThreshold: number;
  aerobicBase: number;
  anaerobicCapacity: number;
  efficiency: number; // 0-100
}

export interface RecoveryMetrics {
  hrvTrend: number; // -100 to 100
  sleepQuality: number; // 0-100
  stressLevel: number; // 0-100
  readinessScore: number; // 0-100
  fatigueLevel: number; // 0-100
}

export interface NutritionMetrics {
  adherence: number; // 0-100
  macroBalance: number; // 0-100
  timing: number; // 0-100
  hydration: number; // 0-100
  micronutrientScore: number; // 0-100
}

export interface ConsistencyMetrics {
  workoutFrequency: number; // workouts per week
  nutritionConsistency: number; // 0-100
  sleepConsistency: number; // 0-100
  adherenceScore: number; // 0-100
  streakDays: number;
}

// Real-time AI Analysis
export interface AIAnalysis {
  id: string;
  timestamp: Date;
  dataSource: 'Apple Watch' | 'Manual' | 'Combined';
  insights: OptimizationInsight[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
  overallScore: number; // 0-100
  nextAnalysis: Date;
}
