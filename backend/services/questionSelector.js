import Question from '../models/Question.js';

/**
 * Question Selector Service
 * Handles intelligent selection of questions based on criteria
 */

// Question category mappings for Section A - Aptitude
const APTITUDE_CATEGORIES = {
  MATH_LOGIC: [
    'mathematical_logic',
    'arithmetic_logic', 
    'ratio_reasoning',
    'quantitative_estimation',
    'equation_puzzle',
    'business_math',
    'financial_logic',
    'time_work_logic',
    'percentage_estimation',
    'algebraic_reasoning'
  ],
  
  SCIENTIFIC_ABSTRACT: [
    'scientific_deduction',
    'scientific_pattern',
    'experimental_logic',
    'abstract_reasoning',
    'pattern_recognition',
    'sequence_pattern',
    'data_interpretation',
    'logical_reasoning',
    'deductive_chain',
    'inductive_reasoning'
  ],
  
  SPATIAL: [
    'spatial_folding',
    'spatial_ability',
    'geometry_reasoning',
    '3d_visualization',
    'spatial_rotation',
    'pattern_blocks',
    'cube_visualization',
    'spatial_relationships'
  ],
  
  VERBAL: [
    'verbal_inference',
    'reading_comprehension',
    'word_puzzle',
    'analogy_reasoning',
    'sentence_logic',
    'grammar_reasoning',
    'classification_logic',
    'verbal_analogy',
    'language_reasoning',
    'text_analysis'
  ]
};

// Stream-based question selection
const STREAM_WEIGHTS = {
  'PCM': { math_logic: 0.4, scientific_abstract: 0.3, spatial: 0.2, verbal: 0.1 },
  'PCB': { math_logic: 0.2, scientific_abstract: 0.4, spatial: 0.1, verbal: 0.3 },
  'Commerce': { math_logic: 0.3, scientific_abstract: 0.1, spatial: 0.1, verbal: 0.5 },
  'Humanities': { math_logic: 0.1, scientific_abstract: 0.1, spatial: 0.1, verbal: 0.7 }
};

class QuestionSelector {
  constructor() {
    this.categories = APTITUDE_CATEGORIES;
    this.streamWeights = STREAM_WEIGHTS;
  }

  /**
   * Select 12 questions for Section A - Aptitude based on criteria
   * @param {string} stream - Target stream (PCM, PCB, Commerce, Humanities)
   * @param {Object} options - Selection options
   * @returns {Array} Selected questions
   */
  async selectAptitudeQuestions(stream = 'PCM', options = {}) {
    try {
      const {
        mathLogicCount = 4,
        scientificAbstractCount = 3,
        spatialCount = 2,
        verbalCount = 3,
        difficulty = 'mixed', // 'easy', 'medium', 'hard', 'mixed'
        excludeUsed = true
      } = options;

      console.log(`🎯 Selecting aptitude questions for ${stream} stream...`);

      // Get all available aptitude questions
      const allQuestions = await this.getAllAptitudeQuestions();
      
      if (allQuestions.length === 0) {
        throw new Error('No aptitude questions found in database');
      }

      console.log(`📊 Found ${allQuestions.length} total aptitude questions`);

      // Select questions by category
      const selectedQuestions = [];

      // 1. Math/Logic Questions (4)
      const mathLogicQuestions = await this.selectQuestionsByCategory(
        allQuestions, 
        this.categories.MATH_LOGIC, 
        mathLogicCount, 
        { stream, difficulty }
      );
      selectedQuestions.push(...mathLogicQuestions);

      // 2. Scientific/Abstract Questions (3)
      const scientificAbstractQuestions = await this.selectQuestionsByCategory(
        allQuestions, 
        this.categories.SCIENTIFIC_ABSTRACT, 
        scientificAbstractCount, 
        { stream, difficulty }
      );
      selectedQuestions.push(...scientificAbstractQuestions);

      // 3. Spatial Questions (2)
      const spatialQuestions = await this.selectQuestionsByCategory(
        allQuestions, 
        this.categories.SPATIAL, 
        spatialCount, 
        { stream, difficulty }
      );
      selectedQuestions.push(...spatialQuestions);

      // 4. Verbal Questions (3)
      const verbalQuestions = await this.selectQuestionsByCategory(
        allQuestions, 
        this.categories.VERBAL, 
        verbalCount, 
        { stream, difficulty }
      );
      selectedQuestions.push(...verbalQuestions);

      // Shuffle the final selection to randomize order
      const shuffledQuestions = this.shuffleArray(selectedQuestions);

      console.log(`✅ Selected ${shuffledQuestions.length} questions for ${stream} stream`);
      console.log(`   📈 Math/Logic: ${mathLogicQuestions.length}`);
      console.log(`   🔬 Scientific/Abstract: ${scientificAbstractQuestions.length}`);
      console.log(`   🧩 Spatial: ${spatialQuestions.length}`);
      console.log(`   📝 Verbal: ${verbalQuestions.length}`);

      return shuffledQuestions;

    } catch (error) {
      console.error('❌ Error selecting aptitude questions:', error);
      throw error;
    }
  }

