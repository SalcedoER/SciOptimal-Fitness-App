import { UserProfile, WorkoutSession } from '../store';
import { GeneratedWorkout } from './workoutGenerator';
import { RecoveryScore } from './sleepIntelligence';

export interface WorkoutAdaptation {
  originalWorkout: GeneratedWorkout;
  adaptedWorkout: GeneratedWorkout;
  changes: WorkoutChange[];
  reason: string;
  confidence: number;
}

export interface WorkoutChange {
  type: 'intensity' | 'duration' | 'exercises' | 'volume' | 'rest';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PerformanceMetrics {
  strength: number; // 0-100
  endurance: number; // 0-100
  power: number; // 0-100
  consistency: number; // 0-100
  recovery: number; // 0-100
}

export class WorkoutAdaptationService {
  /**
   * Adapt workout based on performance and recovery data
   */
  static adaptWorkout(
    originalWorkout: GeneratedWorkout,
    userProfile: UserProfile,
    workoutHistory: WorkoutSession[],
    recoveryScore: RecoveryScore
  ): WorkoutAdaptation {
    const changes: WorkoutChange[] = [];
    let adaptedWorkout = { ...originalWorkout };
    let reason = '';
    let confidence = 0.8;

    // Analyze recent performance
    const performanceMetrics = this.analyzePerformance(workoutHistory);
    const recentTrends = this.analyzeRecentTrends(workoutHistory);

    // Adapt based on recovery score
    if (recoveryScore.overall < 40) {
      // Poor recovery - reduce intensity significantly
      adaptedWorkout = this.reduceIntensity(adaptedWorkout, 0.6);
      changes.push({
        type: 'intensity',
        description: 'Reduced intensity by 40% due to poor recovery',
        impact: 'positive'
      });
      reason = 'Poor recovery detected - prioritizing rest and recovery';
      confidence = 0.9;
    } else if (recoveryScore.overall < 60) {
      // Moderate recovery - slight reduction
      adaptedWorkout = this.reduceIntensity(adaptedWorkout, 0.8);
      changes.push({
        type: 'intensity',
        description: 'Reduced intensity by 20% due to moderate recovery',
        impact: 'positive'
      });
      reason = 'Moderate recovery - slightly reduced intensity for safety';
      confidence = 0.8;
    } else if (recoveryScore.overall > 80) {
      // Excellent recovery - can increase intensity
      adaptedWorkout = this.increaseIntensity(adaptedWorkout, 1.1);
      changes.push({
        type: 'intensity',
        description: 'Increased intensity by 10% due to excellent recovery',
        impact: 'positive'
      });
      reason = 'Excellent recovery - increased intensity for optimal gains';
      confidence = 0.7;
    }

    // Adapt based on performance trends
    if (recentTrends.strengthDeclining) {
      adaptedWorkout = this.focusOnStrength(adaptedWorkout);
      changes.push({
        type: 'exercises',
        description: 'Added more compound strength exercises',
        impact: 'positive'
      });
      reason += ' | Strength plateau detected - focusing on compound movements';
    }

    if (recentTrends.enduranceDeclining) {
      adaptedWorkout = this.focusOnEndurance(adaptedWorkout);
      changes.push({
        type: 'exercises',
        description: 'Added more endurance-focused exercises',
        impact: 'positive'
      });
      reason += ' | Endurance plateau detected - increasing cardio focus';
    }

    // Adapt based on consistency
    if (performanceMetrics.consistency < 60) {
      adaptedWorkout = this.simplifyWorkout(adaptedWorkout);
      changes.push({
        type: 'exercises',
        description: 'Simplified workout for better consistency',
        impact: 'positive'
      });
      reason += ' | Low consistency - simplified for better adherence';
    }

    // Adapt based on user goals
    if (userProfile.targetPhysique.toLowerCase().includes('muscle')) {
      adaptedWorkout = this.optimizeForMuscleGain(adaptedWorkout);
      changes.push({
        type: 'volume',
        description: 'Optimized for muscle growth - increased volume',
        impact: 'positive'
      });
    } else if (userProfile.targetPhysique.toLowerCase().includes('lean')) {
      adaptedWorkout = this.optimizeForFatLoss(adaptedWorkout);
      changes.push({
        type: 'exercises',
        description: 'Optimized for fat loss - added more cardio',
        impact: 'positive'
      });
    }

    return {
      originalWorkout,
      adaptedWorkout,
      changes,
      reason: reason || 'Standard workout adaptation',
      confidence
    };
  }

