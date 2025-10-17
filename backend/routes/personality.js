import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import bigFiveSelector, { BIG_FIVE_TRAITS } from '../services/bigFiveSelector.js';
import bigFiveScorer from '../services/bigFiveScorer.js';

const router = express.Router();

// @route   POST /api/personality/generate-section-c
// @desc    Generate Section C – Personality (Big Five) set: 10 Qs (2 per trait)
// @access  Private
router.post('/generate-section-c', verifyToken, async (req, res) => {
  try {
    const { traits = BIG_FIVE_TRAITS } = req.body || {};

    const questions = await bigFiveSelector.getSectionCSet({ traits, perTrait: 2 });

    const formatted = questions.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options?.map(o => ({ text: o.text })) || [],
      traits: (q.tags || []).filter(t => traits.includes(t))
    }));

    // Count per trait
    const counts = Object.fromEntries(traits.map(t => [t, 0]));
    formatted.forEach(q => {
      q.traits.forEach(t => { if (counts[t] !== undefined) counts[t]++; });
    });

    res.json({
      success: true,
      data: {
        total: formatted.length,
        perTrait: counts,
        target: Object.fromEntries(traits.map(t => [t, 2])),
        questions: formatted
      }
    });
  } catch (error) {
    console.error('Error generating Big Five set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Big Five set' });
  }
});

// @route   POST /api/personality/submit-bigfive
// @desc    Submit Big Five answers and get trait scores + stream recommendations
// @access  Private
router.post('/submit-bigfive', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body || {};
    if (!Array.isArray(answers) || !answers.length) {
      return res.status(400).json({ success: false, message: 'answers[] required' });
    }

    const resolved = await bigFiveScorer.resolveTraitsFromAnswers(answers);
    const result = bigFiveScorer.scoreResponses(resolved);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error scoring Big Five:', error);
    res.status(500).json({ success: false, message: 'Failed to score Big Five' });
  }
});

export default router;
