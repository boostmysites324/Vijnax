/**
 * RIASEC Career Interest Analyzer
 * Handles scoring, analysis, and stream recommendations based on RIASEC responses
 */

// RIASEC Type definitions
const RIASEC_TYPES = {
  R: {
    name: 'Realistic',
    description: 'Hands-on, technical, practical, mechanical',
    characteristics: ['Practical', 'Technical', 'Mechanical', 'Physical', 'Concrete'],
    color: '#FF6B6B'
  },
  I: {
    name: 'Investigative',
    description: 'Analytical, logical, scientific inquiry',
    characteristics: ['Analytical', 'Logical', 'Scientific', 'Intellectual', 'Curious'],
    color: '#4ECDC4'
  },
  A: {
    name: 'Artistic',
    description: 'Creative, design-oriented, expressive',
    characteristics: ['Creative', 'Artistic', 'Expressive', 'Imaginative', 'Original'],
    color: '#45B7D1'
  },
  S: {
    name: 'Social',
    description: 'Helping, caring, guiding others',
    characteristics: ['Helpful', 'Caring', 'Supportive', 'Empathetic', 'Collaborative'],
    color: '#96CEB4'
  },
  E: {
    name: 'Enterprising',
    description: 'Leadership, persuasion, business-minded',
    characteristics: ['Leadership', 'Persuasive', 'Ambitious', 'Confident', 'Influential'],
    color: '#FFEAA7'
  },
  C: {
    name: 'Conventional',
    description: 'Structured, data-driven, organized',
    characteristics: ['Organized', 'Systematic', 'Detail-oriented', 'Reliable', 'Methodical'],
    color: '#DDA0DD'
  }
};

// Stream mapping based on RIASEC scores
const STREAM_MAPPING = {
  'Science (Maths)': {
    primary: ['R', 'I', 'C'],
    secondary: ['E'],
    description: 'Mathematics, Physics, Chemistry, Engineering',
    careers: ['Engineer', 'Scientist', 'Mathematician', 'Data Analyst', 'Architect']
  },
  'Science (Biology)': {
    primary: ['I', 'S', 'C'],
    secondary: ['R'],
    description: 'Biology, Medicine, Environmental Science, Psychology',
    careers: ['Doctor', 'Biologist', 'Psychologist', 'Environmental Scientist', 'Researcher']
  },
  'Commerce': {
    primary: ['C', 'E', 'I'],
    secondary: ['S'],
    description: 'Business, Economics, Finance, Management',
    careers: ['Business Analyst', 'Accountant', 'Manager', 'Entrepreneur', 'Financial Advisor']
  },
  'Humanities': {
    primary: ['A', 'S', 'E'],
    secondary: ['I'],
    description: 'Literature, History, Philosophy, Arts, Social Sciences',
    careers: ['Writer', 'Teacher', 'Journalist', 'Social Worker', 'Artist']
  },
  'Vocational/Applied': {
    primary: ['R', 'C', 'A'],
    secondary: ['S'],
    description: 'Technical skills, Applied arts, Vocational training',
    careers: ['Technician', 'Designer', 'Craftsman', 'Chef', 'Mechanic']
  }
};

class RIASECAnalyzer {
  constructor() {
    this.riasecTypes = RIASEC_TYPES;
    this.streamMapping = STREAM_MAPPING;
  }

  /**
   * Calculate RIASEC scores from responses
   * @param {Array} responses - Array of response objects
   * @returns {Object} RIASEC scores and analysis
   */
  calculateScores(responses) {
    const scores = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    };

    const totalQuestions = responses.length;
    let validResponses = 0;

    // Count responses for each RIASEC type
    responses.forEach(response => {
      if (response.selectedRIASECType && scores.hasOwnProperty(response.selectedRIASECType)) {
        scores[response.selectedRIASECType]++;
        validResponses++;
      }
    });

    // Calculate percentages
    const percentages = {};
    Object.keys(scores).forEach(type => {
      percentages[type] = validResponses > 0 ? 
        Math.round((scores[type] / validResponses) * 100 * 100) / 100 : 0;
    });

    // Find top 2 RIASEC types
    const sortedTypes = Object.entries(percentages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    const topTwo = sortedTypes.map(([type, percentage]) => ({
      type,
      percentage,
      name: this.riasecTypes[type].name,
      description: this.riasecTypes[type].description
    }));

    return {
      scores,
      percentages,
      totalQuestions,
      validResponses,
      topTwo,
      dominantType: topTwo[0]?.type,
      secondaryType: topTwo[1]?.type
    };
  }

