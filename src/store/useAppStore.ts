import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, 
  UserProfile, 
  TrainingPhase, 
  ProgressEntry, 
  WorkoutSession, 
  NutritionEntry
} from '../types';
import { generateTrainingProgram } from '../utils/trainingPhaseGenerator';
import { calculateMacroTargets, calculateBMR, calculateTDEE } from '../utils/scientificCalculations';

interface AppStore extends AppState {
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setCurrentPhase: (phase: TrainingPhase) => void;
  generateUserProgram: () => void;
  addProgressEntry: (entry: ProgressEntry) => void;
  updateProgressEntry: (id: string, updates: Partial<ProgressEntry>) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  updateWorkoutSession: (id: string, updates: Partial<WorkoutSession>) => void;
  addNutritionEntry: (entry: NutritionEntry) => void;
  updateNutritionEntry: (id: string, updates: Partial<NutritionEntry>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetApp: () => void;
}

const initialState: AppState = {
  userProfile: null,
  currentPhase: null,
  progressHistory: [],
  workoutHistory: [],
  nutritionLog: [],
  currentDate: new Date(),
  isLoading: false,
  error: null
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserProfile: (profile: UserProfile) => {
        set({ userProfile: profile });
        // Auto-generate training program when profile is set
        get().generateUserProgram();
      },

      updateUserProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().userProfile;
        if (currentProfile) {
          const updatedProfile = { ...currentProfile, ...updates, updatedAt: new Date() };
          set({ userProfile: updatedProfile });
          // Regenerate program if significant changes were made
          if (updates.weight || updates.height || updates.bodyFatPercentage || updates.equipment) {
            get().generateUserProgram();
          }
        }
      },

      setCurrentPhase: (phase: TrainingPhase) => {
        set({ currentPhase: phase });
      },

      generateUserProgram: () => {
        const { userProfile } = get();
        if (!userProfile) return;

        try {
          set({ isLoading: true, error: null });
          const program = generateTrainingProgram(userProfile);
          set({ currentPhase: program[0] }); // Start with Phase 1
        } catch (error) {
          set({ error: 'Failed to generate training program' });
        } finally {
          set({ isLoading: false });
        }
      },

      addProgressEntry: (entry: ProgressEntry) => {
        const { progressHistory } = get();
        const newEntry = {
          ...entry,
          id: `progress_${Date.now()}`,
          date: new Date()
        };
        set({ progressHistory: [...progressHistory, newEntry] });
      },

      updateProgressEntry: (id: string, updates: Partial<ProgressEntry>) => {
        const { progressHistory } = get();
        const updatedHistory = progressHistory.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        );
        set({ progressHistory: updatedHistory });
      },

      addWorkoutSession: (session: WorkoutSession) => {
        const { workoutHistory } = get();
        const newSession = {
          ...session,
          id: `workout_${Date.now()}`,
          date: new Date()
        };
        set({ workoutHistory: [...workoutHistory, newSession] });
      },

      updateWorkoutSession: (id: string, updates: Partial<WorkoutSession>) => {
        const { workoutHistory } = get();
        const updatedHistory = workoutHistory.map(session =>
          session.id === id ? { ...session, ...updates } : session
        );
        set({ workoutHistory: updatedHistory });
      },

      addNutritionEntry: (entry: NutritionEntry) => {
        const { nutritionLog } = get();
        const newEntry = {
          ...entry,
          id: `nutrition_${Date.now()}`,
          date: new Date()
        };
        set({ nutritionLog: [...nutritionLog, newEntry] });
      },

      updateNutritionEntry: (id: string, updates: Partial<NutritionEntry>) => {
        const { nutritionLog } = get();
        const updatedLog = nutritionLog.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        );
        set({ nutritionLog: updatedLog });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      resetApp: () => {
        set(initialState);
      }
    }),
    {
      name: 'phase-fitness-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        currentPhase: state.currentPhase,
        progressHistory: state.progressHistory,
        workoutHistory: state.workoutHistory,
        nutritionLog: state.nutritionLog
      })
    }
  )
);

// Selector hooks for better performance
export const useUserProfile = () => useAppStore(state => state.userProfile);
export const useCurrentPhase = () => useAppStore(state => state.currentPhase);
export const useProgressHistory = () => useAppStore(state => state.progressHistory);
export const useWorkoutHistory = () => useAppStore(state => state.workoutHistory);
export const useNutritionLog = () => useAppStore(state => state.nutritionLog);
export const useAppLoading = () => useAppStore(state => state.isLoading);
export const useAppError = () => useAppStore(state => state.error);

// Computed selectors
export const useLatestProgress = () => {
  const progressHistory = useProgressHistory();
  return progressHistory.length > 0 ? progressHistory[progressHistory.length - 1] : null;
};

export const useTodayWorkout = () => {
  const workoutHistory = useWorkoutHistory();
  const today = new Date().toDateString();
  return workoutHistory.find(session => 
    new Date(session.date).toDateString() === today
  );
};

export const useTodayNutrition = () => {
  const nutritionLog = useNutritionLog();
  const today = new Date().toDateString();
  return nutritionLog.filter(entry => 
    new Date(entry.date).toDateString() === today
  );
};

export const useMacroTotals = () => {
  const todayNutrition = useTodayNutrition();
  return todayNutrition.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.totalCalories,
      protein: totals.protein + entry.macros.protein,
      carbs: totals.carbs + entry.macros.carbs,
      fat: totals.fat + entry.macros.fat,
      fiber: totals.fiber + entry.macros.fiber,
      sodium: totals.sodium + (entry.macros.sodium || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
  );
};

export const useTargetMacros = () => {
  const currentPhase = useCurrentPhase();
  const userProfile = useUserProfile();
  
  if (!currentPhase || !userProfile) return null;
  
  const bmr = calculateBMR(userProfile);
  const tdee = calculateTDEE(bmr, userProfile.activityLevel);
  
  return calculateMacroTargets(
    userProfile.weight,
    userProfile.bodyFatPercentage,
    tdee,
    2.2, // default protein multiplier
    40,  // default carb percentage
    25   // default fat percentage
  );
};

export const useMacroCompliance = () => {
  const macroTotals = useMacroTotals();
  const targetMacros = useTargetMacros();
  
  if (!targetMacros) return null;
  
  return {
    calories: (macroTotals.calories / targetMacros.protein * 4 + targetMacros.carbs * 4 + targetMacros.fat * 9) * 100,
    protein: (macroTotals.protein / targetMacros.protein) * 100,
    carbs: (macroTotals.carbs / targetMacros.carbs) * 100,
    fat: (macroTotals.fat / targetMacros.fat) * 100,
    fiber: (macroTotals.fiber / targetMacros.fiber) * 100
  };
};

export const useProgressTrends = () => {
  const progressHistory = useProgressHistory();
  
  if (progressHistory.length < 2) return null;
  
  const sortedHistory = [...progressHistory].sort((a, b) => 
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
};

export const useStrengthProgress = () => {
  const progressHistory = useProgressHistory();
  
  if (progressHistory.length < 2) return null;
  
  const sortedHistory = [...progressHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const strengthTrends = {
    benchPress: sortedHistory
      .filter(entry => entry.strengthLifts.benchPress)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts.benchPress!
      })),
    squat: sortedHistory
      .filter(entry => entry.strengthLifts.squat)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts.squat!
      })),
    deadlift: sortedHistory
      .filter(entry => entry.strengthLifts.deadlift)
      .map(entry => ({
        date: entry.date,
        weight: entry.strengthLifts.deadlift!
      }))
  };
  
  return strengthTrends;
};
