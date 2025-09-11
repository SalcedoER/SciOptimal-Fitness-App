import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Badge,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Science,
  ExpandMore,
  CheckCircle,
  Warning,
  Info,
  School,
  TrendingUp,
  Psychology,
  FitnessCenter,
  Restaurant,
  Bedtime,
  Schedule,
  Search,
  FilterList
} from '@mui/icons-material';
import { researchAIService, ResearchRecommendation, ResearchStudy } from '../services/researchAI';
import { useAppStore } from '../store';

// Research Panel - Evidence-Based AI Recommendations
export default function ResearchPanel() {
  const { userProfile, workoutHistory, nutritionLog, progressHistory } = useAppStore();
  const [recommendations, setRecommendations] = useState<ResearchRecommendation[]>([]);
  const [studies, setStudies] = useState<ResearchStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudy, setExpandedStudy] = useState<string | false>(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'studies'>('recommendations');

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, workoutHistory, nutritionLog, progressHistory]);

  const generateRecommendations = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const goals = ['muscle_growth', 'strength', 'fat_loss']; // This would come from user profile
      const recs = researchAIService.getPersonalizedRecommendations(userProfile, goals);
      setRecommendations(recs);
      
      // Get all studies for reference
      const allStudies = researchAIService.getStudiesByCategory('workout');
      setStudies(allStudies);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout': return <FitnessCenter />;
      case 'nutrition': return <Restaurant />;
      case 'recovery': return <Bedtime />;
      case 'progression': return <TrendingUp />;
      case 'timing': return <Schedule />;
      default: return <Science />;
    }
  };

  const getEvidenceColor = (strength: number) => {
    if (strength >= 90) return '#4caf50';
    if (strength >= 70) return '#ff9800';
    return '#f44336';
  };

  const getEvidenceLabel = (strength: number) => {
    if (strength >= 90) return 'Very Strong';
    if (strength >= 70) return 'Strong';
    if (strength >= 50) return 'Moderate';
    return 'Weak';
  };

  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );

  let filteredStudies = studies;
  
  // Filter by institution
  if (selectedInstitution !== 'all') {
    filteredStudies = researchAIService.getStudiesByInstitution(selectedInstitution as any);
  }
  
  // Filter by recent studies
  if (showRecentOnly) {
    filteredStudies = researchAIService.getRecentStudies();
  }
  
  // Filter by search term
  filteredStudies = filteredStudies.filter(study =>
    study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.keyFindings.some(finding => finding.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff !important' }}>
          🔬 Research-Backed AI
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Science />}
          onClick={generateRecommendations}
          disabled={loading}
          sx={{ color: '#ffffff !important', borderColor: '#555555 !important' }}
        >
          {loading ? <CircularProgress size={20} /> : 'Update Recommendations'}
        </Button>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        {[
          { id: 'recommendations', label: 'AI Recommendations', icon: <Psychology /> },
          { id: 'studies', label: 'Research Studies', icon: <Science /> }
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            startIcon={tab.icon}
            sx={{
              color: activeTab === tab.id ? '#000000 !important' : '#ffffff !important',
              background: activeTab === tab.id ? '#ffffff !important' : '#333333 !important',
              border: '1px solid #555555 !important',
              '&:hover': {
                background: activeTab === tab.id ? '#cccccc !important' : '#444444 !important'
              }
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      {/* Tab Content */}
      <Grid container spacing={3}>
          {/* Recommendations */}
          <Grid item xs={12} md={8}>
          <Card sx={{ background: '#000000 !important', border: '1px solid #333333 !important' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff !important', mb: 2 }}>
                Evidence-Based Recommendations
              </Typography>
              
              {/* Filters */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mb: 1 }}>
                  Category Filter:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {['all', 'workout', 'nutrition', 'recovery', 'progression', 'timing'].map(category => (
                    <Chip
                      key={category}
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                      onClick={() => setSelectedCategory(category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      icon={category !== 'all' ? getCategoryIcon(category) : undefined}
                      sx={{ 
                        color: selectedCategory === category ? '#000000 !important' : '#ffffff !important',
                        background: selectedCategory === category ? '#ffffff !important' : '#333333 !important'
                      }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mb: 1 }}>
                  Institution Filter:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {['all', 'NIH', 'CDC', 'WHO', 'JAMA', 'NEJM'].map(institution => (
                    <Chip
                      key={institution}
                      label={institution}
                      onClick={() => setSelectedInstitution(institution)}
                      color={selectedInstitution === institution ? 'primary' : 'default'}
                      sx={{ 
                        color: selectedInstitution === institution ? '#000000 !important' : '#ffffff !important',
                        background: selectedInstitution === institution ? '#ffffff !important' : '#333333 !important'
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={showRecentOnly ? "Recent Only (2022-2024)" : "All Years"}
                    onClick={() => setShowRecentOnly(!showRecentOnly)}
                    color={showRecentOnly ? 'primary' : 'default'}
                    sx={{ 
                      color: showRecentOnly ? '#000000 !important' : '#ffffff !important',
                      background: showRecentOnly ? '#ffffff !important' : '#333333 !important'
                    }}
                  />
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress sx={{ color: '#ffffff !important' }} />
                </Box>
              ) : (
                <Box>
                  {filteredRecommendations.map((rec, index) => (
                    <Accordion 
                      key={index}
                      sx={{ 
                        background: '#1e1e1e !important', 
                        color: '#ffffff !important',
                        border: '1px solid #333333 !important',
                        mb: 1
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#ffffff !important' }} />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            {getCategoryIcon(rec.category)}
                            <Typography variant="h6" sx={{ color: '#ffffff !important', ml: 1 }}>
                              {rec.title}
                            </Typography>
                          </Box>
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={getEvidenceLabel(rec.evidenceStrength)}
                              size="small"
                              sx={{ 
                                background: getEvidenceColor(rec.evidenceStrength),
                                color: '#ffffff !important'
                              }}
                            />
                            <Badge badgeContent={rec.supportingStudies.length} color="primary">
                              <Science sx={{ color: '#ffffff !important' }} />
                            </Badge>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body1" sx={{ color: '#ffffff !important', mb: 2 }}>
                            {rec.description}
                          </Typography>
                          
                          <Alert severity="info" sx={{ mb: 2, background: '#1e1e1e !important', color: '#ffffff !important' }}>
                            <Typography variant="body2" sx={{ color: '#ffffff !important' }}>
                              <strong>Implementation:</strong> {rec.implementation}
                            </Typography>
                          </Alert>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mb: 1 }}>
                                Expected Outcomes:
                              </Typography>
                              <List dense>
                                {rec.expectedOutcomes.map((outcome, idx) => (
                                  <ListItem key={idx} sx={{ py: 0 }}>
                                    <ListItemIcon>
                                      <CheckCircle sx={{ color: '#4caf50 !important', fontSize: 16 }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={outcome} 
                                      sx={{ '& .MuiListItemText-primary': { color: '#ffffff !important', fontSize: '0.9rem' } }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mb: 1 }}>
                                Time to Results:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ffffff !important', mb: 2 }}>
                                {rec.timeToResults}
                              </Typography>
                              
                              {rec.contraindications.length > 0 && (
                                <>
                                  <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mb: 1 }}>
                                    Contraindications:
                                  </Typography>
                                  <List dense>
                                    {rec.contraindications.map((contra, idx) => (
                                      <ListItem key={idx} sx={{ py: 0 }}>
                                        <ListItemIcon>
                                          <Warning sx={{ color: '#ff9800 !important', fontSize: 16 }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={contra} 
                                          sx={{ '& .MuiListItemText-primary': { color: '#ffffff !important', fontSize: '0.9rem' } }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Research Studies */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: '#000000 !important', border: '1px solid #333333 !important' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff !important', mb: 2 }}>
                Supporting Research
              </Typography>
              
              {/* Search */}
              <Box sx={{ mb: 2 }}>
                <input
                  type="text"
                  placeholder="Search studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1e1e1e',
                    color: '#ffffff',
                    border: '1px solid #555555',
                    borderRadius: '4px'
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {filteredStudies.map((study, index) => (
                  <Accordion 
                    key={study.id}
                    expanded={expandedStudy === study.id}
                    onChange={() => setExpandedStudy(expandedStudy === study.id ? false : study.id)}
                    sx={{ 
                      background: '#1e1e1e !important', 
                      color: '#ffffff !important',
                      border: '1px solid #333333 !important',
                      mb: 1
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#ffffff !important' }} />}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff !important', fontWeight: 'bold' }}>
                          {study.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#aaaaaa !important' }}>
                          {study.authors[0]} et al. ({study.year}) • {study.evidenceLevel} Evidence
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#ffffff !important', mb: 1 }}>
                          <strong>Journal:</strong> {study.journal}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff !important', mb: 1 }}>
                          <strong>Sample Size:</strong> {study.sampleSize} participants
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff !important', mb: 1 }}>
                          <strong>Study Type:</strong> {study.studyType}
                        </Typography>
                        
                        <Typography variant="subtitle2" sx={{ color: '#ffffff !important', mt: 2, mb: 1 }}>
                          Key Findings:
                        </Typography>
                        <List dense>
                          {study.keyFindings.slice(0, 3).map((finding, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
                              <ListItemIcon>
                                <Info sx={{ color: '#4caf50 !important', fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={finding} 
                                sx={{ '& .MuiListItemText-primary': { color: '#ffffff !important', fontSize: '0.8rem' } }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
