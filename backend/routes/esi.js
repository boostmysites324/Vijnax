import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import esiSelector, { ESI_SUBTHEMES } from '../services/esiSelector.js';

const router = express.Router();

// @route   POST /api/esi/generate-section-f
// @desc    Generate Section F – ESI (6 questions): 2 Empathy, 1 Regulation, 1 Conflict, 2 Self-Awareness/Perspective
// @access  Private
router.post('/generate-section-f', verifyToken, async (req, res) => {
  try {
    const set = await esiSelector.generateSectionF();

    const counts = {
      [ESI_SUBTHEMES.EMPATHY]: 0,
      [ESI_SUBTHEMES.EMOTIONAL_REGULATION]: 0,
      [ESI_SUBTHEMES.CONFLICT_HANDLING]: 0,
      [ESI_SUBTHEMES.SELF_AWARENESS]: 0,
      [ESI_SUBTHEMES.PERSPECTIVE_TAKING]: 0
    };

    set.forEach(q => {
      for (const t of Object.values(ESI_SUBTHEMES)) {
        if ((q.tags || []).includes(t)) { counts[t]++; break; }
      }
    });

    const formatted = set.map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options?.map(o => ({ text: o.text, mappedStream: o.mappedStream })) || [],
      tags: q.tags
    }));

    res.json({ success: true, data: { total: formatted.length, perSubtheme: counts, questions: formatted } });
  } catch (error) {
    console.error('Error generating Section F ESI set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Section F ESI set' });
  }
});

export default router;





