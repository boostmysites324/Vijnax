import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Question from '../models/Question.js';

const router = express.Router();

// @route   GET /api/questions
// @desc    Get questions with filtering options
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const { 
      domain, 
      category, 
      difficulty, 
      stream, 
      limit = 20, 
      page = 1,
      type = 'random' 
    } = req.query;

    const query = { isActive: true };
    
    // Build query based on filters
    if (domain) query.domain = domain;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (stream) query.streamMapping = stream;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let questions;
    
    if (type === 'random') {
      // Get random questions
      questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: parseInt(limit) } },
        { $sort: { order: 1 } }
      ]);
    } else {
      // Get ordered questions
      questions = await Question.find(query)
        .sort({ order: 1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: questions.length,
          totalQuestions: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/questions/streams
// @desc    Get questions by stream mapping
// @access  Private
router.get('/streams/:stream', verifyToken, async (req, res) => {
  try {
    const { stream } = req.params;
    const { limit = 10 } = req.query;

    const questions = await Question.find({
      isActive: true,
      streamMapping: stream
    })
    .sort({ order: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching stream questions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/questions/categories
// @desc    Get available categories
// @access  Private
router.get('/categories', verifyToken, async (req, res) => {
  try {
    const categories = await Question.distinct('category', { isActive: true });
    const streams = await Question.distinct('streamMapping', { isActive: true });
    
    res.json({
      success: true,
      data: {
        categories,
        streams: streams.flat()
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/questions/submit
// @desc    Submit question response and get feedback
// @access  Private
router.post('/submit', verifyToken, async (req, res) => {
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
        streamMapping: question.streamMapping
      }
    });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

