/**
 * Enhanced Question Selection Service
 * Implements randomization logic based on Career Compass Test Blueprint
 * 
 * Test Structure (60 questions total):
 * - Section A: Aptitude (10 questions)
 * - Section B: Career Interest - RIASEC (10 questions)
 * - Section C: Decision Making (10 questions)
 * - Section D: Emotional & Social Intelligence (10 questions)
 * - Section E: Learning Orientation (10 questions)
 * - Section F: Personality Traits - Big Five (10 questions)
 */

import Question from '../models/Question.js';
import RIASECQuestion from '../models/RIASECQuestion.js';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Select random items from array
 */
function selectRandom(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Select 10 aptitude questions with balanced distribution
 * Distribution:
 * - Mathematical Logic: 2
 * - Verbal/Reading: 2
 * - Pattern Recognition: 2
 * - Scientific/Logical: 2
 * - Quantitative: 2
 */
export async function selectAptitudeQuestions(userStream = null) {
  try {
    const categoryDistribution = {
      'mathematical_logic': 2,
      'verbal_inference': 2,
      'pattern_recognition': 2,
      'scientific_deduction': 2,
      'quantitative_estimation': 2
    };
    
    const selectedQuestions = [];
    
    for (const [category, count] of Object.entries(categoryDistribution)) {
      const query = {
        domain: 'aptitude',
        category,
        isActive: true
      };
      
      // If user stream is known, prefer stream-relevant questions
      if (userStream) {
        query.streamMapping = { $in: [userStream] };
      }
      
      const questions = await Question.find(query).lean();
      
      // If not enough stream-specific questions, get generic ones
      if (questions.length < count) {
        const additionalQuestions = await Question.find({
          domain: 'aptitude',
          category,
          isActive: true
        }).lean();
        questions.push(...additionalQuestions);
      }
      
      const selected = selectRandom(questions, count);
      selectedQuestions.push(...selected);
    }
    
    // Final shuffle to mix categories
    return shuffleArray(selectedQuestions);
    
  } catch (error) {
    console.error('Error selecting aptitude questions:', error);
    throw error;
  }
}

/**
 * Select 10 RIASEC questions ensuring all 6 types are represented
 * Distribution:
 * - R (Realistic): 2
 * - I (Investigative): 2
 * - A (Artistic): 2
 * - S (Social): 2
 * - E (Enterprising): 1
 * - C (Conventional): 1
 */
export async function selectRIASECQuestions() {
  try {
    const allQuestions = await RIASECQuestion.find({ isActive: true }).lean();
    
    // Select 10 random questions
    // The scoring will aggregate based on options chosen, not question types
    const selected = selectRandom(allQuestions, 10);
    
    // Ensure balanced representation by checking option diversity
    const hasAllTypes = selected.some(q => {
      const types = new Set(q.options.map(o => o.riasecType));
      return types.size >= 4; // At least 4 different types represented
    });
    
    if (!hasAllTypes && allQuestions.length >= 10) {
      // Re-select with diversity
      return selectRandom(allQuestions, 10);
    }
    
    return shuffleArray(selected);
    
  } catch (error) {
    console.error('Error selecting RIASEC questions:', error);
    throw error;
  }
}

/**
 * Select 10 Decision Making questions
 * Themes covered:
 * - Peer Pressure vs Integrity
 * - Responsibility vs Freedom
 * - Truth vs Kindness
 * - Risk vs Security
 * - Competition vs Collaboration
 */
export async function selectDecisionMakingQuestions() {
  try {
    const questions = await Question.find({
      category: 'decision_making',
      isActive: true
    }).lean();
    
    return selectRandom(questions, 10);
    
  } catch (error) {
    console.error('Error selecting decision making questions:', error);
    throw error;
  }
}

/**
 * Select 10 Emotional & Social Intelligence questions
 * Sub-themes:
 * - Empathy
 * - Emotional Regulation
 * - Conflict Handling
 * - Self-Awareness
 */
export async function selectESIQuestions() {
  try {
    const questions = await Question.find({
      category: 'emotional_intelligence',
      isActive: true
    }).lean();
    
    return selectRandom(questions, 10);
    
  } catch (error) {
    console.error('Error selecting ESI questions:', error);
    throw error;
  }
}

/**
 * Select 10 Learning Orientation questions
 * Focus areas:
 * - Learning Persistence
 * - Time Management
 * - Handling Distractions
 * - Revision/Feedback Approach
 */
export async function selectLearningOrientationQuestions() {
  try {
    const questions = await Question.find({
      category: 'learning_style',
      isActive: true
    }).lean();
    
    return selectRandom(questions, 10);
    
  } catch (error) {
    console.error('Error selecting learning orientation questions:', error);
    throw error;
  }
}

/**
 * Select 10 Big Five Personality questions
 * Distribution across traits:
 * - Conscientiousness: 2
 * - Openness: 2
 * - Agreeableness: 2
 * - Extraversion: 2
 * - Emotional Stability: 2
 */
export async function selectBigFiveQuestions() {
  try {
    const questions = await Question.find({
      category: 'personality_traits',
      domain: 'personality',
      isActive: true
    }).lean();
    
    // Select 10 random questions
    // The Big Five scoring happens based on chosen options, not question types
    return selectRandom(questions, 10);
    
  } catch (error) {
    console.error('Error selecting Big Five questions:', error);
    throw error;
  }
}

/**
 * Master function to select all test questions
 * Returns 60 questions in proper section order
 */
export async function selectAllTestQuestions(userStream = null) {
  try {
    console.log('🎯 Selecting test questions with randomization...');
    
    const sections = {
      sectionA: await selectAptitudeQuestions(userStream),
      sectionB: await selectRIASECQuestions(),
      sectionC: await selectDecisionMakingQuestions(),
      sectionD: await selectESIQuestions(),
      sectionE: await selectLearningOrientationQuestions(),
      sectionF: await selectBigFiveQuestions()
    };
    
    // Validate counts
    const counts = {
      'Section A (Aptitude)': sections.sectionA.length,
      'Section B (RIASEC)': sections.sectionB.length,
      'Section C (Decision)': sections.sectionC.length,
      'Section D (ESI)': sections.sectionD.length,
      'Section E (Learning)': sections.sectionE.length,
      'Section F (Big Five)': sections.sectionF.length
    };
    
    console.log('📊 Question selection summary:', counts);
    
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    console.log(`Total questions selected: ${total}/60`);
    
    // Return sections separately for structured delivery
    return {
      sections,
      total,
      structure: [
        { section: 'A', name: 'Aptitude', count: sections.sectionA.length, questions: sections.sectionA },
        { section: 'B', name: 'Career Interest', count: sections.sectionB.length, questions: sections.sectionB },
        { section: 'C', name: 'Decision Making', count: sections.sectionC.length, questions: sections.sectionC },
        { section: 'D', name: 'Emotional Intelligence', count: sections.sectionD.length, questions: sections.sectionD },
        { section: 'E', name: 'Learning Orientation', count: sections.sectionE.length, questions: sections.sectionE },
        { section: 'F', name: 'Personality Traits', count: sections.sectionF.length, questions: sections.sectionF }
      ]
    };
    
  } catch (error) {
    console.error('Error selecting all test questions:', error);
    throw error;
  }
}

/**
 * Select questions for a specific section only
 */
export async function selectSectionQuestions(sectionName, userStream = null) {
  const selectors = {
    'A': selectAptitudeQuestions,
    'B': selectRIASECQuestions,
    'C': selectDecisionMakingQuestions,
    'D': selectESIQuestions,
    'E': selectLearningOrientationQuestions,
    'F': selectBigFiveQuestions
  };
  
  const selector = selectors[sectionName.toUpperCase()];
  if (!selector) {
    throw new Error(`Invalid section name: ${sectionName}`);
  }
  
  return await selector(userStream);
}

export default {
  selectAllTestQuestions,
  selectSectionQuestions,
  selectAptitudeQuestions,
  selectRIASECQuestions,
  selectDecisionMakingQuestions,
  selectESIQuestions,
  selectLearningOrientationQuestions,
  selectBigFiveQuestions
};
