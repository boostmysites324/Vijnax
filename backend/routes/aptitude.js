import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import questionSelector from '../services/questionSelector.js';
import Question from '../models/Question.js';

const router = express.Router();

// @route   POST /api/aptitude/generate-test
// @desc    Generate a 12-question aptitude test based on criteria
// @access  Private
router.post('/generate-test', verifyToken, async (req, res) => {
  try {
    const { 
      stream = 'PCM',
      difficulty = 'mixed',
      testType = 'standard' // 'standard', 'adaptive', 'timed'
    } = req.body;

    // Validate stream
    questionSelector.validateSelectionCriteria(stream);

    console.log(`🎯 Generating aptitude test for ${stream} stream...`);

    // Generate test questions
    const testQuestions = await questionSelector.selectAptitudeQuestions(stream, {
      mathLogicCount: 4,
      scientificAbstractCount: 3,
      spatialCount: 2,
      verbalCount: 3,
      difficulty,
      excludeUsed: true
    });

    if (testQuestions.length !== 12) {
      console.warn(`⚠️  Warning: Expected 12 questions, got ${testQuestions.length}`);
    }

    // Calculate total estimated time
    const totalTime = testQuestions.reduce((sum, q) => sum + (q.metadata?.estimatedTime || 60), 0);

    // Prepare test metadata
    const testMetadata = {
      testId: `aptitude_${stream}_${Date.now()}`,
      stream,
      difficulty,
      testType,
      totalQuestions: testQuestions.length,
      estimatedTime: totalTime,
      categories: {
        mathLogic: testQuestions.filter(q => 
          questionSelector.categories.MATH_LOGIC.includes(q.category)
        ).length,
        scientificAbstract: testQuestions.filter(q => 
          questionSelector.categories.SCIENTIFIC_ABSTRACT.includes(q.category)
        ).length,
        spatial: testQuestions.filter(q => 
          questionSelector.categories.SPATIAL.includes(q.category)
        ).length,
        verbal: testQuestions.filter(q => 
          questionSelector.categories.VERBAL.includes(q.category)
        ).length
      },
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        testMetadata,
        questions: testQuestions.map((q, index) => ({
          questionId: q._id,
          questionNumber: index + 1,
          text: q.text,
          options: q.options.map(opt => ({
            text: opt.text,
            // Don't include isCorrect in response for security
          })),
          category: q.category,
          difficulty: q.difficulty,
          estimatedTime: q.metadata?.estimatedTime || 60,
          skill: q.skill,
          tags: q.tags
        }))
      }
    });

  } catch (error) {
    console.error('Error generating aptitude test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate aptitude test',
      error: error.message
    });
  }
});

// @route   GET /api/aptitude/categories
// @desc    Get available aptitude question categories
// @access  Private
router.get('/categories', verifyToken, async (req, res) => {
  try {
    const categories = {
      mathLogic: questionSelector.categories.MATH_LOGIC,
      scientificAbstract: questionSelector.categories.SCIENTIFIC_ABSTRACT,
      spatial: questionSelector.categories.SPATIAL,
      verbal: questionSelector.categories.VERBAL
    };

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// @route   GET /api/aptitude/stats
// @desc    Get aptitude question statistics
// @access  Private
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await questionSelector.getQuestionStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// @route   GET /api/aptitude/streams/:stream/distribution
// @desc    Get recommended question distribution for a stream
// @access  Private
router.get('/streams/:stream/distribution', verifyToken, async (req, res) => {
  try {
    const { stream } = req.params;
    
    questionSelector.validateSelectionCriteria(stream);
    const distribution = questionSelector.getRecommendedDistribution(stream);
    
    res.json({
      success: true,
      data: {
        stream,
        recommendedDistribution: distribution,
        totalQuestions: Object.values(distribution).reduce((sum, count) => sum + count, 0)
      }
    });
  } catch (error) {
    console.error('Error getting distribution:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/aptitude/submit-answer
// @desc    Submit answer for a question and get feedback
// @access  Private
router.post('/submit-answer', verifyToken, async (req, res) => {
  try {
    const { questionId, selectedOption, responseTime } = req.body;
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Find the selected option
    const selectedOptionData = question.options.find(opt => opt.text === selectedOption);
    const isCorrect = selectedOptionData ? selectedOptionData.isCorrect : false;

    // Update question statistics
    await question.updateStats(responseTime || 60, isCorrect);

    // Prepare response
    const correctOption = question.options.find(opt => opt.isCorrect);
    
    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        correctOption: correctOption?.text,
        explanation: question.explanation,
        skill: question.skill,
        category: question.category,
        streamMapping: question.streamMapping
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer'
    });
  }
});

// @route   POST /api/aptitude/submit-test
// @desc    Submit complete test and get results
// @access  Private
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    const { 
      testId, 
      answers, 
      totalTime, 
      stream 
    } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required'
      });
    }

    // Process each answer
    const results = [];
    let correctCount = 0;
    let totalScore = 0;

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.text === answer.selectedOption);
        const isCorrect = selectedOption ? selectedOption.isCorrect : false;
        const score = selectedOption ? selectedOption.score : 0;

        if (isCorrect) {
          correctCount++;
          totalScore += score;
        }

        results.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect,
          score,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          category: question.category,
          skill: question.skill
        });
      }
    }

    // Calculate performance by category
    const categoryPerformance = {
      mathLogic: { correct: 0, total: 0 },
      scientificAbstract: { correct: 0, total: 0 },
      spatial: { correct: 0, total: 0 },
      verbal: { correct: 0, total: 0 }
    };

    results.forEach(result => {
      const category = result.category;
      if (questionSelector.categories.MATH_LOGIC.includes(category)) {
        categoryPerformance.mathLogic.total++;
        if (result.isCorrect) categoryPerformance.mathLogic.correct++;
      } else if (questionSelector.categories.SCIENTIFIC_ABSTRACT.includes(category)) {
        categoryPerformance.scientificAbstract.total++;
        if (result.isCorrect) categoryPerformance.scientificAbstract.correct++;
      } else if (questionSelector.categories.SPATIAL.includes(category)) {
        categoryPerformance.spatial.total++;
        if (result.isCorrect) categoryPerformance.spatial.correct++;
      } else if (questionSelector.categories.VERBAL.includes(category)) {
        categoryPerformance.verbal.total++;
        if (result.isCorrect) categoryPerformance.verbal.correct++;
      }
    });

    // Calculate percentages
    Object.keys(categoryPerformance).forEach(category => {
      const perf = categoryPerformance[category];
      perf.percentage = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
    });

    const overallPercentage = Math.round((correctCount / answers.length) * 100);

    res.json({
      success: true,
      data: {
        testId,
        stream,
        totalQuestions: answers.length,
        correctAnswers: correctCount,
        totalScore,
        overallPercentage,
        totalTime,
        categoryPerformance,
        results,
        recommendations: generateRecommendations(categoryPerformance, stream)
      }
    });

  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit test'
    });
  }
});

// Helper function to generate recommendations
function generateRecommendations(categoryPerformance, stream) {
  const recommendations = [];
  
  Object.entries(categoryPerformance).forEach(([category, perf]) => {
    if (perf.percentage < 60) {
      recommendations.push({
        category,
        message: `Focus on improving ${category} skills. Current performance: ${perf.percentage}%`,
        priority: 'high'
      });
    } else if (perf.percentage < 80) {
      recommendations.push({
        category,
        message: `Good progress in ${category}. Continue practicing to reach excellence.`,
        priority: 'medium'
      });
    }
  });

  return recommendations;
}

export default router;





