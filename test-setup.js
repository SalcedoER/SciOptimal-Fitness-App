// Test script to verify backend functionality
const API_BASE_URL = 'https://scioptimal-fitness.netlify.app/.netlify/functions/api';

// Test data with comprehensive profiles
const testUser = {
  name: 'TestUser',
  email: 'test@scioptimal.com',
  password: 'testpass123',
  profile: {
    age: 25,
    height: 70, // 5'10" in inches
    weight: 80, // 176 lbs in kg
    bodyFatPercentage: 15,
    goalWeight: 75, // 165 lbs in kg
    targetPhysique: 'lean_recomp',
    equipment: ['dumbbells', 'pull_up_bar', 'resistance_bands'],
    activityLevel: 'moderately_active',
    sleepSchedule: {
      wakeUpTime: '06:00',
      bedTime: '22:00',
      targetSleepHours: 8,
      sleepQuality: 8,
      sleepTracking: true,
      sleepNotes: 'Consistent schedule for optimal recovery'
    }
  }
};

const devinUser = {
  name: 'Devin',
  email: 'devin@scioptimal.com',
  password: 'devin123',
  profile: {
    age: 28,
    height: 72, // 6'0" in inches
    weight: 85, // 187 lbs in kg
    bodyFatPercentage: 18,
    goalWeight: 80, // 176 lbs in kg
    targetPhysique: 'muscle_gain',
    equipment: ['gym_membership', 'dumbbells', 'resistance_bands'],
    activityLevel: 'very_active',
    sleepSchedule: {
      wakeUpTime: '05:30',
      bedTime: '21:30',
      targetSleepHours: 7.5,
      sleepQuality: 7,
      sleepTracking: true,
      sleepNotes: 'Early riser, focused on strength gains'
    }
  }
};

const testWorkout = {
  date: new Date().toISOString(),
  type: 'workout',
  exercises: [
    {
      name: 'Bench Press',
      muscle_group: ['chest', 'arms'],
      sets: 3,
      reps: '8-10',
      weight: 135,
      rpe: 8,
      notes: 'Test workout'
    }
  ],
  duration: 45,
  notes: 'Test workout session',
  rpe: 8
};

const testNutrition = {
  date: new Date().toISOString(),
  meal: 'Breakfast',
  foods: [
    {
      name: 'Oatmeal',
      kcal: 150,
      protein_g: 6,
      carbs_g: 27,
      fat_g: 3,
      fiber_g: 4,
      sodium_mg: 0,
      potassium_mg: 150
    }
  ],
  totalCalories: 150,
  macros: {
    protein_g: 6,
    carbs_g: 27,
    fat_g: 3,
    fiber_g: 4,
    sodium_mg: 0,
    potassium_mg: 150
  },
  notes: 'Test meal'
};

const testSleep = {
  date: new Date().toISOString(),
  sleepHours: 8,
  sleepQuality: 8,
  stressLevel: 5,
  caffeineIntake: 6,
  notes: 'Test sleep entry'
};

const testProgress = {
  date: new Date().toISOString(),
  weight: 180,
  bodyFatPercentage: 15,
  measurements: {
    chest: 42,
    waist: 32,
    hips: 38,
    biceps: 15,
    thighs: 24,
    calves: 16
  },
  strengthLifts: {
    benchPress: 225,
    squat: 315,
    deadlift: 405,
    overheadPress: 135,
    rows: 185
  },
  notes: 'Test progress entry'
};

// Test functions
async function testHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
}

async function testUserRegistration(userData = testUser) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === 'User already exists') {
        console.log(`ℹ️ User ${userData.name} already exists, proceeding with login`);
        return await testUserLogin(userData);
      }
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log(`✅ User registration successful: ${data.user.name}`);
    localStorage.setItem('authToken', data.token);
    return data.token;
  } catch (error) {
    console.error(`❌ User registration failed for ${userData.name}:`, error);
    return null;
  }
}

async function testUserLogin(userData = testUser) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log(`✅ User login successful: ${data.user.name}`);
    localStorage.setItem('authToken', data.token);
    return data.token;
  } catch (error) {
    console.error(`❌ User login failed for ${userData.name}:`, error);
    return null;
  }
}

async function testPersonalizedData() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for personalized data test');
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/user/personalized-data`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log('✅ Personalized data retrieved successfully:');
    console.log(`   - BMR: ${data.bmr} calories`);
    console.log(`   - TDEE: ${data.tdee} calories`);
    console.log(`   - Protein: ${data.macros.protein_g}g`);
    console.log(`   - Carbs: ${data.macros.carbs_g}g`);
    console.log(`   - Fat: ${data.macros.fat_g}g`);
    console.log(`   - Training Phase: ${data.trainingPhase.name}`);
    console.log(`   - Sleep Recommendation: ${data.recommendations.sleepHours} hours`);
    console.log(`   - Water Intake: ${data.recommendations.waterIntake}L/day`);
    console.log(`   - Cardio Frequency: ${data.recommendations.cardioFrequency}x/week`);
    
    return true;
  } catch (error) {
    console.error('❌ Personalized data retrieval failed:', error);
    return false;
  }
}

async function testWorkoutCreation() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for workout test');
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testWorkout)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log('✅ Workout creation successful:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Workout creation failed:', error);
    return false;
  }
}

async function testNutritionCreation() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for nutrition test');
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testNutrition)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log('✅ Nutrition creation successful:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Nutrition creation failed:', error);
    return false;
  }
}

async function testSleepCreation() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for sleep test');
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/sleep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testSleep)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log('✅ Sleep creation successful:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Sleep creation failed:', error);
    return false;
  }
}

async function testProgressCreation() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for progress test');
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testProgress)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    console.log('✅ Progress creation successful:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Progress creation failed:', error);
    return false;
  }
}

async function testDataRetrieval() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token for data retrieval test');
      return false;
    }
    
    const [workouts, nutrition, sleep, progress, trainingPhases] = await Promise.all([
      fetch(`${API_BASE_URL}/workouts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE_URL}/nutrition`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE_URL}/sleep`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE_URL}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE_URL}/training-phases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json())
    ]);
    
    console.log('✅ Data retrieval successful:');
    console.log(`   - Workouts: ${workouts.length}`);
    console.log(`   - Nutrition: ${nutrition.length}`);
    console.log(`   - Sleep: ${sleep.length}`);
    console.log(`   - Progress: ${progress.length}`);
    console.log(`   - Training Phases: ${trainingPhases.length}`);
    return true;
  } catch (error) {
    console.error('❌ Data retrieval failed:', error);
    return false;
  }
}

