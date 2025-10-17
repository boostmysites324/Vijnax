import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import valuesSelector from '../services/valuesSelector.js';

const router = express.Router();

// @route   POST /api/values/generate-section-c
// @desc    Generate Section C – Values/Ethics scenario set (12 questions)
// @access  Private
router.post('/generate-section-c', verifyToken, async (req, res) => {
  try {
    const { themes = [] } = req.body || {};

    const questions = await valuesSelector.getSectionCSet({ themes, limit: 12 });

    const formatted = questions.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options.map(o => ({ text: o.text, mappedStream: o.mappedStream })),
      tags: q.tags,
      themeTags: (q.tags || []).filter(t => /^Theme\d+/.test(t))
    }));

    // Count options by mapped stream for transparency
    const streamCounts = { PCM: 0, PCB: 0, Commerce: 0, Humanities: 0 };
    formatted.forEach(q => {
      q.options.forEach(o => { if (o.mappedStream && streamCounts[o.mappedStream] !== undefined) streamCounts[o.mappedStream]++; });
    });

    res.json({
      success: true,
      data: {
        total: formatted.length,
        streamOptionCounts: streamCounts,
        questions: formatted
      }
    });
  } catch (error) {
    console.error('Error generating Section C set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Section C set' });
  }
});

export default router;





