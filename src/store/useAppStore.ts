import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  UserProfile, 
  TrainingPhase, 
  Exercise, 
  TrainingDay, 
  NutritionEntry, 
  WorkoutSession, 
  ProgressEntry,
  SleepEntry,
  WorkoutDay
} from '../types';

interface AppStore {
  userProfile: UserProfile | null;
  currentPhase: TrainingPhase | null;
  workoutHistory: WorkoutSession[];
  workoutDays: WorkoutDay[]; // Add support for WorkoutDay format
  nutritionLog: NutritionEntry[];
  sleepLog: SleepEntry[];
  corrections: any[];
  progressHistory: ProgressEntry[];
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  setCurrentPhase: (phase: TrainingPhase) => void;
  addWorkout: (workout: WorkoutSession) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  addWorkoutDay: (workout: WorkoutDay) => void; // Add WorkoutDay support
  addNutritionEntry: (entry: NutritionEntry) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  addWeeklySummary: (summary: any) => void;
  addCorrection: (correction: any) => void;
  addProgressEntry: (entry: ProgressEntry) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      userProfile: null,
      currentPhase: null,
      workoutHistory: [],
      workoutDays: [], // Initialize WorkoutDay array
      nutritionLog: [],
      sleepLog: [],
      corrections: [],
      progressHistory: [],
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: state.userProfile ? { ...state.userProfile, ...updates, updatedAt: new Date() } : null
      })),
      
      logout: () => {
        // Clear all localStorage data
        localStorage.clear();
        // Clear sessionStorage too
        sessionStorage.clear();
        // Reset store state
        set({
          userProfile: null,
          currentPhase: null,
          workoutHistory: [],
          workoutDays: [],
          nutritionLog: [],
          sleepLog: [],
          corrections: [],
          progressHistory: []
        });
      },
      
      setCurrentPhase: (phase) => set({ currentPhase: phase }),
      
      addWorkout: (workout) => set((state) => ({
        workoutHistory: [...state.workoutHistory, workout]
      })),
      
      addWorkoutSession: (session) => set((state) => ({
        workoutHistory: [...state.workoutHistory, session]
      })),

      addWorkoutDay: (workout) => set((state) => ({
        workoutDays: [...state.workoutDays, workout]
      })),
      
      addNutritionEntry: (entry) => set((state) => ({
        nutritionLog: [...state.nutritionLog, entry]
      })),
      
      addSleepEntry: (entry) => set((state) => ({
        sleepLog: [...state.sleepLog, entry]
      })),
      
      addWeeklySummary: (summary) => set((state) => ({
        corrections: [...state.corrections, summary]
      })),
      
      addCorrection: (correction) => set((state) => ({
        corrections: [...state.corrections, correction]
      })),
      
      addProgressEntry: (entry) => set((state) => ({
        progressHistory: [...state.progressHistory, entry]
      })),
    }),
    {
      name: 'scioptimal-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        currentPhase: state.currentPhase,
        workoutHistory: state.workoutHistory,
        workoutDays: state.workoutDays, // Include WorkoutDay in persistence
        nutritionLog: state.nutritionLog,
        sleepLog: state.sleepLog,
        corrections: state.corrections,
        progressHistory: state.progressHistory,
      }),
      onRehydrateStorage: () => (state) => {
        // Optional: Log when data is restored
        if (state) {
          console.log('SciOptimal data restored from localStorage');
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useUserProfile = () => useAppStore((state) => state.userProfile);
export const useCurrentPhase = () => useAppStore((state) => state.currentPhase);
export const useWorkoutHistory = () => useAppStore((state) => state.workoutHistory);
export const useWorkoutDays = () => useAppStore((state) => state.workoutDays); // Add WorkoutDay selector
export const useNutritionLog = () => useAppStore((state) => state.nutritionLog);
export const useSleepLog = () => useAppStore((state) => state.sleepLog);
export const useCorrections = () => useAppStore((state) => state.corrections);
export const useProgressHistory = () => useAppStore((state) => state.progressHistory);

// Action hooks
export const useSetUserProfile = () => useAppStore((state) => state.setUserProfile);
export const useUpdateUserProfile = () => useAppStore((state) => state.updateUserProfile);
export const useLogout = () => useAppStore((state) => state.logout);
export const useSetCurrentPhase = () => useAppStore((state) => state.setCurrentPhase);
export const useAddWorkout = () => useAppStore((state) => state.addWorkout);
export const useAddWorkoutSession = () => useAppStore((state) => state.addWorkoutSession);
export const useAddWorkoutDay = () => useAppStore((state) => state.addWorkoutDay); // Add WorkoutDay action
export const useAddNutritionEntry = () => useAppStore((state) => state.addNutritionEntry);
export const useAddSleepEntry = () => useAppStore((state) => state.addSleepEntry);
export const useAddWeeklySummary = () => useAppStore((state) => state.addWeeklySummary);
export const useAddCorrection = () => useAppStore((state) => state.addCorrection);
export const useAddProgressEntry = () => useAppStore((state) => state.addProgressEntry);

// Devin-specific tracking
export const useDevinData = () => useAppStore((state) => {
  if (!state.userProfile || state.userProfile.name.toLowerCase() !== 'devin') {
    return null;
  }
  
  return {
    profile: state.userProfile,
    workouts: state.workoutHistory,
    workoutDays: state.workoutDays,
    nutrition: state.nutritionLog,
    sleep: state.sleepLog,
    progress: state.progressHistory,
    totalEntries: {
      workouts: state.workoutHistory.length,
      workoutDays: state.workoutDays.length,
      nutrition: state.nutritionLog.length,
      sleep: state.sleepLog.length,
      progress: state.progressHistory.length
    }
  };
});

// Simple computed selectors
export const useMacroTotals = () => useAppStore((state) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = state.nutritionLog.filter((entry) => 
    entry.date.toISOString().split('T')[0] === today
  );
  
  return todayEntries.reduce((totals, entry) => ({
    protein_g: totals.protein_g + entry.macros.protein_g,
    carbs_g: totals.carbs_g + entry.macros.carbs_g,
    fat_g: totals.carbs_g + entry.macros.fat_g,
    fiber_g: totals.fiber_g + (entry.macros.fiber_g || 0),
    sodium_mg: totals.sodium_mg + (entry.macros.sodium_mg || 0),
    potassium_mg: totals.potassium_mg + (entry.macros.potassium_mg || 0),
    calories: totals.calories + entry.totalCalories,
  }), {
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    sodium_mg: 0,
    potassium_mg: 0,
    calories: 0,
  });
});

export const useTargetMacros = () => useAppStore((state) => {
  if (!state.userProfile || !state.currentPhase) return null;
  
  // Calculate based on user profile and current phase
  // Convert height from inches to centimeters for BMR calculation
  const heightCm = state.userProfile.height * 2.54;
  const bmr = 10 * state.userProfile.weight + 6.25 * heightCm - 5 * state.userProfile.age + 5;
  const activityMultipliers: any = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  
  const tdee = bmr * activityMultipliers[state.userProfile.activityLevel];
  const protein = state.userProfile.weight * 2.2;
  const fat = (tdee * 0.25) / 9;
  const carbs = (tdee - (protein * 4) - (fat * 9)) / 4;
  
  return {
    protein_g: Math.round(protein),
    carbs_g: Math.round(carbs),
    fat_g: Math.round(fat),
    fiber_g: 25,
    sodium_mg: 2300,
    potassium_mg: 3500,
    calories: Math.round(tdee),
  };
});

export const useMacroCompliance = () => useAppStore((state) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = state.nutritionLog.filter((entry) => 
    entry.date.toISOString().split('T')[0] === today
  );
  
  const totals = todayEntries.reduce((totals, entry) => ({
    protein_g: totals.protein_g + entry.macros.protein_g,
    carbs_g: totals.carbs_g + entry.macros.carbs_g,
    fat_g: totals.fat_g + entry.macros.fat_g,
    fiber_g: totals.fiber_g + (entry.macros.fiber_g || 0),
    sodium_mg: totals.sodium_mg + (entry.macros.sodium_mg || 0),
    potassium_mg: totals.potassium_mg + (entry.macros.potassium_mg || 0),
    calories: totals.calories + entry.totalCalories,
  }), {
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    sodium_mg: 0,
    potassium_mg: 0,
    calories: 0,
  });
  
  if (!state.userProfile || !state.currentPhase) return null;
  
  // Convert height from inches to centimeters for BMR calculation
  const heightCm = state.userProfile.height * 2.54;
  const bmr = 10 * state.userProfile.weight + 6.25 * heightCm - 5 * state.userProfile.age + 5;
  const activityMultipliers: any = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  
  const tdee = bmr * activityMultipliers[state.userProfile.activityLevel];
  const protein = state.userProfile.weight * 2.2;
  const fat = (tdee * 0.25) / 9;
  const carbs = (tdee - (protein * 4) - (fat * 9)) / 4;
  
  const targets = {
    protein_g: Math.round(protein),
    carbs_g: Math.round(carbs),
    fat_g: Math.round(fat),
    fiber_g: 25,
    sodium_mg: 2300,
    potassium_mg: 3500,
    calories: Math.round(tdee),
  };
  
  return {
    protein: Math.min((totals.protein_g / targets.protein_g) * 100, 100),
    carbs: Math.min((totals.carbs_g / targets.carbs_g) * 100, 100),
    fat: Math.min((totals.fat_g / targets.fat_g) * 100, 100),
    fiber: Math.min((totals.fiber_g / targets.fiber_g) * 100, 100),
  };
});

