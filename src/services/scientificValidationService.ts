// Scientific Validation Service for SciOptimal
// Provides evidence-based scoring and research integration for fitness recommendations

export interface ResearchStudy {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  methodology: string;
  sampleSize: number;
  duration: string;
  findings: string[];
  limitations: string[];
  relevanceScore: number; // 0-100
  evidenceLevel: EvidenceLevel;
  categories: string[];
}

export interface EvidenceLevel {
  level: 'A' | 'B' | 'C' | 'D';
  description: string;
  criteria: string[];
  reliability: number; // 0-100
}

export interface ScientificValidation {
  overallScore: number; // 0-100
  evidenceStrength: EvidenceStrength;
  supportingStudies: ResearchStudy[];
  contradictingStudies: ResearchStudy[];
  consensus: ConsensusLevel;
  recommendations: ScientificRecommendation[];
  lastUpdated: Date;
}

export interface EvidenceStrength {
  score: number; // 0-100
  level: 'strong' | 'moderate' | 'weak' | 'insufficient';
  factors: EvidenceFactor[];
  confidence: number; // 0-100
}

export interface EvidenceFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // 0-1
  description: string;
}

export interface ConsensusLevel {
  level: 'strong_consensus' | 'moderate_consensus' | 'mixed_evidence' | 'insufficient_evidence';
  percentage: number; // 0-100
  supportingStudies: number;
  contradictingStudies: number;
  description: string;
}

export interface ScientificRecommendation {
  recommendation: string;
  evidenceLevel: EvidenceLevel;
  supportingStudies: string[];
  implementation: string[];
  monitoring: string[];
  expectedOutcomes: string[];
  timeToEffect: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ContradictionAnalysis {
  topic: string;
  conflictingRecommendations: ConflictingRecommendation[];
  resolution: string;
  scientificBasis: string;
  practicalGuidance: string;
}

export interface ConflictingRecommendation {
  recommendation: string;
  studies: ResearchStudy[];
  strength: number;
  context: string;
}

export class ScientificValidationService {
  private researchDatabase: ResearchStudy[] = [];
  private evidenceLevels: { [key: string]: EvidenceLevel } = {};

  constructor() {
    this.initializeEvidenceLevels();
    this.initializeResearchDatabase();
  }

  // Validate a fitness recommendation with scientific evidence
  validateRecommendation(
    recommendation: string,
    category: string,
    userProfile: any
  ): ScientificValidation {
    const relevantStudies = this.findRelevantStudies(recommendation, category);
    const evidenceStrength = this.calculateEvidenceStrength(relevantStudies);
    const consensus = this.analyzeConsensus(relevantStudies);
    const contradictions = this.findContradictions(recommendation, category);
    
    const overallScore = this.calculateOverallScore(evidenceStrength, consensus, contradictions);
    const scientificRecommendations = this.generateScientificRecommendations(
      recommendation,
      relevantStudies,
      userProfile
    );

    return {
      overallScore,
      evidenceStrength,
      supportingStudies: relevantStudies.filter(s => s.relevanceScore > 70),
      contradictingStudies: contradictions.map(c => c.studies).flat(),
      consensus,
      recommendations: scientificRecommendations,
      lastUpdated: new Date()
    };
  }

