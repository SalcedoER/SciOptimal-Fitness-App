// Goal-Based Plan Curation Service
import { UserProfile, WorkoutSession, NutritionEntry } from '../store';

export interface CuratedPlan {
  id: string;
  goal: string;
  phase: string;
  duration: number; // weeks
  workouts: WorkoutPlan[];
  nutrition: NutritionPlan;
  timeline: PlanMilestone[];
  expectedOutcomes: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: 'strength' | 'hypertrophy' | 'power' | 'endurance' | 'conditioning';
  frequency: number; // per week
  exercises: ExercisePlan[];
  progression: ProgressionPlan;
  notes: string[];
}

export interface ExercisePlan {
  name: string;
  sets: number;
  reps: string; // e.g., "8-12", "3-5", "15-20"
  weight: string; // e.g., "Bodyweight", "80% 1RM", "Moderate"
  restTime: number; // seconds
  tempo: string; // e.g., "2-1-2-1"
  notes: string;
}

export interface ProgressionPlan {
  type: 'linear' | 'double_progression' | 'wave' | 'block';
  weeklyIncrease: number; // percentage or fixed amount
  deloadFrequency: number; // weeks
  maxAttempts: number; // before deload
}

export interface NutritionPlan {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  mealTiming: MealTiming[];
  supplements: Supplement[];
  hydration: number; // liters per day
}

export interface MealTiming {
  time: string;
  type: 'pre_workout' | 'post_workout' | 'main_meal' | 'snack';
  calories: number;
  protein: number;
  description: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

export interface PlanMilestone {
  week: number;
  goal: string;
  metrics: string[];
  checkpoints: string[];
}

class GoalCurationService {
  // Main curation function based on user profile and goals
  async curatePlan(userProfile: UserProfile): Promise<CuratedPlan> {
    const goal = userProfile.targetPhysique;
    
    switch (goal) {
      case 'NFL Fullback':
        return this.createNFLFullbackPlan(userProfile);
      case 'Power Athlete':
        return this.createPowerAthletePlan(userProfile);
      case 'Functional Strength':
        return this.createFunctionalStrengthPlan(userProfile);
      case 'Muscular':
        return this.createMuscularPlan(userProfile);
      case 'Athletic':
        return this.createAthleticPlan(userProfile);
      case 'Strength Focused':
        return this.createStrengthFocusedPlan(userProfile);
      case 'Weight Loss':
        return this.createWeightLossPlan(userProfile);
      case 'Weight Gain':
        return this.createWeightGainPlan(userProfile);
      case 'Lean & Toned':
        return this.createLeanTonedPlan(userProfile);
      case 'Endurance Focused':
        return this.createEndurancePlan(userProfile);
      default:
        return this.createMaintenancePlan(userProfile);
    }
  }