// Additional computed selectors for compatibility
export const useTodayNutrition = () => useAppStore((state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.nutritionLog.filter((entry) => 
    entry.date.toISOString().split('T')[0] === today
  );
});

export const useTodayWorkout = () => useAppStore((state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.workoutHistory.find((workout) => 
    workout.date.toISOString().split('T')[0] === today
  );
});

export const useLatestProgress = () => useAppStore((state) => {
  if (state.progressHistory.length === 0) return null;
  return state.progressHistory[state.progressHistory.length - 1];
});

export const useProgressTrends = () => useAppStore((state) => {
  if (state.progressHistory.length < 2) return null;
  
  const sortedHistory = [...state.progressHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const weightTrend = sortedHistory.map(entry => ({
    date: entry.date,
    weight: entry.weight
  }));
  
  const bodyFatTrend = sortedHistory
    .filter(entry => entry.bodyFatPercentage)
    .map(entry => ({
      date: entry.date,
      bodyFat: entry.bodyFatPercentage!
    }));
  
  return { weightTrend, bodyFatTrend };
});

export const useStrengthProgress = () => useAppStore((state) => {
  if (state.progressHistory.length < 2) return null;
  
  const sortedHistory = [...state.progressHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const strengthTrends = {
    benchPress: sortedHistory
      .filter(entry => entry.strengthLifts?.benchPress)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts!.benchPress!
      })),
    squat: sortedHistory
      .filter(entry => entry.strengthLifts?.squat)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts!.squat!
      })),
    deadlift: sortedHistory
      .filter(entry => entry.strengthLifts?.deadlift)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts!.deadlift!
      }))
  };
  
  return strengthTrends;
});

