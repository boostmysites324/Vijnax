import RIASECQuestion from '../models/RIASECQuestion.js';

// Desired distribution for Section B – Career Interests (RIASEC)
// 2 R, 2 I, 2 A, 2 S, 1 E, 1 C
export const SECTION_B_DISTRIBUTION = {
  R: 2,
  I: 2,
  A: 2,
  S: 2,
  E: 1,
  C: 1
};

class RIASECSelector {
  async getQuestionsForSectionB(options = {}) {
    const { limitPerType = SECTION_B_DISTRIBUTION, category = 'career_interest' } = options;

    // Fetch once to avoid multiple queries; index exists on category and isActive
    const all = await RIASECQuestion.find({ isActive: true, category }).sort({ questionNumber: 1 }).lean();

    // Group by whether a question contains an option of a type
    const byType = { R: [], I: [], A: [], S: [], E: [], C: [] };
    for (const q of all) {
      const typesInQ = new Set(q.options.map(o => o.riasecType));
      for (const t of Object.keys(byType)) {
        if (typesInQ.has(t)) byType[t].push(q);
      }
    }

    // Select per type without duplicates
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
      return count - picks.length; // remaining needed
    };

    let remainingShortfall = 0;
    for (const [type, need] of Object.entries(limitPerType)) {
      const short = pickFrom(byType[type] || [], need);
      if (short > 0) remainingShortfall += short;
    }

    // Fallback: fill any shortfall from remaining questions not yet chosen
    if (remainingShortfall > 0) {
      const fallbackPool = all.filter(q => !chosenIds.has(String(q._id)));
      const shuffled = this.shuffle(fallbackPool);
      const fallback = shuffled.slice(0, remainingShortfall);
      for (const q of fallback) {
        chosen.push(q);
        chosenIds.add(String(q._id));
      }
    }

    // Final shuffle to randomize order and trim to 10
    const finalShuffled = this.shuffle(chosen).slice(0, Object.values(limitPerType).reduce((a, b) => a + b, 0));

    return finalShuffled;
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

export default new RIASECSelector();