  /**
   * Generate stream recommendations based on RIASEC scores
   * @param {Object} riasecAnalysis - RIASEC analysis results
   * @param {Object} aptitudeScores - Optional aptitude scores for tie-breaking
   * @returns {Object} Stream recommendations
   */
  generateStreamRecommendations(riasecAnalysis, aptitudeScores = null) {
    const { percentages, topTwo } = riasecAnalysis;
    
    // Calculate stream fit scores
    const streamFitScores = {};
    
    Object.entries(this.streamMapping).forEach(([streamName, mapping]) => {
      let score = 0;
      
      // Primary RIASEC types get higher weight
      mapping.primary.forEach(type => {
        score += percentages[type] * 1.0;
      });
      
      // Secondary RIASEC types get lower weight
      mapping.secondary.forEach(type => {
        score += percentages[type] * 0.5;
      });
      
      streamFitScores[streamName] = Math.round(score);
    });

    // Sort streams by fit score
    const sortedStreams = Object.entries(streamFitScores)
      .sort(([,a], [,b]) => b - a)
      .map(([stream, score]) => ({
        stream,
        score,
        fitPercentage: Math.min(100, Math.round(score / 3)), // Normalize to 0-100
        mapping: this.streamMapping[stream]
      }));

    // Primary recommendation
    const primaryRecommendation = sortedStreams[0];
    
    // Secondary recommendations (top 3)
    const secondaryRecommendations = sortedStreams.slice(1, 3);

    // Apply tie-breaking logic if needed
    const finalRecommendation = this.applyTieBreaking(
      primaryRecommendation, 
      secondaryRecommendations, 
      riasecAnalysis, 
      aptitudeScores
    );

    return {
      primaryRecommendation: finalRecommendation,
      secondaryRecommendations,
      allStreamScores: streamFitScores,
      reasoning: this.generateReasoning(riasecAnalysis, finalRecommendation)
    };
  }

  /**
   * Apply tie-breaking logic for stream recommendations
   */
  applyTieBreaking(primary, secondary, riasecAnalysis, aptitudeScores) {
    // If there's a clear winner (score difference > 10), return primary
    if (secondary.length > 0 && primary.score - secondary[0].score > 10) {
      return primary;
    }

    // Use aptitude scores for tie-breaking if available
    if (aptitudeScores) {
      // Logic to prioritize based on aptitude strengths
      const aptitudeStrengths = this.getAptitudeStrengths(aptitudeScores);
      
      // Check which stream aligns better with aptitude strengths
      const streamAptitudeAlignment = this.calculateAptitudeAlignment(
        [primary, ...secondary], 
        aptitudeStrengths
      );
      
      return streamAptitudeAlignment[0];
    }

    // Default tie-breaking: prefer streams that match both top RIASEC types
    const topTwoTypes = riasecAnalysis.topTwo.map(t => t.type);
    
    const alignmentScores = [primary, ...secondary].map(stream => {
      const primaryMatch = stream.mapping.primary.some(type => topTwoTypes.includes(type));
      const secondaryMatch = stream.mapping.secondary.some(type => topTwoTypes.includes(type));
      
      return {
        ...stream,
        alignmentScore: (primaryMatch ? 2 : 0) + (secondaryMatch ? 1 : 0)
      };
    });

    return alignmentScores.sort((a, b) => b.alignmentScore - a.alignmentScore)[0];
  }

  /**
   * Get aptitude strengths from aptitude scores
   */
  getAptitudeStrengths(aptitudeScores) {
    // This would analyze aptitude test results to identify strengths
    // For now, return a placeholder
    return {
      mathLogic: aptitudeScores.mathLogic || 0,
      scientificAbstract: aptitudeScores.scientificAbstract || 0,
      spatial: aptitudeScores.spatial || 0,
      verbal: aptitudeScores.verbal || 0
    };
  }

  /**
   * Calculate how well streams align with aptitude strengths
   */
  calculateAptitudeAlignment(streams, aptitudeStrengths) {
    return streams.map(stream => {
      let alignmentScore = 0;
      
      // Science (Maths) alignment
      if (stream.stream === 'Science (Maths)') {
        alignmentScore += aptitudeStrengths.mathLogic * 0.4;
        alignmentScore += aptitudeStrengths.spatial * 0.3;
        alignmentScore += aptitudeStrengths.scientificAbstract * 0.3;
      }
      
      // Science (Biology) alignment
      if (stream.stream === 'Science (Biology)') {
        alignmentScore += aptitudeStrengths.scientificAbstract * 0.5;
        alignmentScore += aptitudeStrengths.verbal * 0.3;
        alignmentScore += aptitudeStrengths.mathLogic * 0.2;
      }
      
      // Commerce alignment
      if (stream.stream === 'Commerce') {
        alignmentScore += aptitudeStrengths.mathLogic * 0.4;
        alignmentScore += aptitudeStrengths.verbal * 0.4;
        alignmentScore += aptitudeStrengths.scientificAbstract * 0.2;
      }
      
      // Humanities alignment
      if (stream.stream === 'Humanities') {
        alignmentScore += aptitudeStrengths.verbal * 0.6;
        alignmentScore += aptitudeStrengths.scientificAbstract * 0.2;
        alignmentScore += aptitudeStrengths.spatial * 0.2;
      }
      
      return {
        ...stream,
        aptitudeAlignment: alignmentScore
      };
    }).sort((a, b) => b.aptitudeAlignment - a.aptitudeAlignment);
  }

