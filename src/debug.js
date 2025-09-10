// Debug script to test app functionality
console.log('=== SciOptimal Debug ===');

// Test 1: Check if React is loading
console.log('React available:', typeof React !== 'undefined');

// Test 2: Check if store is accessible
try {
  const { useAppStore } = require('./store');
  console.log('Store accessible:', !!useAppStore);
} catch (error) {
  console.error('Store error:', error);
}

// Test 3: Check if workout generator is accessible
try {
  const { workoutGeneratorService } = require('./services/workoutGenerator');
  console.log('Workout generator accessible:', !!workoutGeneratorService);
} catch (error) {
  console.error('Workout generator error:', error);
}

// Test 4: Check localStorage
console.log('LocalStorage available:', typeof localStorage !== 'undefined');

// Test 5: Check if we're in a browser environment
console.log('Window available:', typeof window !== 'undefined');

console.log('=== End Debug ===');
