// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  bodyFatPercentage: number;
  goalWeight?: number;
  targetPhysique: string; // e.g., "NFL fullback", "lean athlete"
  equipment: Equipment[];
  activityLevel: ActivityLevel;
  sleepSchedule: SleepSchedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepSchedule {
  wakeUpTime: string; // "05:30"
  bedTime: string; // "23:30"
  targetSleepHours: number;
  sleepQuality?: number; // 1-10 scale
  sleepTracking?: boolean; // whether to track sleep quality
  sleepNotes?: string; // notes about sleep patterns
}

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

export type Equipment = 
  | 'dumbbells' 
  | 'barbells' 
  | 'machines' 
  | 'cables' 
  | 'smith_machine' 
  | 'treadmill' 
  | 'bench' 
  | 'squat_rack';

// Training Phase Types
export interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // weeks
  targetWeight: number;
  targetBodyFat: number;
  focus: PhaseFocus;
  trainingSplit: TrainingSplit;
  nutritionPlan: NutritionPlan;
  cardioPlan: CardioPlan;
  progressionRules: ProgressionRule[];
}

export type PhaseFocus = 'lean_recomp' | 'muscle_gain' | 'final_cut';

export interface TrainingSplit {
  days: TrainingDay[];
  restDays: number[];
  rotationPattern?: string[];
}

export interface TrainingDay {
  dayNumber: number;
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
  accessories: Exercise[];
  abs: Exercise[];
  cardio?: CardioSession;
}

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'legs' 
  | 'core' 
  | 'forearms';

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  category: ExerciseCategory;
  sets: number;
  reps: number | string; // can be "8-12" or "30-45s"
  rpe: number; // Rate of Perceived Exertion 1-10
  restTime: number; // seconds
  tempo?: string; // e.g., "3-1-3"
  notes?: string;
  progression?: ProgressionMethod;
}

export type ExerciseCategory = 'compound' | 'isolation' | 'accessory' | 'cardio' | 'abs';

export type ProgressionMethod = 'weight' | 'reps' | 'sets' | 'rpe' | 'tempo' | 'duration' | 'volume' | 'intensity';

export interface ProgressionRule {
  type: ProgressionMethod;
  condition: string; // e.g., "if RPE < 8 for 2 consecutive sessions"
  action: string; // e.g., "increase weight by 2.5kg"
}

// Nutrition Types
export interface NutritionPlan {
  targetCalories: number;
  macros: MacroTargets;
  mealTiming: MealTiming;
  hydration: HydrationPlan;
  supplements?: Supplement[];
  debloatMode?: boolean;
}

export interface MacroTargets {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium?: number; // mg
}

export interface MealTiming {
  preWorkout: number; // minutes before
  postWorkout: number; // minutes after
  mealFrequency: number; // meals per day
  fastingWindow?: number; // hours
}

export interface HydrationPlan {
  dailyWater: number; // liters
  preWorkout: number; // liters
  duringWorkout: number; // liters per hour
  postWorkout: number; // liters
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

// Cardio Types
export interface CardioPlan {
  frequency: number; // times per week
  duration: number; // minutes
  intensity: CardioIntensity;
  type: CardioType;
  timing: 'pre_workout' | 'post_workout' | 'separate';
}

export interface CardioSession {
  type: CardioType;
  duration: number;
  intensity: CardioIntensity;
  rpe: number;
  incline?: number;
  speed?: number;
}

export type CardioType = 'treadmill' | 'elliptical' | 'bike' | 'rowing' | 'walking';
export type CardioIntensity = 'low' | 'moderate' | 'high';

// Progress Tracking Types
export interface ProgressEntry {
  id: string;
  date: Date;
  weight: number;
  bodyFatPercentage?: number;
  measurements: BodyMeasurements;
  strengthLifts: StrengthLifts;
  sleepHours?: number;
  stressLevel?: number; // 1-10
  notes?: string;
}

export interface BodyMeasurements {
  waist: number;
  chest: number;
  arms: number;
  shoulders: number;
  thighs: number;
  calves: number;
  forearms?: number;
}

export interface StrengthLifts {
  benchPress?: number;
  squat?: number;
  deadlift?: number;
  overheadPress?: number;
  rows?: number;
}

// Workout Session Types
export interface WorkoutSession {
  id: string;
  date: Date;
  trainingDay: TrainingDay;
  exercises: CompletedExercise[];
  duration: number; // minutes
  notes?: string;
  rpe: number;
}

export interface CompletedExercise {
  exercise: Exercise;
  sets: CompletedSet[];
  notes?: string;
}

export interface CompletedSet {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number; // for timed exercises
  rpe: number;
  restTime: number;
}

// App State Types
export interface AppState {
  userProfile: UserProfile | null;
  currentPhase: TrainingPhase | null;
  progressHistory: ProgressEntry[];
  workoutHistory: WorkoutSession[];
  nutritionLog: NutritionEntry[];
  currentDate: Date;
  isLoading: boolean;
  error: string | null;
}

export interface NutritionEntry {
  id: string;
  date: Date;
  meal: string;
  foods: FoodItem[];
  totalCalories: number;
  macros: MacroTargets;
  notes?: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number;
  servingSize: string;
}

// Scientific Data Types
export interface ScientificData {
  bmrFormulas: BMRFormula[];
  tdeeMultipliers: TDEEMultiplier[];
  proteinRequirements: ProteinRequirement[];
  hypertrophyGuidelines: HypertrophyGuideline[];
  recoveryGuidelines: RecoveryGuideline[];
}

export interface BMRFormula {
  name: string;
  formula: string;
  coefficients: Record<string, number>;
}

export interface TDEEMultiplier {
  activityLevel: ActivityLevel;
  multiplier: number;
  description: string;
}

export interface ProteinRequirement {
  goal: string;
  proteinPerKg: number;
  proteinPerLb: number;
  notes: string;
}

export interface HypertrophyGuideline {
  muscleGroup: MuscleGroup;
  frequency: number; // times per week
  volume: number; // sets per week
  intensity: number; // % of 1RM
  restTime: number; // seconds
}

export interface RecoveryGuideline {
  factor: string;
  recommendation: string;
  scientificBasis: string;
}