  /**
   * Generate reasoning for recommendations
   */
  generateReasoning(riasecAnalysis, recommendation) {
    const { topTwo, percentages } = riasecAnalysis;
    const dominantType = topTwo[0];
    const secondaryType = topTwo[1];

    return {
      dominantTraits: `${dominantType.name} (${dominantType.percentage}%) and ${secondaryType.name} (${secondaryType.percentage}%)`,
      streamAlignment: `Your ${recommendation.stream} recommendation aligns with your ${dominantType.name.toLowerCase()} and ${secondaryType.name.toLowerCase()} interests`,
      careerFit: `This stream leads to careers like ${recommendation.mapping.careers.slice(0, 3).join(', ')}`,
      nextSteps: this.generateNextSteps(recommendation.stream)
    };
  }

  /**
   * Generate next steps for recommended stream
   */
  generateNextSteps(stream) {
    const nextSteps = {
      'Science (Maths)': [
        'Focus on Mathematics and Physics',
        'Prepare for JEE, BITSAT, or other engineering entrance exams',
        'Consider subjects like Mathematics, Physics, Chemistry',
        'Explore careers in Engineering, Research, Data Science'
      ],
      'Science (Biology)': [
        'Focus on Biology and Chemistry',
        'Prepare for NEET, AIIMS, or other medical entrance exams',
        'Consider subjects like Biology, Chemistry, Physics',
        'Explore careers in Medicine, Research, Environmental Science'
      ],
      'Commerce': [
        'Focus on Mathematics and Economics',
        'Prepare for CA, CS, or other commerce entrance exams',
        'Consider subjects like Accountancy, Business Studies, Economics',
        'Explore careers in Business, Finance, Management'
      ],
      'Humanities': [
        'Focus on Languages and Social Sciences',
        'Prepare for competitive exams in your area of interest',
        'Consider subjects like History, Geography, Political Science',
        'Explore careers in Teaching, Journalism, Social Work'
      ],
      'Vocational/Applied': [
        'Focus on practical skills and technical training',
        'Consider vocational courses and apprenticeships',
        'Develop hands-on skills in your area of interest',
        'Explore careers in Technical fields, Design, Crafts'
      ]
    };

    return nextSteps[stream] || [];
  }

  /**
   * Generate comprehensive report
   */
  generateReport(riasecAnalysis, streamRecommendations, userInfo = {}) {
    const { scores, percentages, topTwo } = riasecAnalysis;
    const { primaryRecommendation, reasoning } = streamRecommendations;

    return {
      userInfo: {
        name: userInfo.name || 'Student',
        date: new Date().toISOString(),
        testVersion: '1.0'
      },
      riasecScores: {
        raw: scores,
        percentages,
        topTwo,
        chart: this.generateChartData(percentages)
      },
      recommendations: {
        primary: primaryRecommendation,
        reasoning,
        fitIndex: primaryRecommendation.fitPercentage
      },
      insights: this.generateInsights(riasecAnalysis),
      nextSteps: reasoning.nextSteps,
      disclaimer: 'This assessment is one factor in career decision-making. Consider aptitude, personality, and practical factors as well.'
    };
  }

  /**
   * Generate chart data for visualization
   */
  generateChartData(percentages) {
    return Object.entries(percentages).map(([type, percentage]) => ({
      type,
      name: this.riasecTypes[type].name,
      percentage,
      color: this.riasecTypes[type].color
    }));
  }

  /**
   * Generate insights based on RIASEC analysis
   */
  generateInsights(riasecAnalysis) {
    const { topTwo, percentages } = riasecAnalysis;
    const insights = [];

    // Dominant type insights
    const dominant = topTwo[0];
    if (dominant.percentage > 25) {
      insights.push(`You have a strong preference for ${dominant.name.toLowerCase()} activities (${dominant.percentage}%)`);
    }

    // Balanced profile insights
    const maxPercentage = Math.max(...Object.values(percentages));
    const minPercentage = Math.min(...Object.values(percentages));
    if (maxPercentage - minPercentage < 15) {
      insights.push('You have a well-balanced interest profile across different areas');
    }

    // Specific type insights
    if (percentages.R > 20) {
      insights.push('You enjoy hands-on, practical work and technical problem-solving');
    }
    if (percentages.I > 20) {
      insights.push('You have strong analytical and scientific thinking abilities');
    }
    if (percentages.A > 20) {
      insights.push('You are creative and enjoy expressive, artistic activities');
    }
    if (percentages.S > 20) {
      insights.push('You are people-oriented and enjoy helping others');
    }
    if (percentages.E > 20) {
      insights.push('You have leadership potential and business acumen');
    }
    if (percentages.C > 20) {
      insights.push('You are organized and prefer structured, systematic work');
    }

    return insights;
  }
}

export default new RIASECAnalyzer();