  private createNFLFullbackPlan(profile: UserProfile): CuratedPlan {
    return {
      id: `nfl_fullback_${Date.now()}`,
      goal: 'NFL Fullback',
      phase: 'Foundation',
      duration: 16,
      workouts: [
        {
          id: 'fullback_strength',
          name: 'Fullback Strength Training',
          type: 'strength',
          frequency: 3,
          exercises: [
            {
              name: 'Deadlift',
              sets: 5,
              reps: '3-5',
              weight: '85-95% 1RM',
              restTime: 300,
              tempo: '2-1-2-1',
              notes: 'Focus on explosive hip drive and maintaining neutral spine'
            },
            {
              name: 'Squat',
              sets: 4,
              reps: '5-8',
              weight: '80-90% 1RM',
              restTime: 240,
              tempo: '3-1-2-1',
              notes: 'Full depth, controlled descent'
            },
            {
              name: 'Bench Press',
              sets: 4,
              reps: '5-8',
              weight: '80-90% 1RM',
              restTime: 240,
              tempo: '2-1-2-1',
              notes: 'Powerful press, full range of motion'
            },
            {
              name: 'Power Clean',
              sets: 5,
              reps: '3-5',
              weight: '70-85% 1RM',
              restTime: 300,
              tempo: 'Explosive',
              notes: 'Focus on triple extension and quick turnover'
            },
            {
              name: 'Farmer\'s Walk',
              sets: 3,
              reps: '20-30 yards',
              weight: 'Heavy',
              restTime: 180,
              tempo: 'Steady',
              notes: 'Maintain upright posture, strong grip'
            },
            {
              name: 'Sled Push',
              sets: 4,
              reps: '20-30 yards',
              weight: 'Heavy',
              restTime: 180,
              tempo: 'Explosive',
              notes: 'Low body position, powerful leg drive'
            }
          ],
          progression: {
            type: 'linear',
            weeklyIncrease: 2.5,
            deloadFrequency: 4,
            maxAttempts: 3
          },
          notes: [
            'Focus on explosive power development',
            'Maintain mobility and flexibility',
            'Progressive overload is key'
          ]
        },
        {
          id: 'fullback_conditioning',
          name: 'Fullback Conditioning',
          type: 'conditioning',
          frequency: 2,
          exercises: [
            {
              name: 'Sprint Intervals',
              sets: 8,
              reps: '40 yards',
              weight: 'Bodyweight',
              restTime: 60,
              tempo: 'Max effort',
              notes: 'Focus on acceleration and top speed'
            },
            {
              name: 'Battle Ropes',
              sets: 4,
              reps: '30 seconds',
              weight: 'Heavy ropes',
              restTime: 90,
              tempo: 'High intensity',
              notes: 'Alternating waves, maintain power output'
            },
            {
              name: 'Tire Flips',
              sets: 5,
              reps: '5-8',
              weight: 'Heavy tire',
              restTime: 120,
              tempo: 'Explosive',
              notes: 'Use proper technique, protect lower back'
            },
            {
              name: 'Sled Drags',
              sets: 4,
              reps: '50 yards',
              weight: 'Heavy',
              restTime: 120,
              tempo: 'Steady power',
              notes: 'Forward and backward drags'
            }
          ],
          progression: {
            type: 'wave',
            weeklyIncrease: 5,
            deloadFrequency: 3,
            maxAttempts: 2
          },
          notes: [
            'Build work capacity and mental toughness',
            'Simulate game-like conditions',
            'Focus on power endurance'
          ]
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 20), // 20 cal/lb for active athletes
        protein: Math.round(profile.weight * 1.2), // 1.2g/lb
        carbs: Math.round(profile.weight * 4), // 4g/lb
        fat: Math.round(profile.weight * 0.8), // 0.8g/lb
        mealTiming: [
          {
            time: '7:00 AM',
            type: 'main_meal',
            calories: 600,
            protein: 40,
            description: 'Breakfast: Oatmeal, eggs, fruit'
          },
          {
            time: '10:00 AM',
            type: 'snack',
            calories: 300,
            protein: 25,
            description: 'Greek yogurt with nuts'
          },
          {
            time: '1:00 PM',
            type: 'main_meal',
            calories: 800,
            protein: 60,
            description: 'Lunch: Chicken, rice, vegetables'
          },
          {
            time: '3:30 PM',
            type: 'pre_workout',
            calories: 200,
            protein: 15,
            description: 'Banana with almond butter'
          },
          {
            time: '6:30 PM',
            type: 'post_workout',
            calories: 400,
            protein: 30,
            description: 'Protein shake with fruit'
          },
          {
            time: '8:00 PM',
            type: 'main_meal',
            calories: 700,
            protein: 50,
            description: 'Dinner: Salmon, sweet potato, greens'
          }
        ],
        supplements: [
          {
            name: 'Whey Protein',
            dosage: '1-2 scoops',
            timing: 'Post-workout',
            purpose: 'Muscle recovery and growth'
          },
          {
            name: 'Creatine Monohydrate',
            dosage: '5g daily',
            timing: 'With any meal',
            purpose: 'Power output and muscle mass'
          },
          {
            name: 'Beta-Alanine',
            dosage: '3-5g daily',
            timing: 'Pre-workout',
            purpose: 'Muscle endurance and power'
          },
          {
            name: 'Omega-3',
            dosage: '2-3g daily',
            timing: 'With meals',
            purpose: 'Recovery and joint health'
          }
        ],
        hydration: 4.5 // liters per day
      },
      timeline: [
        {
          week: 1,
          goal: 'Establish baseline and technique',
          metrics: ['1RM testing', 'Body composition', 'Conditioning baseline'],
          checkpoints: ['Form check on all lifts', 'Nutrition tracking setup']
        },
        {
          week: 4,
          goal: 'Strength foundation',
          metrics: ['5% increase in main lifts', 'Conditioning improvement'],
          checkpoints: ['Deload week', 'Recovery assessment']
        },
        {
          week: 8,
          goal: 'Power development',
          metrics: ['10% increase in power lifts', 'Sprint time improvement'],
          checkpoints: ['Mid-program assessment', 'Nutrition adjustments']
        },
        {
          week: 12,
          goal: 'Peak strength',
          metrics: ['15% increase in main lifts', 'Conditioning peak'],
          checkpoints: ['Final deload', 'Competition prep']
        },
        {
          week: 16,
          goal: 'Peak performance',
          metrics: ['Max strength achieved', 'Peak conditioning'],
          checkpoints: ['Final testing', 'Next phase planning']
        }
      ],
      expectedOutcomes: [
        '15-20% increase in strength across all main lifts',
        'Improved power output and explosiveness',
        'Enhanced work capacity and conditioning',
        'Better body composition (muscle gain, fat loss)',
        'Increased mental toughness and confidence'
      ]
    };
  }

