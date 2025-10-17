import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import workValuesSelector, { WORK_SUBTHEMES } from '../services/workValuesSelector.js';

const router = express.Router();

// @route   POST /api/values-work/generate
// @desc    Generate Section G – Work Values set; supports explicit per-subtheme counts
// @access  Private
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { 
      subthemes = [
        WORK_SUBTHEMES.ACHIEVEMENT, 
        WORK_SUBTHEMES.STABILITY,
        WORK_SUBTHEMES.CREATIVITY,
        WORK_SUBTHEMES.HELPING,
        WORK_SUBTHEMES.LEADERSHIP
      ],
      total = 6,
      countPerSubtheme = 0, // used only if perSubthemeCounts not provided
      perSubthemeCounts = null // e.g., { "Achievement Orientation": 2, "Stability & Structure": 1, ... }
    } = req.body || {};

    // Preload pool
    const pool = await workValuesSelector.generate({ perSubtheme: Math.max(countPerSubtheme, total) });

    // Group pool by subtheme
    const grouped = new Map(subthemes.map(s => [s, []]));
    for (const q of pool) {
      const t = (q.tags || []).find(tag => grouped.has(tag));
      if (t) grouped.get(t).push(q);
    }

    const selected = [];
    const chosenIds = new Set();

    const take = (arr, n) => {
      for (const q of arr) {
        if (selected.length >= total) break;
        if (!chosenIds.has(String(q._id)) && n > 0) {
          selected.push(q);
          chosenIds.add(String(q._id));
          n--;
        }
      }
    };

    if (perSubthemeCounts && typeof perSubthemeCounts === 'object') {
      // Explicit counts per subtheme
      for (const s of subthemes) {
        const want = perSubthemeCounts[s] || 0;
        take(grouped.get(s) || [], want);
      }
    } else {
      // Even distribution fallback
      const each = Math.floor(total / subthemes.length) || 1;
      for (const s of subthemes) take(grouped.get(s) || [], each);
    }

    // Top up if short
    if (selected.length < total) {
      const remainder = pool.filter(q => !chosenIds.has(String(q._id)) && (q.tags || []).some(t => subthemes.includes(t)));
      for (const q of remainder) {
        if (selected.length >= total) break;
        selected.push(q);
      }
    }

    const formatted = selected.slice(0, total).map((q, idx) => ({
      questionId: q._id,
      questionNumber: q.order || idx + 1,
      text: q.text,
      options: q.options?.map(o => ({ text: o.text, mappedStream: o.mappedStream })) || [],
      tags: q.tags
    }));

    const counts = Object.fromEntries(subthemes.map(s => [s, 0]));
    formatted.forEach(q => {
      const t = (q.tags || []).find(tag => counts[tag] !== undefined);
      if (t) counts[t]++;
    });

    res.json({ success: true, data: { total: formatted.length, perSubtheme: counts, questions: formatted } });
  } catch (error) {
    console.error('Error generating Work Values set:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Work Values set' });
  }
});

export default router;
