import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import RIASECQuestion from '../models/RIASECQuestion.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const CONTENT_DIR = path.join(__dirname, '../../content');

/**
 * Parse Section A - Aptitude Questions (160 questions)
 * Format in single line: Q1. Text A) Option B) Option C) Option D) Option Answer: X Streams: ...
 */
function parseAptitudeQuestions(content) {
  const questions = [];
  
  // Split by question numbers
  const matches = content.matchAll(/Q(\d+)\.\s*([^Q]+?)(?=Q\d+\.|$)/gs);
  
  for (const match of matches) {
    const qNum = parseInt(match[1]);
    const qBlock = match[2].trim();
    
    try {
      // Extract question text (everything before first option)
      const questionMatch = qBlock.match(/^(.+?)\s+A\)/s);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[1].trim()
        .replace(/Mathematical Logic|Verbal Logical Inference|Pattern Series|Abstract Reasoning|Quantitative Estimation|Graph-Based Interpretation|Logical Word Puzzle|Spatial Folding|Scientific Deduction|Ratio Reasoning|Pattern Block Puzzle|Verbal Classification|Biological Logic|Sequence Pattern|Reading Comprehension Logic|Geometry Word Problem|Deductive Chain|Logical Equation Puzzle|Scientific Pattern Deduction|Verbal Analogy|Graph Interpretation|Scientific Logic|Number Puzzle|Deductive Reasoning|Arithmetic & Logic|Pattern Deduction|Graph-Based Reasoning|Logical Reasoning|Percentage Problem|Life Science Inference|Word Puzzle|Matrix Reasoning|Reading-Based Logic|Time & Work Logic|Human Physiology Logic|Logical Reversal Puzzle|Geometry Concept|Statement Reasoning|Series Completion|Experimental Logic|Data Sufficiency|Coding Puzzle|Verbal Logic|Profit & Loss Logic|Logical Flow|Arithmetic Logic|Cause & Effect|Verbal Category|Number Logic|Analytical Decision|Body Systems Reasoning|Word Construction|Reverse Arithmetic Puzzle|Analogy|Earth Science Inference|Table Logic|Inference Logic|Logical Deduction|Science Inference|Arithmetic Puzzle|Word Association|Geometry Reasoning|Percentage Application|Human Body Reasoning|Pattern Completion|Analogy Reasoning|Profit-Loss Calculation|Comprehension-Based Inference|Geometry Word Problem|Table Interpretation|Biological Cause & Effect|Number Puzzle|Business Math|Sentence Logic|Time & Work Reasoning|Experimental Setup Inference|Odd Word Out|Arithmetic Word Problem|Visual Pattern|Profit Sharing|Verbal Analogy|Scientific Method Reasoning|Number Series|Reasoning Statement|Geometry Puzzle|Time Table Inference|Functional Biology|Language Classification|Speed Ratio Logic|Cause & Effect in Biology|Financial Logic|Verbal Logic|Coding-Decoding|Tax Logic|Disease Identification|Conjunction Usage|Numeric Puzzle|Ratio & Proportion|Contextual Grammar|Pattern Recognition|Biology Logic|Basic Finance|Equation Puzzle|Sentence Classification|Scientific Instrument Logic|Reasoning Category|Percentage Increase|Health & Biology|Perimeter Calculation|Reading Inference|Simple Interest|Series Logic|Synonym Identification|Biological Classification|Cost-Benefit Reasoning|Triangle Angle|Sentence Completion|Geometry & Perimeter|Grammar Identification|Medical Logic|Contextual Language|Area Reasoning|Nutrient Function|Profit & Discount|Human Body Function|Logical Series|Sentence Connector|GST Application|Pythagorean Logic|Financial Logic|Sentence Type|Plant Biology|Geometry Surface Area|Synonym Challenge/gi, '')
        .replace(/\s+–\s+Easier Version|– Revised Version|– Moderate Difficulty/gi, '')
        .replace(/\(([^)]+)\)/g, '')
        .trim();
      
      // Extract options
      const options = [];
      const optionMatches = qBlock.matchAll(/([A-D])\)\s*([^A-D)]+?)(?=[A-D]\)|Answer:|Streams?:|Skill:|$)/gs);
      
      for (const optMatch of optionMatches) {
        const label = optMatch[1];
        const text = optMatch[2].trim();
        if (text && text.length > 0) {
          options.push({
            text: text.replace(/\s+/g, ' ').trim(),
            label,
            isCorrect: false,
            score: 0,
            domain: 'aptitude'
          });
        }
      }
      
      // Extract answer
      const answerMatch = qBlock.match(/Answer:\s*([A-D])/i);
      let correctAnswer = answerMatch ? answerMatch[1] : '';
      
      // Mark correct option
      if (correctAnswer) {
        options.forEach(opt => {
          if (opt.label === correctAnswer) {
            opt.isCorrect = true;
            opt.score = 10; // Max score for correct answer
          }
        });
      }
      
      // Extract streams
      const streamMatch = qBlock.match(/Streams?:\s*([^Q]+?)(?:Skill:|Why|High|Tests:|$)/i);
      let streams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
      if (streamMatch) {
        const streamText = streamMatch[1].trim();
        streams = streamText.split(/,|\band\b/)
          .map(s => s.trim())
          .filter(s => s && s.match(/PCM|PCB|Commerce|Humanities|Science|Maths|Bio/i))
          .map(s => {
            if (s.match(/PCM|Maths/i)) return 'PCM';
            if (s.match(/PCB|Bio/i)) return 'PCB';
            if (s.match(/Commerce/i)) return 'Commerce';
            if (s.match(/Humanities/i)) return 'Humanities';
            return s;
          });
        streams = [...new Set(streams)];
        if (streams.length === 0) streams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
      }
      
      // Determine category - map to valid Question model categories
      let category = 'numerical_ability'; // default
      const qLower = questionText.toLowerCase();
      
      if (qLower.includes('pattern') || qLower.includes('series') || qLower.includes('sequence')) {
        category = 'logical_reasoning';
      } else if (qLower.includes('spatial') || qLower.includes('cube') || qLower.includes('fold') || qLower.includes('3d')) {
        category = 'spatial_ability';
      } else if (qLower.includes('analogy') || qLower.includes('word') || qLower.includes('synonym') || qLower.includes('antonym') || qLower.includes('reading') || qLower.includes('verbal')) {
        category = 'verbal_ability';
      } else if (qLower.includes('scientific') || qLower.includes('experiment') || qLower.includes('biology') || qLower.includes('physics')) {
        category = 'problem_solving';
      } else if (qLower.includes('graph') || qLower.includes('data') || qLower.includes('table') || qLower.includes('chart')) {
        category = 'logical_reasoning';
      } else if (qLower.includes('percentage') || qLower.includes('profit') || qLower.includes('ratio') || qLower.includes('discount') || qLower.includes('number')) {
        category = 'numerical_ability';
      } else if (qLower.includes('geometry') || qLower.includes('triangle') || qLower.includes('perimeter') || qLower.includes('area')) {
        category = 'spatial_ability';
      } else if (qLower.includes('speed') || qLower.includes('time') || qLower.includes('distance')) {
        category = 'numerical_ability';
      }
      
      if (questionText && options.length >= 4) {
        questions.push({
          questionNumber: qNum,
          text: questionText,
          options,
          domain: 'aptitude',
          category,
          difficulty: 'medium',
          type: 'multiple_choice',
          isActive: true,
          correctAnswer,
          streamMapping: streams,
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
      console.error(`Error parsing aptitude Q${qNum}:`, err.message);
    }
  }
  
  return questions;
}