  private createPowerAthletePlan(profile: UserProfile): CuratedPlan {
    return {
      id: `power_athlete_${Date.now()}`,
      goal: 'Power Athlete',
      phase: 'Power Development',
      duration: 12,
      workouts: [
        {
          id: 'power_training',
          name: 'Power Training',
          type: 'power',
          frequency: 4,
          exercises: [
            {
              name: 'Hang Clean',
              sets: 6,
              reps: '2-3',
              weight: '80-90% 1RM',
              restTime: 300,
              tempo: 'Explosive',
              notes: 'Focus on triple extension and quick turnover'
            },
            {
              name: 'Jump Squat',
              sets: 5,
              reps: '3-5',
              weight: '30-50% 1RM',
              restTime: 240,
              tempo: 'Explosive',
              notes: 'Max height on each jump'
            },
            {
              name: 'Medicine Ball Slam',
              sets: 4,
              reps: '8-10',
              weight: 'Heavy ball',
              restTime: 120,
              tempo: 'Explosive',
              notes: 'Full body power transfer'
            }
          ],
          progression: {
            type: 'wave',
            weeklyIncrease: 2.5,
            deloadFrequency: 3,
            maxAttempts: 2
          },
          notes: ['Focus on speed and power', 'Quality over quantity']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 18),
        protein: Math.round(profile.weight * 1.1),
        carbs: Math.round(profile.weight * 3.5),
        fat: Math.round(profile.weight * 0.7),
        mealTiming: [],
        supplements: [],
        hydration: 4.0
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createFunctionalStrengthPlan(profile: UserProfile): CuratedPlan {
    return {
      id: `functional_strength_${Date.now()}`,
      goal: 'Functional Strength',
      phase: 'Movement Mastery',
      duration: 10,
      workouts: [
        {
          id: 'functional_training',
          name: 'Functional Training',
          type: 'strength',
          frequency: 3,
          exercises: [
            {
              name: 'Turkish Get-up',
              sets: 3,
              reps: '3-5 each side',
              weight: 'Moderate',
              restTime: 180,
              tempo: 'Controlled',
              notes: 'Focus on stability and control'
            },
            {
              name: 'Farmer\'s Walk',
              sets: 4,
              reps: '30-50 yards',
              weight: 'Heavy',
              restTime: 120,
              tempo: 'Steady',
              notes: 'Maintain upright posture'
            }
          ],
          progression: {
            type: 'double_progression',
            weeklyIncrease: 0,
            deloadFrequency: 4,
            maxAttempts: 3
          },
          notes: ['Focus on movement quality', 'Progressive complexity']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 16),
        protein: Math.round(profile.weight * 1.0),
        carbs: Math.round(profile.weight * 3.0),
        fat: Math.round(profile.weight * 0.6),
        mealTiming: [],
        supplements: [],
        hydration: 3.5
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createMuscularPlan(profile: UserProfile): CuratedPlan {
    return {
      id: `muscular_${Date.now()}`,
      goal: 'Muscular',
      phase: 'Hypertrophy',
      duration: 12,
      workouts: [
        {
          id: 'hypertrophy_training',
          name: 'Hypertrophy Training',
          type: 'hypertrophy',
          frequency: 5,
          exercises: [
            {
              name: 'Barbell Squat',
              sets: 4,
              reps: '8-12',
              weight: '70-80% 1RM',
              restTime: 120,
              tempo: '3-1-2-1',
              notes: 'Focus on muscle tension and time under load'
            },
            {
              name: 'Bench Press',
              sets: 4,
              reps: '8-12',
              weight: '70-80% 1RM',
              restTime: 120,
              tempo: '3-1-2-1',
              notes: 'Full range of motion, controlled movement'
            }
          ],
          progression: {
            type: 'double_progression',
            weeklyIncrease: 0,
            deloadFrequency: 6,
            maxAttempts: 4
          },
          notes: ['Focus on muscle growth', 'Progressive overload']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 18),
        protein: Math.round(profile.weight * 1.2),
        carbs: Math.round(profile.weight * 4.0),
        fat: Math.round(profile.weight * 0.7),
        mealTiming: [],
        supplements: [],
        hydration: 4.0
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createAthleticPlan(profile: UserProfile): CuratedPlan {
    return this.createNFLFullbackPlan(profile); // Similar to NFL Fullback but adjusted
  }

  private createStrengthFocusedPlan(profile: UserProfile): CuratedPlan {
    return this.createNFLFullbackPlan(profile); // Similar to NFL Fullback but adjusted
  }

  private createWeightLossPlan(profile: UserProfile): CuratedPlan {
    return {
      id: `weight_loss_${Date.now()}`,
      goal: 'Weight Loss',
      phase: 'Fat Loss',
      duration: 16,
      workouts: [
        {
          id: 'fat_loss_training',
          name: 'Fat Loss Training',
          type: 'conditioning',
          frequency: 5,
          exercises: [
            {
              name: 'Circuit Training',
              sets: 4,
              reps: '45 seconds work, 15 rest',
              weight: 'Moderate',
              restTime: 60,
              tempo: 'High intensity',
              notes: 'Keep heart rate elevated'
            }
          ],
          progression: {
            type: 'linear',
            weeklyIncrease: 5,
            deloadFrequency: 4,
            maxAttempts: 3
          },
          notes: ['Focus on fat burning', 'Maintain muscle mass']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 12), // Caloric deficit
        protein: Math.round(profile.weight * 1.0),
        carbs: Math.round(profile.weight * 2.0),
        fat: Math.round(profile.weight * 0.5),
        mealTiming: [],
        supplements: [],
        hydration: 3.5
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createWeightGainPlan(profile: UserProfile): CuratedPlan {
    return {
      id: `weight_gain_${Date.now()}`,
      goal: 'Weight Gain',
      phase: 'Muscle Building',
      duration: 16,
      workouts: [
        {
          id: 'muscle_building',
          name: 'Muscle Building',
          type: 'hypertrophy',
          frequency: 4,
          exercises: [
            {
              name: 'Compound Movements',
              sets: 4,
              reps: '6-10',
              weight: '75-85% 1RM',
              restTime: 180,
              tempo: '2-1-2-1',
              notes: 'Focus on progressive overload'
            }
          ],
          progression: {
            type: 'linear',
            weeklyIncrease: 2.5,
            deloadFrequency: 6,
            maxAttempts: 4
          },
          notes: ['Focus on muscle growth', 'Caloric surplus']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 22), // Caloric surplus
        protein: Math.round(profile.weight * 1.2),
        carbs: Math.round(profile.weight * 5.0),
        fat: Math.round(profile.weight * 0.8),
        mealTiming: [],
        supplements: [],
        hydration: 4.5
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createLeanTonedPlan(profile: UserProfile): CuratedPlan {
    return this.createWeightLossPlan(profile); // Similar approach
  }

  private createEndurancePlan(profile: UserProfile): CuratedPlan {
    return {
      id: `endurance_${Date.now()}`,
      goal: 'Endurance Focused',
      phase: 'Aerobic Base',
      duration: 12,
      workouts: [
        {
          id: 'endurance_training',
          name: 'Endurance Training',
          type: 'endurance',
          frequency: 6,
          exercises: [
            {
              name: 'Long Distance Running',
              sets: 1,
              reps: '30-60 minutes',
              weight: 'Bodyweight',
              restTime: 0,
              tempo: 'Steady state',
              notes: 'Build aerobic base'
            }
          ],
          progression: {
            type: 'linear',
            weeklyIncrease: 10,
            deloadFrequency: 4,
            maxAttempts: 3
          },
          notes: ['Focus on endurance', 'Progressive distance']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 16),
        protein: Math.round(profile.weight * 0.9),
        carbs: Math.round(profile.weight * 5.0),
        fat: Math.round(profile.weight * 0.6),
        mealTiming: [],
        supplements: [],
        hydration: 4.0
      },
      timeline: [],
      expectedOutcomes: []
    };
  }

  private createMaintenancePlan(profile: UserProfile): CuratedPlan {
    return {
      id: `maintenance_${Date.now()}`,
      goal: 'Maintenance',
      phase: 'Maintenance',
      duration: 8,
      workouts: [
        {
          id: 'maintenance_training',
          name: 'Maintenance Training',
          type: 'strength',
          frequency: 3,
          exercises: [
            {
              name: 'Full Body Workout',
              sets: 3,
              reps: '8-12',
              weight: '70% 1RM',
              restTime: 120,
              tempo: 'Controlled',
              notes: 'Maintain current fitness level'
            }
          ],
          progression: {
            type: 'linear',
            weeklyIncrease: 0,
            deloadFrequency: 8,
            maxAttempts: 0
          },
          notes: ['Maintain current fitness', 'Focus on consistency']
        }
      ],
      nutrition: {
        calories: Math.round(profile.weight * 15),
        protein: Math.round(profile.weight * 0.8),
        carbs: Math.round(profile.weight * 3.0),
        fat: Math.round(profile.weight * 0.6),
        mealTiming: [],
        supplements: [],
        hydration: 3.5
      },
      timeline: [],
      expectedOutcomes: []
    };
  }
}

export const goalCurationService = new GoalCurationService();
