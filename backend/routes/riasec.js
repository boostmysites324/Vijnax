import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import RIASECQuestion from '../models/RIASECQuestion.js';
import riasecAnalyzer from '../services/riasecAnalyzer.js';
import riasecSelector, { SECTION_B_DISTRIBUTION } from '../services/riasecSelector.js';

const router = express.Router();

// @route   GET /api/riasec/questions
// @desc    Get RIASEC assessment questions
// @access  Private
router.get('/questions', verifyToken, async (req, res) => {
  try {
    const { limit = 60, category = 'career_interest' } = req.query;

    const questions = await RIASECQuestion.find({
      isActive: true,
      category
    })
    .sort({ questionNumber: 1 })
    .limit(parseInt(limit));

    // Format questions for frontend
    const formattedQuestions = questions.map(q => ({
      questionId: q._id,
      questionNumber: q.questionNumber,
      text: q.text,
      options: q.options.map(opt => ({
        text: opt.text,
        riasecType: opt.riasecType,
        description: opt.description
      })),
      estimatedTime: q.metadata?.estimatedTime || 30
    }));

    res.json({
      success: true,
      data: {
        questions: formattedQuestions,
        totalQuestions: formattedQuestions.length,
        estimatedTime: formattedQuestions.reduce((sum, q) => sum + q.estimatedTime, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching RIASEC questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RIASEC questions'
    });
  }
});

// @route   POST /api/riasec/submit-assessment
// @desc    Submit RIASEC assessment responses and get analysis
// @access  Private
router.post('/submit-assessment', verifyToken, async (req, res) => {
  try {
    const { 
      responses, 
      userInfo = {},
      aptitudeScores = null 
    } = req.body;

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: 'Responses array is required'
      });
    }

    console.log(`🧪 Analyzing RIASEC responses for user: ${userInfo.name || 'Anonymous'}`);

    // Calculate RIASEC scores
    const riasecAnalysis = riasecAnalyzer.calculateScores(responses);
    
    // Generate stream recommendations
    const streamRecommendations = riasecAnalyzer.generateStreamRecommendations(
      riasecAnalysis, 
      aptitudeScores
    );

    // Generate comprehensive report
    const report = riasecAnalyzer.generateReport(
      riasecAnalysis, 
      streamRecommendations, 
      userInfo
    );

    // Update question usage statistics
    await updateQuestionStats(responses);

    res.json({
      success: true,
      data: {
        report,
        analysis: riasecAnalysis,
        recommendations: streamRecommendations,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing RIASEC assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process RIASEC assessment',
      error: error.message
    });
  }
});

// @route   GET /api/riasec/types
// @desc    Get RIASEC type definitions
// @access  Private
router.get('/types', verifyToken, async (req, res) => {
  try {
    const types = riasecAnalyzer.riasecTypes;
    
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching RIASEC types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RIASEC types'
    });
  }
});

// @route   GET /api/riasec/streams
// @desc    Get stream mapping information
// @access  Private
router.get('/streams', verifyToken, async (req, res) => {
  try {
    const streamMapping = riasecAnalyzer.streamMapping;
    
    res.json({
      success: true,
      data: streamMapping
    });
  } catch (error) {
    console.error('Error fetching stream mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stream mapping'
    });
  }
});

// @route   GET /api/riasec/stats
// @desc    Get RIASEC question statistics
// @access  Private
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await RIASECQuestion.getRIASECDistribution();
    const totalQuestions = await RIASECQuestion.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      data: {
        totalQuestions,
        riasecDistribution: stats,
        questionTypes: await RIASECQuestion.distinct('category', { isActive: true })
      }
    });
  } catch (error) {
    console.error('Error fetching RIASEC stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RIASEC statistics'
    });
  }
});

// @route   POST /api/riasec/analyze-scores
// @desc    Analyze RIASEC scores without full assessment
// @access  Private
router.post('/analyze-scores', verifyToken, async (req, res) => {
  try {
    const { riasecScores, aptitudeScores = null } = req.body;

    if (!riasecScores || typeof riasecScores !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'RIASEC scores object is required'
      });
    }

    // Convert scores to analysis format
    const responses = Object.entries(riasecScores).flatMap(([type, count]) => 
      Array(count).fill({ selectedRIASECType: type })
    );

    const riasecAnalysis = riasecAnalyzer.calculateScores(responses);
    const streamRecommendations = riasecAnalyzer.generateStreamRecommendations(
      riasecAnalysis, 
      aptitudeScores
    );

    res.json({
      success: true,
      data: {
        analysis: riasecAnalysis,
        recommendations: streamRecommendations
      }
    });

  } catch (error) {
    console.error('Error analyzing RIASEC scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze RIASEC scores'
    });
  }
});

// @route   GET /api/riasec/report/:reportId
// @desc    Get saved assessment report
// @access  Private
router.get('/report/:reportId', verifyToken, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    // In a real implementation, you would fetch from a reports collection
    // For now, return a placeholder
    res.json({
      success: true,
      message: 'Report retrieval not implemented yet',
      data: { reportId }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report'
    });
  }
});

// @route   POST /api/riasec/generate-section-b
// @desc    Generate Section B – Career Interests (RIASEC) set: 10 Qs (2R,2I,2A,2S,1E,1C)
// @access  Private
router.post('/generate-section-b', verifyToken, async (req, res) => {
  try {
    const { category = 'career_interest' } = req.body || {};

    const questions = await riasecSelector.getQuestionsForSectionB({ category, limitPerType: SECTION_B_DISTRIBUTION });

    // Normalize response shape
    const formatted = questions.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.questionNumber,
      text: q.text,
      options: q.options.map(o => ({ text: o.text, riasecType: o.riasecType })),
      estimatedTime: q.metadata?.estimatedTime || 30,
      order: idx + 1
    }));

    // Count per type for transparency
    const perType = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.forEach(q => {
      const types = new Set(q.options.map(o => o.riasecType));
      for (const t of Object.keys(perType)) if (types.has(t)) perType[t]++;
    });

    res.json({
      success: true,
      data: {
        total: formatted.length,
        perType,
        target: SECTION_B_DISTRIBUTION,
        questions: formatted
      }
    });
  } catch (error) {
    console.error('Error generating Section B RIASEC set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Section B' });
  }
});

// Helper function to update question usage statistics
async function updateQuestionStats(responses) {
  try {
    const questionIds = responses.map(r => r.questionId).filter(Boolean);
    
    if (questionIds.length > 0) {
      await RIASECQuestion.updateMany(
        { _id: { $in: questionIds } },
        { $inc: { usageCount: 1 } }
      );
    }
  } catch (error) {
    console.error('Error updating question stats:', error);
    // Don't throw error as this is not critical
  }
}

export default router;
