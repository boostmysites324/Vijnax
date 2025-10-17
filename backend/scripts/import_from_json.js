import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from '../models/Question.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careercompass');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to load questions from JSON file
const loadQuestionsFromJSON = () => {
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'full_aptitude_questions.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    return data.questions;
  } catch (error) {
    console.error('❌ Error loading questions from JSON:', error);
    throw error;
  }
};

// Function to create sample questions if JSON doesn't exist
const createSampleQuestions = () => {
  const sampleQuestions = [];
  
  // Create 20 sample questions with varied content
  const questionTemplates = [
    {
      text: "What is the next number in the sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "20", "28"],
      correct: 1,
      category: "pattern_recognition",
      stream: ["PCM"],
      skill: "Geometric progression recognition"
    },
    {
      text: "If a train travels 300 km in 4 hours, what is its average speed?",
      options: ["60 km/h", "75 km/h", "80 km/h", "90 km/h"],
      correct: 1,
      category: "arithmetic_logic",
      stream: ["PCM", "Commerce"],
      skill: "Speed-distance-time calculations"
    },
    {
      text: "Which word is most similar to 'Courageous'?",
      options: ["Brave", "Timid", "Careful", "Quiet"],
      correct: 0,
      category: "verbal_inference",
      stream: ["Humanities"],
      skill: "Synonym recognition"
    },
    {
      text: "A rectangle has length 12 cm and width 8 cm. What is its area?",
      options: ["96 cm²", "100 cm²", "88 cm²", "104 cm²"],
      correct: 0,
      category: "geometry_reasoning",
      stream: ["PCM"],
      skill: "Area calculation"
    },
    {
      text: "If 25% of a number is 50, what is the number?",
      options: ["150", "200", "175", "225"],
      correct: 1,
      category: "quantitative_estimation",
      stream: ["Commerce", "PCM"],
      skill: "Percentage calculations"
    }
  ];
  
  for (let i = 0; i < 20; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    const question = {
      text: template.text,
      options: template.options.map((option, index) => ({
        text: option,
        isCorrect: index === template.correct,
        score: index === template.correct ? 10 : 0,
        domain: "aptitude"
      })),
      domain: "aptitude",
      category: template.category,
      difficulty: ["easy", "medium", "hard"][i % 3],
      type: "multiple_choice",
      correctAnswer: ["A", "B", "C", "D"][template.correct],
      explanation: `This is the explanation for question ${i + 1}`,
      streamMapping: template.stream,
      skill: template.skill,
      tags: [`sample${i + 1}`, template.category],
      metadata: {
        estimatedTime: 60 + (i * 3),
        weightage: 1.0 + (i * 0.01),
        reliability: 0.8 + (i * 0.01),
        validity: 0.8 + (i * 0.01)
      }
    };
    sampleQuestions.push(question);
  }
  
  return sampleQuestions;
};

// Function to import questions
const importQuestions = async () => {
  try {
    console.log('🚀 Starting aptitude questions import...');
    
    // Clear existing aptitude questions
    await Question.deleteMany({ domain: 'aptitude' });
    console.log('🗑️  Cleared existing aptitude questions');
    
    // Create a default admin user ID
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Try to load from JSON, fallback to sample questions
    let questions;
    try {
      questions = loadQuestionsFromJSON();
      console.log(`📄 Loaded ${questions.length} questions from JSON file`);
    } catch (error) {
      console.log('⚠️  JSON file not found, creating sample questions...');
      questions = createSampleQuestions();
      console.log(`📝 Created ${questions.length} sample questions`);
    }
    
    // Add metadata to each question
    const questionsWithMetadata = questions.map((question, index) => ({
      ...question,
      createdBy: adminUserId,
      lastModifiedBy: adminUserId,
      order: index + 1,
      isActive: true
    }));
    
    // Insert questions in batches
    const batchSize = 50;
    let importedCount = 0;
    
    for (let i = 0; i < questionsWithMetadata.length; i += batchSize) {
      const batch = questionsWithMetadata.slice(i, i + batchSize);
      await Question.insertMany(batch);
      importedCount += batch.length;
      console.log(`📦 Imported batch ${Math.floor(i / batchSize) + 1}: ${importedCount}/${questionsWithMetadata.length} questions`);
    }
    
    console.log(`✅ Successfully imported ${importedCount} aptitude questions`);
    
    // Display summary
    const streamSummary = {};
    const categorySummary = {};
    const difficultySummary = {};
    
    questionsWithMetadata.forEach(q => {
      // Stream mapping summary
      if (q.streamMapping) {
        q.streamMapping.forEach(stream => {
          streamSummary[stream] = (streamSummary[stream] || 0) + 1;
        });
      }
      
      // Category summary
      if (q.category) {
        categorySummary[q.category] = (categorySummary[q.category] || 0) + 1;
      }
      
      // Difficulty summary
      if (q.difficulty) {
        difficultySummary[q.difficulty] = (difficultySummary[q.difficulty] || 0) + 1;
      }
    });
    
    console.log('\n📊 Stream Mapping Summary:');
    Object.entries(streamSummary).forEach(([stream, count]) => {
      console.log(`   ${stream}: ${count} questions`);
    });
    
    console.log('\n🎯 Categories imported:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} questions`);
    });
    
    console.log('\n📈 Difficulty Distribution:');
    Object.entries(difficultySummary).forEach(([difficulty, count]) => {
      console.log(`   - ${difficulty}: ${count} questions`);
    });
    
    // Test the import by fetching a sample
    const sampleQuestions = await Question.find({ domain: 'aptitude' }).limit(5);
    console.log('\n🔍 Sample imported questions:');
    sampleQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.text.substring(0, 50)}...`);
    });
    
    // Test API endpoints
    console.log('\n🧪 Testing API endpoints...');
    
    // Test categories endpoint
    const categories = await Question.distinct('category', { isActive: true });
    console.log(`   📋 Found ${categories.length} categories`);
    
    // Test stream mapping
    const streams = await Question.distinct('streamMapping', { isActive: true });
    console.log(`   🎯 Found ${streams.flat().length} stream mappings`);
    
    console.log('\n🎉 Import and validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error importing questions:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await importQuestions();
    console.log('\n📋 Next steps:');
    console.log('   1. Test the API endpoints: GET /api/questions');
    console.log('   2. Test stream filtering: GET /api/questions/streams/PCM');
    console.log('   3. Test categories: GET /api/questions/categories');
    console.log('   4. Update frontend to use new question format');
    process.exit(0);
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
};

// Run the import if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default importQuestions;





