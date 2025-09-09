// API Service for Database Connectivity
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://scioptimal-fitness-app.netlify.app/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async getProfile() {
    return this.request<{
      id: string;
      name: string;
      email: string;
      profile: any;
    }>('/user/profile');
  }

  async updateProfile(profile: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile }),
    });
  }

  // Workout Data
  async saveWorkout(workout: any) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async getWorkouts() {
    return this.request<any[]>('/workouts');
  }

  // Nutrition Data
  async saveNutrition(nutrition: any) {
    return this.request('/nutrition', {
      method: 'POST',
      body: JSON.stringify(nutrition),
    });
  }

  async getNutrition() {
    return this.request<any[]>('/nutrition');
  }

  // Progress Data
  async saveProgress(progress: any) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  async getProgress() {
    return this.request<any[]>('/progress');
  }

  // Sleep Data
  async saveSleep(sleep: any) {
    return this.request('/sleep', {
      method: 'POST',
      body: JSON.stringify(sleep),
    });
  }

  async getSleep() {
    return this.request<any[]>('/sleep');
  }

  // Training Phases
  async saveTrainingPhase(phase: any) {
    return this.request('/training-phases', {
      method: 'POST',
      body: JSON.stringify(phase),
    });
  }

  async getTrainingPhases() {
    return this.request<any[]>('/training-phases');
  }

  // Health Check
  async healthCheck() {
    return this.request<{
      status: string;
      timestamp: string;
    }>('/health');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
