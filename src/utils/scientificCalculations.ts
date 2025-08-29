import { UserProfile, ActivityLevel, TrainingPhase, MacroTargets, ProgressionRule } from '../types';

// Scientific data based on NSCA, ACSM, and ISSN guidelines
export const SCIENTIFIC_DATA = {
  // TDEE multipliers based on research (ACSM guidelines)
  tdeeMultipliers: [
    { activityLevel: 'sedentary', multiplier: 1.2, description: 'Little to no exercise' },
    { activityLevel: 'lightly_active', multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
    { activityLevel: 'moderately_active', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week' },
    { activityLevel: 'very_active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week' },
    { activityLevel: 'extremely_active', multiplier: 1.9, description: 'Very hard exercise, physical job' }
  ],
  
  // Protein requirements based on ISSN position stand
  proteinRequirements: {
    sedentary: 1.0, // g/kg bodyweight
    lightly_active: 1.2,
    moderately_active: 1.6,
    very_active: 2.0,
    extremely_active: 2.2,
    muscle_gain: 2.2, // Optimal for muscle building
    fat_loss: 2.4, // Higher protein to preserve muscle
    recomp: 2.2 // Balanced approach
  },
  
  // Rest intervals based on NSCA guidelines
  restIntervals: {
    strength: { min: 180, max: 300, unit: 'seconds' }, // 3-5 minutes for heavy compound lifts
    hypertrophy: { min: 60, max: 120, unit: 'seconds' }, // 1-2 minutes for muscle building
    endurance: { min: 30, max: 60, unit: 'seconds' }, // 30-60 seconds for muscular endurance
    power: { min: 180, max: 300, unit: 'seconds' } // 3-5 minutes for power movements
  },
  
  // Progression guidelines based on evidence
  progressionGuidelines: [
    {
      type: 'weight' as const,
      condition: 'RPE ≤ 7 for 2 consecutive sessions',
      action: 'Increase weight by 2.5-5kg (5-10lbs)',
      evidence: 'NSCA Strength Training Guidelines'
    },
    {
      type: 'reps' as const,
      condition: 'Achieving upper rep range consistently',
      action: 'Increase reps by 1-2 before increasing weight',
      evidence: 'ACSM Progressive Overload Principles'
    },
    {
      type: 'sets' as const,
      condition: 'Recovery allows additional volume',
      action: 'Add 1 set every 2-3 weeks',
      evidence: 'ISSN Volume Progression Research'
    },
    {
      type: 'rpe' as const,
      condition: 'RPE consistently below target range',
      action: 'Increase intensity or reduce rest time',
      evidence: 'RPE-based Training Studies'
    }
  ],
  
  // Recovery guidelines
  recoveryGuidelines: {
    muscleGroups: {
      small: 48, // hours (arms, calves, forearms)
      medium: 72, // hours (chest, back, shoulders)
      large: 96  // hours (legs, glutes)
    },
    cns: 72, // Central nervous system recovery
    connective: 120 // Tendon/ligament recovery
  }
};

// Calculate BMR using Mifflin-St Jeor formula (most accurate for general population)
// Note: height is in inches, converted to cm for calculation
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age } = profile;
  
  // Validate inputs
  if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
    console.warn('Invalid profile data for BMR calculation:', { weight, height, age });
    return 1800; // Safe default BMR
  }
  
  const isMale = true; // Assuming male for NFL fullback aesthetic
  
  // Convert height from inches to centimeters for BMR calculation
  const heightCm = height * 2.54;
  let bmr = (10 * weight) + (6.25 * heightCm) - (5 * age);
  bmr += isMale ? 5 : -161;
  
  // Ensure reasonable BMR range (1200-4000)
  bmr = Math.max(1200, Math.min(4000, bmr));
  
  return Math.round(bmr);
}

// Enhanced TDEE calculation with activity level validation
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = SCIENTIFIC_DATA.tdeeMultipliers.find(
    m => m.activityLevel === activityLevel
  )?.multiplier || 1.55;
  
  return Math.round(bmr * multiplier);
}

// Calculate lean body mass using body fat percentage
export function calculateLeanMass(weight: number, bodyFatPercentage: number): number {
  return weight * (1 - bodyFatPercentage / 100);
}

// Enhanced target calories based on phase and goals with scientific backing
export function calculateTargetCalories(
  profile: UserProfile, 
  phase: TrainingPhase
): number {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  
  switch (phase.focus) {
    case 'lean_recomp':
      // Small deficit for lean recomp (200-300 calories) - ISSN guidelines
      return tdee - 250;
    case 'muscle_gain':
      // Small surplus for muscle gain (200-300 calories) - NSCA guidelines
      return tdee + 250;
    case 'final_cut':
      // Larger deficit for final cut (500-700 calories) - ACSM guidelines
      return tdee - 600;
    default:
      return tdee;
  }
}