/**
 * Parse Section B - RIASEC Questions (60 questions)
 */
function parseRIASECQuestions(content) {
  const questions = [];
  
  const matches = content.matchAll(/Q(\d+)\.\s*([^Q]+?)(?=Q\d+\.|$)/gs);
  
  const riasecMap = {
    'realistic': 'R',
    'investigative': 'I',
    'artistic': 'A',
    'social': 'S',
    'enterprising': 'E',
    'conventional': 'C'
  };
  
  for (const match of matches) {
    const qNum = parseInt(match[1]);
    const qBlock = match[2].trim();
    
    try {
      const questionMatch = qBlock.match(/^(.+?)\s+A\)/s);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[1].trim().replace(/\([^)]+\)\s*$/g, '');
      
      const options = [];
      const optionMatches = qBlock.matchAll(/([A-D])\)\s*(.+?)\s*\(([^)]+)\)/g);
      
      for (const optMatch of optionMatches) {
        const label = optMatch[1];
        const text = optMatch[2].trim();
        const riasecType = optMatch[3].toLowerCase();
        
        let mappedType = 'R';
        for (const [key, value] of Object.entries(riasecMap)) {
          if (riasecType.includes(key)) {
            mappedType = value;
            break;
          }
        }
        
        options.push({
          text,
          riasecType: mappedType,
          description: optMatch[3]
        });
      }
      
      if (questionText && options.length >= 2) {
        questions.push({
          questionNumber: qNum,
          text: questionText,
          options,
          category: 'career_interest',
          isActive: true,
          order: qNum - 1,
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
      console.error(`Error parsing RIASEC Q${qNum}:`, err.message);
    }
  }
  
  return questions;
}

