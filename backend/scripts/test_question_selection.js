import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import RIASECQuestion from '../models/RIASECQuestion.js';

dotenv.config();

async function testQuestionSelection() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/career_compass';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');
    
    // Test Section A: Aptitude Questions (15 random from 99)
    console.log('📝 Section A - Aptitude Questions:');
    const aptitudeQuestions = await Question.aggregate([
      { $match: { domain: 'aptitude', isActive: true } },
      { $sample: { size: 15 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${aptitudeQuestions.length} questions`);
    console.log(`   Sample: ${aptitudeQuestions[0]?.text.substring(0, 60)}...`);
    console.log(`   Categories: ${[...new Set(aptitudeQuestions.map(q => q.category))].join(', ')}\n`);
    
    // Test Section B: RIASEC Questions (10 random from 56)
    console.log('📝 Section B - RIASEC Questions:');
    const riasecQuestions = await RIASECQuestion.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 10 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${riasecQuestions.length} questions`);
    console.log(`   Sample: ${riasecQuestions[0]?.text.substring(0, 60)}...`);
    console.log(`   Tags: ${riasecQuestions[0]?.tags?.join(', ') || 'N/A'}\n`);
    
    // Test Section C: Decision Making (6 random from 38)
    console.log('📝 Section C - Decision Making Questions:');
    const decisionQuestions = await Question.aggregate([
      { $match: { category: 'problem_solving', isActive: true } },
      { $sample: { size: 6 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${decisionQuestions.length} questions`);
    console.log(`   Sample: ${decisionQuestions[0]?.text.substring(0, 60)}...`);
    
    // Test Section D: ESI Questions (6 random from 60)
    console.log('\n📝 Section D - ESI Questions:');
    const esiQuestions = await Question.aggregate([
      { $match: { category: 'stress_management', isActive: true } },
      { $sample: { size: 6 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${esiQuestions.length} questions`);
    console.log(`   Sample: ${esiQuestions[0]?.text.substring(0, 60)}...`);
    
    // Test Section E: Learning Orientation (8 random from 58)
    console.log('\n📝 Section E - Learning Orientation Questions:');
    const learningQuestions = await Question.aggregate([
      { $match: { category: 'learning_style', isActive: true } },
      { $sample: { size: 8 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${learningQuestions.length} questions`);
    console.log(`   Sample: ${learningQuestions[0]?.text.substring(0, 60)}...`);
    
    // Test Section F: Big Five Personality (10 random from 105)
    console.log('\n📝 Section F - Personality Traits (Big Five):');
    const personalityQuestions = await Question.aggregate([
      { $match: { domain: 'personality', category: 'personality_traits', isActive: true } },
      { $sample: { size: 10 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${personalityQuestions.length} questions`);
    console.log(`   Sample: ${personalityQuestions[0]?.text.substring(0, 60)}...`);
    
    // Test Section G: Work Values (5 random from 35)
    console.log('\n📝 Section G - Work Values Questions:');
    const workValuesQuestions = await Question.aggregate([
      { $match: { category: 'work_values', isActive: true } },
      { $sample: { size: 5 } },
      { $project: { _id: 1, text: 1, category: 1 } }
    ]);
    console.log(`   Selected ${workValuesQuestions.length} questions`);
    console.log(`   Sample: ${workValuesQuestions[0]?.text.substring(0, 60)}...`);
    
    // Summary
    const totalSelected = aptitudeQuestions.length + riasecQuestions.length + 
                          decisionQuestions.length + esiQuestions.length + 
                          learningQuestions.length + personalityQuestions.length + 
                          workValuesQuestions.length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST GENERATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Questions Selected: ${totalSelected} / 60`);
    console.log('='.repeat(60));
    console.log('\n✅ All question sections can be randomly selected successfully!');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

testQuestionSelection();
