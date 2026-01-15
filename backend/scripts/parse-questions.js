import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../../content');

/**
 * Parse Section A - Aptitude Questions
 * Format: Q1. Question text
 *         A) Option 1
 *         B) Option 2
 *         Answer: X
 *         Streams: PCM, Commerce
 */
function parseAptitudeQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\./g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      
      // Extract question text (first line)
      const questionText = lines[0].trim();
      
      // Extract options
      const options = [];
      let correctAnswer = '';
      let streams = [];
      let skill = '';
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match options A), B), C), D)
        const optionMatch = line.match(/^([A-D])\)\s*(.+)/);
        if (optionMatch) {
          options.push({
            text: optionMatch[2].trim(),
            label: optionMatch[1]
          });
        }
        
        // Match Answer
        const answerMatch = line.match(/Answer:\s*([A-D])/i);
        if (answerMatch) {
          correctAnswer = answerMatch[1];
        }
        
        // Match Streams
        const streamMatch = line.match(/Streams?:\s*(.+)/i);
        if (streamMatch) {
          streams = streamMatch[1].split(',').map(s => s.trim());
        }
        
        // Match Skill
        const skillMatch = line.match(/Skill:\s*(.+)/i);
        if (skillMatch) {
          skill = skillMatch[1].trim();
        }
      }
      
      if (questionText && options.length > 0) {
        // Mark correct option
        options.forEach(opt => {
          opt.isCorrect = opt.label === correctAnswer;
          opt.score = opt.isCorrect ? 1 : 0;
        });
        
        // Determine category based on keywords
        let category = 'mathematical_logic';
        const qLower = questionText.toLowerCase();
        
        if (qLower.includes('pattern') || qLower.includes('series')) {
          category = 'pattern_recognition';
        } else if (qLower.includes('spatial') || qLower.includes('cube') || qLower.includes('folding')) {
          category = 'spatial_ability';
        } else if (qLower.includes('verbal') || qLower.includes('analogy') || qLower.includes('word')) {
          category = 'verbal_inference';
        } else if (qLower.includes('scientific') || qLower.includes('experiment') || qLower.includes('biology')) {
          category = 'scientific_deduction';
        } else if (qLower.includes('graph') || qLower.includes('data')) {
          category = 'data_interpretation';
        } else if (qLower.includes('percentage') || qLower.includes('profit') || qLower.includes('ratio')) {
          category = 'quantitative_estimation';
        }
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'aptitude',
          category,
          difficulty: 'medium',
          type: 'multiple_choice',
          isActive: true,
          correctAnswer,
          streamMapping: streams.length > 0 ? streams : ['PCM', 'PCB', 'Commerce', 'Humanities'],
          skill: skill || category,
          tags: streams,
          metadata: {
            estimatedTime: 60,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing aptitude question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section B - RIASEC Questions
 * Format: Q1. Question text
 *         A) Option (Realistic)
 *         B) Option (Investigative)
 */
function parseRIASECQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\./g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match options with RIASEC type: A) Option text (Realistic)
        const optionMatch = line.match(/^([A-D])\)\s*(.+?)\s*\(([RIASEC][a-z]*)\)/i);
        if (optionMatch) {
          const riasecType = optionMatch[3].charAt(0).toUpperCase();
          options.push({
            text: optionMatch[2].trim(),
            riasecType,
            description: optionMatch[3]
          });
        }
      }
      
      if (questionText && options.length > 0) {
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          category: 'career_interest',
          isActive: true,
          order: index,
          tags: [...new Set(options.map(o => o.riasecType))],
          metadata: {
            estimatedTime: 30,
            weightage: 1.0,
            reliability: 0.85,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing RIASEC question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section C - Big Five Personality Questions
 * Format: Q1. Question text
 *         A) Option (Conscientiousness)
 */
function parseBigFiveQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\./g).filter(Boolean);
  
  const traitMap = {
    'conscientiousness': 'C',
    'openness': 'O',
    'agreeableness': 'A',
    'extraversion': 'E',
    'emotional stability': 'S',
    'stability': 'S',
    'low stability': 'L'
  };
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match options with trait: A) Option text (Conscientiousness)
        const optionMatch = line.match(/^([A-D])\)\s*(.+?)\s*\(([^)]+)\)/i);
        if (optionMatch) {
          const traitName = optionMatch[3].toLowerCase();
          let mappedTrait = 'C';
          
          // Find matching trait
          for (const [key, value] of Object.entries(traitMap)) {
            if (traitName.includes(key)) {
              mappedTrait = value;
              break;
            }
          }
          
          options.push({
            text: optionMatch[2].trim(),
            mappedTrait,
            description: optionMatch[3]
          });
        }
      }
      
      if (questionText && options.length > 0) {
        const tags = [...new Set(options.map(o => {
          const traitNames = {
            'C': 'Conscientiousness',
            'O': 'Openness',
            'A': 'Agreeableness',
            'E': 'Extraversion',
            'S': 'Stability',
            'L': 'Low Stability'
          };
          return traitNames[o.mappedTrait] || 'Conscientiousness';
        }))];
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'personality',
          category: 'personality_traits',
          difficulty: 'medium',
          type: 'likert_scale',
          isActive: true,
          order: index,
          tags,
          metadata: {
            estimatedTime: 45,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing Big Five question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section D - Decision Making Questions
 * Format: Q1.1 Question text
 *         A) Option (PCM - logic)
 */
function parseDecisionQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\.\d+/g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match options with stream mapping
        const optionMatch = line.match(/^([A-D])\)\s*(.+?)\s*\(([^)]+)\)/i);
        if (optionMatch) {
          let mappedStream = 'PCM';
          const streamInfo = optionMatch[3].toLowerCase();
          
          if (streamInfo.includes('pcb') || streamInfo.includes('bio')) mappedStream = 'PCB';
          else if (streamInfo.includes('commerce')) mappedStream = 'Commerce';
          else if (streamInfo.includes('humanities')) mappedStream = 'Humanities';
          else if (streamInfo.includes('pcm')) mappedStream = 'PCM';
          
          options.push({
            text: optionMatch[2].trim(),
            mappedStream,
            description: optionMatch[3]
          });
        }
      }
      
      if (questionText && options.length > 0) {
        // Determine theme from context
        let theme = 'Peer Pressure vs Integrity';
        const qLower = questionText.toLowerCase();
        
        if (qLower.includes('responsibility') || qLower.includes('freedom')) {
          theme = 'Responsibility vs Freedom';
        } else if (qLower.includes('truth') || qLower.includes('kindness')) {
          theme = 'Truth vs Kindness';
        } else if (qLower.includes('risk') || qLower.includes('security')) {
          theme = 'Risk vs Security';
        }
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'values',
          category: 'decision_making',
          difficulty: 'medium',
          type: 'scenario_based',
          isActive: true,
          order: index,
          tags: [theme],
          metadata: {
            estimatedTime: 60,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing decision question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section E - Learning Orientation Questions
 */
function parseLearningQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\.\d+/g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        const optionMatch = line.match(/^([A-D])\)\s*(.+?)(?:\s*\(([^)]+)\))?$/i);
        if (optionMatch) {
          let mappedStream = 'PCM';
          if (optionMatch[3]) {
            const streamInfo = optionMatch[3].toLowerCase();
            if (streamInfo.includes('pcb')) mappedStream = 'PCB';
            else if (streamInfo.includes('commerce')) mappedStream = 'Commerce';
            else if (streamInfo.includes('humanities')) mappedStream = 'Humanities';
          }
          
          options.push({
            text: optionMatch[2].trim(),
            mappedStream
          });
        }
      }
      
      if (questionText && options.length > 0) {
        let subtheme = 'Persistence';
        const qLower = questionText.toLowerCase();
        
        if (qLower.includes('time') || qLower.includes('deadline')) {
          subtheme = 'Time Management';
        } else if (qLower.includes('distract')) {
          subtheme = 'Distraction';
        } else if (qLower.includes('revision') || qLower.includes('feedback')) {
          subtheme = 'Revision/Feedback';
        }
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'skills',
          category: 'learning_style',
          difficulty: 'medium',
          type: 'scenario_based',
          isActive: true,
          order: index,
          tags: [subtheme],
          metadata: {
            estimatedTime: 50,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing learning question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section F - ESI Questions
 */
function parseESIQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\.\d+/g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        const optionMatch = line.match(/^([A-D])\)\s*(.+)$/i);
        if (optionMatch) {
          options.push({
            text: optionMatch[2].trim(),
            mappedStream: 'PCB' // ESI generally maps to PCB
          });
        }
      }
      
      if (questionText && options.length > 0) {
        let subtheme = 'Empathy';
        const qLower = questionText.toLowerCase();
        
        if (qLower.includes('emotional regulation') || qLower.includes('calm')) {
          subtheme = 'Emotional Regulation';
        } else if (qLower.includes('conflict')) {
          subtheme = 'Conflict Handling';
        } else if (qLower.includes('self-aware')) {
          subtheme = 'Self-Awareness';
        }
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'values',
          category: 'emotional_intelligence',
          difficulty: 'medium',
          type: 'scenario_based',
          isActive: true,
          order: index,
          tags: [subtheme],
          metadata: {
            estimatedTime: 50,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing ESI question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Parse Section G - Work Values Questions
 */
function parseWorkValuesQuestions(content) {
  const questions = [];
  const questionBlocks = content.split(/Q\d+\./g).filter(Boolean);
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0].trim();
      
      const options = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        const optionMatch = line.match(/^([A-D])\)\s*(.+?)(?:\s*\(([^)]+)\))?$/i);
        if (optionMatch) {
          let mappedStream = 'PCM';
          if (optionMatch[3]) {
            const streamInfo = optionMatch[3].toLowerCase();
            if (streamInfo.includes('pcb')) mappedStream = 'PCB';
            else if (streamInfo.includes('commerce')) mappedStream = 'Commerce';
            else if (streamInfo.includes('humanities')) mappedStream = 'Humanities';
          }
          
          options.push({
            text: optionMatch[2].trim(),
            mappedStream
          });
        }
      }
      
      if (questionText && options.length > 0) {
        let subtheme = 'Achievement Orientation';
        const qLower = questionText.toLowerCase();
        
        if (qLower.includes('stability') || qLower.includes('structure')) {
          subtheme = 'Stability & Structure';
        } else if (qLower.includes('creativ')) {
          subtheme = 'Creativity & Freedom';
        } else if (qLower.includes('help')) {
          subtheme = 'Helping & Service';
        } else if (qLower.includes('leader')) {
          subtheme = 'Leadership & Influence';
        }
        
        questions.push({
          questionNumber: index + 1,
          text: questionText,
          options,
          domain: 'values',
          category: 'work_values',
          difficulty: 'medium',
          type: 'likert_scale',
          isActive: true,
          order: index,
          tags: [subtheme],
          metadata: {
            estimatedTime: 30,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing work values question ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

// Main execution
async function main() {
  try {
    console.log('📚 Starting question parsing...\n');
    
    const results = {};
    
    // Parse Section A - Aptitude
    console.log('📖 Parsing Section A - Aptitude Questions...');
    const aptitudeContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-A_Aptitude_Questions.md'),
      'utf-8'
    );
    results.aptitude = parseAptitudeQuestions(aptitudeContent);
    console.log(`✅ Parsed ${results.aptitude.length} aptitude questions\n`);
    
    // Parse Section B - RIASEC
    console.log('📖 Parsing Section B - RIASEC Questions...');
    const riasecContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-B_Career_Interest_RAISEC_Questions_Final.md'),
      'utf-8'
    );
    results.riasec = parseRIASECQuestions(riasecContent);
    console.log(`✅ Parsed ${results.riasec.length} RIASEC questions\n`);
    
    // Parse Section C - Decision Making (Note: The file name in content is Section-C but it's Decision Making)
    console.log('📖 Parsing Section C - Decision Making Questions...');
    const decisionContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-C_Decision_Making_Questions.md'),
      'utf-8'
    );
    results.decision = parseDecisionQuestions(decisionContent);
    console.log(`✅ Parsed ${results.decision.length} decision making questions\n`);
    
    // Parse Section D - ESI
    console.log('📖 Parsing Section D - ESI Questions...');
    const esiContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-D_Emotional_Social_Intelligence.md'),
      'utf-8'
    );
    results.esi = parseESIQuestions(esiContent);
    console.log(`✅ Parsed ${results.esi.length} ESI questions\n`);
    
    // Parse Section E - Learning Orientation
    console.log('📖 Parsing Section E - Learning Orientation Questions...');
    const learningContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-E_Learning_Orientation_Questions.md'),
      'utf-8'
    );
    results.learning = parseLearningQuestions(learningContent);
    console.log(`✅ Parsed ${results.learning.length} learning orientation questions\n`);
    
    // Parse Section F - Big Five Personality
    console.log('📖 Parsing Section F - Big Five Personality Questions...');
    const bigFiveContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-F_Personality_Traits_Questions.md'),
      'utf-8'
    );
    results.bigFive = parseBigFiveQuestions(bigFiveContent);
    console.log(`✅ Parsed ${results.bigFive.length} Big Five personality questions\n`);
    
    // Parse Section G - Work Values
    console.log('📖 Parsing Section G - Work Values Questions...');
    const workValuesContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-G_Work_values_Life_Style_Questions.md'),
      'utf-8'
    );
    results.workValues = parseWorkValuesQuestions(workValuesContent);
    console.log(`✅ Parsed ${results.workValues.length} work values questions\n`);
    
    // Write results to JSON files
    const outputDir = path.join(__dirname, '../data/parsed');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    for (const [key, questions] of Object.entries(results)) {
      const outputPath = path.join(outputDir, `${key}_questions.json`);
      fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
      console.log(`💾 Saved ${questions.length} ${key} questions to ${outputPath}`);
    }
    
    // Summary
    console.log('\n📊 PARSING SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Aptitude Questions:        ${results.aptitude.length}`);
    console.log(`RIASEC Questions:          ${results.riasec.length}`);
    console.log(`Decision Making Questions: ${results.decision.length}`);
    console.log(`ESI Questions:             ${results.esi.length}`);
    console.log(`Learning Questions:        ${results.learning.length}`);
    console.log(`Big Five Questions:        ${results.bigFive.length}`);
    console.log(`Work Values Questions:     ${results.workValues.length}`);
    console.log('═'.repeat(50));
    console.log(`TOTAL QUESTIONS:           ${Object.values(results).reduce((sum, arr) => sum + arr.length, 0)}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
