import Question from '../models/Question.js';

export const WORK_SUBTHEMES = {
  ACHIEVEMENT: 'Achievement Orientation',
  STABILITY: 'Stability & Structure',
  CREATIVITY: 'Creativity & Freedom',
  HELPING: 'Helping & Service',
  LEADERSHIP: 'Leadership & Influence',
  INTELLECTUAL: 'Intellectual Exploration'
};

class WorkValuesSelector {
  async generate(options = {}) {
    const { perSubtheme = 6 } = options; // default pulls 6 per subtheme; caller can slice

    const needed = Object.values(WORK_SUBTHEMES);

    const all = await Question.find({
      domain: 'values',
      isActive: true,
      type: { $in: ['scenario_based', 'multiple_choice'] },
      tags: { $in: needed }
    }).lean();

    const byTheme = new Map(needed.map(t => [t, []]));
    for (const q of all) {
      const t = (q.tags || []).find(tag => byTheme.has(tag));
      if (t) byTheme.get(t).push(q);
    }

    const pick = (arr, count, chosenIds) => {
      const pool = arr.filter(q => !chosenIds.has(String(q._id)));
      return this.shuffle(pool).slice(0, count);
    };

    const chosen = [];
    const chosenIds = new Set();

    for (const t of needed) {
      const picks = pick(byTheme.get(t) || [], perSubtheme, chosenIds);
      for (const q of picks) { chosen.push(q); chosenIds.add(String(q._id)); }
    }

    return this.shuffle(chosen);
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

export default new WorkValuesSelector();





