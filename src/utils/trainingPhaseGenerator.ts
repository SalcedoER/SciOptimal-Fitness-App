import { 
  UserProfile, 
  TrainingPhase, 
  TrainingSplit, 
  TrainingDay, 
  Exercise, 
  MuscleGroup, 
  PhaseFocus,
  CardioSession,
  CardioIntensity
} from '../types';
import { 
  calculateCardioPlan 
} from './scientificCalculations';
import { 
  getExercisesByEquipment,
  getAbsExercises
} from '../data/exercises';

// Phase 1: Lean Recomp (8 weeks)
export function generatePhase1(userProfile: UserProfile): TrainingPhase {
  const trainingSplit = generateLeanRecompSplit(userProfile);
  
  return {
    id: 'phase_1_lean_recomp',
    name: 'Phase 1: Lean Recomp',
    duration: 8,
    targetWeight: 186, // 84.4 kg
    targetBodyFat: 14,
    focus: 'lean_recomp',
    trainingSplit,
    createdAt: new Date(),
    nutritionPlan: {
      targetCalories: 2650,
      macros: {
        protein_g: 200,
        carbs_g: 250,
        fat_g: 70,
        fiber_g: 35,
        sodium_mg: 2100
      },
      mealTiming: {
        preWorkout: 90,
        postWorkout: 30,
        mealFrequency: 4,
        fastingWindow: 12
      },
      hydration: {
        dailyWater: 4.0, // liters
        preWorkout: 0.5,
        duringWorkout: 0.5,
        postWorkout: 0.5
      },
      debloatMode: true,
      supplements: [
        {
          name: 'Creatine Monohydrate',
          dose: '5g daily',
          timing: 'Any time',
          purpose: 'Strength and power output'
        },
        {
          name: 'Whey Protein',
          dose: '30g post-workout',
          timing: 'Within 30 minutes',
          purpose: 'Muscle protein synthesis'
        }
      ]
    },
    cardioPlan: {
      frequency: 5,
      duration: 30,
      intensity: 'moderate',
      type: 'treadmill',
      timing: 'post_workout'
    },
    progressionRules: [
      {
        type: 'weight',
        condition: 'If RPE < 8 for 2 consecutive sessions',
        action: 'Increase weight by 2.5kg for compound, 1kg for isolation'
      },
      {
        type: 'reps',
        condition: 'If RPE < 7 for 3 consecutive sessions',
        action: 'Increase reps by 1-2 per set'
      },
      {
        type: 'rpe',
        condition: 'If consistently hitting RPE 9+',
        action: 'Reduce weight by 5% to maintain proper form'
      }
    ]
  };
}

// Phase 2: Muscle Gain (6-10 weeks)
export function generatePhase2(userProfile: UserProfile): TrainingPhase {
  const trainingSplit = generateMuscleGainSplit(userProfile);
  
  return {
    id: 'phase_2_muscle_gain',
    name: 'Phase 2: Muscle Gain',
    duration: 8,
    targetWeight: 190, // 86.2 kg
    targetBodyFat: 16,
    focus: 'muscle_gain',
    trainingSplit,
    createdAt: new Date(),
    nutritionPlan: {
      targetCalories: 2900,
      macros: {
        protein_g: 220,
        carbs_g: 320,
        fat_g: 65,
        fiber_g: 40,
        sodium_mg: 2300
      },
      mealTiming: {
        preWorkout: 120,
        postWorkout: 30,
        mealFrequency: 5,
        fastingWindow: 10
      },
      hydration: {
        dailyWater: 4.5,
        preWorkout: 0.7,
        duringWorkout: 0.7,
        postWorkout: 0.7
      },
      debloatMode: false,
      supplements: [
        {
          name: 'Creatine Monohydrate',
          dose: '5g daily',
          timing: 'Any time',
          purpose: 'Strength and power output'
        },
        {
          name: 'Whey Protein',
          dose: '40g post-workout',
          timing: 'Within 30 minutes',
          purpose: 'Muscle protein synthesis'
        },
        {
          name: 'BCAAs',
          dose: '10g during workout',
          timing: 'During training',
          purpose: 'Muscle preservation'
        }
      ]
    },
    cardioPlan: {
      frequency: 3,
      duration: 20,
      intensity: 'low',
      type: 'treadmill',
      timing: 'post_workout'
    },
    progressionRules: [
      {
        type: 'weight',
        condition: 'If RPE < 8 for 2 consecutive sessions',
        action: 'Increase weight by 2.5kg for compound, 1kg for isolation'
      },
      {
        type: 'volume',
        condition: 'If consistently hitting RPE 7-8',
        action: 'Add 1 set to compound movements'
      },
      {
        type: 'rpe',
        condition: 'If consistently hitting RPE 9+',
        action: 'Reduce weight by 5% to maintain proper form'
      }
    ]
  };
}