// Enhanced Devin tracking with analytics
export const useDevinAnalytics = () => useAppStore((state) => {
  if (!state.userProfile || state.userProfile.name.toLowerCase() !== 'devin') {
    return null;
  }
  
  const workouts = [...state.workoutHistory, ...state.workoutDays];
  const nutrition = state.nutritionLog;
  const sleep = state.sleepLog;
  const progress = state.progressHistory;
  
  // Calculate trends
  const workoutTrend = workouts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(workout => ({
      date: workout.date,
      type: 'workoutDay' in workout ? 'WorkoutDay' : 'WorkoutSession',
      exercises: 'exercises' in workout ? workout.exercises.length : 0,
      duration: workout.duration || 0
    }));
  
  const nutritionTrend = nutrition
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      calories: entry.totalCalories,
      protein: entry.macros.protein_g,
      carbs: entry.macros.carbs_g,
      fat: entry.macros.fat_g
    }));
  
  const sleepTrend = sleep
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      hours: entry.sleepHours,
      quality: entry.sleepQuality,
      stress: entry.stressLevel
    }));
  
  const progressTrend = progress
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      weight: entry.weight,
      bodyFat: entry.bodyFatPercentage,
      bench: entry.strengthLifts?.benchPress,
      squat: entry.strengthLifts?.squat,
      deadlift: entry.strengthLifts?.deadlift
    }));
  
  return {
    trends: {
      workouts: workoutTrend,
      nutrition: nutritionTrend,
      sleep: sleepTrend,
      progress: progressTrend
    },
    summary: {
      totalWorkouts: workouts.length,
      totalNutritionEntries: nutrition.length,
      totalSleepEntries: sleep.length,
      totalProgressEntries: progress.length,
      averageWorkoutDuration: workouts.length > 0 ? 
        workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length : 0,
      averageSleepHours: sleep.length > 0 ? 
        sleep.reduce((sum, s) => sum + s.sleepHours, 0) / sleep.length : 0,
      averageSleepQuality: sleep.length > 0 ? 
        sleep.reduce((sum, s) => sum + s.sleepQuality, 0) / sleep.length : 0
    }
  };
});