  /**
   * Analyze performance metrics from workout history
   */
  private static analyzePerformance(workoutHistory: WorkoutSession[]): PerformanceMetrics {
    if (workoutHistory.length === 0) {
      return { strength: 50, endurance: 50, power: 50, consistency: 50, recovery: 50 };
    }

    const recentWorkouts = workoutHistory.slice(-10);
    
    // Calculate strength (based on RPE and duration)
    const avgRPE = recentWorkouts.reduce((sum, w) => sum + (w.rpe || 5), 0) / recentWorkouts.length;
    const strength = Math.min(100, avgRPE * 10);

    // Calculate endurance (based on workout duration)
    const avgDuration = recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / recentWorkouts.length;
    const endurance = Math.min(100, (avgDuration / 60) * 20); // 60 min = 100%

    // Calculate power (based on high-intensity workouts)
    const highIntensityWorkouts = recentWorkouts.filter(w => (w.rpe || 0) > 8).length;
    const power = Math.min(100, (highIntensityWorkouts / recentWorkouts.length) * 100);

    // Calculate consistency (based on workout frequency)
    const daysSinceFirst = (Date.now() - new Date(recentWorkouts[0].date).getTime()) / (1000 * 60 * 60 * 24);
    const consistency = Math.min(100, (recentWorkouts.length / daysSinceFirst) * 7 * 10);

    // Calculate recovery (based on RPE progression)
    const rpeProgression = this.calculateRPEProgression(recentWorkouts);
    const recovery = Math.max(0, 100 - (rpeProgression * 20));

    return { strength, endurance, power, consistency, recovery };
  }

  /**
   * Analyze recent trends
   */
  private static analyzeRecentTrends(workoutHistory: WorkoutSession[]): {
    strengthDeclining: boolean;
    enduranceDeclining: boolean;
    volumeDeclining: boolean;
  } {
    if (workoutHistory.length < 6) {
      return { strengthDeclining: false, enduranceDeclining: false, volumeDeclining: false };
    }

    const recent = workoutHistory.slice(-3);
    const previous = workoutHistory.slice(-6, -3);

    const recentAvgRPE = recent.reduce((sum, w) => sum + (w.rpe || 5), 0) / recent.length;
    const previousAvgRPE = previous.reduce((sum, w) => sum + (w.rpe || 5), 0) / previous.length;

    const recentAvgDuration = recent.reduce((sum, w) => sum + (w.duration || 0), 0) / recent.length;
    const previousAvgDuration = previous.reduce((sum, w) => sum + (w.duration || 0), 0) / previous.length;

    return {
      strengthDeclining: recentAvgRPE < previousAvgRPE - 0.5,
      enduranceDeclining: recentAvgDuration < previousAvgDuration - 10,
      volumeDeclining: recent.length < previous.length
    };
  }

  /**
   * Calculate RPE progression (positive = increasing difficulty)
   */
  private static calculateRPEProgression(workouts: WorkoutSession[]): number {
    if (workouts.length < 3) return 0;

    const rpeValues = workouts.map(w => w.rpe || 5);
    let progression = 0;
    
    for (let i = 1; i < rpeValues.length; i++) {
      progression += rpeValues[i] - rpeValues[i - 1];
    }
    
    return progression / (rpeValues.length - 1);
  }

