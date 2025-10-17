import Question from '../models/Question.js';

// Section C expects 12 scenario-based questions from themes
// We will use domain = 'values' and type = 'scenario_based' to filter

class ValuesSelector {
  async getSectionCSet(options = {}) {
    const { themes = [], limit = 12 } = options;

    const query = { domain: 'values', type: 'scenario_based', isActive: true };
    if (themes.length) query.tags = { $in: themes };

    const all = await Question.find(query).sort({ order: 1, createdAt: -1 }).lean();
    if (!all.length) return [];

    // Ensure spread across themes if provided via tags like 'Theme1', 'Theme2', etc.
    const byTheme = new Map();
    for (const q of all) {
      const qThemes = (q.tags || []).filter(t => /^Theme\d+/.test(t));
      if (qThemes.length === 0) {
        const arr = byTheme.get('Misc') || [];
        arr.push(q);
        byTheme.set('Misc', arr);
      } else {
        for (const t of qThemes) {
          const arr = byTheme.get(t) || [];
          arr.push(q);
          byTheme.set(t, arr);
        }
      }
    }

    const chosen = [];
    const chosenIds = new Set();

    const pick = (arr, count) => {
      const pool = arr.filter(q => !chosenIds.has(String(q._id)));
      const shuffled = this.shuffle(pool);
      const picks = shuffled.slice(0, count);
      for (const q of picks) {
        chosen.push(q);
        chosenIds.add(String(q._id));
      }
      return count - picks.length;
    };

    // Try round-robin across themes
    const themeKeys = Array.from(byTheme.keys());
    let remaining = limit;
    while (remaining > 0 && chosen.length < all.length) {
      let progress = false;
      for (const key of themeKeys) {
        if (remaining <= 0) break;
        const arr = byTheme.get(key) || [];
        const short = pick(arr, 1);
        if (short === 0) {
          remaining -= 1;
          progress = true;
        }
      }
      if (!progress) break;
    }

    // Fallback fill if still short
    if (chosen.length < limit) {
      const fallback = all.filter(q => !chosenIds.has(String(q._id)));
      const extra = this.shuffle(fallback).slice(0, limit - chosen.length);
      chosen.push(...extra);
    }

    return this.shuffle(chosen).slice(0, limit);
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

export default new ValuesSelector();