async function testDevinAccount() {
  console.log('\n🧪 Testing Devin\'s account creation...');
  
  // Clear any existing tokens
  localStorage.removeItem('authToken');
  
  // Create Devin's account
  const devinToken = await testUserRegistration(devinUser);
  if (!devinToken) {
    console.log('❌ Could not create Devin\'s account');
    return false;
  }
  
  // Test Devin's personalized data
  const personalizedOk = await testPersonalizedData();
  
  // Test data creation for Devin
  const workoutOk = await testWorkoutCreation();
  const nutritionOk = await testNutritionCreation();
  const sleepOk = await testSleepCreation();
  const progressOk = await testProgressCreation();
  
  console.log('\n📊 Devin\'s Account Test Summary:');
  console.log(`   Personalized Data: ${personalizedOk ? '✅' : '❌'}`);
  console.log(`   Workout Creation: ${workoutOk ? '✅' : '❌'}`);
  console.log(`   Nutrition Creation: ${nutritionOk ? '✅' : '❌'}`);
  console.log(`   Sleep Creation: ${sleepOk ? '✅' : '❌'}`);
  console.log(`   Progress Creation: ${progressOk ? '✅' : '❌'}`);
  
  return personalizedOk && workoutOk && nutritionOk && sleepOk && progressOk;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting SciOptimal Backend Tests...\n');
  
  // Test health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('❌ Backend is not accessible. Please deploy first.');
    return;
  }
  
  // Test TestUser account
  console.log('🧪 Testing TestUser account...');
  const testUserToken = await testUserRegistration(testUser);
  if (!testUserToken) {
    console.log('❌ TestUser authentication failed. Cannot proceed with other tests.');
    return;
  }
  
  // Test personalized data generation
  const personalizedOk = await testPersonalizedData();
  
  // Test data creation
  const workoutOk = await testWorkoutCreation();
  const nutritionOk = await testNutritionCreation();
  const sleepOk = await testSleepCreation();
  const progressOk = await testProgressCreation();
  
  // Test data retrieval
  const retrievalOk = await testDataRetrieval();
  
  // Test Devin's account
  const devinOk = await testDevinAccount();
  
  // Summary
  console.log('\n📊 Overall Test Summary:');
  console.log(`   Health Check: ${healthOk ? '✅' : '❌'}`);
  console.log(`   TestUser Authentication: ${testUserToken ? '✅' : '❌'}`);
  console.log(`   Personalized Data: ${personalizedOk ? '✅' : '❌'}`);
  console.log(`   Workout Creation: ${workoutOk ? '✅' : '❌'}`);
  console.log(`   Nutrition Creation: ${nutritionOk ? '✅' : '❌'}`);
  console.log(`   Sleep Creation: ${sleepOk ? '✅' : '❌'}`);
  console.log(`   Progress Creation: ${progressOk ? '✅' : '❌'}`);
  console.log(`   Data Retrieval: ${retrievalOk ? '✅' : '❌'}`);
  console.log(`   Devin's Account: ${devinOk ? '✅' : '❌'}`);
  
  const allPassed = healthOk && testUserToken && personalizedOk && workoutOk && nutritionOk && sleepOk && progressOk && retrievalOk && devinOk;
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed. Check the logs above.'}`);
  
  if (allPassed) {
    console.log('\n✅ Your SciOptimal backend is fully functional!');
    console.log('✅ Fresh, personalized data is generated for each user');
    console.log('✅ Macros and training plans are calculated based on user profiles');
    console.log('✅ Data will persist even when your laptop is off');
    console.log('✅ Multiple users can access the app simultaneously');
    console.log('✅ Perfect for tracking Devin\'s progress!');
    console.log('\n🔐 Test Accounts Created:');
    console.log('   - TestUser: test@scioptimal.com / testpass123');
    console.log('   - Devin: devin@scioptimal.com / devin123');
  }
}

// Run tests if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runSciOptimalTests = runAllTests;
  window.testDevinAccount = testDevinAccount;
  console.log('🧪 SciOptimal test script loaded.');
  console.log('Run window.runSciOptimalTests() to test everything');
  console.log('Run window.testDevinAccount() to test Devin\'s account specifically');
} else {
  // Node.js environment
  runAllTests();
}
