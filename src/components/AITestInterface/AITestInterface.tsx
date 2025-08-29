// AI Test Interface - Browser-based testing of AI Intelligence
// Provides a user-friendly way to test all AI capabilities

import React, { useState, useEffect } from 'react';
import { intelligentAI } from '../../services/intelligentAIService';
import { useAppStore } from '../../store/useAppStore';

interface TestResult {
  testName: string;
  passed: boolean;
  score: number;
  details: string;
  expectedBehavior: string;
  actualBehavior: string;
  improvement?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  overallScore: number;
  passedTests: number;
  totalTests: number;
}

const AITestInterface: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestSuite | null>(null);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  const { userProfile } = useAppStore();

  // Mock data for testing
  const mockUserProfile = {
    id: 'test_user_001',
    name: 'Test User',
    age: 28,
    height: 70,
    weight: 75,
    bodyFatPercentage: 18,
    goalWeight: 70,
    targetPhysique: 'lean athlete',
    equipment: ['dumbbells', 'barbells', 'bench', 'squat_rack'],
    activityLevel: 'moderately_active',
    sleepSchedule: {
      wakeUpTime: '06:00',
      bedTime: '22:30',
      targetSleepHours: 7.5,
      sleepQuality: 7,
      sleepTracking: true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  };

  const mockWorkoutHistory = [
    {
      id: 'workout_001',
      date: new Date('2024-01-15'),
      trainingDay: {} as any,
      exercises: [],
      duration: 75,
      notes: 'Great session, felt strong',
      rpe: 8
    }
  ];

  const mockNutritionLog = [
    {
      id: 'nutrition_001',
      date: new Date('2024-01-15'),
      meal: 'Post-workout',
      foods: [],
      totalCalories: 2200,
      macros: { protein_g: 180, carbs_g: 200, fat_g: 80, fiber_g: 25, sodium_mg: 1500, potassium_mg: 3000 }
    }
  ];

  const mockProgressHistory = [
    {
      id: 'progress_001',
      date: new Date('2024-01-01'),
      weight: 78,
      bodyFatPercentage: 20,
      measurements: { waist: 32, chest: 42, arms: 14, shoulders: 48, thighs: 24, calves: 16, forearms: 12 },
      strengthLifts: { benchPress: 135, squat: 185, deadlift: 225, overheadPress: 95, rows: 155 },
      sleepHours: 7.5,
      stressLevel: 6,
      notes: 'Starting point'
    }
  ];

  const mockSleepLog = [
    {
      id: 'sleep_001',
      date: new Date('2024-01-15'),
      bedTime: '22:30',
      wakeUpTime: '06:00',
      sleepHours: 7.5,
      sleepQuality: 7,
      stressLevel: 6,
      caffeineIntake: 200,
      notes: 'Good sleep, felt rested'
    }
  ];

  // Test 1: Advanced Question Detection
  const testAdvancedQuestionDetection = async (): Promise<TestResult> => {
    setCurrentTest('Advanced Question Detection');
    
    const testCases = [
      'How can I optimize my body recomposition for maximum results?',
      'Predict my strength gains timeline for the next 3 months',
      'What are my biggest optimization opportunities right now?',
      'How many sets should I do for chest?'
    ];

    let passedTests = 0;
    let totalTests = testCases.length;

    for (const question of testCases) {
      try {
        const analysis = await intelligentAI.analyzeQuestion(question);
        
        const hasEnhancedFeatures = analysis.predictiveInsights || 
                                  analysis.adaptiveRecommendations || 
                                  analysis.riskAssessment || 
                                  analysis.optimizationOpportunities;
        
        if (hasEnhancedFeatures) {
          passedTests++;
        }
      } catch (error) {
        console.error('Test case failed:', error);
      }
    }

    const score = (passedTests / totalTests) * 100;
    const passed = score >= 80;

    return {
      testName: 'Advanced Question Detection',
      passed,
      score,
      details: `Tested ${totalTests} question types, ${passedTests} passed`,
      expectedBehavior: 'AI should detect question types and provide appropriate enhanced analysis',
      actualBehavior: `AI correctly handled ${passedTests}/${totalTests} question types`,
      improvement: passed ? undefined : 'Improve question type detection accuracy'
    };
  };

  // Test 2: Predictive Analytics
  const testPredictiveAnalytics = async (): Promise<TestResult> => {
    setCurrentTest('Predictive Analytics');
    
    try {
      const analysis = await intelligentAI.analyzeQuestion('Predict my strength gains in the next 8 weeks');
      
      const hasPredictiveInsights = analysis.predictiveInsights && analysis.predictiveInsights.length > 0;
      const hasTimeline = hasPredictiveInsights && analysis.predictiveInsights.some(insight => 
        insight.timeframe && insight.timeframe.includes('week')
      );
      const hasProbability = hasPredictiveInsights && analysis.predictiveInsights.some(insight => 
        insight.probability > 0 && insight.probability <= 100
      );
      const hasActionableSteps = hasPredictiveInsights && analysis.predictiveInsights.some(insight => 
        insight.actionableSteps && insight.actionableSteps.length > 0
      );

      const score = [hasPredictiveInsights, hasTimeline, hasProbability, hasActionableSteps]
        .filter(Boolean).length * 25;

      const passed = score >= 75;

      return {
        testName: 'Predictive Analytics',
        passed,
        score,
        details: `Predictive insights: ${hasPredictiveInsights}, Timeline: ${hasTimeline}, Probability: ${hasProbability}, Actionable steps: ${hasActionableSteps}`,
        expectedBehavior: 'AI should provide predictions with timelines, probabilities, and actionable steps',
        actualBehavior: `AI provided ${score/25}/4 predictive features`,
        improvement: passed ? undefined : 'Enhance prediction accuracy and detail'
      };
    } catch (error) {
      return {
        testName: 'Predictive Analytics',
        passed: false,
        score: 0,
        details: 'Test failed due to error',
        expectedBehavior: 'AI should provide predictions',
        actualBehavior: 'Test error occurred',
        improvement: 'Fix error handling in predictive analytics'
      };
    }
  };

  // Test 3: Risk Assessment
  const testRiskAssessment = async (): Promise<TestResult> => {
    setCurrentTest('Risk Assessment');
    
    try {
      const analysis = await intelligentAI.analyzeQuestion('Assess my current training risks');
      
      const hasRiskAssessment = analysis.riskAssessment;
      const hasRiskFactors = hasRiskAssessment && analysis.riskAssessment.riskFactors.length > 0;
      const hasMitigationStrategies = hasRiskAssessment && analysis.riskAssessment.mitigationStrategies.length > 0;
      const hasMonitoringRecommendations = hasRiskAssessment && analysis.riskAssessment.monitoringRecommendations.length > 0;
      const hasUrgency = hasRiskAssessment && analysis.riskAssessment.urgency;

      const score = [hasRiskAssessment, hasRiskFactors, hasMitigationStrategies, hasMonitoringRecommendations, hasUrgency]
        .filter(Boolean).length * 20;

      const passed = score >= 80;

      return {
        testName: 'Risk Assessment',
        passed,
        score,
        details: `Risk assessment: ${hasRiskAssessment}, Risk factors: ${hasRiskFactors}, Mitigation: ${hasMitigationStrategies}, Monitoring: ${hasMonitoringRecommendations}, Urgency: ${hasUrgency}`,
        expectedBehavior: 'AI should assess risks and provide mitigation strategies',
        actualBehavior: `AI provided ${score/20}/5 risk assessment features`,
        improvement: passed ? undefined : 'Improve risk detection accuracy and mitigation strategies'
      };
    } catch (error) {
      return {
        testName: 'Risk Assessment',
        passed: false,
        score: 0,
        details: 'Test failed due to error',
        expectedBehavior: 'AI should assess risks',
        actualBehavior: 'Test error occurred',
        improvement: 'Fix error handling in risk assessment'
      };
    }
  };

  // Test 4: Optimization Opportunities
  const testOptimizationOpportunities = async (): Promise<TestResult> => {
    setCurrentTest('Optimization Opportunities');
    
    try {
      const analysis = await intelligentAI.analyzeQuestion('What are my optimization opportunities?');
      
      const hasOptimizationOpportunities = analysis.optimizationOpportunities && analysis.optimizationOpportunities.length > 0;
      const hasCurrentState = hasOptimizationOpportunities && analysis.optimizationOpportunities.some(opp => 
        opp.currentState && opp.currentState.length > 0
      );
      const hasOptimalState = hasOptimizationOpportunities && analysis.optimizationOpportunities.some(opp => 
        opp.optimalState && opp.optimalState.length > 0
      );
      const hasPotentialGain = hasOptimizationOpportunities && analysis.optimizationOpportunities.some(opp => 
        opp.potentialGain && opp.potentialGain.length > 0
      );
      const hasImplementation = hasOptimizationOpportunities && analysis.optimizationOpportunities.some(opp => 
        opp.implementation && opp.implementation.length > 0
      );

      const score = [hasOptimizationOpportunities, hasCurrentState, hasOptimalState, hasPotentialGain, hasImplementation]
        .filter(Boolean).length * 20;

      const passed = score >= 80;

      return {
        testName: 'Optimization Opportunities',
        passed,
        score,
        details: `Opportunities: ${hasOptimizationOpportunities}, Current state: ${hasCurrentState}, Optimal state: ${hasOptimalState}, Potential gain: ${hasPotentialGain}, Implementation: ${hasImplementation}`,
        expectedBehavior: 'AI should identify optimization opportunities with implementation plans',
        actualBehavior: `AI provided ${score/20}/5 optimization features`,
        improvement: passed ? undefined : 'Enhance optimization analysis depth and accuracy'
      };
    } catch (error) {
      return {
        testName: 'Optimization Opportunities',
        passed: false,
        score: 0,
        details: 'Test failed due to error',
        expectedBehavior: 'AI should identify optimization opportunities',
        actualBehavior: 'Test error occurred',
        improvement: 'Fix error handling in optimization analysis'
      };
    }
  };

  // Test 5: Response Quality
  const testResponseQuality = async (): Promise<TestResult> => {
    setCurrentTest('Response Quality and Relevance');
    
    try {
      const analysis = await intelligentAI.analyzeQuestion('How can I break through my bench press plateau?');
      
      const hasRecommendation = analysis.recommendation && analysis.recommendation.length > 20;
      const hasImplementation = analysis.implementation && analysis.implementation.length >= 3;
      const hasNextSteps = analysis.nextSteps && analysis.nextSteps.length >= 2;
      const hasFollowUpQuestions = analysis.followUpQuestions && analysis.followUpQuestions.length >= 2;
      const hasUserContext = analysis.userContext && Object.keys(analysis.userContext).length > 0;

      const score = [hasRecommendation, hasImplementation, hasNextSteps, hasFollowUpQuestions, hasUserContext]
        .filter(Boolean).length * 20;

      const passed = score >= 80;

      return {
        testName: 'Response Quality and Relevance',
        passed,
        score,
        details: `Recommendation: ${hasRecommendation}, Implementation: ${hasImplementation}, Next steps: ${hasNextSteps}, Follow-up: ${hasFollowUpQuestions}, User context: ${hasUserContext}`,
        expectedBehavior: 'AI should provide high-quality, relevant responses with actionable steps',
        actualBehavior: `AI provided ${score/20}/5 quality features`,
        improvement: passed ? undefined : 'Improve response relevance and actionability'
      };
    } catch (error) {
      return {
        testName: 'Response Quality and Relevance',
        passed: false,
        score: 0,
        details: 'Test failed due to error',
        expectedBehavior: 'AI should provide quality responses',
        actualBehavior: 'Test error occurred',
        improvement: 'Fix error handling in response generation'
      };
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults(null);

    // Set up mock data
    intelligentAI.setUserContext(
      mockUserProfile as any,
      mockWorkoutHistory,
      mockNutritionLog,
      mockSleepLog,
      mockProgressHistory
    );

    const tests = [
      testAdvancedQuestionDetection,
      testPredictiveAnalytics,
      testRiskAssessment,
      testOptimizationOpportunities,
      testResponseQuality
    ];

    const results: TestResult[] = [];
    
    for (let i = 0; i < tests.length; i++) {
      try {
        const result = await tests[i]();
        results.push(result);
        setProgress(((i + 1) / tests.length) * 100);
      } catch (error) {
        console.error(`Test failed: ${error}`);
        results.push({
          testName: 'Unknown Test',
          passed: false,
          score: 0,
          details: 'Test execution failed',
          expectedBehavior: 'Test should run successfully',
          actualBehavior: 'Test execution error',
          improvement: 'Fix test execution issues'
        });
      }
    }

    // Calculate overall results
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalScore / results.length;
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    const testSuite: TestSuite = {
      name: 'AI Intelligence Test Suite',
      tests: results,
      overallScore: averageScore,
      passedTests,
      totalTests
    };

    setTestResults(testSuite);
    setIsRunning(false);
    setProgress(100);
    setCurrentTest('');
  };

  // Get grade based on score
  const getGrade = (score: number): string => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    if (score >= 35) return 'D-';
    return 'F';
  };

  // Get assessment based on score
  const getAssessment = (score: number): string => {
    if (score >= 90) return '🌟 EXCEPTIONAL: Your AI is performing at an elite level!';
    if (score >= 80) return '🚀 EXCELLENT: Your AI demonstrates superior intelligence.';
    if (score >= 70) return '👍 GOOD: Your AI shows solid intelligence.';
    if (score >= 60) return '⚠️ FAIR: Your AI has basic intelligence.';
    return '❌ POOR: Your AI requires major upgrades.';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧠 AI Intelligence Test Interface
        </h1>
        <p className="text-gray-600">
          Test your enhanced AI system's capabilities including predictive analytics, risk assessment, 
          optimization opportunities, and response quality.
        </p>
      </div>

      {/* Test Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Test Controls</h2>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md font-medium hover:from-blue-700 to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isRunning ? '🧪 Running Tests...' : '🚀 Run AI Intelligence Tests'}
          </button>
        </div>

        {isRunning && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {currentTest && (
              <p className="text-sm text-gray-600">
                Currently testing: <span className="font-medium">{currentTest}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Test Results Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{testResults.overallScore.toFixed(1)}</div>
                <div className="text-sm text-blue-700">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{testResults.passedTests}</div>
                <div className="text-sm text-green-700">Tests Passed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{testResults.totalTests}</div>
                <div className="text-sm text-purple-700">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">{getGrade(testResults.overallScore)}</div>
                <div className="text-sm text-indigo-700">Grade</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-medium text-gray-700 mb-2">
                Success Rate: {((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {getAssessment(testResults.overallScore)}
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">📋 Detailed Test Results</h3>
            
            <div className="space-y-4">
              {testResults.tests.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{test.testName}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                      <span className="text-lg font-bold text-gray-700">{test.score}/100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Expected Behavior:</h5>
                      <p className="text-gray-600">{test.expectedBehavior}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Actual Behavior:</h5>
                      <p className="text-gray-600">{test.actualBehavior}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 mb-1">Details:</h5>
                    <p className="text-gray-600">{test.details}</p>
                  </div>
                  
                  {test.improvement && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <h5 className="font-medium text-yellow-800 mb-1">💡 Improvement Needed:</h5>
                      <p className="text-yellow-700">{test.improvement}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Results */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">💾 Export Results</h3>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(testResults, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ai-test-results-${new Date().toISOString().slice(0, 19)}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              📥 Download Test Results (JSON)
            </button>
          </div>
        </div>
      )}

      {/* Test Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">ℹ️ Test Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">What These Tests Measure:</h3>
            <ul className="space-y-1">
              <li>• Advanced question detection and analysis</li>
              <li>• Predictive analytics capabilities</li>
              <li>• Risk assessment and mitigation</li>
              <li>• Optimization opportunity identification</li>
              <li>• Response quality and relevance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Grading Scale:</h3>
            <ul className="space-y-1">
              <li>• A+ (90-100): Exceptional performance</li>
              <li>• A (85-89): Excellent performance</li>
              <li>• B (70-84): Good performance</li>
              <li>• C (60-69): Fair performance</li>
              <li>• D/F (0-59): Needs improvement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITestInterface;
