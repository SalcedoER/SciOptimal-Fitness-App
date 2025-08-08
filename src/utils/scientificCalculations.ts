import { 
  UserProfile, 
  ActivityLevel, 
  MacroTargets, 
  TrainingPhase, 
  PhaseFocus,
  ScientificData
} from '../types';

// Scientific data based on research studies
export const SCIENTIFIC_DATA: ScientificData = {
  bmrFormulas: [
    {
      name: 'Mifflin-St Jeor',
      formula: 'BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5',
      coefficients: { weight: 10, height: 6.25, age: 5, constant: 5 }
    },
    {
      name: 'Katch-McArdle',
      formula: 'BMR = 370 + (21.6 × lean_mass)',
      coefficients: { lean_mass: 21.6, constant: 370 }
    }
  ],
  tdeeMultipliers: [
    { activityLevel: 'sedentary', multiplier: 1.2, description: 'Little or no exercise' },
    { activityLevel: 'lightly_active', multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
    { activityLevel: 'moderately_active', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week' },
    { activityLevel: 'very_active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week' },
    { activityLevel: 'extremely_active', multiplier: 1.9, description: 'Very hard exercise, physical job' }
  ],
  proteinRequirements: [
    { goal: 'maintenance', proteinPerKg: 1.6, proteinPerLb: 0.73, notes: 'General health and maintenance' },
    { goal: 'muscle_gain', proteinPerKg: 2.2, proteinPerLb: 1.0, notes: 'Muscle building and strength' },
    { goal: 'fat_loss', proteinPerKg: 2.4, proteinPerLb: 1.1, notes: 'Preserve muscle during deficit' },
    { goal: 'athlete', proteinPerKg: 2.6, proteinPerLb: 1.2, notes: 'High-level athletic performance' }
  ],
  hypertrophyGuidelines: [
    { muscleGroup: 'chest', frequency: 2, volume: 12, intensity: 70, restTime: 90 },
    { muscleGroup: 'back', frequency: 2, volume: 15, intensity: 70, restTime: 90 },
    { muscleGroup: 'shoulders', frequency: 2, volume: 9, intensity: 70, restTime: 90 },
    { muscleGroup: 'arms', frequency: 2, volume: 12, intensity: 70, restTime: 60 },
    { muscleGroup: 'legs', frequency: 2, volume: 15, intensity: 75, restTime: 120 },
    { muscleGroup: 'core', frequency: 3, volume: 9, intensity: 60, restTime: 45 },
    { muscleGroup: 'forearms', frequency: 3, volume: 6, intensity: 60, restTime: 45 }
  ],
  recoveryGuidelines: [
    { 
      factor: 'sleep', 
      recommendation: '7-9 hours per night',
      scientificBasis: 'Optimal for muscle protein synthesis and recovery'
    },
    { 
      factor: 'protein_timing', 
      recommendation: '20-40g every 3-4 hours',
      scientificBasis: 'Maximizes muscle protein synthesis rates'
    },
    { 
      factor: 'rest_between_sets', 
      recommendation: '2-3 minutes for compound, 1-2 minutes for isolation',
      scientificBasis: 'Allows for ATP and creatine phosphate resynthesis'
    }
  ]
};

// Calculate BMR using Mifflin-St Jeor formula (most accurate for general population)
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age } = profile;
  const isMale = true; // Assuming male for NFL fullback aesthetic
  
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr += isMale ? 5 : -161;
  
  return Math.round(bmr);
}

// Calculate TDEE based on activity level
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = SCIENTIFIC_DATA.tdeeMultipliers.find(
    m => m.activityLevel === activityLevel
  )?.multiplier || 1.55;
  
  return Math.round(bmr * multiplier);
}

// Calculate lean body mass
export function calculateLeanMass(weight: number, bodyFatPercentage: number): number {
  return weight * (1 - bodyFatPercentage / 100);
}

// Calculate target calories based on phase and goals
export function calculateTargetCalories(
  profile: UserProfile, 
  phase: TrainingPhase
): number {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  
  switch (phase.focus) {
    case 'lean_recomp':
      // Small deficit for lean recomp (200-300 calories)
      return tdee - 250;
    case 'muscle_gain':
      // Small surplus for muscle gain (200-300 calories)
      return tdee + 250;
    case 'final_cut':
      // Larger deficit for final cut (500-700 calories)
      return tdee - 600;
    default:
      return tdee;
  }
}

// Calculate protein requirements based on goal and body weight
export function calculateProteinRequirement(
  profile: UserProfile, 
  phase: TrainingPhase
): number {
  const leanMass = calculateLeanMass(profile.weight, profile.bodyFatPercentage);
  
  let proteinMultiplier: number;
  
  switch (phase.focus) {
    case 'lean_recomp':
      proteinMultiplier = 2.2; // Higher protein for recomp
      break;
    case 'muscle_gain':
      proteinMultiplier = 2.2; // Optimal for muscle building
      break;
    case 'final_cut':
      proteinMultiplier = 2.4; // Higher protein to preserve muscle
      break;
    default:
      proteinMultiplier = 2.0;
  }
  
  return Math.round(leanMass * proteinMultiplier);
}

