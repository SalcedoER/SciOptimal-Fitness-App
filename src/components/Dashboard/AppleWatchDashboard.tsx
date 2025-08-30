// Apple Watch Dashboard - Real-time Biometric Data and Health Insights
// Integrates with Apple Watch and HealthKit for comprehensive health monitoring

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
  Button,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Watch,
  Favorite,
  Bedtime,
  DirectionsRun,
  TrendingUp,
  Warning,
  CheckCircle,
  Info,
  Refresh,
  BatteryChargingFull,
  BatteryFull,
  Battery6Bar,
  Battery4Bar,
  Battery2Bar,
  Battery0Bar,
  SignalCellular4Bar,
  SignalCellular3Bar,
  SignalCellular2Bar,
  SignalCellular1Bar,
  SignalCellular0Bar
} from '@mui/icons-material';
import appleWatchService from '../../services/appleWatchService';
import biometricAnalyticsService from '../../services/biometricAnalyticsService';
import { AppleWatchData, AppleWatchConnection } from '../../services/appleWatchService';
import { BiometricInsight, HealthScore, RecoveryReadiness, StressAnalysis } from '../../services/biometricAnalyticsService';

const AppleWatchDashboard: React.FC = () => {
  const [watchData, setWatchData] = useAppStore<AppleWatchData | null>(null);
  const [connection, setConnection] = useAppStore<AppleWatchConnection | null>(null);
  const [biometricInsights, setBiometricInsights] = useAppStore<BiometricInsight[]>([]);
  const [healthScore, setHealthScore] = useAppStore<HealthScore | null>(null);
  const [recoveryReadiness, setRecoveryReadiness] = useAppStore<RecoveryReadiness | null>(null);
  const [stressAnalysis, setStressAnalysis] = useAppStore<StressAnalysis | null>(null);
  const [isLoading, setIsLoading] = useAppStore(true);
  const [lastUpdate, setLastUpdate] = useAppStore<Date>(new Date());

  useAppStore(() => {
    initializeAppleWatch();
    return () => {
      // Cleanup subscription
    };
  }, []);

  const initializeAppleWatch = async () => {
    try {
      // Subscribe to Apple Watch data updates
      const unsubscribe = appleWatchService.subscribe((data: AppleWatchData) => {
        setWatchData(data);
        analyzeBiometricData(data);
        setLastUpdate(new Date());
      });

      // Get initial data
      const initialData = appleWatchService.getCurrentData();
      const connectionStatus = appleWatchService.getConnectionStatus();
      
      setWatchData(initialData);
      setConnection(connectionStatus);
      
      if (initialData) {
        analyzeBiometricData(initialData);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Apple Watch:', error);
      setIsLoading(false);
    }
  };

  const analyzeBiometricData = (data: AppleWatchData) => {
    const analysis = biometricAnalyticsService.analyzeBiometricData(data);
    setBiometricInsights(analysis.insights);
    setHealthScore(analysis.healthScore);
    setRecoveryReadiness(analysis.recoveryReadiness);
    setStressAnalysis(analysis.stressAnalysis);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await appleWatchService.refreshData();
      const newData = appleWatchService.getCurrentData();
      if (newData) {
        setWatchData(newData);
        analyzeBiometricData(newData);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level >= 90) return <BatteryFull />;
    if (level >= 70) return <Battery6Bar />;
    if (level >= 50) return <Battery4Bar />;
    if (level >= 30) return <Battery2Bar />;
    return <Battery0Bar />;
  };

  const getSignalIcon = (strength: string) => {
    switch (strength) {
      case 'excellent': return <SignalCellular4Bar />;
      case 'good': return <SignalCellular3Bar />;
      case 'fair': return <SignalCellular2Bar />;
      case 'poor': return <SignalCellular1Bar />;
      default: return <SignalCellular0Bar />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Connecting to Apple Watch...
        </Typography>
      </Box>
    );
  }

  if (!connection?.isConnected && !watchData) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Apple Watch not connected. Please ensure your watch is paired and HealthKit permissions are granted.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Watch sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Apple Watch Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time biometric monitoring and health insights
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshData}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Connection Status */}
      {connection && (
        <Card sx={{ mb: 3, background: connection.isConnected ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' : 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {connection.isConnected ? 'Connected to Apple Watch' : 'Apple Watch Disconnected'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Last sync: {connection.lastSync.toLocaleTimeString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Battery Level">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getBatteryIcon(connection.batteryLevel)}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {connection.batteryLevel}%
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Connection Strength">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getSignalIcon(connection.connectionStrength)}
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Health Score Overview */}
      {healthScore && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Health Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={healthScore.overall}
                size={80}
                thickness={4}
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="h4" color="primary.main">
                  {healthScore.overall}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {healthScore.lastUpdated.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    {healthScore.cardiovascular}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cardiovascular
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {healthScore.recovery}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recovery
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main">
                    {healthScore.sleep}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sleep
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {healthScore.activity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="secondary.main">
                    {healthScore.stress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stress
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Heart Rate & HRV */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Favorite sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6" component="h3">
                  Heart Rate & HRV
                </Typography>
              </Box>
              
              {watchData && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="error.main" gutterBottom>
                      {watchData.heartRate.current} BPM
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Heart Rate
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Resting HR
                      </Typography>
                      <Typography variant="h6">
                        {watchData.heartRate.resting} BPM
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        HRV
                      </Typography>
                      <Typography variant="h6">
                        {watchData.heartRateVariability.current}ms
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Recovery Readiness
                    </Typography>
                    <Chip
                      label={watchData.heartRateVariability.readiness.toUpperCase()}
                      color={watchData.heartRateVariability.readiness === 'ready' ? 'success' : 
                             watchData.heartRateVariability.readiness === 'moderate' ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Trend: {watchData.heartRate.trend}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sleep Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Bedtime sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h3">
                  Sleep Analysis
                </Typography>
              </Box>
              
              {watchData && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {watchData.sleep.lastNight.duration}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Night's Sleep
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Sleep Quality Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={watchData.sleep.quality.sleepScore}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {watchData.sleep.quality.sleepScore}/100
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Deep Sleep
                      </Typography>
                      <Typography variant="h6">
                        {Math.round(watchData.sleep.lastNight.deepSleep / 60)}h
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        REM Sleep
                      </Typography>
                      <Typography variant="h6">
                        {Math.round(watchData.sleep.lastNight.remSleep / 60)}h
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Efficiency
                      </Typography>
                      <Typography variant="h6">
                        {watchData.sleep.lastNight.efficiency}%
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Rings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsRun sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" component="h3">
                  Activity Rings
                </Typography>
              </Box>
              
              {watchData && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      {watchData.activity.steps.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Steps Today
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress
                          variant="determinate"
                          value={watchData.activity.rings.move.percentage}
                          size={60}
                          color="success"
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Move
                        </Typography>
                        <Typography variant="h6">
                          {watchData.activity.rings.move.percentage}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress
                          variant="determinate"
                          value={watchData.activity.rings.exercise.percentage}
                          size={60}
                          color="primary"
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Exercise
                        </Typography>
                        <Typography variant="h6">
                          {watchData.activity.rings.exercise.percentage}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress
                          variant="determinate"
                          value={watchData.activity.rings.stand.percentage}
                          size={60}
                          color="warning"
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Stand
                        </Typography>
                        <Typography variant="h6">
                          {watchData.activity.rings.stand.percentage}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Exercise: {watchData.activity.exerciseMinutes} min | 
                      Calories: {watchData.activity.calories} cal
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Readiness */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6" component="h3">
                  Recovery Readiness
                </Typography>
              </Box>
              
              {recoveryReadiness && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="info.main" gutterBottom>
                      {recoveryReadiness.score}/100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recovery Score
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={recoveryReadiness.status.toUpperCase()}
                      color={recoveryReadiness.status === 'ready' ? 'success' : 
                             recoveryReadiness.status === 'moderate' ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Key Factors:
                  </Typography>
                  <List dense>
                    {recoveryReadiness.factors.slice(0, 3).map((factor, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Chip
                            label={factor.impact}
                            size="small"
                            color={factor.impact === 'positive' ? 'success' : 
                                   factor.impact === 'negative' ? 'error' : 'default'}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={factor.factor}
                          secondary={`${factor.score}/100`}
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

        {/* Biometric Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Insights & Recommendations
              </Typography>
              
              {biometricInsights.length > 0 ? (
                <List>
                  {biometricInsights.slice(0, 5).map((insight) => (
                    <ListItem key={insight.id} sx={{ px: 0, mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Badge badgeContent={insight.priority} color={getPriorityColor(insight.priority) as any}>
                          <Chip
                            label={insight.severity}
                            size="small"
                            color={getSeverityColor(insight.severity) as any}
                          />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {insight.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Confidence: {insight.confidence}% | Expected: {insight.expectedOutcome}
                            </Typography>
                            {insight.recommendations.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                                  Recommendations:
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {insight.recommendations[0]}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No insights available. Continue monitoring your biometric data.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Last Update */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {lastUpdate.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default AppleWatchDashboard;

