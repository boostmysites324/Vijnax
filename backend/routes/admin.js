import express from 'express';
import Question from '../models/Question.js';
import RIASECQuestion from '../models/RIASECQuestion.js';

const router = express.Router();

// ... existing admin routes ...

// @route   GET /api/admin/question-audit
// @desc    Read-only counts of questions per domain/category/tags used by selectors
// @access  Admin (assumes verify in middleware upstream if needed)
router.get('/question-audit', async (req, res) => {
  try {
    const domains = ['aptitude', 'personality', 'interest', 'values', 'skills'];
    const byDomain = {};
    for (const d of domains) {
      // Count active
      // eslint-disable-next-line no-await-in-loop
      byDomain[d] = await Question.countDocuments({ domain: d, isActive: true });
    }

    // Aptitude by categories
    const aptitudeCats = [
      'mathematical_logic','arithmetic_logic','ratio_reasoning','quantitative_estimation','equation_puzzle',
      'scientific_deduction','scientific_pattern','abstract_reasoning','pattern_recognition','sequence_pattern',
      'spatial_folding','geometry_reasoning','word_puzzle','verbal_inference','graph_interpretation'
    ];
    const aptitude = {};
    for (const c of aptitudeCats) {
      // eslint-disable-next-line no-await-in-loop
      aptitude[c] = await Question.countDocuments({ domain: 'aptitude', category: c, isActive: true });
    }

    // RIASEC distribution from dedicated collection
    const riasecDistAgg = await RIASECQuestion.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$options' },
      { $group: { _id: '$options.riasecType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Values & ESI tag counts (selected tags)
    const valueTags = [
      'Peer Pressure vs Integrity','Responsibility vs Freedom','Truth vs Kindness','Risk vs Security','Rules vs Exceptions',
      'Empathy','Emotional Regulation','Conflict Handling','Self-Awareness','Perspective Taking',
      'Achievement Orientation','Stability & Structure','Creativity & Freedom','Helping & Service','Leadership & Influence','Intellectual Exploration'
    ];
    const values = {};
    for (const t of valueTags) {
      // eslint-disable-next-line no-await-in-loop
      values[t] = await Question.countDocuments({ domain: 'values', isActive: true, tags: t });
    }

    // Learning Orientation tags
    const learningTags = ['Persistence','Time Management','Distraction','Revision/Feedback'];
    const learning = {};
    for (const t of learningTags) {
      // eslint-disable-next-line no-await-in-loop
      learning[t] = await Question.countDocuments({ domain: 'skills', isActive: true, tags: t });
    }

    // Big Five trait-mapped options (approx by questions having at least one option)
    const bigFiveCounts = {
      C: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'C' }),
      O: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'O' }),
      A: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'A' }),
      E: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'E' }),
      S: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'S' }),
      L: await Question.countDocuments({ domain: 'personality', isActive: true, 'options.mappedTrait': 'L' })
    };

    res.json({
      success: true,
      data: {
        totals: byDomain,
        aptitude,
        riasec: riasecDistAgg,
        values,
        learning,
        bigFive: bigFiveCounts
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Question audit failed:', error);
    res.status(500).json({ success: false, message: 'Audit failed' });
  }
});

export default router;