// Calculate macro targets based on scientific guidelines
export function calculateMacroTargets(
  weight: number,
  bodyFatPercentage: number,
  targetCalories: number,
  proteinMultiplier: number = 2.2,
  carbPercentage: number = 40,
  fatPercentage: number = 25
): MacroTargets {
  // Calculate protein based on lean mass
  const leanMass = weight * (1 - bodyFatPercentage / 100);
  const protein = Math.round(leanMass * proteinMultiplier);
  const proteinCalories = protein * 4;
  
  // Calculate remaining calories for carbs and fat
  const remainingCalories = targetCalories - proteinCalories;
  
  // Calculate carbs and fat based on percentages
  const carbCalories = (remainingCalories * carbPercentage) / 100;
  const fatCalories = (remainingCalories * fatPercentage) / 100;
  
  const carbs = Math.round(carbCalories / 4);
  const fat = Math.round(fatCalories / 9);
  const fiber = Math.round(targetCalories / 1000 * 14); // 14g per 1000 calories
  
  return {
    protein,
    carbs,
    fat,
    fiber
  };
}

// Calculate optimal training volume based on muscle group
export function calculateTrainingVolume(muscleGroup: string, phase: PhaseFocus): number {
  const baseVolume = SCIENTIFIC_DATA.hypertrophyGuidelines.find(
    g => g.muscleGroup === muscleGroup
  )?.volume || 12;
  
  switch (phase) {
    case 'lean_recomp':
      return baseVolume; // Standard volume
    case 'muscle_gain':
      return Math.round(baseVolume * 1.1); // 10% more volume
    case 'final_cut':
      return Math.round(baseVolume * 0.9); // 10% less volume to maintain intensity
    default:
      return baseVolume;
  }
}

// Calculate optimal rest periods
export function calculateRestTime(exerciseCategory: string, phase: PhaseFocus): number {
  let baseRest: number;
  
  switch (exerciseCategory) {
    case 'compound':
      baseRest = 180; // 3 minutes
      break;
    case 'isolation':
      baseRest = 90; // 1.5 minutes
      break;
    case 'accessory':
      baseRest = 60; // 1 minute
      break;
    default:
      baseRest = 90;
  }
  
  switch (phase) {
    case 'lean_recomp':
      return baseRest;
    case 'muscle_gain':
      return Math.round(baseRest * 1.1); // Slightly more rest for recovery
    case 'final_cut':
      return Math.round(baseRest * 0.9); // Slightly less rest for metabolic stress
    default:
      return baseRest;
  }
}

// Calculate optimal cardio duration and intensity
export function calculateCardioPlan(phase: PhaseFocus): { duration: number; intensity: string } {
  switch (phase) {
    case 'lean_recomp':
      return { duration: 30, intensity: 'moderate' };
    case 'muscle_gain':
      return { duration: 20, intensity: 'low' }; // Minimal cardio to preserve muscle
    case 'final_cut':
      return { duration: 45, intensity: 'moderate' }; // More cardio for fat loss
    default:
      return { duration: 30, intensity: 'moderate' };
  }
}

// Calculate optimal caffeine timing based on sleep schedule
export function calculateCaffeineTiming(sleepSchedule: any): { 
  lastCaffeineTime: string; 
  recommendation: string 
} {
  const wakeUpHour = parseInt(sleepSchedule.wakeUpTime.split(':')[0]);
  const lastCaffeineHour = wakeUpHour + 8; // 8 hours after wake up
  
  return {
    lastCaffeineTime: `${lastCaffeineHour.toString().padStart(2, '0')}:30`,
    recommendation: `Avoid caffeine after ${lastCaffeineHour}:30 PM for optimal sleep quality`
  };
}

// Calculate optimal hydration needs
export function calculateHydrationNeeds(weight: number, activityLevel: ActivityLevel): number {
  const baseHydration = weight * 0.033; // 33ml per kg body weight
  const activityMultiplier = activityLevel === 'very_active' || activityLevel === 'extremely_active' ? 1.5 : 1.2;
  
  return Math.round(baseHydration * activityMultiplier * 100) / 100; // Round to 2 decimal places
}

// Calculate optimal meal timing
export function calculateMealTiming(phase: PhaseFocus): { 
  mealFrequency: number; 
  preWorkout: number; 
  postWorkout: number 
} {
  switch (phase) {
    case 'lean_recomp':
      return { mealFrequency: 4, preWorkout: 90, postWorkout: 30 };
    case 'muscle_gain':
      return { mealFrequency: 5, preWorkout: 120, postWorkout: 30 };
    case 'final_cut':
      return { mealFrequency: 3, preWorkout: 60, postWorkout: 45 };
    default:
      return { mealFrequency: 4, preWorkout: 90, postWorkout: 30 };
  }
}
