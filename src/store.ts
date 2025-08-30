// SciOptimal Fitness App - Clean State Management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Core Types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // inches
  weight: number; // lbs
  bodyFatPercentage: number;
  goalWeight?: number;
  targetPhysique: string;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  createdAt: Date;
}

export interface WorkoutSession {
  id: string;
  date: Date;
  name: string;
  exercises: ExerciseSet[];
  duration: number; // minutes
  rpe: number; // 1-10 scale
  notes?: string;
}

export interface ExerciseSet {
  name: string;
  sets: { reps: number; weight: number; rpe: number }[];
  muscleGroups: string[];
}

export interface NutritionEntry {
  id: string;
  date: Date;
  meal: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ProgressEntry {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  measurements?: { [key: string]: number };
  photos?: string[];
  notes?: string;
}

export interface SleepEntry {
  id: string;
  date: Date;
  bedTime: string;
  wakeTime: string;
  duration: number; // hours
  quality: number; // 1-10 scale
  notes?: string;
}

// AI Insights
export interface AIInsight {
  id: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'progress';
  title: string;
  description: string;
  recommendation: string;
  confidence: number; // 0-100
  timestamp: Date;
}

// App State
interface AppState {
  // User Data
  userProfile: UserProfile | null;
  workoutHistory: WorkoutSession[];
  nutritionLog: NutritionEntry[];
  progressHistory: ProgressEntry[];
  sleepLog: SleepEntry[];
  
  // AI Features
  aiInsights: AIInsight[];
  isAnalyzing: boolean;
  
  // UI State
  currentTab: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  addNutritionEntry: (entry: NutritionEntry) => void;
  addProgressEntry: (entry: ProgressEntry) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  addAIInsight: (insight: AIInsight) => void;
  setCurrentTab: (tab: number) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  generateAIInsights: () => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userProfile: null,
      workoutHistory: [],
      nutritionLog: [],
      progressHistory: [],
      sleepLog: [],
      aiInsights: [],
      isAnalyzing: false,
      currentTab: 0,
      isLoading: false,
      error: null,

      // Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      addWorkoutSession: (session) => 
        set(state => ({ 
          workoutHistory: [...state.workoutHistory, session].slice(-50) // Keep last 50
        })),
      
      addNutritionEntry: (entry) => 
        set(state => ({ 
          nutritionLog: [...state.nutritionLog, entry].slice(-100) // Keep last 100
        })),
      
      addProgressEntry: (entry) => 
        set(state => ({ 
          progressHistory: [...state.progressHistory, entry].slice(-50) // Keep last 50
        })),
      
      addSleepEntry: (entry) => 
        set(state => ({ 
          sleepLog: [...state.sleepLog, entry].slice(-30) // Keep last 30
        })),
      
      addAIInsight: (insight) => 
        set(state => ({ 
          aiInsights: [...state.aiInsights, insight].slice(-20) // Keep last 20
        })),
      
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      
      generateAIInsights: () => {
        const state = get();
        if (!state.userProfile) return;
        
        set({ isAnalyzing: true });
        
        // Generate smart insights based on user data
        setTimeout(() => {
          const insights: AIInsight[] = [];
          
          // Workout insights
          if (state.workoutHistory.length > 0) {
            const recentWorkouts = state.workoutHistory.slice(-5);
            const avgRPE = recentWorkouts.reduce((sum, w) => sum + w.rpe, 0) / recentWorkouts.length;
            
            if (avgRPE < 7) {
              insights.push({
                id: `insight_${Date.now()}_1`,
                type: 'workout',
                title: 'Increase Training Intensity',
                description: 'Your recent workouts show lower intensity (RPE < 7)',
                recommendation: 'Consider increasing weight or reps to optimize muscle growth. Aim for RPE 7-9 on working sets.',
                confidence: 85,
                timestamp: new Date()
              });
            }
          }
          
          // Nutrition insights
          if (state.nutritionLog.length > 0) {
            const recentNutrition = state.nutritionLog.slice(-7);
            const avgProtein = recentNutrition.reduce((sum, n) => sum + n.protein, 0) / recentNutrition.length;
            const targetProtein = (state.userProfile?.weight || 150) * 0.8; // 0.8g per lb
            
            if (avgProtein < targetProtein) {
              insights.push({
                id: `insight_${Date.now()}_2`,
                type: 'nutrition',
                title: 'Optimize Protein Intake',
                description: `Your protein intake (${Math.round(avgProtein)}g) is below optimal target (${Math.round(targetProtein)}g)`,
                recommendation: 'Add protein-rich foods to each meal or consider a protein supplement.',
                confidence: 90,
                timestamp: new Date()
              });
            }
          }
          
          // Progress insights
          if (state.progressHistory.length >= 2) {
            const recent = state.progressHistory.slice(-2);
            const weightChange = recent[1].weight - recent[0].weight;
            
            if (Math.abs(weightChange) > 2) {
              insights.push({
                id: `insight_${Date.now()}_3`,
                type: 'progress',
                title: 'Weight Change Detected',
                description: `Weight ${weightChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(weightChange)} lbs`,
                recommendation: weightChange > 0 
                  ? 'Consider adjusting caloric intake if this aligns with your goals.'
                  : 'Ensure adequate protein to preserve muscle mass during weight loss.',
                confidence: 80,
                timestamp: new Date()
              });
            }
          }
          
          // Recovery insights
          if (state.sleepLog.length > 0) {
            const recentSleep = state.sleepLog.slice(-7);
            const avgSleep = recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length;
            
            if (avgSleep < 7) {
              insights.push({
                id: `insight_${Date.now()}_4`,
                type: 'recovery',
                title: 'Improve Sleep Duration',
                description: `Average sleep: ${avgSleep.toFixed(1)} hours (below optimal 7-9 hours)`,
                recommendation: 'Prioritize 7-9 hours of sleep for optimal recovery and performance.',
                confidence: 95,
                timestamp: new Date()
              });
            }
          }
          
          // Add insights to store
          insights.forEach(insight => {
            set(state => ({ 
              aiInsights: [...state.aiInsights, insight].slice(-20)
            }));
          });
          
          set({ isAnalyzing: false });
        }, 2000); // Simulate AI processing time
      }
    }),
    {
      name: 'scioptimal-fitness-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        workoutHistory: state.workoutHistory,
        nutritionLog: state.nutritionLog,
        progressHistory: state.progressHistory,
        sleepLog: state.sleepLog,
        aiInsights: state.aiInsights,
      })
    }
  )
);