  // Find research studies relevant to a specific recommendation
  findRelevantStudies(recommendation: string, category: string): ResearchStudy[] {
    const keywords = this.extractKeywords(recommendation);
    const categoryStudies = this.researchDatabase.filter(study => 
      study.categories.includes(category)
    );

    return categoryStudies
      .map(study => ({
        ...study,
        relevanceScore: this.calculateRelevanceScore(study, keywords, category)
      }))
      .filter(study => study.relevanceScore > 50)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Calculate evidence strength based on study quality and relevance
  calculateEvidenceStrength(studies: ResearchStudy[]): EvidenceStrength {
    if (studies.length === 0) {
      return {
        score: 0,
        level: 'insufficient',
        factors: [],
        confidence: 0
      };
    }

    const factors: EvidenceFactor[] = [];
    let totalScore = 0;

    // Study quality factor
    const avgEvidenceLevel = studies.reduce((sum, s) => sum + s.evidenceLevel.reliability, 0) / studies.length;
    factors.push({
      factor: 'Study Quality',
      impact: 'positive',
      weight: 0.4,
      description: `Average evidence level reliability: ${Math.round(avgEvidenceLevel)}%`
    });
    totalScore += avgEvidenceLevel * 0.4;

    // Sample size factor
    const avgSampleSize = studies.reduce((sum, s) => sum + s.sampleSize, 0) / studies.length;
    const sampleSizeScore = Math.min(100, (avgSampleSize / 100) * 100);
    factors.push({
      factor: 'Sample Size',
      impact: sampleSizeScore > 50 ? 'positive' : 'negative',
      weight: 0.2,
      description: `Average sample size: ${Math.round(avgSampleSize)} participants`
    });
    totalScore += sampleSizeScore * 0.2;

    // Study recency factor
    const currentYear = new Date().getFullYear();
    const avgRecency = studies.reduce((sum, s) => sum + (currentYear - s.year), 0) / studies.length;
    const recencyScore = Math.max(0, 100 - (avgRecency * 2));
    factors.push({
      factor: 'Study Recency',
      impact: recencyScore > 50 ? 'positive' : 'negative',
      weight: 0.15,
      description: `Average study age: ${Math.round(avgRecency)} years`
    });
    totalScore += recencyScore * 0.15;

    // Consistency factor
    const consistencyScore = this.calculateConsistencyScore(studies);
    factors.push({
      factor: 'Findings Consistency',
      impact: consistencyScore > 70 ? 'positive' : 'negative',
      weight: 0.25,
      description: `Consistency score: ${Math.round(consistencyScore)}%`
    });
    totalScore += consistencyScore * 0.25;

    const level = this.determineEvidenceLevel(totalScore);
    const confidence = Math.min(100, totalScore + (studies.length * 2));

    return {
      score: Math.round(totalScore),
      level,
      factors,
      confidence: Math.min(100, confidence)
    };
  }

  // Analyze consensus among studies
  analyzeConsensus(studies: ResearchStudy[]): ConsensusLevel {
    if (studies.length === 0) {
      return {
        level: 'insufficient_evidence',
        percentage: 0,
        supportingStudies: 0,
        contradictingStudies: 0,
        description: 'No studies available for analysis'
      };
    }

    if (studies.length === 1) {
      return {
        level: 'insufficient_evidence',
        percentage: 100,
        supportingStudies: 1,
        contradictingStudies: 0,
        description: 'Single study - insufficient evidence for consensus'
      };
    }

    // Group studies by findings similarity
    const findingsGroups = this.groupStudiesByFindings(studies);
    const largestGroup = findingsGroups.reduce((max, group) => 
      group.studies.length > max.studies.length ? group : max
    );

    const percentage = (largestGroup.studies.length / studies.length) * 100;
    const level = this.determineConsensusLevel(percentage, studies.length);

    return {
      level,
      percentage: Math.round(percentage),
      supportingStudies: largestGroup.studies.length,
      contradictingStudies: studies.length - largestGroup.studies.length,
      description: this.generateConsensusDescription(level, percentage, studies.length)
    };
  }

  // Find contradictions in research
  findContradictions(recommendation: string, category: string): ContradictionAnalysis[] {
    const studies = this.findRelevantStudies(recommendation, category);
    const contradictions: ContradictionAnalysis[] = [];

    // Analyze conflicting findings
    const findingsGroups = this.groupStudiesByFindings(studies);
    
    if (findingsGroups.length > 1) {
      const mainGroup = findingsGroups[0];
      const conflictingGroups = findingsGroups.slice(1);

      conflictingGroups.forEach(group => {
        contradictions.push({
          topic: this.extractTopic(recommendation),
          conflictingRecommendations: [
            {
              recommendation: mainGroup.findings,
              studies: mainGroup.studies,
              strength: mainGroup.studies.length,
              context: 'Primary recommendation'
            },
            {
              recommendation: group.findings,
              studies: group.studies,
              strength: group.studies.length,
              context: 'Conflicting evidence'
            }
          ],
          resolution: this.resolveContradiction(mainGroup, group),
          scientificBasis: this.generateContradictionBasis(mainGroup, group),
          practicalGuidance: this.generatePracticalGuidance(mainGroup, group)
        });
      });
    }

    return contradictions;
  }

  // Generate evidence-based recommendations
  generateScientificRecommendations(
    recommendation: string,
    studies: ResearchStudy[],
    userProfile: any
  ): ScientificRecommendation[] {
    const recommendations: ScientificRecommendation[] = [];

    studies.forEach(study => {
      if (study.relevanceScore > 80) {
        recommendations.push({
          recommendation: this.adaptRecommendation(recommendation, study, userProfile),
          evidenceLevel: study.evidenceLevel,
          supportingStudies: [study.id],
          implementation: this.generateImplementation(study, userProfile),
          monitoring: this.generateMonitoring(study, userProfile),
          expectedOutcomes: this.extractExpectedOutcomes(study),
          timeToEffect: this.estimateTimeToEffect(study, userProfile),
          riskLevel: this.assessRiskLevel(study, userProfile)
        });
      }
    });

    return recommendations;
  }

  // Get latest research updates for a specific topic
  getLatestResearch(topic: string, limit: number = 5): ResearchStudy[] {
    const relevantStudies = this.researchDatabase.filter(study =>
      study.categories.includes(topic) || 
      study.title.toLowerCase().includes(topic.toLowerCase())
    );

    return relevantStudies
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
  }

  // Generate research summary for a topic
  generateResearchSummary(topic: string): string {
    const studies = this.getLatestResearch(topic, 10);
    
    if (studies.length === 0) {
      return `No research studies found for "${topic}". Consider consulting with a fitness professional for personalized advice.`;
    }

    const evidenceLevels = studies.map(s => s.evidenceLevel.level);
    const avgYear = studies.reduce((sum, s) => sum + s.year, 0) / studies.length;
    const totalParticipants = studies.reduce((sum, s) => sum + s.sampleSize, 0);

    let summary = `Research Summary for "${topic}":\n\n`;
    summary += `• ${studies.length} studies analyzed\n`;
    summary += `• Evidence levels: ${evidenceLevels.join(', ')}\n`;
    summary += `• Average publication year: ${Math.round(avgYear)}\n`;
    summary += `• Total participants: ${totalParticipants.toLocaleString()}\n\n`;

    const keyFindings = this.extractKeyFindings(studies);
    summary += `Key Findings:\n${keyFindings.map(f => `• ${f}`).join('\n')}\n\n`;

    const recommendations = this.generateTopicRecommendations(studies);
    summary += `Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}`;

    return summary;
  }

  // Private helper methods
  private initializeEvidenceLevels(): void {
    this.evidenceLevels = {
      'A': {
        level: 'A',
        description: 'Strong evidence from well-designed studies',
        criteria: [
          'Randomized controlled trials',
          'Large sample sizes (>100 participants)',
          'Multiple studies with consistent findings',
          'Published in peer-reviewed journals'
        ],
        reliability: 95
      },
      'B': {
        level: 'B',
        description: 'Moderate evidence from well-designed studies',
        criteria: [
          'Randomized controlled trials',
          'Moderate sample sizes (30-100 participants)',
          'Some consistency in findings',
          'Published in peer-reviewed journals'
        ],
        reliability: 80
      },
      'C': {
        level: 'C',
        description: 'Limited evidence from observational studies',
        criteria: [
          'Observational studies',
          'Small sample sizes (<30 participants)',
          'Limited consistency in findings',
          'May not be peer-reviewed'
        ],
        reliability: 60
      },
      'D': {
        level: 'D',
        description: 'Expert opinion and case studies',
        criteria: [
          'Expert consensus',
          'Case studies',
          'No controlled research',
          'Limited scientific basis'
        ],
        reliability: 30
      }
    };
  }

  private initializeResearchDatabase(): void {
    // This would typically be populated from a real research database
    // For now, adding some sample studies
    this.researchDatabase = [
      {
        id: 'study_001',
        title: 'Effects of Progressive Overload on Strength Gains',
        authors: ['Smith, J.', 'Johnson, A.', 'Williams, B.'],
        journal: 'Journal of Strength and Conditioning Research',
        year: 2022,
        doi: '10.1234/jscr.2022.001',
        abstract: 'Study examining progressive overload principles in resistance training...',
        methodology: 'Randomized controlled trial with 120 participants',
        sampleSize: 120,
        duration: '12 weeks',
        findings: [
          'Progressive overload increases strength by 15-20%',
          'Optimal progression rate is 2.5-5kg per week',
          'Consistency is more important than progression rate'
        ],
        limitations: [
          'Limited to healthy adults',
          'Short duration study'
        ],
        relevanceScore: 95,
        evidenceLevel: this.evidenceLevels['A'],
        categories: ['strength_training', 'progressive_overload', 'resistance_training']
      },
      {
        id: 'study_002',
        title: 'Protein Intake and Muscle Protein Synthesis',
        authors: ['Brown, C.', 'Davis, E.'],
        journal: 'International Journal of Sport Nutrition',
        year: 2021,
        doi: '10.1234/ijsn.2021.002',
        abstract: 'Meta-analysis of protein intake effects on muscle building...',
        methodology: 'Systematic review and meta-analysis',
        sampleSize: 1500,
        duration: 'Various',
        findings: [
          'Optimal protein intake is 1.6-2.2g/kg body weight',
          'Protein timing has minimal effect on muscle gains',
          'Higher protein intake preserves muscle during weight loss'
        ],
        limitations: [
          'Heterogeneous study designs',
          'Limited long-term data'
        ],
        relevanceScore: 90,
        evidenceLevel: this.evidenceLevels['A'],
        categories: ['nutrition', 'protein', 'muscle_growth']
      }
    ];
  }

  private extractKeywords(recommendation: string): string[] {
    const commonKeywords = [
      'strength', 'cardio', 'protein', 'recovery', 'sleep', 'progressive overload',
      'hypertrophy', 'endurance', 'flexibility', 'balance', 'coordination'
    ];
    
    return commonKeywords.filter(keyword => 
      recommendation.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private calculateRelevanceScore(study: ResearchStudy, keywords: string[], category: string): number {
    let score = 0;
    
    // Category match
    if (study.categories.includes(category)) score += 40;
    
    // Keyword matches
    keywords.forEach(keyword => {
      if (study.title.toLowerCase().includes(keyword.toLowerCase()) ||
          study.abstract.toLowerCase().includes(keyword.toLowerCase())) {
        score += 20;
      }
    });
    
    // Evidence level bonus
    score += study.evidenceLevel.reliability * 0.4;
    
    return Math.min(100, score);
  }

  private calculateConsistencyScore(studies: ResearchStudy[]): number {
    if (studies.length < 2) return 100;
    
    const findings = studies.map(s => s.findings.join(' ').toLowerCase());
    const similarityMatrix = this.calculateSimilarityMatrix(findings);
    
    return Math.round(
      similarityMatrix.reduce((sum, row) => sum + row.reduce((rowSum, val) => rowSum + val, 0), 0) / 
      (similarityMatrix.length * similarityMatrix[0].length) * 100
    );
  }

  private calculateSimilarityMatrix(findings: string[]): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < findings.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < findings.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = this.calculateTextSimilarity(findings[i], findings[j]);
        }
      }
    }
    
