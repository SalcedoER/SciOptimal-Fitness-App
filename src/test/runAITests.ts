// AI Intelligence Test Runner
// Run this to test your enhanced AI system

import { AIIntelligenceTestSuite } from './aiIntelligenceTest';

console.log('🧠 SciOptimal AI Intelligence Test Runner');
console.log('==========================================\n');

async function runTests() {
  try {
    const testSuite = new AIIntelligenceTestSuite();
    await testSuite.runAllTests();
    
    // Get detailed results
    const results = testSuite.getTestResults();
    if (results.length > 0) {
      const suite = results[0];
      console.log('\n🎉 Test Suite Completed!');
      console.log(`📊 Final Results:`);
      console.log(`   Overall Score: ${suite.overallScore.toFixed(1)}/100`);
      console.log(`   Tests Passed: ${suite.passedTests}/${suite.totalTests}`);
      console.log(`   Success Rate: ${((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%`);
      
      // Export results to JSON for analysis
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ai-test-results-${timestamp}.json`;
      
      fs.writeFileSync(filename, JSON.stringify(results, null, 2));
      console.log(`\n📁 Detailed results saved to: ${filename}`);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
runTests();
