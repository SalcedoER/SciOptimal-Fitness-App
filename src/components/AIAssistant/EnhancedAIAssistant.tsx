// Enhanced AI Assistant - Showcasing Advanced AI Capabilities
// Features: Predictive Analytics, Adaptive Learning, Risk Assessment, Optimization

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { intelligentAI, AIAnalysis, PredictiveInsight, AdaptiveRecommendation, RiskAssessment, OptimizationOpportunity } from '../../services/intelligentAIService';
import {
  AIInsight,
  PredictiveRecommendation,
  AdaptiveWorkoutPlan,
  SmartNutritionSuggestion,
  RecoveryOptimization,
  AILearningProgress
} from '../../store/useAppStore';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  TrendingUp,
  QuestionAnswer
} from '@mui/icons-material';

const EnhancedAIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ question: string; analysis: AIAnalysis; timestamp: Date }>>([]);
  const [planModificationPreview, setPlanModificationPreview] = useState<any>(null);
  const [showPlanPreview, setShowPlanPreview] = useState(false);
  
  const {
    userProfile,
    workoutHistory,
    nutritionLog,
    progressHistory,
    aiInsights,
    predictiveRecommendations,
    adaptiveWorkoutPlans,
    smartNutritionSuggestions,
    recoveryOptimization,
    aiConfidence,
    userEngagementScore,
    aiLearningProgress,
    analyzeUserProgress,
    generatePersonalizedRecommendations,
    adaptWorkoutPlan,
    optimizeNutrition,
    analyzeRecovery,
    predictFutureProgress,
    learnFromUserBehavior,
    recordUserFeedback,
    getAIPlanModificationPreview,
    modifyPlanFromAI
  } = useAppStore();

  useEffect(() => {
    // Initialize AI analysis when component mounts
    if (userProfile) {
      analyzeUserProgress();
    }
  }, [userProfile, analyzeUserProgress]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnalyzing(true);
    try {
      // Check if this is a workout plan modification request
      if (isWorkoutModificationRequest(question)) {
        // Get preview of plan modifications
        const preview = await getAIPlanModificationPreview(question);
        setPlanModificationPreview(preview);
        setShowPlanPreview(true);
        
        // Also get AI analysis for context
        const analysis = await intelligentAI.analyzeQuestion(question);
        setCurrentAnalysis(analysis);
        setChatHistory(prev => [...prev, { question, analysis, timestamp: new Date() }]);
      } else {
        // Regular AI analysis
        const analysis = await intelligentAI.analyzeQuestion(question);
        setCurrentAnalysis(analysis);
        setChatHistory(prev => [...prev, { question, analysis, timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Error analyzing question:', error);
      setCurrentAnalysis({
        type: 'general',
        question,
        userContext: {},
        recommendation: 'Sorry, I encountered an error while processing your request. Please try again.',
        scientificBasis: '',
        studies: [],
        implementation: [],
        warnings: [],
        confidence: 0,
        nextSteps: [],
        followUpQuestions: [],
        predictiveInsights: [],
        adaptiveRecommendations: [],
        riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
        optimizationOpportunities: [],
        aiConfidence: 0,
        learningProgress: { userPatterns: [], adaptationSuccess: 0, recommendationAccuracy: 0, userSatisfaction: 0, learningAreas: [], improvementMetrics: [] }
      });
    } finally {
      setIsAnalyzing(false);
      setQuestion('');
    }
  };

  // NEW: Check if question is about workout plan modification
  const isWorkoutModificationRequest = (question: string): boolean => {
    const modificationKeywords = [
      'change', 'modify', 'update', 'switch', 'replace', 'adjust',
      'workout', 'training', 'exercise', 'routine', 'plan',
      'strength', 'hypertrophy', 'endurance', 'bodyweight',
      'frequency', 'days', 'chest', 'back', 'legs', 'arms',
      'recovery', 'rest', 'intensity', 'volume'
    ];
    
    return modificationKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );
  };

  // NEW: Apply workout plan modifications
  const applyPlanModifications = async () => {
    if (!planModificationPreview) return;
    
    try {
      setIsAnalyzing(true);
      const modifiedPlan = await modifyPlanFromAI(planModificationPreview.aiRequest);
      
      // Update the preview with the applied plan
      setPlanModificationPreview({
        ...planModificationPreview,
        modifiedPlan,
        applied: true
      });
      
      // Show success message
      setCurrentAnalysis({
        type: 'workout',
        question: planModificationPreview.aiRequest,
        userContext: {},
        recommendation: `✅ Your workout plan has been successfully modified! The changes have been applied to your training program.`,
        scientificBasis: 'AI-powered plan adaptation based on your request and current progress',
        studies: ['Adaptive training protocols', 'Personalized exercise prescription'],
        implementation: ['Review your updated plan in the Training Plan section', 'The new plan is now active'],
        warnings: [],
        confidence: 95,
        nextSteps: ['Start your next workout with the new plan', 'Monitor how the changes affect your progress'],
        followUpQuestions: ['How does the new plan feel?', 'Would you like to make any further adjustments?'],
        predictiveInsights: [],
        adaptiveRecommendations: [],
        riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
        optimizationOpportunities: [],
        aiConfidence: 95,
        learningProgress: { patternRecognition: 0, predictionAccuracy: 0, adaptationSuccess: 0, userSatisfaction: 0, learningAreas: [], improvementMetrics: [] }
      });
      
      setShowPlanPreview(false);
    } catch (error) {
      console.error('Error applying plan modifications:', error);
      setCurrentAnalysis({
        type: 'workout',
        question: planModificationPreview.aiRequest,
        userContext: {},
        recommendation: '❌ Sorry, I encountered an error while applying the plan modifications. Please try again.',
        scientificBasis: '',
        studies: [],
        implementation: [],
        warnings: [],
        confidence: 0,
        nextSteps: [],
        followUpQuestions: [],
        predictiveInsights: [],
        adaptiveRecommendations: [],
        riskAssessment: { overallRisk: 'low', riskFactors: [], mitigationStrategies: [], monitoringRecommendations: [], urgency: 'ongoing' },
        optimizationOpportunities: [],
        aiConfidence: 0,
        learningProgress: { patternRecognition: 0, predictionAccuracy: 0, adaptationSuccess: 0, userSatisfaction: 0, learningAreas: [], improvementMetrics: [] }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // NEW: Render plan modification preview
  const renderPlanModificationPreview = () => {
    if (!planModificationPreview || !showPlanPreview) return null;

    return (
      <Card sx={{ mb: 3, border: '2px solid #2196f3' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🎯 Workout Plan Modification Preview
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Based on your request: "{planModificationPreview.aiRequest}"
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              📊 Changes to be made:
            </Typography>
            <List dense>
              {planModificationPreview.changes.map((change: string, index: number) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={change} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={applyPlanModifications}
              disabled={isAnalyzing}
              startIcon={<CheckCircle />}
            >
              {isAnalyzing ? 'Applying...' : 'Apply Changes'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowPlanPreview(false)}
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            💡 The AI will automatically adapt your plan based on your request and current progress data.
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const handleFeedback = (insightId: string, feedback: 'implemented' | 'ignored' | 'modified', effectiveness?: number) => {
    recordUserFeedback(insightId, feedback, effectiveness);
  };

  const renderPredictiveInsights = (insights: PredictiveInsight[]) => {
    if (!insights.length) return null;

    return (
      <div className="predictive-insights">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          🔮 Predictive Insights
        </h3>
        <div className="grid gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  {insight.category}
                </span>
                <span className="text-sm text-gray-600">
                  {insight.probability}% probability
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{insight.prediction}</h4>
              <p className="text-sm text-gray-600 mb-3">{insight.scientificBasis}</p>
              <div className="mb-3">
                <span className="text-xs text-gray-500">Timeline: {insight.timeframe}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-xs text-gray-500">Confidence: {insight.confidence}%</span>
              </div>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Key Factors:</h5>
                <div className="flex flex-wrap gap-1">
                  {insight.factors.map((factor, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Actionable Steps:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {insight.actionableSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdaptiveRecommendations = (recommendations: AdaptiveRecommendation[]) => {
    if (!recommendations.length) return null;

    return (
      <div className="adaptive-recommendations">
        <h3 className="text-xl font-bold text-green-600 mb-4">
          🎯 Adaptive Recommendations
        </h3>
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`bg-gradient-to-r p-4 rounded-lg border ${
              rec.priority === 'critical' ? 'from-red-50 to-pink-50 border-red-200' :
              rec.priority === 'high' ? 'from-orange-50 to-yellow-50 border-orange-200' :
              rec.priority === 'medium' ? 'from-yellow-50 to-green-50 border-yellow-200' :
              'from-green-50 to-blue-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  rec.priority === 'critical' ? 'text-red-700 bg-red-100' :
                  rec.priority === 'high' ? 'text-orange-700 bg-orange-100' :
                  rec.priority === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                  'text-green-700 bg-green-100'
                }`}>
                  {rec.priority} priority
                </span>
                <span className="text-sm text-gray-600">
                  {rec.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{rec.recommendation}</h4>
              <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Expected Outcome:</h5>
                <p className="text-sm text-gray-600">{rec.expectedOutcome}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Implementation:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {rec.implementation.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Adaptation Rate: {rec.adaptationRate}x</span>
                <span>Success Metrics: {rec.successMetrics.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRiskAssessment = (assessment: RiskAssessment) => {
    if (assessment.overallRisk === 'low' && assessment.riskFactors.length === 0) return null;

    return (
      <div className="risk-assessment">
        <h3 className={`text-xl font-bold mb-4 ${
          assessment.overallRisk === 'high' ? 'text-red-600' :
          assessment.overallRisk === 'medium' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {assessment.overallRisk === 'high' ? '🚨 High Risk Alert' :
           assessment.overallRisk === 'medium' ? '⚠️ Medium Risk Warning' :
           '✅ Low Risk Status'}
        </h3>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
          {assessment.riskFactors.map((risk, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{risk.factor}</h4>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  risk.riskLevel === 'high' ? 'text-red-700 bg-red-100' :
                  risk.riskLevel === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                  'text-green-700 bg-green-100'
                }`}>
                  {risk.riskLevel} risk
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Impact:</strong> {risk.impact}</p>
              <p className="text-sm text-gray-600 mb-3"><strong>Probability:</strong> {Math.round(risk.probability * 100)}%</p>
            </div>
          ))}
          
          {assessment.mitigationStrategies.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Mitigation Strategies:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {assessment.mitigationStrategies.map((strategy, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {assessment.monitoringRecommendations.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Monitoring Recommendations:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {assessment.monitoringRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
            <p className="text-sm text-red-700">
              <strong>Urgency:</strong> {assessment.urgency === 'immediate' ? 'Take action immediately' :
                                        assessment.urgency === 'soon' ? 'Address within the next few days' :
                                        'Monitor ongoing'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderOptimizationOpportunities = (opportunities: OptimizationOpportunity[]) => {
    if (!opportunities.length) return null;

    return (
      <div className="optimization-opportunities">
        <h3 className="text-xl font-bold text-purple-600 mb-4">
          🚀 Optimization Opportunities
        </h3>
        <div className="grid gap-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  {opp.area}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  opp.effortRequired === 'high' ? 'text-red-700 bg-red-100' :
                  opp.effortRequired === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                  'text-green-700 bg-green-100'
                }`}>
                  {opp.effortRequired} effort
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Current State</h4>
              <p className="text-sm text-gray-600 mb-3">{opp.currentState}</p>
              <h4 className="font-semibold text-gray-800 mb-2">Optimal State</h4>
              <p className="text-sm text-gray-600 mb-3">{opp.optimalState}</p>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Potential Gain:</h5>
                <p className="text-sm text-purple-600 font-medium">{opp.potentialGain}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Implementation:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {opp.implementation.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-gray-500">
                <span>Timeframe: {opp.timeframe}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAILearningProgress = () => (
    <div className="ai-learning-progress">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">
        🧠 AI Learning Progress
      </h3>
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Pattern Recognition</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiLearningProgress.patternRecognition}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{aiLearningProgress.patternRecognition}%</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prediction Accuracy</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiLearningProgress.predictionAccuracy}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{aiLearningProgress.predictionAccuracy}%</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Adaptation Success</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiLearningProgress.adaptationSuccess}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{aiLearningProgress.adaptationSuccess}%</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">User Satisfaction</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiLearningProgress.userSatisfaction}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{aiLearningProgress.userSatisfaction}%</span>
          </div>
        </div>
        
        {aiLearningProgress.learningAreas.length > 0 && (
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Areas:</h5>
            <div className="flex flex-wrap gap-1">
              {aiLearningProgress.learningAreas.map((area, idx) => (
                <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          <span>Overall AI Confidence: {aiConfidence}%</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>User Engagement: {userEngagementScore}%</span>
        </div>
      </div>
    </div>
  );

  const renderChatHistory = () => (
    <div className="chat-history">
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        💬 Conversation History
      </h3>
      <div className="space-y-4">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Your Question</span>
                <span className="text-xs text-gray-400">
                  {chat.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800">{chat.question}</p>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">AI Response</span>
                <span className="text-xs text-gray-400">
                  Confidence: {chat.analysis.confidence}%
                </span>
              </div>
              <p className="text-gray-800 mb-2">{chat.analysis.recommendation}</p>
              
              {chat.analysis.implementation.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-xs font-medium text-gray-600 mb-1">Implementation:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {chat.analysis.implementation.slice(0, 3).map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start">
                        <span className="text-blue-500 mr-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {chat.analysis.predictiveInsights && chat.analysis.predictiveInsights.length > 0 && (
              <div className="mb-2">
                <h5 className="text-xs font-medium text-gray-600 mb-1">Predictions:</h5>
                <p className="text-xs text-gray-600">
                  {chat.analysis.predictiveInsights[0]?.prediction}
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback(`chat_${idx}`, 'implemented')}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              >
                ✅ Implemented
              </button>
              <button
                onClick={() => handleFeedback(`chat_${idx}`, 'ignored')}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              >
                ❌ Ignored
              </button>
              <button
                onClick={() => handleFeedback(`chat_${idx}`, 'modified')}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                🔄 Modified
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Enhanced AI Assistant
          </h2>
          <p className="text-gray-600">
            Please complete your profile setup to access the enhanced AI features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Enhanced AI Assistant
        </h1>
        <p className="text-gray-600">
          Experience the future of fitness coaching with advanced AI capabilities including predictive analytics, 
          adaptive learning, risk assessment, and optimization opportunities.
        </p>
      </div>

      {/* AI Question Input */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Ask your AI coach anything about fitness, nutrition, or recovery:
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., 'How can I optimize my body recomposition?' or 'Predict my strength gains timeline' or 'What are my optimization opportunities?'"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isAnalyzing}
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !question.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md font-medium hover:from-blue-700 to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isAnalyzing ? '🤖 AI is analyzing...' : '🚀 Get AI Analysis'}
          </button>
        </form>
      </div>

      {/* Plan Modification Preview */}
      {renderPlanModificationPreview()}

      {/* AI Analysis Results */}
      {currentAnalysis && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🤖 AI Analysis
            </Typography>
            
            <Typography variant="body1" paragraph>
              {currentAnalysis.recommendation}
            </Typography>

            {currentAnalysis.scientificBasis && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🔬 Scientific Basis:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentAnalysis.scientificBasis}
                </Typography>
              </Box>
            )}

            {currentAnalysis.implementation.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📋 Implementation Steps:
                </Typography>
                <List dense>
                  {currentAnalysis.implementation.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {currentAnalysis.warnings.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="warning.main">
                  ⚠️ Warnings:
                </Typography>
                <List dense>
                  {currentAnalysis.warnings.map((warning, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <Warning color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={warning} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {currentAnalysis.nextSteps.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🚀 Next Steps:
                </Typography>
                <List dense>
                  {currentAnalysis.nextSteps.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <TrendingUp color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {currentAnalysis.followUpQuestions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ❓ Follow-up Questions:
                </Typography>
                <List dense>
                  {currentAnalysis.followUpQuestions.map((question, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <QuestionAnswer color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={question} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`Confidence: ${currentAnalysis.confidence}%`}
                color={currentAnalysis.confidence > 80 ? 'success' : currentAnalysis.confidence > 60 ? 'warning' : 'error'}
                size="small"
              />
              <Chip 
                label={`AI Confidence: ${currentAnalysis.aiConfidence}%`}
                color={currentAnalysis.aiConfidence > 80 ? 'success' : currentAnalysis.aiConfidence > 60 ? 'warning' : 'error'}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Enhanced AI Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Predictive Insights */}
        {currentAnalysis?.predictiveInsights && renderPredictiveInsights(currentAnalysis.predictiveInsights)}
        
        {/* Adaptive Recommendations */}
        {currentAnalysis?.adaptiveRecommendations && renderAdaptiveRecommendations(currentAnalysis.adaptiveRecommendations)}
        
        {/* Risk Assessment */}
        {currentAnalysis?.riskAssessment && renderRiskAssessment(currentAnalysis.riskAssessment)}
        
        {/* Optimization Opportunities */}
        {currentAnalysis?.optimizationOpportunities && renderOptimizationOpportunities(currentAnalysis.optimizationOpportunities)}
      </div>

      {/* AI Learning Progress */}
      {renderAILearningProgress()}

      {/* Chat History */}
      {chatHistory.length > 0 && renderChatHistory()}

      {/* Additional AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              💡 AI Insights
            </h3>
            <div className="space-y-3">
              {aiInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-gray-800">{insight.insight}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleFeedback(insight.id, 'implemented')}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => handleFeedback(insight.id, 'ignored')}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictive Recommendations */}
        {predictiveRecommendations.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              🔮 Predictive Recommendations
            </h3>
            <div className="space-y-3">
              {predictiveRecommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 bg-purple-50 rounded border border-purple-200">
                  <p className="text-sm text-gray-800">{rec.prediction}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                    <span>{rec.timeframe}</span>
                    <span>{rec.probability}% probability</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAIAssistant;