/**
 * Parse Section F - Big Five Personality Questions (108 questions)
 */
function parseBigFiveQuestions(content) {
  const questions = [];
  
  const matches = content.matchAll(/Q(\d+)\.\s*([^Q]+?)(?=Q\d+\.|$)/gs);
  
  const traitMap = {
    'conscientiousness': 'C',
    'openness': 'O',
    'agreeableness': 'A',
    'extraversion': 'E',
    'emotional stability': 'S',
    'stability': 'S',
    'low stability': 'L',
    'introversion': 'I'
  };
  
  for (const match of matches) {
    const qNum = parseInt(match[1]);
    const qBlock = match[2].trim();
    
    try {
      const questionMatch = qBlock.match(/^(.+?)\s+A\)/s);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[1].trim();
      
      const options = [];
      const optionMatches = qBlock.matchAll(/([A-D])\)\s*(.+?)\s*\(([^)]+)\)/g);
      
      for (const optMatch of optionMatches) {
        const text = optMatch[2].trim();
        const traitName = optMatch[3].toLowerCase();
        
        let mappedTrait = 'C';
        for (const [key, value] of Object.entries(traitMap)) {
          if (traitName.includes(key)) {
            mappedTrait = value;
            break;
          }
        }
        
        options.push({
          text,
          mappedTrait,
          description: optMatch[3],
          score: 5, // Default score for personality questions
          domain: 'personality'
        });
      }
      
      if (questionText && options.length >= 2) {
        const tags = [...new Set(options.map(o => {
          const names = {
            'C': 'Conscientiousness',
            'O': 'Openness',
            'A': 'Agreeableness',
            'E': 'Extraversion',
            'S': 'Stability',
            'L': 'Low Stability',
            'I': 'Introversion'
          };
          return names[o.mappedTrait] || 'Conscientiousness';
        }))];
        
        questions.push({
          questionNumber: qNum,
          text: questionText,
          options,
          domain: 'personality',
          category: 'personality_traits',
          difficulty: 'medium',
          type: 'likert_scale',
          isActive: true,
          order: qNum - 1,
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
      console.error(`Error parsing Big Five Q${qNum}:`, err.message);
    }
  }
  
  return questions;
}

/**
 * Parse generic scenario-based questions (Decision, Learning, ESI, Work Values)
 */
