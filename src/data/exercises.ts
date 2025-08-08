import { Exercise, Equipment, MuscleGroup, ExerciseCategory } from '../types';

export const EXERCISES: Exercise[] = [
  // Chest Exercises
  {
    id: 'bench_press_barbell',
    name: 'Barbell Bench Press',
    muscleGroups: ['chest'],
    equipment: ['barbells', 'bench'],
    category: 'compound',
    sets: 4,
    reps: '6-8',
    rpe: 8,
    restTime: 180,
    tempo: '3-1-3',
    notes: 'Focus on controlled descent, explosive press',
    progression: 'weight'
  },
  {
    id: 'bench_press_dumbbell',
    name: 'Dumbbell Bench Press',
    muscleGroups: ['chest'],
    equipment: ['dumbbells', 'bench'],
    category: 'compound',
    sets: 3,
    reps: '8-12',
    rpe: 8,
    restTime: 120,
    tempo: '3-1-3',
    notes: 'Greater range of motion than barbell',
    progression: 'weight'
  },
  {
    id: 'incline_press_barbell',
    name: 'Incline Barbell Press',
    muscleGroups: ['chest'],
    equipment: ['barbells', 'bench'],
    category: 'compound',
    sets: 3,
    reps: '8-10',
    rpe: 8,
    restTime: 150,
    tempo: '3-1-3',
    notes: 'Targets upper chest',
    progression: 'weight'
  },
  {
    id: 'decline_press',
    name: 'Decline Barbell Press',
    muscleGroups: ['chest'],
    equipment: ['barbells', 'bench'],
    category: 'compound',
    sets: 3,
    reps: '8-12',
    rpe: 8,
    restTime: 150,
    tempo: '3-1-3',
    notes: 'Targets lower chest',
    progression: 'weight'
  },
  {
    id: 'cable_flyes',
    name: 'Cable Flyes',
    muscleGroups: ['chest'],
    equipment: ['cables'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Constant tension throughout movement',
    progression: 'weight'
  },
  {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    muscleGroups: ['chest'],
    equipment: ['dumbbells', 'bench'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Focus on chest stretch and contraction',
    progression: 'weight'
  },

  // Back Exercises
  {
    id: 'deadlift',
    name: 'Barbell Deadlift',
    muscleGroups: ['back'],
    equipment: ['barbells'],
    category: 'compound',
    sets: 4,
    reps: '5-8',
    rpe: 9,
    restTime: 240,
    tempo: '1-1-3',
    notes: 'Focus on proper form and hip hinge',
    progression: 'weight'
  },
  {
    id: 'barbell_rows',
    name: 'Barbell Rows',
    muscleGroups: ['back'],
    equipment: ['barbells'],
    category: 'compound',
    sets: 4,
    reps: '8-12',
    rpe: 8,
    restTime: 150,
    tempo: '3-1-3',
    notes: 'Keep chest up, pull to lower chest',
    progression: 'weight'
  },
  {
    id: 'pull_ups',
    name: 'Pull-ups',
    muscleGroups: ['back'],
    equipment: [],
    category: 'compound',
    sets: 3,
    reps: '6-12',
    rpe: 8,
    restTime: 120,
    tempo: '3-1-3',
    notes: 'Full range of motion, controlled descent',
    progression: 'reps'
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['back'],
    equipment: ['machines'],
    category: 'compound',
    sets: 3,
    reps: '10-12',
    rpe: 8,
    restTime: 120,
    tempo: '3-1-3',
    notes: 'Pull to upper chest, squeeze shoulder blades',
    progression: 'weight'
  },
  {
    id: 'cable_rows',
    name: 'Cable Rows',
    muscleGroups: ['back'],
    equipment: ['cables'],
    category: 'compound',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Constant tension, focus on mid-back',
    progression: 'weight'
  },
  {
    id: 'face_pulls',
    name: 'Face Pulls',
    muscleGroups: ['back'],
    equipment: ['cables'],
    category: 'isolation',
    sets: 3,
    reps: '15-20',
    rpe: 6,
    restTime: 60,
    tempo: '2-1-2',
    notes: 'Great for shoulder health and posture',
    progression: 'weight'
  },

  // Shoulder Exercises
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    muscleGroups: ['shoulders'],
    equipment: ['barbells'],
    category: 'compound',
    sets: 4,
    reps: '6-10',
    rpe: 8,
    restTime: 180,
    tempo: '3-1-3',
    notes: 'Press directly overhead, avoid arching',
    progression: 'weight'
  },
  {
    id: 'dumbbell_press',
    name: 'Dumbbell Shoulder Press',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    category: 'compound',
    sets: 3,
    reps: '8-12',
    rpe: 8,
    restTime: 120,
    tempo: '3-1-3',
    notes: 'Greater range of motion than barbell',
    progression: 'weight'
  },
  {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Raise to shoulder height, slight forward angle',
    progression: 'weight'
  },
  {
    id: 'rear_delt_flyes',
    name: 'Rear Delt Flyes',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '15-20',
    rpe: 6,
    restTime: 60,
    tempo: '3-1-3',
    notes: 'Bent over position, focus on rear delts',
    progression: 'weight'
  },
  {
    id: 'upright_rows',
    name: 'Upright Rows',
    muscleGroups: ['shoulders'],
    equipment: ['barbells'],
    category: 'compound',
    sets: 3,
    reps: '10-12',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Keep bar close to body',
    progression: 'weight'
  },

  // Arm Exercises
  {
    id: 'barbell_curls',
    name: 'Barbell Curls',
    muscleGroups: ['arms'],
    equipment: ['barbells'],
    category: 'isolation',
    sets: 3,
    reps: '10-12',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Keep elbows at sides, full range of motion',
    progression: 'weight'
  },
  {
    id: 'dumbbell_curls',
    name: 'Dumbbell Curls',
    muscleGroups: ['arms'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Alternate arms or both together',
    progression: 'weight'
  },
  {
    id: 'hammer_curls',
    name: 'Hammer Curls',
    muscleGroups: ['arms'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Targets brachialis and forearms',
    progression: 'weight'
  },
  {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    muscleGroups: ['arms'],
    equipment: [],
    category: 'compound',
    sets: 3,
    reps: '8-12',
    rpe: 8,
    restTime: 120,
    tempo: '3-1-3',
    notes: 'Keep elbows close to body',
    progression: 'reps'
  },
  {
    id: 'tricep_pushdowns',
    name: 'Tricep Pushdowns',
    muscleGroups: ['arms'],
    equipment: ['cables'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Keep elbows at sides',
    progression: 'weight'
  },
  {
    id: 'skull_crushers',
    name: 'Skull Crushers',
    muscleGroups: ['arms'],
    equipment: ['barbells', 'bench'],
    category: 'isolation',
    sets: 3,
    reps: '10-12',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Lower bar to forehead, extend elbows',
    progression: 'weight'
  },

  // Leg Exercises
  {
    id: 'squat',
    name: 'Barbell Squat',
    muscleGroups: ['legs'],
    equipment: ['barbells', 'squat_rack'],
    category: 'compound',
    sets: 4,
    reps: '6-10',
    rpe: 8,
    restTime: 240,
    tempo: '3-1-3',
    notes: 'Break at hips and knees simultaneously',
    progression: 'weight'
  },
  {
    id: 'deadlift_romanian',
    name: 'Romanian Deadlift',
    muscleGroups: ['legs'],
    equipment: ['barbells'],
    category: 'compound',
    sets: 3,
    reps: '8-12',
    rpe: 8,
    restTime: 180,
    tempo: '3-1-3',
    notes: 'Focus on hamstring stretch',
    progression: 'weight'
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    muscleGroups: ['legs'],
    equipment: ['machines'],
    category: 'compound',
    sets: 3,
    reps: '10-15',
    rpe: 8,
    restTime: 180,
    tempo: '3-1-3',
    notes: 'Full range of motion, don\'t lock out',
    progression: 'weight'
  },
  {
    id: 'leg_extensions',
    name: 'Leg Extensions',
    muscleGroups: ['legs'],
    equipment: ['machines'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Focus on quad contraction',
    progression: 'weight'
  },
  {
    id: 'leg_curls',
    name: 'Leg Curls',
    muscleGroups: ['legs'],
    equipment: ['machines'],
    category: 'isolation',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Focus on hamstring contraction',
    progression: 'weight'
  },
  {
    id: 'calf_raises',
    name: 'Standing Calf Raises',
    muscleGroups: ['legs'],
    equipment: ['machines'],
    category: 'isolation',
    sets: 4,
    reps: '15-20',
    rpe: 7,
    restTime: 60,
    tempo: '2-1-2',
    notes: 'Full range of motion, pause at top',
    progression: 'weight'
  },

  // Core Exercises
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['core'],
    equipment: [],
    category: 'abs',
    sets: 3,
    reps: '30-60s',
    rpe: 6,
    restTime: 60,
    tempo: 'hold',
    notes: 'Keep body straight, engage core',
    progression: 'duration'
  },
  {
    id: 'crunches',
    name: 'Crunches',
    muscleGroups: ['core'],
    equipment: [],
    category: 'abs',
    sets: 3,
    reps: '15-20',
    rpe: 6,
    restTime: 45,
    tempo: '2-1-2',
    notes: 'Focus on upper abs',
    progression: 'reps'
  },
  {
    id: 'leg_raises',
    name: 'Leg Raises',
    muscleGroups: ['core'],
    equipment: [],
    category: 'abs',
    sets: 3,
    reps: '12-15',
    rpe: 7,
    restTime: 60,
    tempo: '3-1-3',
    notes: 'Lower legs slowly, don\'t swing',
    progression: 'reps'
  },
  {
    id: 'russian_twists',
    name: 'Russian Twists',
    muscleGroups: ['core'],
    equipment: [],
    category: 'abs',
    sets: 3,
    reps: '20-30',
    rpe: 6,
    restTime: 45,
    tempo: 'controlled',
    notes: 'Rotate from core, not arms',
    progression: 'reps'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    muscleGroups: ['core'],
    equipment: [],
    category: 'abs',
    sets: 3,
    reps: '30-45s',
    rpe: 7,
    restTime: 60,
    tempo: 'fast',
    notes: 'Keep core engaged throughout',
    progression: 'duration'
  },

  // Forearm Exercises
  {
    id: 'zottman_curls',
    name: 'Zottman Curls',
    muscleGroups: ['forearms', 'arms'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '10-12',
    rpe: 7,
    restTime: 90,
    tempo: '3-1-3',
    notes: 'Curl up, rotate, lower slowly',
    progression: 'weight'
  },
  {
    id: 'wrist_curls',
    name: 'Wrist Curls',
    muscleGroups: ['forearms'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '15-20',
    rpe: 6,
    restTime: 60,
    tempo: '2-1-2',
    notes: 'Full range of motion',
    progression: 'weight'
  },
  {
    id: 'reverse_wrist_curls',
    name: 'Reverse Wrist Curls',
    muscleGroups: ['forearms'],
    equipment: ['dumbbells'],
    category: 'isolation',
    sets: 3,
    reps: '15-20',
    rpe: 6,
    restTime: 60,
    tempo: '2-1-2',
    notes: 'Targets extensor muscles',
    progression: 'weight'
  },
  {
    id: 'farmers_carries',
    name: 'Farmer\'s Carries',
    muscleGroups: ['forearms'],
    equipment: ['dumbbells'],
    category: 'accessory',
    sets: 3,
    reps: '30-60s',
    rpe: 7,
    restTime: 90,
    tempo: 'walk',
    notes: 'Walk with heavy dumbbells',
    progression: 'weight'
  },
  {
    id: 'plate_pinch',
    name: 'Plate Pinch',
    muscleGroups: ['forearms'],
    equipment: [],
    category: 'isolation',
    sets: 3,
    reps: '30-45s',
    rpe: 6,
    restTime: 60,
    tempo: 'hold',
    notes: 'Pinch weight plates together',
    progression: 'weight'
  }
];

// Helper functions to filter exercises
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return EXERCISES.filter(exercise => 
    exercise.muscleGroups.includes(muscleGroup)
  );
}

export function getExercisesByEquipment(equipment: Equipment[]): Exercise[] {
  return EXERCISES.filter(exercise => 
    equipment.some(eq => exercise.equipment.includes(eq))
  );
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISES.filter(exercise => exercise.category === category);
}

export function getCompoundExercises(): Exercise[] {
  return EXERCISES.filter(exercise => exercise.category === 'compound');
}

export function getIsolationExercises(): Exercise[] {
  return EXERCISES.filter(exercise => exercise.category === 'isolation');
}

export function getAccessoryExercises(): Exercise[] {
  return EXERCISES.filter(exercise => exercise.category === 'accessory');
}

export function getAbsExercises(): Exercise[] {
  return EXERCISES.filter(exercise => exercise.category === 'abs');
}

export function getForearmExercises(): Exercise[] {
  return EXERCISES.filter(exercise => 
    exercise.muscleGroups.includes('forearms')
  );
}
