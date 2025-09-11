// Simple test to check if AI responses are different
console.log('Testing AI response generation...');

// Simulate the AI response generation
const timestamp1 = Date.now();
const randomSeed1 = timestamp1 % 1000;

const timestamp2 = Date.now() + 1000;
const randomSeed2 = timestamp2 % 1000;

console.log('Random Seed 1:', randomSeed1);
console.log('Random Seed 2:', randomSeed2);

// Test workout responses
const workoutResponses = [
  "Welcome to your fitness journey! As someone targeting a NFL Fullback physique, I'll create a comprehensive training plan that builds strength, power, and athleticism. Your current stats (85lbs, 180cm) suggest we should focus on compound movements and progressive overload. Ready to start?",
  "Time to unleash your potential! Your NFL Fullback goals are achievable with the right training approach. Based on your stats (85lbs, 180cm), I'll design workouts that maximize your genetic potential. Let's begin!",
  "Your transformation starts now! I'll create a personalized training program specifically designed for your NFL Fullback aspirations. With your current build (85lbs, 180cm), we'll focus on strength, power, and athletic development. Ready to dominate?",
  "Let's build something incredible! Your NFL Fullback journey begins with a strategic training plan tailored to your unique physique (85lbs, 180cm). I'll ensure every workout moves you closer to your goals. Shall we start?"
];

console.log('\nResponse 1:', workoutResponses[randomSeed1 % workoutResponses.length]);
console.log('\nResponse 2:', workoutResponses[randomSeed2 % workoutResponses.length]);

console.log('\nAre responses different?', workoutResponses[randomSeed1 % workoutResponses.length] !== workoutResponses[randomSeed2 % workoutResponses.length]);
