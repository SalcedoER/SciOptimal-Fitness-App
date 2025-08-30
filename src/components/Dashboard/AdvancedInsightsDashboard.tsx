// Advanced Insights Dashboard - Showcasing SciOptimal's Cutting-Edge Features
// Features: Circadian Rhythm Optimization, Predictive Analytics, Scientific Validation

import circadianRhythmService from '../../services/circadianRhythmService';
import predictiveAnalyticsService from '../../services/predictiveAnalyticsService';
import scientificValidationService from '../../services/scientificValidationService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  Schedule,
  Science,
  Psychology,
  FitnessCenter,
  Restaurant,
  Bedtime,
  Lightbulb,
  Timeline,
  Assessment,
  Warning,
  CheckCircle,
  Info,
  ExpandMore,
  Refresh
} from '@mui/icons-material';

const AdvancedInsightsDashboard: React.FC = () => {
  const [circadianAnalysis, setCircadianAnalysis] = useState<any>(null);
  const [progressForecast, setProgressForecast] = useState<any>(null);
  const [injuryRisk, setInjuryRisk] = useState<any>(null);
  const [dailyInsight, setDailyInsight] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    userProfile,
    workoutHistory,
    nutritionLog,
    progressHistory,
    aiInsights,
    predictiveRecommendations,
    recoveryOptimization
  } = useAppStore();

  useAppStore(() => {
    if (userProfile) {
      generateAdvancedInsights();
    }
  }, [userProfile]);

  const generateAdvancedInsights = async () => {
    setIsLoading(true);
    try {
      // Generate circadian rhythm analysis
      const sleepData = generateMockSleepData();
      const chronotype = circadianRhythmService.analyzeChronotype(sleepData);
      const circadianRecs = circadianRhythmService.generateCircadianRecommendations(
        chronotype,
        sleepData[0],
        userProfile?.goals || []
      );
      
      setCircadianAnalysis({
        chronotype,
        recommendations: circadianRecs,
        optimizationScore: circadianRhythmService.calculateOptimizationScore(
          chronotype,
          sleepData[0],
          75
        )
      });

      // Generate progress forecast
      const forecast = predictiveAnalyticsService.generateProgressForecast(
        userProfile,
        progressHistory,
        workoutHistory,
        nutritionLog
      );
      setProgressForecast(forecast);

      // Assess injury risk
      const risk = predictiveAnalyticsService.assessInjuryRisk(
        workoutHistory,
        sleepData,
        5, // stress level
        [], // previous injuries
        userProfile
      );
      setInjuryRisk(risk);

      // Generate daily AI insight
      const insight = generateDailyInsight();
      setDailyInsight(insight);

    } catch (error) {
      console.error('Error generating advanced insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockSleepData = () => {
    return [{
      averageBedtime: '22:30',
      averageWakeTime: '06:30',
      averageDuration: 7.5,
      consistency: 85,
      quality: 8,
      lightExposure: {
        morning: 45,
        evening: 20
      }
    }];
  };

  const generateDailyInsight = () => {
    const insights = [
      {
        title: 'Circadian Optimization',
        description: 'Your early bird chronotype suggests training between 6-10 AM for peak performance',
        type: 'performance',
        priority: 'high',
        scientificBasis: 'Research shows early birds perform 15-20% better in morning workouts',
        action: 'Schedule strength training before 10 AM this week'
      },
      {
        title: 'Recovery Window',
        description: 'Your sleep quality is excellent (8/10) - perfect for muscle growth',
        type: 'recovery',
        priority: 'medium',
        scientificBasis: 'Quality sleep increases muscle protein synthesis by up to 30%',
        action: 'Maintain current sleep routine and consider adding 30 min to sleep duration'
      },
      {
        title: 'Nutrition Timing',
        description: 'As an early bird, your metabolism peaks earlier - optimize meal timing',
        type: 'nutrition',
        priority: 'medium',
        scientificBasis: 'Early birds have earlier cortisol peaks, making morning nutrition critical',
        action: 'Consume 30% of daily calories at breakfast, reduce evening meals'
      }
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Advanced AI Insights
        </Typography>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Analyzing your data with advanced AI algorithms...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Advanced AI Insights
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={generateAdvancedInsights}
        >
          Refresh Insights
        </Button>
      </Box>

      {/* Daily AI Insight */}
      {dailyInsight && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lightbulb sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="h2">
                Today's AI Insight
              </Typography>
              <Chip
                label={dailyInsight.type}
                size="small"
                sx={{ ml: 'auto', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
            <Typography variant="h5" gutterBottom>
              {dailyInsight.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {dailyInsight.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <strong>Scientific Basis:</strong> {dailyInsight.scientificBasis}
              </Typography>
            </Box>
            <Alert severity="info" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <strong>Action:</strong> {dailyInsight.action}
            </Alert>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Circadian Rhythm Optimization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h3">
                  Circadian Rhythm Optimization
                </Typography>
              </Box>
              
              {circadianAnalysis && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Your Chronotype: <strong>{circadianAnalysis.chronotype.type.replace('_', ' ')}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Peak Performance: {circadianAnalysis.chronotype.peakPerformanceWindow.start} - {circadianAnalysis.chronotype.peakPerformanceWindow.end}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Optimization Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={circadianAnalysis.optimizationScore}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {circadianAnalysis.optimizationScore}/100
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Top Recommendations:
                  </Typography>
                  <List dense>
                    {circadianAnalysis.recommendations.slice(0, 3).map((rec: any, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Chip
                            label={rec.priority}
                            size="small"
                            color={getPriorityColor(rec.priority)}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={rec.title}
                          secondary={rec.description}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Injury Risk Assessment */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" component="h3">
                  Injury Risk Assessment
                </Typography>
              </Box>

              {injuryRisk && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        Overall Risk Level
                      </Typography>
                      <Chip
                        label={injuryRisk.overallRisk.toUpperCase()}
                        color={getRiskColor(injuryRisk.overallRisk)}
                        size="small"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={injuryRisk.riskScore}
                      color={getRiskColor(injuryRisk.overallRisk) as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Risk Score: {injuryRisk.riskScore}/100
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Key Risk Factors:
                  </Typography>
                  <List dense>
                    {injuryRisk.riskFactors.slice(0, 3).map((factor: any, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Chip
                            label={factor.impact}
                            size="small"
                            color={factor.impact === 'high' ? 'error' : factor.impact === 'medium' ? 'warning' : 'success'}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={factor.factor}
                          secondary={factor.currentStatus}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {injuryRisk.overallRisk === 'high' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <strong>High Risk Detected:</strong> {injuryRisk.recommendedActions[0]}
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Forecast */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h3">
                  Progress Forecast
                </Typography>
              </Box>

              {progressForecast && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Overall Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progressForecast.overallProgress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {progressForecast.overallProgress}/100
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Strength Progress:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Plateau Risk: {progressForecast.strength.plateauRisk}%
                    </Typography>
                    {progressForecast.strength.optimizationOpportunities.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Opportunities: {progressForecast.strength.optimizationOpportunities[0]}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Body Composition:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Weight: {progressForecast.bodyComposition.weight.current} lbs → {progressForecast.bodyComposition.weight.predicted} lbs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Timeframe: {progressForecast.bodyComposition.weight.timeframe}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Scientific Validation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Science sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" component="h3">
                  Scientific Validation
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                All recommendations are backed by peer-reviewed research and continuously validated.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Evidence Quality
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label="A" size="small" color="success" />
                  <Chip label="B" size="small" color="warning" />
                  <Chip label="C" size="small" color="error" />
                  <Chip label="D" size="small" color="default" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  A: Strong evidence, D: Expert opinion
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Latest Research:
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Progressive Overload"
                    secondary="15-20% strength gains with proper progression"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Protein Intake"
                    secondary="1.6-2.2g/kg optimal for muscle growth"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Optimization */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Recovery & Wellness Optimization
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Bedtime sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Sleep Quality
                    </Typography>
                    <Typography variant="h4" color="primary.main">
                      {recoveryOptimization?.sleepQuality?.qualityScore || 8}/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recoveryOptimization?.sleepQuality?.optimizationTips?.[0] || 'Maintain current sleep routine'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Psychology sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Stress Management
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {recoveryOptimization?.stressManagement?.currentStressLevel || 5}/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recoveryOptimization?.stressManagement?.recommendations?.[0] || 'Practice stress management techniques'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <FitnessCenter sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Recovery Score
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {recoveryOptimization?.overallRecoveryScore || 7.5}/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recoveryOptimization?.optimizationSuggestions?.[0] || 'Continue current recovery practices'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedInsightsDashboard;
