import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import decisionSelector, { THEMES } from '../services/decisionSelector.js';

const router = express.Router();

// @route   POST /api/decision/generate-section-d
// @desc    Generate Section D – Decision-Making & Judgment (8 questions)
// @access  Private
router.post('/generate-section-d', verifyToken, async (req, res) => {
  try {
    const set = await decisionSelector.generateSet({ requiredPerTheme: 2 });

    // Count per theme
    const perTheme = Object.fromEntries(Object.values(THEMES).map(t => [t, 0]));
    set.forEach(q => {
      const t = (q.tags || []).find(tag => perTheme[tag] !== undefined);
      if (t) perTheme[t]++;
    });

    const formatted = set.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options.map(o => ({ text: o.text, mappedStream: o.mappedStream })),
      themes: (q.tags || []).filter(tag => THEMES_VALUES.includes(tag))
    }));

    res.json({
      success: true,
      data: {
        total: formatted.length,
        perTheme,
        target: {
          [THEMES.PEER_PRESSURE_INTEGRITY]: 2,
          [THEMES.RESPONSIBILITY_FREEDOM]: 2,
          [THEMES.TRUTH_KINDNESS]: 2,
          'Risk vs Security OR Rules vs Exceptions': 2
        },
        questions: formatted
      }
    });
  } catch (error) {
    console.error('Error generating Section D set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Section D set' });
  }
});

// Helper to filter only theme tags we care about
const THEMES_VALUES = Object.values(THEMES);

export default router;