  /**
   * Reduce workout intensity
   */
  private static reduceIntensity(workout: GeneratedWorkout, factor: number): GeneratedWorkout {
    return {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: Math.max(1, Math.round(exercise.sets * factor)),
        reps: exercise.reps.replace(/\d+/g, (match) => 
          Math.max(1, Math.round(parseInt(match) * factor)).toString()
        )
      })),
      duration: Math.round(workout.duration * factor)
    };
  }

  /**
   * Increase workout intensity
   */
  private static increaseIntensity(workout: GeneratedWorkout, factor: number): GeneratedWorkout {
    return {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: Math.round(exercise.sets * factor),
        reps: exercise.reps.replace(/\d+/g, (match) => 
          Math.round(parseInt(match) * factor).toString()
        )
      })),
      duration: Math.round(workout.duration * factor)
    };
  }

  /**
   * Focus on strength training
   */
  private static focusOnStrength(workout: GeneratedWorkout): GeneratedWorkout {
    const strengthExercises = [
      'Barbell Squat', 'Deadlift', 'Bench Press', 'Overhead Press', 'Barbell Row',
      'Pull-ups', 'Dips', 'Lunges', 'Bulgarian Split Squats'
    ];

    return {
      ...workout,
      exercises: [
        ...workout.exercises,
        ...strengthExercises.slice(0, 2).map(name => ({
          id: `strength_${Date.now()}_${Math.random()}`,
          name,
          category: 'compound' as const,
          muscleGroups: ['compound'],
          equipment: ['barbell', 'dumbbells'],
          difficulty: 'intermediate' as const,
          sets: 4,
          reps: '6-8',
          restTime: 180,
          notes: 'Added for strength focus',
          scientificRationale: 'Compound movements for maximum strength development'
        }))
      ]
    };
  }

  /**
   * Focus on endurance training
   */
  private static focusOnEndurance(workout: GeneratedWorkout): GeneratedWorkout {
    const enduranceExercises = [
      'Burpees', 'Mountain Climbers', 'Jumping Jacks', 'High Knees',
      'Plank', 'Russian Twists', 'Jump Squats', 'Push-ups'
    ];

    return {
      ...workout,
      exercises: [
        ...workout.exercises,
        ...enduranceExercises.slice(0, 3).map(name => ({
          id: `endurance_${Date.now()}_${Math.random()}`,
          name,
          category: 'cardio' as const,
          muscleGroups: ['cardio'],
          equipment: ['bodyweight'],
          difficulty: 'beginner' as const,
          sets: 3,
          reps: '30-45 seconds',
          restTime: 60,
          notes: 'Added for endurance focus',
          scientificRationale: 'High-intensity cardio for endurance development'
        }))
      ]
    };
  }

  /**
   * Simplify workout for better consistency
   */
  private static simplifyWorkout(workout: GeneratedWorkout): GeneratedWorkout {
    return {
      ...workout,
      exercises: workout.exercises.slice(0, 4), // Keep only first 4 exercises
      duration: Math.min(workout.duration, 30) // Cap at 30 minutes
    };
  }

  /**
   * Optimize for muscle gain
   */
  private static optimizeForMuscleGain(workout: GeneratedWorkout): GeneratedWorkout {
    return {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: Math.max(exercise.sets, 4),
        reps: exercise.reps.replace(/\d+/g, (match) => 
          Math.max(parseInt(match), 8).toString()
        )
      }))
    };
  }

  /**
   * Optimize for fat loss
   */
  private static optimizeForFatLoss(workout: GeneratedWorkout): GeneratedWorkout {
    const cardioExercises = [
      'Burpees', 'Mountain Climbers', 'Jumping Jacks', 'High Knees',
      'Jump Squats', 'Push-ups', 'Plank', 'Russian Twists'
    ];

    return {
      ...workout,
      exercises: [
        ...workout.exercises,
        ...cardioExercises.slice(0, 2).map(name => ({
          id: `cardio_${Date.now()}_${Math.random()}`,
          name,
          category: 'cardio' as const,
          muscleGroups: ['cardio'],
          equipment: ['bodyweight'],
          difficulty: 'beginner' as const,
          sets: 3,
          reps: '45-60 seconds',
          restTime: 30,
          notes: 'Added for fat loss focus',
          scientificRationale: 'High-intensity cardio for fat loss and conditioning'
        }))
      ],
      duration: Math.max(workout.duration, 45) // Minimum 45 minutes
    };
  }

  /**
   * Get workout recommendation based on current state
   */
  static getWorkoutRecommendation(
    userProfile: UserProfile,
    workoutHistory: WorkoutSession[],
    recoveryScore: RecoveryScore
  ): {
    shouldWorkout: boolean;
    recommendedType: string;
    intensity: string;
    duration: string;
    focus: string;
  } {
    if (recoveryScore.overall < 30) {
      return {
        shouldWorkout: false,
        recommendedType: 'Rest Day',
        intensity: 'None',
        duration: '0 minutes',
        focus: 'Recovery and sleep'
      };
    }

    if (recoveryScore.overall < 60) {
      return {
        shouldWorkout: true,
        recommendedType: 'Light Recovery',
        intensity: 'Low',
        duration: '20-30 minutes',
        focus: 'Mobility and light cardio'
      };
    }

    if (recoveryScore.overall >= 80) {
      return {
        shouldWorkout: true,
        recommendedType: 'High Intensity',
        intensity: 'High',
        duration: '60+ minutes',
        focus: 'Strength and power training'
      };
    }

    return {
      shouldWorkout: true,
      recommendedType: 'Moderate Training',
      intensity: 'Medium',
      duration: '45-60 minutes',
      focus: 'Balanced training'
    };
  }
}