// Phase 3: Final Cut (6 weeks)
export function generatePhase3(userProfile: UserProfile): TrainingPhase {
  const trainingSplit = generateFinalCutSplit(userProfile);
  
  return {
    id: 'phase_3_final_cut',
    name: 'Phase 3: Final Cut',
    duration: 6,
    targetWeight: 186, // 84.4 kg
    targetBodyFat: 12,
    focus: 'final_cut',
    trainingSplit,
    createdAt: new Date(),
    nutritionPlan: {
      targetCalories: 2200,
      macros: {
        protein_g: 240,
        carbs_g: 180,
        fat_g: 75,
        fiber_g: 30,
        sodium_mg: 2000
      },
      mealTiming: {
        preWorkout: 60,
        postWorkout: 45,
        mealFrequency: 3,
        fastingWindow: 14
      },
      hydration: {
        dailyWater: 5.0,
        preWorkout: 0.5,
        duringWorkout: 0.8,
        postWorkout: 0.8
      },
      debloatMode: true,
      supplements: [
        {
          name: 'Creatine Monohydrate',
          dose: '5g daily',
          timing: 'Any time',
          purpose: 'Maintain strength during deficit'
        },
        {
          name: 'Whey Protein',
          dose: '35g post-workout',
          timing: 'Within 30 minutes',
          purpose: 'Muscle protein synthesis'
        },
        {
          name: 'Caffeine',
          dose: '200mg pre-workout',
          timing: '30 minutes before',
          purpose: 'Fat oxidation and performance'
        }
      ]
    },
    cardioPlan: {
      frequency: 6,
      duration: 45,
      intensity: 'moderate',
      type: 'treadmill',
      timing: 'post_workout'
    },
    progressionRules: [
      {
        type: 'weight',
        condition: 'If RPE < 8 for 2 consecutive sessions',
        action: 'Increase weight by 2.5kg for compound, 1kg for isolation'
      },
      {
        type: 'intensity',
        condition: 'If consistently hitting RPE 7-8',
        action: 'Reduce rest time by 15 seconds'
      },
      {
        type: 'rpe',
        condition: 'If consistently hitting RPE 9+',
        action: 'Reduce weight by 5% to maintain proper form'
      }
    ]
  };
}

