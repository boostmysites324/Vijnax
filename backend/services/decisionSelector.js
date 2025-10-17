import Question from '../models/Question.js';

const THEMES = {
  PEER_PRESSURE_INTEGRITY: 'Peer Pressure vs Integrity',
  RESPONSIBILITY_FREEDOM: 'Responsibility vs Freedom',
  TRUTH_KINDNESS: 'Truth vs Kindness',
  RISK_SECURITY: 'Risk vs Security',
  RULES_EXCEPTIONS: 'Rules vs Exceptions'
};

class DecisionSelector {
  async generateSet(options = {}) {
    const {
      domain = 'values',
      type = 'scenario_based',
      requiredPerTheme = 2
    } = options;

    // We expect questions tagged with Theme keys like 'Peer Pressure vs Integrity'
    const all = await Question.find({ domain, type, isActive: true }).lean();

    const byTheme = new Map(Object.values(THEMES).map(t => [t, []]));
    for (const q of all) {
      const t = (q.tags || []).find(tag => byTheme.has(tag));
      if (t) byTheme.get(t).push(q);
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

    // 2 each for three fixed themes
    pickFrom(byTheme.get(THEMES.PEER_PRESSURE_INTEGRITY) || [], requiredPerTheme);
    pickFrom(byTheme.get(THEMES.RESPONSIBILITY_FREEDOM) || [], requiredPerTheme);
    pickFrom(byTheme.get(THEMES.TRUTH_KINDNESS) || [], requiredPerTheme);

    // 2 from Risk vs Security OR Rules vs Exceptions (prefer Risk first)
    let remaining = requiredPerTheme;
    remaining = pickFrom(byTheme.get(THEMES.RISK_SECURITY) || [], remaining);
    if (remaining > 0) {
      pickFrom(byTheme.get(THEMES.RULES_EXCEPTIONS) || [], remaining);
    }

    // Finalize: ensure exactly 8
    return this.shuffle(chosen).slice(0, requiredPerTheme * 4);
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

export default new DecisionSelector();
export { THEMES };





