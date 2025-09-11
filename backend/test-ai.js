// Test script to verify AI responses are different
const { AdvancedIntelligentAI } = require('./src/services/advancedIntelligentAI.ts');

// Mock user profile
const mockProfile = {
  age: 25,
  height: 180,
  weight: 85,
  bodyFatPercentage: 15,
  goalWeight: 90,
  targetPhysique: 'NFL Fullback',
  activityLevel: 'Moderately Active',
  createdAt: new Date()
};

// Mock workout history
const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'Strength',
    exercises: [],
    duration: 60,
    notes: 'Great session',
    rpe: 7
  }
];

// Mock nutrition log
const mockNutrition = [];

console.log('Testing AI responses...\n');

// Test multiple responses
for (let i = 0; i < 5; i++) {
  console.log(`--- Test ${i + 1} ---`);
  
  AdvancedIntelligentAI.generateResponse(
    'I want to workout today',
    mockProfile,
    mockWorkouts,
    mockNutrition,
    `test-${i}`
  ).then(response => {
    console.log(`Response: ${response.content.substring(0, 100)}...`);
    console.log(`Suggestions: ${response.suggestions.join(', ')}`);
    console.log('');
  }).catch(err => {
    console.error('Error:', err.message);
  });
}
