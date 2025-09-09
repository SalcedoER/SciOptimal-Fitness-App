import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Speed,
  Insights,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Psychology,
  Science,
  Refresh,
  Analytics,
  Timeline,
  MonitorHeart,
  FitnessCenter,
  Restaurant,
  Bedtime
} from '@mui/icons-material';
import { useAppStore } from '../store';
import { format } from 'date-fns';

// AI Optimization Panel - Advanced Plan Optimization
export default function AIOptimizationPanel() {
  const { 
    optimizationInsights,
    adaptivePlan,
    aiAnalysis,
    isOptimizing,
    runAIOptimization,
    healthData,
    isHealthDataConnected,
    workoutHistory
  } = useAppStore();

  const [activeStep, setActiveStep] = useState(0);
  const [expandedInsight, setExpandedInsight] = useState<string | false>(false);

  useEffect(() => {
    if (!isOptimizing && optimizationInsights.length === 0) {
      runAIOptimization();
    }
  }, []);

  const handleOptimize = async () => {
    await runAIOptimization();
  };

  const handleInsightExpand = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? false : insightId);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'workout': return <FitnessCenter />;
      case 'nutrition': return <Restaurant />;
      case 'recovery': return <Bedtime />;
      case 'progression': return <TrendingUp />;
      case 'timing': return <Schedule />;
      default: return <Insights />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const optimizationSteps = [
    {
      label: 'Data Collection',
      description: 'Gathering health data from Apple Watch and manual entries',
      icon: <MonitorHeart />
    },
    {
      label: 'AI Analysis',
      description: 'Analyzing patterns and identifying optimization opportunities',
      icon: <Psychology />
    },
    {
      label: 'Plan Generation',
      description: 'Creating personalized recommendations and adjustments',
      icon: <Science />
    },
    {
      label: 'Implementation',
      description: 'Applying changes to your fitness plan',
      icon: <Speed />
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff !important' }}>
          🚀 AI Optimization Center
        </Typography>
        <Button 
          variant="contained" 
          startIcon={isOptimizing ? <CircularProgress size={20} /> : <Refresh />}
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="gradient-button"
          sx={{ 
            background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
            minHeight: { xs: 44, sm: 36 }
          }}
        >
          {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Optimization Status */}
        <Grid item xs={12}>
          <Card className="fitness-card glass-effect" sx={{ 
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
            border: '1px solid rgba(156, 39, 176, 0.2)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
                Optimization Status
              </Typography>
              
              <Stepper activeStep={isOptimizing ? 1 : 0} orientation="horizontal" sx={{ mt: 2 }}>
                {optimizationSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: isOptimizing && index <= 1 ? 'primary.main' : 'grey.300',
                          color: 'white'
                        }}>
                          {step.icon}
                        </Box>
                      )}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>


        {/* Health Data Status */}
        <Grid item xs={12} md={4}>
          <Card className="slide-in">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonitorHeart sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Health Data</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={isHealthDataConnected ? 'Connected' : 'Disconnected'} 
                  color={isHealthDataConnected ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                />
              </Box>

              {healthData && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Data Points Available:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`${healthData.heartRate.length} HR`} size="small" />
                    <Chip label={`${healthData.steps.length} Steps`} size="small" />
                    <Chip label={`${healthData.sleep.length} Sleep`} size="small" />
                    <Chip label={`${workoutHistory.length} Workouts`} size="small" />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Adaptive Plan */}
        <Grid item xs={12} md={4}>
          <Card className="slide-in">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Adaptive Plan</Typography>
              </Box>
              
              {adaptivePlan ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    {adaptivePlan.currentPhase}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Phase: {adaptivePlan.currentPhase.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated: {format(new Date(adaptivePlan.lastUpdated), 'MMM dd, yyyy')}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No adaptive plan active
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Optimization Insights */}
        <Grid item xs={12}>
          <Card className="slide-in">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Insights sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">AI Optimization Insights</Typography>
                <Badge badgeContent={optimizationInsights.length} color="primary" sx={{ ml: 1 }}>
                  <Psychology color="primary" />
                </Badge>
              </Box>
              
              {optimizationInsights.length > 0 ? (
                <Box>
                  {optimizationInsights.map((insight, index) => (
                    <Accordion 
                      key={insight.id}
                      expanded={expandedInsight === insight.id}
                      onChange={() => handleInsightExpand(insight.id)}
                      sx={{ mb: 1 }}
                    >
                      <AccordionSummary
                        expandIcon={<Warning />}
                        sx={{ 
                          bgcolor: insight.priority === 'high' ? 'error.50' : 
                                  insight.priority === 'medium' ? 'warning.50' : 'info.50'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getInsightIcon(insight.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1">{insight.title}</Typography>
                                <Chip 
                                  label={insight.priority} 
                                  size="small" 
                                  color={getPriorityColor(insight.priority) as any}
                                />
                                <Chip 
                                  label={`${insight.impact}/10 impact`} 
                                  size="small" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={`${insight.effort}/10 effort`} 
                                  size="small" 
                                  variant="outlined"
                                  color="success"
                                />
                              </Box>
                            }
                            secondary={insight.description}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body1" gutterBottom>
                            <strong>Recommendation:</strong> {insight.description}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Evidence:</strong> {insight.evidence.join(', ')}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button 
                              variant="contained" 
                              size="small"
                              startIcon={<CheckCircle />}
                            >
                              Apply
                            </Button>
                            <Button 
                              variant="outlined" 
                              size="small"
                              startIcon={<Schedule />}
                            >
                              Schedule
                            </Button>
                            <Button 
                              variant="text" 
                              size="small"
                            >
                              Dismiss
                            </Button>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  No optimization insights available. Complete some workouts and nutrition entries to get AI recommendations!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Factors & Opportunities */}
        {aiAnalysis && (
          <>
            <Grid item xs={12} md={6}>
              <Card className="slide-in">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Warning sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">Risk Factors</Typography>
                  </Box>
                  
                  {aiAnalysis.riskFactors.length > 0 ? (
                    <List dense>
                      {aiAnalysis.riskFactors.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="error" />
                          </ListItemIcon>
                          <ListItemText primary={risk} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No risk factors detected
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className="slide-in">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Opportunities</Typography>
                  </Box>
                  
                  {aiAnalysis.opportunities.length > 0 ? (
                    <List dense>
                      {aiAnalysis.opportunities.map((opportunity, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TrendingUp color="success" />
                          </ListItemIcon>
                          <ListItemText primary={opportunity} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No opportunities identified
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
