import { 
  UserProfile, 
  WorkoutSession, 
  WorkoutDay, 
  NutritionEntry, 
  SleepEntry, 
  ProgressEntry, 
  TrainingPhase 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://scioptimal-fitness.netlify.app/.netlify/functions/api';

// Helper function to make requests (no auth required for now)
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        name: payload.name,
      };
    } catch (error) {
      return null;
    }
  },
};

// User Profile API
export const userAPI = {
  createProfile: async (profile: Omit<UserProfile, 'id'>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Profile creation failed');
    }

    const data = await response.json();
    // Store the profile ID for future reference
    localStorage.setItem('profileId', data.id);
    return data;
  },

  getProfile: async (): Promise<UserProfile | null> => {
    // First try to get profile by stored ID
    const profileId = localStorage.getItem('profileId');
    if (profileId) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile/${profileId}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log('Failed to get profile by ID');
      }
    }
    
    return null;
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) throw new Error('No profile ID found');
    
    const response = await fetch(`${API_BASE_URL}/user/profile/${profileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Profile update failed');
    }

    return await response.json();
  },

  getPersonalizedData: async () => {
    return makeRequest('/user/personalized-data');
  },
};

// Workouts API
export const workoutsAPI = {
  getAll: async (): Promise<(WorkoutSession | WorkoutDay)[]> => {
    return makeRequest('/workouts');
  },

  create: async (workout: Omit<WorkoutSession | WorkoutDay, 'id'>): Promise<WorkoutSession | WorkoutDay> => {
    return makeRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  },

  update: async (id: string, workout: Partial<WorkoutSession | WorkoutDay>): Promise<WorkoutSession | WorkoutDay> => {
    return makeRequest(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  },

  delete: async (id: string): Promise<void> => {
    return makeRequest(`/workouts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Nutrition API
export const nutritionAPI = {
  getAll: async (): Promise<NutritionEntry[]> => {
    return makeRequest('/nutrition');
  },

  create: async (nutrition: Omit<NutritionEntry, 'id'>): Promise<NutritionEntry> => {
    return makeRequest('/nutrition', {
      method: 'POST',
      body: JSON.stringify(nutrition),
    });
  },

  update: async (id: string, nutrition: Partial<NutritionEntry>): Promise<NutritionEntry> => {
    return makeRequest(`/nutrition/${id}`, {
      method: 'PUT',
      body: JSON.stringify(nutrition),
    });
  },

  delete: async (id: string): Promise<void> => {
    return makeRequest(`/nutrition/${id}`, {
      method: 'DELETE',
    });
  },
};

// Sleep API
export const sleepAPI = {
  getAll: async (): Promise<SleepEntry[]> => {
    return makeRequest('/sleep');
  },

  create: async (sleep: Omit<SleepEntry, 'id'>): Promise<SleepEntry> => {
    return makeRequest('/sleep', {
      method: 'POST',
      body: JSON.stringify(sleep),
    });
  },

  update: async (id: string, sleep: Partial<SleepEntry>): Promise<SleepEntry> => {
    return makeRequest(`/sleep/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sleep),
    });
  },

  delete: async (id: string): Promise<void> => {
    return makeRequest(`/sleep/${id}`, {
      method: 'DELETE',
    });
  },
};

// Progress API
export const progressAPI = {
  getAll: async (): Promise<ProgressEntry[]> => {
    return makeRequest('/progress');
  },

  create: async (progress: Omit<ProgressEntry, 'id'>): Promise<ProgressEntry> => {
    return makeRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  },

  update: async (id: string, progress: Partial<ProgressEntry>): Promise<ProgressEntry> => {
    return makeRequest(`/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progress),
    });
  },

  delete: async (id: string): Promise<void> => {
    return makeRequest(`/progress/${id}`, {
      method: 'DELETE',
    });
  },
};

// Training Phases API
export const trainingPhasesAPI = {
  getAll: async (): Promise<TrainingPhase[]> => {
    return makeRequest('/training-phases');
  },

  create: async (phase: Omit<TrainingPhase, 'id'>): Promise<TrainingPhase> => {
    return makeRequest('/training-phases', {
      method: 'POST',
      body: JSON.stringify(phase),
    });
  },

  update: async (id: string, phase: Partial<TrainingPhase>): Promise<TrainingPhase> => {
    return makeRequest(`/training-phases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(phase),
    });
  },

  delete: async (id: string): Promise<void> => {
    return makeRequest(`/training-phases/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};