// Generate training splits for each phase
function generateLeanRecompSplit(userProfile: UserProfile): TrainingSplit {
  const availableExercises = getExercisesByEquipment(userProfile.equipment);
  
  const days: TrainingDay[] = [
    // Day 1: Chest + Abs + Forearms
    {
      dayNumber: 1,
      muscleGroups: ['chest', 'core', 'forearms'],
      exercises: selectExercises(availableExercises, ['chest'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['chest'], 'isolation', 2),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('lean_recomp')
    },
    // Day 2: Back + Abs + Forearms
    {
      dayNumber: 2,
      muscleGroups: ['back', 'core', 'forearms'],
      exercises: selectExercises(availableExercises, ['back'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['back'], 'isolation', 2),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('lean_recomp')
    },
    // Day 3: Shoulders + Abs
    {
      dayNumber: 3,
      muscleGroups: ['shoulders', 'core'],
      exercises: selectExercises(availableExercises, ['shoulders'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['shoulders'], 'isolation', 2),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('lean_recomp')
    },
    // Day 4: Arms + Abs + Optional Forearms
    {
      dayNumber: 4,
      muscleGroups: ['arms', 'core', 'forearms'],
      exercises: selectExercises(availableExercises, ['arms'], 'compound', 1),
      accessories: selectExercises(availableExercises, ['arms'], 'isolation', 3),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('lean_recomp')
    },
    // Day 5: Legs + Core
    {
      dayNumber: 5,
      muscleGroups: ['legs', 'core'],
      exercises: selectExercises(availableExercises, ['legs'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['legs'], 'isolation', 2),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('lean_recomp')
    },
    // Day 6: Back or Shoulders (Rotating emphasis)
    {
      dayNumber: 6,
      muscleGroups: ['back', 'shoulders'],
      exercises: selectExercises(availableExercises, ['back'], 'compound', 1),
      accessories: selectExercises(availableExercises, ['shoulders'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('lean_recomp')
    }
  ];

  return {
    days,
    restDays: [7],
    rotationPattern: ['back', 'shoulders']
  };
}

function generateMuscleGainSplit(userProfile: UserProfile): TrainingSplit {
  const availableExercises = getExercisesByEquipment(userProfile.equipment);
  
  const days: TrainingDay[] = [
    // Day 1: Chest + Triceps
    {
      dayNumber: 1,
      muscleGroups: ['chest', 'arms'],
      exercises: selectExercises(availableExercises, ['chest'], 'compound', 3),
      accessories: selectExercises(availableExercises, ['chest'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('muscle_gain')
    },
    // Day 2: Back + Biceps
    {
      dayNumber: 2,
      muscleGroups: ['back', 'arms'],
      exercises: selectExercises(availableExercises, ['back'], 'compound', 3),
      accessories: selectExercises(availableExercises, ['back'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('muscle_gain')
    },
    // Day 3: Shoulders + Forearms
    {
      dayNumber: 3,
      muscleGroups: ['shoulders', 'forearms'],
      exercises: selectExercises(availableExercises, ['shoulders'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['shoulders'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('muscle_gain')
    },
    // Day 4: Legs
    {
      dayNumber: 4,
      muscleGroups: ['legs'],
      exercises: selectExercises(availableExercises, ['legs'], 'compound', 3),
      accessories: selectExercises(availableExercises, ['legs'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('muscle_gain')
    },
    // Day 5: Arms + Abs
    {
      dayNumber: 5,
      muscleGroups: ['arms', 'core'],
      exercises: selectExercises(availableExercises, ['arms'], 'compound', 1),
      accessories: selectExercises(availableExercises, ['arms'], 'isolation', 4),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('muscle_gain')
    }
  ];

  return {
    days,
    restDays: [6, 7]
  };
}

function generateFinalCutSplit(userProfile: UserProfile): TrainingSplit {
  const availableExercises = getExercisesByEquipment(userProfile.equipment);
  
  const days: TrainingDay[] = [
    // Day 1: Upper Body Push
    {
      dayNumber: 1,
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exercises: selectExercises(availableExercises, ['chest'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['shoulders', 'arms'], 'isolation', 3),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('final_cut')
    },
    // Day 2: Upper Body Pull
    {
      dayNumber: 2,
      muscleGroups: ['back', 'arms'],
      exercises: selectExercises(availableExercises, ['back'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['back', 'arms'], 'isolation', 3),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('final_cut')
    },
    // Day 3: Legs + Core
    {
      dayNumber: 3,
      muscleGroups: ['legs', 'core'],
      exercises: selectExercises(availableExercises, ['legs'], 'compound', 2),
      accessories: selectExercises(availableExercises, ['legs'], 'isolation', 2),
      abs: selectAbsExercises(3),
      cardio: generateCardioSession('final_cut')
    },
    // Day 4: Full Body
    {
      dayNumber: 4,
      muscleGroups: ['chest', 'back', 'legs'],
      exercises: selectExercises(availableExercises, ['chest', 'back', 'legs'], 'compound', 1),
      accessories: selectExercises(availableExercises, ['arms', 'shoulders'], 'isolation', 2),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('final_cut')
    },
    // Day 5: Arms + Forearms
    {
      dayNumber: 5,
      muscleGroups: ['arms', 'forearms'],
      exercises: selectExercises(availableExercises, ['arms'], 'compound', 1),
      accessories: selectExercises(availableExercises, ['arms', 'forearms'], 'isolation', 4),
      abs: selectAbsExercises(2),
      cardio: generateCardioSession('final_cut')
    }
  ];

  return {
    days,
    restDays: [6, 7]
  };
}

// Helper functions
function selectExercises(
  availableExercises: Exercise[], 
  muscleGroups: MuscleGroup[], 
  category: 'compound' | 'isolation', 
  count: number
): Exercise[] {
  const filtered = availableExercises.filter(exercise => 
    exercise.category === category && 
    exercise.muscle_group.some(mg => muscleGroups.indexOf(mg) !== -1)
  );
  
  // Shuffle and select
  return shuffleArray(filtered).slice(0, count);
}

function selectAbsExercises(count: number): Exercise[] {
  const absExercises = getAbsExercises();
  return shuffleArray(absExercises).slice(0, count);
}

function generateCardioSession(phase: PhaseFocus): CardioSession {
  const cardioPlan = calculateCardioPlan(phase);
  
  return {
    type: 'treadmill',
    duration: cardioPlan.duration,
    intensity: cardioPlan.intensity as CardioIntensity,
    rpe: phase === 'muscle_gain' ? 3 : 4,
    incline: 6.0,
    speed: 3.5
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate complete training program based on user profile
export function generateTrainingProgram(userProfile: UserProfile): TrainingPhase[] {
  return [
    generatePhase1(userProfile),
    generatePhase2(userProfile),
    generatePhase3(userProfile)
  ];
}