  /**
   * Get all aptitude questions from database
   */
  async getAllAptitudeQuestions() {
    return await Question.find({ 
      domain: 'aptitude', 
      isActive: true 
    }).sort({ order: 1 });
  }

  /**
   * Select questions by category with stream optimization
   */
  async selectQuestionsByCategory(allQuestions, categories, count, options = {}) {
    const { stream, difficulty } = options;
    
    // Filter questions by category
    let categoryQuestions = allQuestions.filter(q => 
      categories.includes(q.category)
    );

    // Filter by stream mapping if specified
    if (stream) {
      categoryQuestions = categoryQuestions.filter(q => 
        q.streamMapping && q.streamMapping.includes(stream)
      );
    }

    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'mixed') {
      categoryQuestions = categoryQuestions.filter(q => 
        q.difficulty === difficulty
      );
    }

    // Select random questions from the filtered list
    const shuffled = this.shuffleArray(categoryQuestions);
    return shuffled.slice(0, count);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get question statistics by category
   */
  async getQuestionStats() {
    const stats = {
      total: 0,
      byCategory: {},
      byStream: {},
      byDifficulty: {}
    };

    const questions = await this.getAllAptitudeQuestions();
    stats.total = questions.length;

    // Category statistics
    Object.keys(this.categories).forEach(category => {
      const categoryQuestions = questions.filter(q => 
        this.categories[category].includes(q.category)
      );
      stats.byCategory[category] = categoryQuestions.length;
    });

    // Stream statistics
    const streams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
    streams.forEach(stream => {
      const streamQuestions = questions.filter(q => 
        q.streamMapping && q.streamMapping.includes(stream)
      );
      stats.byStream[stream] = streamQuestions.length;
    });

    // Difficulty statistics
    const difficulties = ['easy', 'medium', 'hard'];
    difficulties.forEach(difficulty => {
      const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
      stats.byDifficulty[difficulty] = difficultyQuestions.length;
    });

    return stats;
  }

  /**
   * Validate question selection criteria
   */
  validateSelectionCriteria(stream) {
    const validStreams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
    if (!validStreams.includes(stream)) {
      throw new Error(`Invalid stream: ${stream}. Must be one of: ${validStreams.join(', ')}`);
    }
    return true;
  }

  /**
   * Get recommended question distribution for a stream
   */
  getRecommendedDistribution(stream) {
    const weights = this.streamWeights[stream];
    if (!weights) {
      throw new Error(`No weights defined for stream: ${stream}`);
    }

    return {
      mathLogic: Math.round(4 * weights.math_logic),
      scientificAbstract: Math.round(3 * weights.scientific_abstract),
      spatial: Math.round(2 * weights.spatial),
      verbal: Math.round(3 * weights.verbal)
    };
  }
}

export default new QuestionSelector();
