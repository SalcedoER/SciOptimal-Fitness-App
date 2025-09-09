// Apple HealthKit Integration Service
import { HealthData, HeartRateData, StepsData, SleepData, WorkoutData, HRVData, EnergyData } from '../types/health';

class HealthKitService {
  private isAvailable: boolean = false;
  private permissions: { [key: string]: boolean } = {};

  constructor() {
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    // Check if HealthKit is available (iOS Safari)
    if (typeof window !== 'undefined' && 'navigator' in window) {
      this.isAvailable = 'health' in navigator;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('HealthKit not available on this device');
      return false;
    }

    try {
      // Request permissions for different data types
      const permissions = await (navigator as any).health.requestPermissions([
        'heartRate',
        'steps',
        'sleep',
        'workouts',
        'heartRateVariability',
        'activeEnergy',
        'restingHeartRate',
        'vo2Max'
      ]);

      this.permissions = permissions;
      return Object.values(permissions).every(Boolean);
    } catch (error) {
      console.error('Failed to request HealthKit permissions:', error);
      return false;
    }
  }

  async getHeartRateData(startDate: Date, endDate: Date): Promise<HeartRateData[]> {
    if (!this.permissions.heartRate) {
      throw new Error('Heart rate permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'heartRate'
      });

      return data.map((item: any) => ({
        timestamp: new Date(item.timestamp),
        value: item.value,
        source: 'Apple Watch',
        context: this.determineHeartRateContext(item.value, item.metadata)
      }));
    } catch (error) {
      console.error('Failed to fetch heart rate data:', error);
      return [];
    }
  }

  async getStepsData(startDate: Date, endDate: Date): Promise<StepsData[]> {
    if (!this.permissions.steps) {
      throw new Error('Steps permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'steps'
      });

      return data.map((item: any) => ({
        date: new Date(item.timestamp),
        count: item.value,
        distance: item.distance || 0,
        floors: item.floors || 0,
        activeMinutes: item.activeMinutes || 0
      }));
    } catch (error) {
      console.error('Failed to fetch steps data:', error);
      return [];
    }
  }

  async getSleepData(startDate: Date, endDate: Date): Promise<SleepData[]> {
    if (!this.permissions.sleep) {
      throw new Error('Sleep permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'sleep'
      });

      return data.map((item: any) => ({
        date: new Date(item.timestamp),
        bedtime: new Date(item.bedtime),
        wakeTime: new Date(item.wakeTime),
        duration: item.duration,
        deepSleep: item.deepSleep || 0,
        lightSleep: item.lightSleep || 0,
        remSleep: item.remSleep || 0,
        awake: item.awake || 0,
        efficiency: item.efficiency || 0
      }));
    } catch (error) {
      console.error('Failed to fetch sleep data:', error);
      return [];
    }
  }

  async getWorkoutData(startDate: Date, endDate: Date): Promise<WorkoutData[]> {
    if (!this.permissions.workouts) {
      throw new Error('Workouts permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'workouts'
      });

      return data.map((item: any) => ({
        id: item.id,
        type: item.type,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        duration: item.duration,
        calories: item.calories,
        averageHeartRate: item.averageHeartRate,
        maxHeartRate: item.maxHeartRate,
        distance: item.distance,
        elevation: item.elevation,
        pace: item.pace
      }));
    } catch (error) {
      console.error('Failed to fetch workout data:', error);
      return [];
    }
  }

  async getHRVData(startDate: Date, endDate: Date): Promise<HRVData[]> {
    if (!this.permissions.heartRateVariability) {
      throw new Error('HRV permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'heartRateVariability'
      });

      return data.map((item: any) => ({
        timestamp: new Date(item.timestamp),
        value: item.value,
        source: 'Apple Watch'
      }));
    } catch (error) {
      console.error('Failed to fetch HRV data:', error);
      return [];
    }
  }

  async getEnergyData(startDate: Date, endDate: Date): Promise<EnergyData[]> {
    if (!this.permissions.activeEnergy) {
      throw new Error('Energy permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        startDate,
        endDate,
        dataType: 'activeEnergy'
      });

      return data.map((item: any) => ({
        date: new Date(item.timestamp),
        active: item.active,
        resting: item.resting,
        total: item.total
      }));
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
      return [];
    }
  }

  async getRestingHeartRate(): Promise<number> {
    if (!this.permissions.restingHeartRate) {
      throw new Error('Resting heart rate permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        dataType: 'restingHeartRate',
        limit: 1
      });

      return data[0]?.value || 0;
    } catch (error) {
      console.error('Failed to fetch resting heart rate:', error);
      return 0;
    }
  }

  async getVO2Max(): Promise<number> {
    if (!this.permissions.vo2Max) {
      throw new Error('VO2 Max permission not granted');
    }

    try {
      const data = await (navigator as any).health.query({
        dataType: 'vo2Max',
        limit: 1
      });

      return data[0]?.value || 0;
    } catch (error) {
      console.error('Failed to fetch VO2 Max:', error);
      return 0;
    }
  }

  async getAllHealthData(startDate: Date, endDate: Date): Promise<HealthData> {
    try {
      const [
        heartRate,
        steps,
        sleep,
        workouts,
        hrv,
        energy,
        restingHR,
        vo2Max
      ] = await Promise.all([
        this.getHeartRateData(startDate, endDate),
        this.getStepsData(startDate, endDate),
        this.getSleepData(startDate, endDate),
        this.getWorkoutData(startDate, endDate),
        this.getHRVData(startDate, endDate),
        this.getEnergyData(startDate, endDate),
        this.getRestingHeartRate(),
        this.getVO2Max()
      ]);

      return {
        heartRate,
        steps,
        sleep,
        workouts,
        heartRateVariability: hrv,
        activeEnergy: energy,
        restingHeartRate: restingHR,
        vo2Max,
        lastSync: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch all health data:', error);
      throw error;
    }
  }

  private determineHeartRateContext(hr: number, metadata: any): 'resting' | 'active' | 'recovery' | 'workout' {
    // Determine heart rate context based on value and metadata
    if (metadata?.workout) return 'workout';
    if (hr < 100) return 'resting';
    if (hr < 120) return 'recovery';
    return 'active';
  }

  // Simulate data for development/testing
  generateMockData(startDate: Date, endDate: Date): HealthData {
    const mockHeartRate: HeartRateData[] = [];
    const mockSteps: StepsData[] = [];
    const mockSleep: SleepData[] = [];
    const mockWorkouts: WorkoutData[] = [];
    const mockHRV: HRVData[] = [];
    const mockEnergy: EnergyData[] = [];

    // Generate mock data for the date range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      
      // Mock heart rate data (every 5 minutes)
      for (let i = 0; i < 288; i++) {
        const timestamp = new Date(date);
        timestamp.setMinutes(timestamp.getMinutes() + i * 5);
        mockHeartRate.push({
          timestamp,
          value: 60 + Math.random() * 40,
          source: 'Apple Watch',
          context: 'resting'
        });
      }

      // Mock steps data
      mockSteps.push({
        date,
        count: Math.floor(8000 + Math.random() * 4000),
        distance: Math.floor(6000 + Math.random() * 3000),
        floors: Math.floor(Math.random() * 10),
        activeMinutes: Math.floor(30 + Math.random() * 60)
      });

      // Mock sleep data
      const bedtime = new Date(date);
      bedtime.setHours(22 + Math.random() * 2);
      const wakeTime = new Date(bedtime);
      wakeTime.setHours(wakeTime.getHours() + 7 + Math.random() * 2);
      
      mockSleep.push({
        date,
        bedtime,
        wakeTime,
        duration: 7 + Math.random() * 2,
        deepSleep: 1.5 + Math.random() * 1,
        lightSleep: 4 + Math.random() * 2,
        remSleep: 1.5 + Math.random() * 1,
        awake: Math.random() * 0.5,
        efficiency: 80 + Math.random() * 15
      });

      // Mock HRV data (daily)
      mockHRV.push({
        timestamp: new Date(date),
        value: 30 + Math.random() * 20,
        source: 'Apple Watch'
      });

      // Mock energy data
      mockEnergy.push({
        date,
        active: Math.floor(400 + Math.random() * 200),
        resting: Math.floor(1500 + Math.random() * 200),
        total: Math.floor(1900 + Math.random() * 300)
      });
    }

    return {
      heartRate: mockHeartRate,
      steps: mockSteps,
      sleep: mockSleep,
      workouts: mockWorkouts,
      heartRateVariability: mockHRV,
      activeEnergy: mockEnergy,
      restingHeartRate: 65,
      vo2Max: 45,
      lastSync: new Date()
    };
  }
}

export const healthKitService = new HealthKitService();
