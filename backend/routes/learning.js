import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import learningSelector, { SUBTHEMES } from '../services/learningSelector.js';

const router = express.Router();

// @route   POST /api/learning/generate-section-e
// @desc    Generate Section E – Learning Orientation (8 questions)
// @access  Private
router.post('/generate-section-e', verifyToken, async (req, res) => {
  try {
    const set = await learningSelector.generateSet({ perSubtheme: 2 });

    const perSubtheme = Object.fromEntries(Object.values(SUBTHEMES).map(t => [t, 0]));
    set.forEach(q => {
      const tag = (q.tags || []).find(t => perSubtheme[t] !== undefined);
      if (tag) perSubtheme[tag]++;
    });

    const formatted = set.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options?.map(o => ({ text: o.text, mappedStream: o.mappedStream })) || [],
      tags: q.tags
    }));

    res.json({
      success: true,
      data: {
        total: formatted.length,
        perSubtheme,
        target: {
          [SUBTHEMES.PERSISTENCE]: 2,
          [SUBTHEMES.TIME_MANAGEMENT]: 2,
          [SUBTHEMES.DISTRACTION]: 2,
          [SUBTHEMES.REVISION_FEEDBACK]: 2
        },
        questions: formatted
      }
    });
  } catch (error) {
    console.error('Error generating Section E set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Section E set' });
  }
});

export default router;