function parseScenarioQuestions(content, domain, category) {
  const questions = [];
  
  // Match both Q1.1 and Q1 formats
  const matches = content.matchAll(/Q(\d+)(?:\.(\d+))?\s+([^Q]+?)(?=Q\d+(?:\.\d+)?|\n{2,}|$)/gs);
  
  for (const match of matches) {
    const qNum = parseInt(match[1]);
    const qSubNum = match[2] ? parseInt(match[2]) : null;
    const qBlock = match[3].trim();
    
    try {
      // Extract question text (everything before first option)
      const questionMatch = qBlock.match(/^(.+?)\s+A\)/s);
      if (!questionMatch) continue;
      
      let questionText = questionMatch[1].trim()
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
      
      // Truncate question text if it exceeds 500 characters (model limit)
      if (questionText.length > 500) {
        questionText = questionText.substring(0, 497) + '...';
      }
      
      // Extract options - improved regex to handle various formats
      const options = [];
      const optionRegex = /([A-D])\)\s+(.+?)(?=\s+[A-D]\)|\s*$)/gs;
      const optionMatches = qBlock.matchAll(optionRegex);
      
      for (const optMatch of optionMatches) {
        let text = optMatch[2].trim()
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ');
        
        // Extract stream mapping if present (for decision-making questions)
        const streamMatch = text.match(/\(([^)]+?(?:PCM|PCB|Commerce|Humanities)[^)]*)\)/i);
        let mappedStream = 'All';
        
        if (streamMatch) {
          const streamInfo = streamMatch[1].toLowerCase();
          if (streamInfo.includes('pcb') || streamInfo.includes('bio')) mappedStream = 'PCB';
          else if (streamInfo.includes('commerce')) mappedStream = 'Commerce';
          else if (streamInfo.includes('humanities')) mappedStream = 'Humanities';
          else if (streamInfo.includes('pcm')) mappedStream = 'PCM';
          
          // Remove stream info from text
          text = text.replace(/\([^)]*?(?:PCM|PCB|Commerce|Humanities)[^)]*?\)/gi, '').trim();
        }
        
        if (text && text.length > 5) {
          // Truncate text if it exceeds 200 characters (model limit)
          if (text.length > 200) {
            text = text.substring(0, 197) + '...';
          }
          
          options.push({
            text,
            mappedStream,
            score: 5, // Default score for scenario-based questions
            domain
          });
        }
      }
      
      if (questionText && options.length >= 2) {
        const questionNum = qSubNum ? parseInt(`${qNum}${qSubNum}`) : qNum;
        questions.push({
          questionNumber: questionNum,
          text: questionText,
          options,
          domain,
          category,
          difficulty: 'medium',
          type: 'scenario_based',
          isActive: true,
          order: questionNum - 1,
          tags: [category, domain],
          metadata: {
            estimatedTime: 50,
            weightage: 1,
            reliability: 0.8,
            validity: 0.8
          }
        });
      }
    } catch (err) {
      console.error(`Error parsing ${category} Q${qNum}${qSubNum ? '.' + qSubNum : ''}:`, err.message);
    }
  }
  
  return questions;
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive question import...\n');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careercompass';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');
    
    // Find or create system user for createdBy field
    let systemUser = await User.findOne({ email: 'system@vijnax.com' });
    if (!systemUser) {
      systemUser = await User.create({
        name: 'System Import',
        email: 'system@vijnax.com',
        mobile: '9999999999',
        password: 'System@123456',
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Created system user\n');
    }
    const systemUserId = systemUser._id;
    
    const results = {
      aptitude: 0,
      riasec: 0,
      bigFive: 0,
      decision: 0,
      learning: 0,
      esi: 0,
      workValues: 0
    };
    
    // Parse and import Section A - Aptitude
    console.log('📖 Parsing Section A - Aptitude Questions...');
    const aptitudeContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-A_Aptitude_Questions.md'),
      'utf-8'
    );
    const aptitudeQuestions = parseAptitudeQuestions(aptitudeContent);
    console.log(`   Parsed ${aptitudeQuestions.length} questions`);
    
    if (aptitudeQuestions.length > 0) {
      // Add createdBy to all questions
      aptitudeQuestions.forEach(q => q.createdBy = systemUserId);
      
      await Question.deleteMany({ domain: 'aptitude' });
      await Question.insertMany(aptitudeQuestions);
      results.aptitude = aptitudeQuestions.length;
      console.log(`✅ Imported ${results.aptitude} aptitude questions\n`);
    }
    
    // Parse and import Section B - RIASEC
    console.log('📖 Parsing Section B - RIASEC Questions...');
    const riasecContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-B_Career_Interest_RAISEC_Questions_Final.md'),
      'utf-8'
    );
    const riasecQuestions = parseRIASECQuestions(riasecContent);
    console.log(`   Parsed ${riasecQuestions.length} questions`);
    
    if (riasecQuestions.length > 0) {
      riasecQuestions.forEach(q => q.createdBy = systemUserId);
      
      await RIASECQuestion.deleteMany({});
      await RIASECQuestion.insertMany(riasecQuestions);
      results.riasec = riasecQuestions.length;
      console.log(`✅ Imported ${results.riasec} RIASEC questions\n`);
    }
    
    // Parse and import Section C - Decision Making
    console.log('📖 Parsing Section C - Decision Making Questions...');
    const decisionContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-C_Decision_Making_Questions.md'),
      'utf-8'
    );
    const decisionQuestions = parseScenarioQuestions(decisionContent, 'values', 'problem_solving');
    console.log(`   Parsed ${decisionQuestions.length} questions`);
    
    if (decisionQuestions.length > 0) {
      decisionQuestions.forEach(q => q.createdBy = systemUserId);
      
      await Question.deleteMany({ category: 'problem_solving', tags: { $in: ['problem_solving', 'decision_making'] } });
      await Question.insertMany(decisionQuestions);
      results.decision = decisionQuestions.length;
      console.log(`✅ Imported ${results.decision} decision-making questions\n`);
    }
    
    // Parse and import Section D - ESI
    console.log('📖 Parsing Section D - ESI Questions...');
    const esiContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-D_Emotional_Social_Intelligence.md'),
      'utf-8'
    );
    const esiQuestions = parseScenarioQuestions(esiContent, 'values', 'stress_management');
    console.log(`   Parsed ${esiQuestions.length} questions`);
    
    if (esiQuestions.length > 0) {
      esiQuestions.forEach(q => {
        q.createdBy = systemUserId;
        q.tags = ['emotional_intelligence', 'stress_management']; // Add both tags
      });
      
      await Question.deleteMany({ category: 'stress_management', tags: { $in: ['emotional_intelligence'] } });
      await Question.insertMany(esiQuestions);
      results.esi = esiQuestions.length;
      console.log(`✅ Imported ${results.esi} ESI questions\n`);
    }
    
    // Parse and import Section E - Learning Orientation
    console.log('📖 Parsing Section E - Learning Orientation Questions...');
    const learningContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-E_Learning_Orientation_Questions.md'),
      'utf-8'
    );
    const learningQuestions = parseScenarioQuestions(learningContent, 'skills', 'learning_style');
    console.log(`   Parsed ${learningQuestions.length} questions`);
    
    if (learningQuestions.length > 0) {
      learningQuestions.forEach(q => q.createdBy = systemUserId);
      
      await Question.deleteMany({ category: 'learning_style' });
      await Question.insertMany(learningQuestions);
      results.learning = learningQuestions.length;
      console.log(`✅ Imported ${results.learning} learning orientation questions\n`);
    }
    
    // Parse and import Section F - Big Five Personality
    console.log('📖 Parsing Section F - Big Five Personality Questions...');
    const bigFiveContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-F_Personality_Traits_Questions.md'),
      'utf-8'
    );
    const bigFiveQuestions = parseBigFiveQuestions(bigFiveContent);
    console.log(`   Parsed ${bigFiveQuestions.length} questions`);
    
    if (bigFiveQuestions.length > 0) {
      bigFiveQuestions.forEach(q => q.createdBy = systemUserId);
      
      await Question.deleteMany({ category: 'personality_traits' });
      await Question.insertMany(bigFiveQuestions);
      results.bigFive = bigFiveQuestions.length;
      console.log(`✅ Imported ${results.bigFive} Big Five personality questions\n`);
    }
    
    // Parse and import Section G - Work Values
    console.log('📖 Parsing Section G - Work Values Questions...');
    const workValuesContent = fs.readFileSync(
      path.join(CONTENT_DIR, 'Section-G_Work_values_Life_Style_Questions.md'),
      'utf-8'
    );
    const workValuesQuestions = parseScenarioQuestions(workValuesContent, 'values', 'work_values');
    console.log(`   Parsed ${workValuesQuestions.length} questions`);
    
    if (workValuesQuestions.length > 0) {
      workValuesQuestions.forEach(q => q.createdBy = systemUserId);
      
      await Question.deleteMany({ category: 'work_values' });
      await Question.insertMany(workValuesQuestions);
      results.workValues = workValuesQuestions.length;
      console.log(`✅ Imported ${results.workValues} work values questions\n`);
    }
    
    // Summary
    const total = Object.values(results).reduce((sum, count) => sum + count, 0);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Aptitude Questions:        ${results.aptitude.toString().padStart(3)}`);
    console.log(`RIASEC Questions:          ${results.riasec.toString().padStart(3)}`);
    console.log(`Decision Making Questions: ${results.decision.toString().padStart(3)}`);
    console.log(`ESI Questions:             ${results.esi.toString().padStart(3)}`);
    console.log(`Learning Questions:        ${results.learning.toString().padStart(3)}`);
    console.log(`Big Five Questions:        ${results.bigFive.toString().padStart(3)}`);
    console.log(`Work Values Questions:     ${results.workValues.toString().padStart(3)}`);
    console.log('='.repeat(60));
    console.log(`TOTAL QUESTIONS:           ${total.toString().padStart(3)}`);
    console.log('='.repeat(60));
    
    console.log('\n✨ All questions successfully imported!\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
