import Question from '../models/Question.js';

export const ESI_SUBTHEMES = {
  EMPATHY: 'Empathy',
  EMOTIONAL_REGULATION: 'Emotional Regulation',
  CONFLICT_HANDLING: 'Conflict Handling',
  SELF_AWARENESS: 'Self-Awareness',
  PERSPECTIVE_TAKING: 'Perspective Taking'
};

class ESISelector {
  async generateSectionF(options = {}) {
    const { per = { Empathy: 2, 'Emotional Regulation': 1, 'Conflict Handling': 1, 'Self-Awareness/Perspective': 2 } } = options;

    const tagsNeeded = ['Empathy', 'Emotional Regulation', 'Conflict Handling', 'Self-Awareness', 'Perspective Taking'];

    const all = await Question.find({
      domain: 'values',
      isActive: true,
      type: { $in: ['scenario_based', 'multiple_choice'] },
      tags: { $in: tagsNeeded }
    }).lean();

    const map = new Map(tagsNeeded.map(t => [t, []]));
    for (const q of all) {
      const t = (q.tags || []).find(tag => map.has(tag));
      if (t) map.get(t).push(q);
    }

    const chosen = [];
    const chosenIds = new Set();

    const pickFrom = (arr, count) => {
      const pool = arr.filter(q => !chosenIds.has(String(q._id)));
      const picks = this.shuffle(pool).slice(0, count);
      for (const q of picks) { chosen.push(q); chosenIds.add(String(q._id)); }
      return count - picks.length;
    };

    // 2 Empathy
    pickFrom(map.get(ESI_SUBTHEMES.EMPATHY) || [], 2);
    // 1 Emotional Regulation
    pickFrom(map.get(ESI_SUBTHEMES.EMOTIONAL_REGULATION) || [], 1);
    // 1 Conflict Handling
    pickFrom(map.get(ESI_SUBTHEMES.CONFLICT_HANDLING) || [], 1);
    // 2 Self-Awareness / Perspective-Taking (combined)
    let remaining = 2;
    remaining = pickFrom(map.get(ESI_SUBTHEMES.SELF_AWARENESS) || [], remaining);
    if (remaining > 0) pickFrom(map.get(ESI_SUBTHEMES.PERSPECTIVE_TAKING) || [], remaining);

    return this.shuffle(chosen).slice(0, 6);
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

export default new ESISelector();





