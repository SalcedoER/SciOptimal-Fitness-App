// Complete working store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { workoutGeneratorService, GeneratedWorkout } from './services/workoutGenerator';

// Export all types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
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
  duration: number;
  exercises: Exercise[];
  notes?: string;
  rpe?: number;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  rpe?: number;
  restTime?: number;
}

export interface NutritionEntry {
  id: string;
  date: Date;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface ProgressEntry {
  id: string;
  date: Date;
  weight: number;
  bodyFatPercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface SleepEntry {
  id: string;
  date: Date;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
}

export interface HealthData {
  steps: Array<{ date: string; count: number }>;
  heartRate: Array<{ timestamp: string; value: number }>;
  restingHeartRate: number;
  activeCalories: Array<{ date: string; calories: number }>;
  sleep: Array<{ date: string; duration: number; quality: number }>;
}

export interface OptimizationInsight {
  id: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'progression';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: number;
  effort: number;
  timeframe: string;
  evidence: string[];
}

export interface AdaptivePlan {
  id: string;
  userId: string;
  currentPhase: string;
  adjustments: PlanAdjustment[];
  lastUpdated: Date;
  nextReview: Date;
}

export interface PlanAdjustment {
  id: string;
  type: 'recovery' | 'workout' | 'nutrition' | 'progression' | 'timing';
  reason: string;
  change: string;
  impact: number;
  date: Date;
}

export interface AIAnalysis {
  id: string;
  userId: string;
  overallScore: number;
  riskFactors: string[];
  opportunities: string[];
  recommendations: string[];
  generatedAt: Date;
}

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: any;
  authLoading: boolean;
  authError: string | null;
  showAuthModal: boolean;
  
  // User Profile
  userProfile: UserProfile | null;
  
  // Data
  workoutHistory: WorkoutSession[];
  nutritionLog: NutritionEntry[];
  progressHistory: ProgressEntry[];
  sleepLog: SleepEntry[];
  
  // Health Data
  healthData: HealthData | null;
  isHealthDataConnected: boolean;
  lastHealthSync: Date | null;
  
  // AI Features
  optimizationInsights: OptimizationInsight[];
  adaptivePlan: AdaptivePlan | null;
  aiAnalysis: AIAnalysis | null;
  isOptimizing: boolean;
  
  // Generated Workout
  todaysWorkout: GeneratedWorkout | null;
  
  // UI State
  currentTab: number;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setShowAuthModal: (show: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  setCurrentTab: (tab: number) => void;
  loadUserData: () => Promise<void>;
  
  // Data actions
  addWorkout: (workout: WorkoutSession) => void;
  addWorkoutSession: (workout: WorkoutSession) => void; // Alias for addWorkout
  addNutritionEntry: (entry: NutritionEntry) => void;
  addProgressEntry: (entry: ProgressEntry) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  
  // Health actions
  setHealthData: (data: HealthData) => void;
  setHealthDataConnected: (connected: boolean) => void;
  syncHealthData: () => Promise<void>;
  
  // AI actions
  addOptimizationInsight: (insight: OptimizationInsight) => void;
  setAdaptivePlan: (plan: AdaptivePlan) => void;
  setAIAnalysis: (analysis: AIAnalysis) => void;
  setIsOptimizing: (optimizing: boolean) => void;
  runAIOptimization: () => Promise<void>;
  
  // Workout generation
  generateTodaysWorkout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      user: null,
      authLoading: false,
      authError: null,
      showAuthModal: false,
      userProfile: null,
      currentTab: 0,
      
      // Data
      workoutHistory: [],
      nutritionLog: [],
      progressHistory: [],
      sleepLog: [],
      
      // Health Data
      healthData: null,
      isHealthDataConnected: false,
      lastHealthSync: null,
      
      // AI Features
      optimizationInsights: [],
      adaptivePlan: null,
      aiAnalysis: null,
      isOptimizing: false,
      
      // Generated Workout
      todaysWorkout: null,

      // Actions
      login: async (email, password) => {
        set({ authLoading: true, authError: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ 
            isAuthenticated: true, 
            user: { id: '1', name: 'Test User', email },
            authLoading: false,
            showAuthModal: false
          });
          // Only load user data if profile exists (for existing users)
          // New users will have userProfile as null and will be directed to setup
        } catch (error: any) {
          set({ 
            authError: error.message || 'Login failed',
            authLoading: false 
          });
        }
      },
      
      register: async (name, email, password) => {
        set({ authLoading: true, authError: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ 
            isAuthenticated: true, 
            user: { id: '1', name, email },
            userProfile: null, // Keep profile null so user goes to setup
            authLoading: false,
            showAuthModal: false
          });
        } catch (error: any) {
          set({ 
            authError: error.message || 'Registration failed',
            authLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null,
          userProfile: null
        });
      },
      
      setShowAuthModal: (show) => set({ showAuthModal: show }),
      setUserProfile: (profile) => {
        // Create adaptive plan when profile is set
        const adaptivePlan: AdaptivePlan = {
          id: `plan_${Date.now()}`,
          userId: profile.id,
          currentPhase: 'foundation',
          adjustments: [],
          lastUpdated: new Date(),
          nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
        };
        
        // Generate today's workout based on profile
        const generatedWorkout = workoutGeneratorService.generateWorkout(profile, []);
        
        set({ 
          userProfile: profile,
          adaptivePlan: adaptivePlan,
          todaysWorkout: generatedWorkout
        });
      },
      setCurrentTab: (tab) => set({ currentTab: tab }),
      loadUserData: async () => {
        // Simulate loading user data
        await new Promise(resolve => setTimeout(resolve, 500));
        // For demo purposes, simulate that existing users have profiles
        // In a real app, this would check if the user has a profile in the database
        const hasExistingProfile = Math.random() > 0.7; // 30% chance of having existing profile
        
        if (hasExistingProfile) {
          const mockProfile: UserProfile = {
            id: '1',
            name: 'Test User',
            age: 25,
            height: 175,
            weight: 70,
            bodyFatPercentage: 15,
            targetPhysique: 'Athletic',
            activityLevel: 'Moderately Active',
            createdAt: new Date()
          };
          
          // Create adaptive plan for existing user
          const adaptivePlan: AdaptivePlan = {
            id: `plan_${Date.now()}`,
            userId: mockProfile.id,
            currentPhase: 'foundation',
            adjustments: [],
            lastUpdated: new Date(),
            nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
          };
          
          // Generate today's workout for existing user
          const generatedWorkout = workoutGeneratorService.generateWorkout(mockProfile, []);
          
          set({ 
            userProfile: mockProfile,
            adaptivePlan: adaptivePlan,
            todaysWorkout: generatedWorkout
          });
        }
        // If no existing profile, userProfile remains null and user goes to setup
      },
      
      // Data actions
      addWorkout: (workout) => set((state) => ({
        workoutHistory: [...state.workoutHistory, workout]
      })),
      addWorkoutSession: (workout) => set((state) => ({
        workoutHistory: [...state.workoutHistory, workout]
      })),
      addNutritionEntry: (entry) => set((state) => ({
        nutritionLog: [...state.nutritionLog, entry]
      })),
      addProgressEntry: (entry) => set((state) => ({
        progressHistory: [...state.progressHistory, entry]
      })),
      addSleepEntry: (entry) => set((state) => ({
        sleepLog: [...state.sleepLog, entry]
      })),
      
      // Health actions
      setHealthData: (data) => set({ healthData: data }),
      setHealthDataConnected: (connected) => set({ isHealthDataConnected: connected }),
      syncHealthData: async () => {
        // Simulate health data sync
        const mockData: HealthData = {
          steps: [{ date: new Date().toISOString().split('T')[0], count: 8500 }],
          heartRate: [{ timestamp: new Date().toISOString(), value: 72 }],
          restingHeartRate: 65,
          activeCalories: [{ date: new Date().toISOString().split('T')[0], calories: 450 }],
          sleep: [{ date: new Date().toISOString().split('T')[0], duration: 7.5, quality: 8 }]
        };
        set({ healthData: mockData, lastHealthSync: new Date() });
      },
      
      // AI actions
      addOptimizationInsight: (insight) => set((state) => ({
        optimizationInsights: [...state.optimizationInsights, insight]
      })),
      setAdaptivePlan: (plan) => set({ adaptivePlan: plan }),
      setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
      setIsOptimizing: (optimizing) => set({ isOptimizing: optimizing }),
      runAIOptimization: async () => {
        set({ isOptimizing: true });
        // Simulate AI optimization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate sample optimization insights
        const sampleInsights: OptimizationInsight[] = [
          {
            id: `insight_${Date.now()}_1`,
            type: 'workout',
            priority: 'high',
            title: 'Increase Training Frequency',
            description: 'Based on your current activity level, consider adding one more workout session per week to optimize muscle growth.',
            impact: 8,
            effort: 6,
            timeframe: '2-4 weeks',
            evidence: ['Current frequency: 3x/week', 'Optimal for your goal: 4-5x/week']
          },
          {
            id: `insight_${Date.now()}_2`,
            type: 'nutrition',
            priority: 'medium',
            title: 'Optimize Protein Timing',
            description: 'Distribute protein intake more evenly throughout the day for better muscle protein synthesis.',
            impact: 6,
            effort: 4,
            timeframe: '1-2 weeks',
            evidence: ['Current protein distribution', 'Research on MPS optimization']
          },
          {
            id: `insight_${Date.now()}_3`,
            type: 'recovery',
            priority: 'low',
            title: 'Improve Sleep Quality',
            description: 'Focus on sleep hygiene to enhance recovery and performance.',
            impact: 5,
            effort: 3,
            timeframe: '1-3 weeks',
            evidence: ['Sleep tracking data', 'Recovery metrics']
          }
        ];
        
        // Generate sample AI analysis
        const sampleAnalysis: AIAnalysis = {
          id: `analysis_${Date.now()}`,
          userId: '1',
          overallScore: 75,
          riskFactors: ['Insufficient training volume', 'Suboptimal protein timing'],
          opportunities: ['Increase training frequency', 'Optimize nutrition timing', 'Improve sleep quality'],
          recommendations: ['Add one more workout per week', 'Distribute protein intake evenly', 'Focus on sleep hygiene'],
          generatedAt: new Date()
        };
        
        set({ 
          isOptimizing: false,
          optimizationInsights: sampleInsights,
          aiAnalysis: sampleAnalysis
        });
      },
      
      // Workout generation
      generateTodaysWorkout: () => {
        const state = get();
        if (state.userProfile) {
          const generatedWorkout = workoutGeneratorService.generateWorkout(
            state.userProfile, 
            state.workoutHistory
          );
          set({ todaysWorkout: generatedWorkout });
        }
      },
    }),
    {
      name: 'scioptimal-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userProfile: state.userProfile,
        currentTab: state.currentTab,
        workoutHistory: state.workoutHistory,
        nutritionLog: state.nutritionLog,
        progressHistory: state.progressHistory,
        sleepLog: state.sleepLog,
        healthData: state.healthData,
        isHealthDataConnected: state.isHealthDataConnected,
        optimizationInsights: state.optimizationInsights,
        adaptivePlan: state.adaptivePlan,
        aiAnalysis: state.aiAnalysis,
        todaysWorkout: state.todaysWorkout,
      }),
    }
  )
);