    return matrix;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private determineEvidenceLevel(score: number): 'strong' | 'moderate' | 'weak' | 'insufficient' {
    if (score >= 80) return 'strong';
    if (score >= 60) return 'moderate';
    if (score >= 40) return 'weak';
    return 'insufficient';
  }

  private groupStudiesByFindings(studies: ResearchStudy[]): any[] {
    const groups: any[] = [];
    
    studies.forEach(study => {
      let addedToGroup = false;
      
      for (const group of groups) {
        if (this.findingsAreSimilar(study.findings, group.findings)) {
          group.studies.push(study);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        groups.push({
          findings: study.findings,
          studies: [study]
        });
      }
    });
    
    return groups;
  }

  private findingsAreSimilar(findings1: string[], findings2: string[]): boolean {
    const text1 = findings1.join(' ').toLowerCase();
    const text2 = findings2.join(' ').toLowerCase();
    
    return this.calculateTextSimilarity(text1, text2) > 0.6;
  }

  private determineConsensusLevel(percentage: number, studyCount: number): ConsensusLevel['level'] {
    if (studyCount < 3) return 'insufficient_evidence';
    if (percentage >= 80) return 'strong_consensus';
    if (percentage >= 60) return 'moderate_consensus';
    return 'mixed_evidence';
  }

  private generateConsensusDescription(level: ConsensusLevel['level'], percentage: number, studyCount: number): string {
    switch (level) {
      case 'strong_consensus':
        return `Strong consensus (${percentage}%) among ${studyCount} studies`;
      case 'moderate_consensus':
        return `Moderate consensus (${percentage}%) among ${studyCount} studies`;
      case 'mixed_evidence':
        return `Mixed evidence with ${percentage}% agreement among ${studyCount} studies`;
      case 'insufficient_evidence':
        return `Insufficient evidence (${studyCount} study/studies)`;
      default:
        return 'Unknown consensus level';
    }
  }

  private extractTopic(recommendation: string): string {
    const topics = ['strength training', 'cardio', 'nutrition', 'recovery', 'flexibility'];
    return topics.find(topic => recommendation.toLowerCase().includes(topic)) || 'general fitness';
  }

  private resolveContradiction(group1: any, group2: any): string {
    if (group1.studies.length > group2.studies.length) {
      return `Primary recommendation supported by ${group1.studies.length} studies vs ${group2.studies.length} conflicting studies. Consider individual factors and consult professionals.`;
    } else if (group2.studies.length > group1.studies.length) {
      return `Conflicting evidence has stronger support (${group2.studies.length} vs ${group1.studies.length} studies). Further research needed.`;
    } else {
      return 'Equal evidence on both sides. Individual factors and professional guidance recommended.';
    }
  }

  private generateContradictionBasis(group1: any, group2: any): string {
    return `Evidence split: ${group1.studies.length} studies support primary recommendation, ${group2.studies.length} studies show conflicting results. Consider study quality, methodology, and individual circumstances.`;
  }

  private generatePracticalGuidance(group1: any, group2: any): string {
    return `Start with the primary recommendation but monitor results closely. If outcomes are suboptimal, consider the alternative approach. Individual response varies significantly.`;
  }

  private calculateOverallScore(evidenceStrength: EvidenceStrength, consensus: ConsensusLevel, contradictions: ContradictionAnalysis[]): number {
    let score = evidenceStrength.score;
    
    // Consensus adjustment
    if (consensus.level === 'strong_consensus') score += 10;
    else if (consensus.level === 'moderate_consensus') score += 5;
    else if (consensus.level === 'mixed_evidence') score -= 10;
    else score -= 20;
    
    // Contradiction penalty
    score -= contradictions.length * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private adaptRecommendation(recommendation: string, study: ResearchStudy, userProfile: any): string {
    // Adapt recommendation based on study findings and user profile
    let adapted = recommendation;
    
    if (study.findings.some(f => f.toLowerCase().includes('individual'))) {
      adapted += ' (Individual response may vary)';
    }
    
    if (userProfile.experience === 'beginner') {
      adapted += ' (Start conservatively and progress gradually)';
    }
    
    return adapted;
  }

  private generateImplementation(study: ResearchStudy, userProfile: any): string[] {
    const implementation: string[] = [];
    
    if (study.methodology.includes('Randomized controlled trial')) {
      implementation.push('Follow the protocol as closely as possible');
    }
    
    if (study.duration.includes('weeks')) {
      implementation.push(`Commit to at least ${study.duration} for best results`);
    }
    
    if (userProfile.experience === 'beginner') {
      implementation.push('Start with 50% of recommended intensity');
      implementation.push('Gradually increase over 2-4 weeks');
    }
    
    return implementation;
  }

  private generateMonitoring(study: ResearchStudy, userProfile: any): string[] {
    return [
      'Track progress weekly',
      'Monitor for any adverse effects',
      'Adjust intensity based on response',
      'Document any deviations from protocol'
    ];
  }

  private extractExpectedOutcomes(study: ResearchStudy): string[] {
    return study.findings.map(finding => {
      if (finding.includes('%')) {
        return `Expect ${finding}`;
      }
      return finding;
    });
  }

  private estimateTimeToEffect(study: ResearchStudy, userProfile: any): string {
    if (study.duration.includes('weeks')) {
      return study.duration;
    }
    
    // Estimate based on study type and user profile
    if (study.evidenceLevel.level === 'A') {
      return userProfile.experience === 'beginner' ? '4-6 weeks' : '2-4 weeks';
    }
    
    return '6-8 weeks';
  }

  private assessRiskLevel(study: ResearchStudy, userProfile: any): 'low' | 'medium' | 'high' {
    if (study.evidenceLevel.level === 'A' && study.sampleSize > 100) {
      return 'low';
    }
    
    if (userProfile.experience === 'beginner') {
      return 'medium';
    }
    
    return 'high';
  }

  private extractKeyFindings(studies: ResearchStudy[]): string[] {
    const allFindings = studies.flatMap(s => s.findings);
    const uniqueFindings = [...new Set(allFindings)];
    
    return uniqueFindings.slice(0, 5); // Top 5 findings
  }

  private generateTopicRecommendations(studies: ResearchStudy[]): string[] {
    const recommendations: string[] = [];
    
    studies.forEach(study => {
      if (study.evidenceLevel.level === 'A' || study.evidenceLevel.level === 'B') {
        study.findings.forEach(finding => {
          if (finding.includes('recommend') || finding.includes('should') || finding.includes('optimal')) {
            recommendations.push(finding);
          }
        });
      }
    });
    
    return [...new Set(recommendations)].slice(0, 3); // Top 3 recommendations
  }
}

export default new ScientificValidationService();

