import Question from '../models/Question.js';

export const BIG_FIVE_TRAITS = [
  'Conscientiousness',
  'Openness',
  'Agreeableness',
  'Extraversion',
  'Stability'
];

const TARGET_PER_TRAIT = 2;

class BigFiveSelector {
  async getSectionCSet(options = {}) {
    const { traits = BIG_FIVE_TRAITS, perTrait = TARGET_PER_TRAIT } = options;

    // Fetch all personality questions tagged with any of the traits
    const all = await Question.find({
      domain: 'personality',
      isActive: true,
      tags: { $in: traits }
    }).sort({ order: 1, createdAt: -1 }).lean();

    if (!all.length) return [];

    // Group by trait (tag)
    const byTrait = new Map();
    for (const trait of traits) byTrait.set(trait, []);

    for (const q of all) {
      const qTraits = (q.tags || []).filter(t => traits.includes(t));
      for (const t of qTraits) {
        const arr = byTrait.get(t) || [];
        arr.push(q);
        byTrait.set(t, arr);
      }
    }

    const chosen = [];
    const chosenIds = new Set();

    const pickFrom = (arr, count) => {
      const pool = arr.filter(q => !chosenIds.has(String(q._id)));
      const shuffled = this.shuffle(pool);
      const picks = shuffled.slice(0, count);
      for (const q of picks) {
        chosen.push(q);
        chosenIds.add(String(q._id));
      }
      return count - picks.length;
    };

    let shortfall = 0;
    for (const t of traits) {
      const arr = byTrait.get(t) || [];
      shortfall += pickFrom(arr, perTrait);
    }

    // Fallback fill from remaining personality questions
    if (shortfall > 0) {
      const fallback = all.filter(q => !chosenIds.has(String(q._id)));
      const extra = this.shuffle(fallback).slice(0, shortfall);
      chosen.push(...extra);
    }

    // Final shuffle and trim to total required
    const totalRequired = traits.length * perTrait;
    return this.shuffle(chosen).slice(0, totalRequired);
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default new BigFiveSelector();