// Enhanced protein requirements based on ISSN position stand
export function calculateProteinRequirement(
  profile: UserProfile, 
  phase: TrainingPhase
): number {
  const leanMass = calculateLeanMass(profile.weight, profile.bodyFatPercentage);
  
  let proteinMultiplier: number;
  
  switch (phase.focus) {
    case 'lean_recomp':
      proteinMultiplier = SCIENTIFIC_DATA.proteinRequirements.recomp;
      break;
    case 'muscle_gain':
      proteinMultiplier = SCIENTIFIC_DATA.proteinRequirements.muscle_gain;
      break;
    case 'final_cut':
      proteinMultiplier = SCIENTIFIC_DATA.proteinRequirements.fat_loss;
      break;
    default:
      proteinMultiplier = SCIENTIFIC_DATA.proteinRequirements[profile.activityLevel] || 1.6;
  }
  
  return Math.round(leanMass * proteinMultiplier);
}

// Enhanced macro targets with scientific backing
export function calculateMacroTargets(
  weight: number,
  bodyFatPercentage: number,
  targetCalories: number,
  proteinMultiplier: number = 2.2,
  carbPercentage: number = 40,
  fatPercentage: number = 25
): MacroTargets {
  // Calculate protein based on lean mass (ISSN guidelines)
  const leanMass = weight * (1 - bodyFatPercentage / 100);
  const protein = Math.round(leanMass * proteinMultiplier);
  const proteinCalories = protein * 4;
  
  // Calculate remaining calories for carbs and fat
  const remainingCalories = targetCalories - proteinCalories;
  
  // Calculate carbs and fat based on percentages (ACSM guidelines)
  const carbCalories = (remainingCalories * carbPercentage) / 100;
  const fatCalories = (remainingCalories * fatPercentage) / 100;
  
  return {
    protein_g: protein,
    carbs_g: Math.round(carbCalories / 4),
    fat_g: Math.round(fatCalories / 9),
    fiber_g: Math.round(weight * 0.5), // 0.5g per kg bodyweight
    sodium_mg: 2300, // FDA daily value
    potassium_mg: 3500 // FDA daily value
  };
}

// Calculate optimal rest intervals based on training goal
export function calculateRestInterval(
  exerciseCategory: string,
  trainingGoal: 'strength' | 'hypertrophy' | 'endurance' | 'power'
): number {
  const restData = SCIENTIFIC_DATA.restIntervals[trainingGoal];
  return Math.round((restData.min + restData.max) / 2); // Return average
}

// Generate evidence-based progression rules
export function generateProgressionRules(
  userLevel: 'beginner' | 'intermediate' | 'advanced',
  focus: string
): ProgressionRule[] {
  const baseRules = [...SCIENTIFIC_DATA.progressionGuidelines];
  
  // Customize based on user level
  if (userLevel === 'beginner') {
    baseRules.push({
      type: 'weight',
      condition: 'Perfect form maintained for 3 consecutive sessions',
      action: 'Increase weight by 2.5kg (5lbs)',
      evidence: 'NSCA Beginner Guidelines'
    });
  } else if (userLevel === 'advanced') {
    baseRules.push({
      type: 'rpe',
      condition: 'RPE 8-9 maintained for 4 weeks',
      action: 'Increase weight by 1-2.5kg (2-5lbs)',
      evidence: 'Advanced Training Research'
    });
  }
  
  return baseRules;
}

// Calculate optimal training frequency based on muscle group size
export function calculateTrainingFrequency(muscleGroup: string): number {
  const sizeMap: Record<string, number> = {
    chest: 2, // 2x per week
    back: 2,  // 2x per week
    shoulders: 2, // 2x per week
    arms: 3,  // 3x per week (can handle more frequency)
    legs: 2,  // 2x per week
    core: 3,  // 3x per week
    forearms: 3 // 3x per week
  };
  
  return sizeMap[muscleGroup] || 2;
}

// Calculate optimal volume based on training experience
export function calculateOptimalVolume(
  experience: 'beginner' | 'intermediate' | 'advanced',
  muscleGroup: string
): { sets: number; reps: number } {
  const baseVolume = {
    beginner: { sets: 2, reps: 8 },
    intermediate: { sets: 3, reps: 8 },
    advanced: { sets: 4, reps: 8 }
  };
  
  const volume = baseVolume[experience];
  
  // Adjust for muscle group size
  if (['legs', 'back'].includes(muscleGroup)) {
    volume.sets = Math.max(2, volume.sets - 1); // Reduce sets for large muscle groups
  } else if (['arms', 'forearms'].includes(muscleGroup)) {
    volume.sets = Math.min(6, volume.sets + 1); // Increase sets for small muscle groups
  }
  
  return volume;
}

// Enhanced recovery time calculation
export function calculateRecoveryTime(
  muscleGroups: string[],
  intensity: number, // RPE scale
  volume: number // total sets
): number {
  let maxRecovery = 0;
  
  muscleGroups.forEach(group => {
    const baseRecovery = SCIENTIFIC_DATA.recoveryGuidelines.muscleGroups[
      ['arms', 'calves', 'forearms'].includes(group) ? 'small' :
      ['chest', 'back', 'shoulders'].includes(group) ? 'medium' : 'large'
    ];
    
    // Adjust for intensity and volume
    let adjustedRecovery = baseRecovery;
    if (intensity >= 8) adjustedRecovery += 24; // High intensity needs more recovery
    if (volume > 20) adjustedRecovery += 24; // High volume needs more recovery
    
    maxRecovery = Math.max(maxRecovery, adjustedRecovery);
  });
  
  return maxRecovery;
}

// Calculate optimal cardio duration and intensity based on training phase
export function calculateCardioPlan(phase: string): { duration: number; intensity: string } {
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
