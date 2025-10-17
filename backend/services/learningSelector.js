import Question from '../models/Question.js';

export const SUBTHEMES = {
  PERSISTENCE: 'Persistence',
  TIME_MANAGEMENT: 'Time Management',
  DISTRACTION: 'Distraction',
  REVISION_FEEDBACK: 'Revision/Feedback'
};

class LearningSelector {
  async generateSet(options = {}) {
    const { perSubtheme = 2 } = options;

    const all = await Question.find({
      domain: 'skills',
      isActive: true,
      type: { $in: ['scenario_based', 'multiple_choice'] },
      tags: { $in: Object.values(SUBTHEMES) }
    }).lean();

    const byTag = new Map(Object.values(SUBTHEMES).map(t => [t, []]));
    for (const q of all) {
      const tag = (q.tags || []).find(t => byTag.has(t));
      if (tag) byTag.get(tag).push(q);
    }

    const chosen = [];
    const chosenIds = new Set();

    const pickFrom = (arr, count) => {
      const pool = arr.filter(q => !chosenIds.has(String(q._id)));
      const picks = this.shuffle(pool).slice(0, count);
      for (const q of picks) {
        chosen.push(q);
        chosenIds.add(String(q._id));
      }
      return count - picks.length;
    };

    let short = 0;
    short += pickFrom(byTag.get(SUBTHEMES.PERSISTENCE) || [], perSubtheme);
    short += pickFrom(byTag.get(SUBTHEMES.TIME_MANAGEMENT) || [], perSubtheme);
    short += pickFrom(byTag.get(SUBTHEMES.DISTRACTION) || [], perSubtheme);
    short += pickFrom(byTag.get(SUBTHEMES.REVISION_FEEDBACK) || [], perSubtheme);

    if (short > 0) {
      const fallback = all.filter(q => !chosenIds.has(String(q._id)));
      const extra = this.shuffle(fallback).slice(0, short);
      chosen.push(...extra);
    }

    // Final shuffle and trim to 8
    return this.shuffle(chosen).slice(0, perSubtheme * 4);
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

export default new LearningSelector();





