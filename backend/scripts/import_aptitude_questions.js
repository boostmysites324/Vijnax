import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

// Load environment variables
dotenv.config();

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

// Sample aptitude questions data (first 20 questions as example)
const aptitudeQuestions = [
  {
    text: "A number is doubled and then 9 is added. If the result is 31, what was the number?",
    options: [
      { text: "9", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "10", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "11", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "12", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "mathematical_logic",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "C",
    explanation: "Let the number be x. Then 2x + 9 = 31, so 2x = 22, x = 11",
    streamMapping: ["PCM", "Commerce"],
    skill: "Algebraic framing, two-step logical decoding",
    tags: ["algebra", "problem-solving"],
    metadata: {
      estimatedTime: 90,
      weightage: 1.2,
      reliability: 0.9,
      validity: 0.85
    }
  },
  {
    text: "\"All mammals have lungs. All whales are mammals.\" What can you infer?",
    options: [
      { text: "All whales have lungs", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "Only some whales have lungs", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "Whales may or may not have lungs", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "None of the above", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "verbal_inference",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "A",
    explanation: "Logical chain from general to specific: All mammals have lungs, whales are mammals, therefore whales have lungs",
    streamMapping: ["PCM", "Humanities"],
    skill: "High standard due to logical chain from general to specific",
    tags: ["logic", "inference"],
    metadata: {
      estimatedTime: 75,
      weightage: 1.1,
      reliability: 0.88,
      validity: 0.9
    }
  },
  {
    text: "Which term comes next in the series: 2, 3, 5, 8, 13, ?",
    options: [
      { text: "18", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "20", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "21", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "22", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "pattern_recognition",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "C",
    explanation: "Fibonacci sequence: each number is the sum of the two preceding ones (2+3=5, 3+5=8, 5+8=13, 8+13=21)",
    streamMapping: ["PCM"],
    skill: "Fibonacci-based logic—tests mathematical curiosity",
    tags: ["sequence", "fibonacci", "patterns"],
    metadata: {
      estimatedTime: 60,
      weightage: 1.0,
      reliability: 0.92,
      validity: 0.88
    }
  },
  {
    text: "If ◆ = 2 and ▲ = 3, and (◆ + ▲)² = ?, what is the result?",
    options: [
      { text: "12", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "25", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "10", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "20", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "abstract_reasoning",
    difficulty: "easy",
    type: "multiple_choice",
    correctAnswer: "B",
    explanation: "(2 + 3)² = 5² = 25",
    streamMapping: ["PCM"],
    skill: "Tests symbolic algebra, abstract manipulation",
    tags: ["algebra", "symbols", "abstract"],
    metadata: {
      estimatedTime: 45,
      weightage: 0.8,
      reliability: 0.85,
      validity: 0.82
    }
  },
  {
    text: "If 40% of a number is 84, what is the number?",
    options: [
      { text: "160", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "180", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "210", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "220", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "quantitative_estimation",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "C",
    explanation: "40% of x = 84, so x = 84 ÷ 0.4 = 210",
    streamMapping: ["Commerce", "PCM"],
    skill: "Percent-to-whole inversion—tests comfort with reverse operations",
    tags: ["percentage", "calculation"],
    metadata: {
      estimatedTime: 60,
      weightage: 1.1,
      reliability: 0.87,
      validity: 0.89
    }
  },
  {
    text: "A line graph shows a company's profits steadily increasing each month over one year. What conclusion is most supported by this trend?",
    options: [
      { text: "The company is hiring fewer employees", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "The company is losing customers", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "The company is growing financially", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "The company has stopped all spending", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "graph_interpretation",
    difficulty: "easy",
    type: "multiple_choice",
    correctAnswer: "C",
    explanation: "Steadily increasing profits indicate financial growth",
    streamMapping: ["Commerce", "PCM"],
    skill: "Graph-based interpretation and business logic",
    tags: ["graph", "business", "interpretation"],
    metadata: {
      estimatedTime: 45,
      weightage: 0.9,
      reliability: 0.83,
      validity: 0.86
    }
  },
  {
    text: "Which of the following is a valid anagram of the word \"TEACHER\"?",
    options: [
      { text: "CHEATER", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "REACHED", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "RETEACH", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "TEARHCE", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "word_puzzle",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "A",
    explanation: "CHEATER uses all letters from TEACHER: T-E-A-C-H-E-R",
    streamMapping: ["Humanities", "Commerce"],
    skill: "Word manipulation and pattern recognition",
    tags: ["anagram", "word-play", "vocabulary"],
    metadata: {
      estimatedTime: 75,
      weightage: 1.0,
      reliability: 0.89,
      validity: 0.84
    }
  },
  {
    text: "A cube painted on all six faces is cut into 64 small cubes. How many will have paint on only one face?",
    options: [
      { text: "24", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "36", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "12", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "6", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "spatial_folding",
    difficulty: "hard",
    type: "multiple_choice",
    correctAnswer: "A",
    explanation: "4×4×4 cube has 6 faces. Cubes with paint on only one face are on the center of each face: 6 faces × 4 center cubes = 24",
    streamMapping: ["PCM"],
    skill: "High cognitive demand: 3D visualization + spatial zones",
    tags: ["spatial", "3d", "visualization"],
    metadata: {
      estimatedTime: 120,
      weightage: 1.5,
      reliability: 0.91,
      validity: 0.87
    }
  },
  {
    text: "A scientist notices that a plant bends toward light. What kind of reasoning leads to forming a hypothesis?",
    options: [
      { text: "Deductive", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "Evaluative", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "Inductive", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "Comparative", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "scientific_deduction",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "C",
    explanation: "Inductive reasoning: observing specific instances to form general conclusions",
    streamMapping: ["PCB", "PCM"],
    skill: "Critical thinking applied to experimental settings",
    tags: ["scientific-method", "reasoning", "hypothesis"],
    metadata: {
      estimatedTime: 90,
      weightage: 1.2,
      reliability: 0.88,
      validity: 0.91
    }
  },
  {
    text: "If A and B together earn ₹3,000 in the ratio 3:2, how much does B earn?",
    options: [
      { text: "₹1,200", isCorrect: true, score: 10, domain: "aptitude" },
      { text: "₹1,500", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "₹1,800", isCorrect: false, score: 0, domain: "aptitude" },
      { text: "₹1,000", isCorrect: false, score: 0, domain: "aptitude" }
    ],
    domain: "aptitude",
    category: "ratio_reasoning",
    difficulty: "medium",
    type: "multiple_choice",
    correctAnswer: "A",
    explanation: "Total ratio parts = 3+2 = 5. B's share = (2/5) × ₹3,000 = ₹1,200",
    streamMapping: ["Commerce", "PCM"],
    skill: "Tests financial reasoning through ratios",
    tags: ["ratio", "proportion", "financial"],
    metadata: {
      estimatedTime: 75,
      weightage: 1.1,
      reliability: 0.86,
      validity: 0.88
    }
  }
  // Note: This is a sample of the first 10 questions. 
  // In a production environment, you would include all 160 questions here.
];

// Function to import questions
const importQuestions = async () => {
  try {
    console.log('🚀 Starting aptitude questions import...');
    
    // Clear existing aptitude questions
    await Question.deleteMany({ domain: 'aptitude' });
    console.log('🗑️  Cleared existing aptitude questions');
    
    // Create a default admin user ID (you might want to get this from your admin user)
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Add metadata to each question
    const questionsWithMetadata = aptitudeQuestions.map((question, index) => ({
      ...question,
      createdBy: adminUserId,
      lastModifiedBy: adminUserId,
      order: index + 1,
      isActive: true
    }));
    
    // Insert questions
    const insertedQuestions = await Question.insertMany(questionsWithMetadata);
    console.log(`✅ Successfully imported ${insertedQuestions.length} aptitude questions`);
    
    // Display summary
    const streamSummary = {};
    insertedQuestions.forEach(q => {
      q.streamMapping.forEach(stream => {
        streamSummary[stream] = (streamSummary[stream] || 0) + 1;
      });
    });
    
    console.log('\n📊 Stream Mapping Summary:');
    Object.entries(streamSummary).forEach(([stream, count]) => {
      console.log(`   ${stream}: ${count} questions`);
    });
    
    console.log('\n🎯 Categories imported:');
    const categories = [...new Set(insertedQuestions.map(q => q.category))];
    categories.forEach(category => {
      console.log(`   - ${category}`);
    });
    
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
    console.log('\n🎉 Import completed successfully!');
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





