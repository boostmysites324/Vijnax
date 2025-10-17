import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import questionSelector from '../services/questionSelector.js';

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

// Create sample questions for testing
const createSampleQuestions = async () => {
  try {
    console.log('🔧 Creating sample aptitude questions...');
    
    // Clear existing questions
    await Question.deleteMany({ domain: 'aptitude' });
    
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Create 20 sample questions (5 per category)
    const sampleQuestions = [
      // Math/Logic Questions
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 1,
        isActive: true,
        metadata: { estimatedTime: 90, weightage: 1.2, reliability: 0.9, validity: 0.85 }
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
        skill: "Percent-to-whole inversion",
        tags: ["percentage", "calculation"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 2,
        isActive: true,
        metadata: { estimatedTime: 60, weightage: 1.1, reliability: 0.87, validity: 0.89 }
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
        skill: "Financial reasoning through ratios",
        tags: ["ratio", "proportion", "financial"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 3,
        isActive: true,
        metadata: { estimatedTime: 75, weightage: 1.1, reliability: 0.86, validity: 0.88 }
      },
      {
        text: "A square plot has an area of 484 m². What is its perimeter?",
        options: [
          { text: "88", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "96", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "100", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "110", isCorrect: true, score: 10, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "geometry_reasoning",
        difficulty: "medium",
        type: "multiple_choice",
        correctAnswer: "D",
        explanation: "Area = 484 m², so side = √484 = 22 m. Perimeter = 4 × 22 = 88 m",
        streamMapping: ["PCM"],
        skill: "Area-root-perimeter transformation",
        tags: ["geometry", "area", "perimeter"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 4,
        isActive: true,
        metadata: { estimatedTime: 90, weightage: 1.2, reliability: 0.88, validity: 0.87 }
      },
      {
        text: "A man spends 1/3 of his salary on rent, 1/4 on groceries, and 1/5 on school fees. If he is left with ₹1,200, what is his salary?",
        options: [
          { text: "₹3,600", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "₹4,800", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "₹6,000", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "₹7,200", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "arithmetic_logic",
        difficulty: "hard",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "Let salary be x. Spent = x/3 + x/4 + x/5 = 47x/60. Remaining = 13x/60 = 1200. So x = 6000",
        streamMapping: ["Commerce", "PCM"],
        skill: "Multi-step fraction arithmetic",
        tags: ["fractions", "arithmetic", "word-problem"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 5,
        isActive: true,
        metadata: { estimatedTime: 120, weightage: 1.3, reliability: 0.85, validity: 0.9 }
      },
      
      // Scientific/Abstract Questions
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 6,
        isActive: true,
        metadata: { estimatedTime: 90, weightage: 1.2, reliability: 0.88, validity: 0.91 }
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 7,
        isActive: true,
        metadata: { estimatedTime: 60, weightage: 1.0, reliability: 0.92, validity: 0.88 }
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 8,
        isActive: true,
        metadata: { estimatedTime: 45, weightage: 0.8, reliability: 0.85, validity: 0.82 }
      },
      {
        text: "A balloon kept in sunlight bursts after some time. The most likely reason is:",
        options: [
          { text: "Friction", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Expansion of air inside", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Sound exposure", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Radiowave interference", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "scientific_pattern",
        difficulty: "medium",
        type: "multiple_choice",
        correctAnswer: "B",
        explanation: "Heat causes air molecules to expand, increasing pressure inside the balloon",
        streamMapping: ["PCM", "PCB"],
        skill: "Cause-effect inference in physics",
        tags: ["physics", "heat", "expansion"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 9,
        isActive: true,
        metadata: { estimatedTime: 75, weightage: 1.1, reliability: 0.87, validity: 0.89 }
      },
      {
        text: "A candle in a jar extinguishes after a while. Why?",
        options: [
          { text: "It gets tired", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "All wax melts", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Oxygen runs out", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Heat reduces", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "scientific_deduction",
        difficulty: "easy",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "Combustion requires oxygen. In a closed jar, oxygen gets depleted",
        streamMapping: ["PCB"],
        skill: "Environmental reasoning",
        tags: ["combustion", "oxygen", "chemistry"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 10,
        isActive: true,
        metadata: { estimatedTime: 60, weightage: 1.0, reliability: 0.86, validity: 0.88 }
      },
      
      // Spatial Questions
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 11,
        isActive: true,
        metadata: { estimatedTime: 120, weightage: 1.5, reliability: 0.91, validity: 0.87 }
      },
      {
        text: "A triangle has sides 5 cm, 12 cm, and 13 cm. It is a:",
        options: [
          { text: "Right triangle", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Scalene triangle", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Isosceles triangle", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Equilateral triangle", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "geometry_reasoning",
        difficulty: "medium",
        type: "multiple_choice",
        correctAnswer: "A",
        explanation: "5² + 12² = 25 + 144 = 169 = 13². This satisfies the Pythagorean theorem",
        streamMapping: ["PCM"],
        skill: "Pythagorean logic",
        tags: ["geometry", "pythagorean", "triangles"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 12,
        isActive: true,
        metadata: { estimatedTime: 90, weightage: 1.2, reliability: 0.89, validity: 0.9 }
      },
      {
        text: "What is the area of a circle with radius 7 cm? (Use π = 22/7)",
        options: [
          { text: "154 cm²", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "147 cm²", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "144 cm²", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "150 cm²", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "geometry_reasoning",
        difficulty: "medium",
        type: "multiple_choice",
        correctAnswer: "A",
        explanation: "Area = πr² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm²",
        streamMapping: ["PCM"],
        skill: "Geometry application",
        tags: ["geometry", "circle", "area"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 13,
        isActive: true,
        metadata: { estimatedTime: 75, weightage: 1.1, reliability: 0.88, validity: 0.89 }
      },
      {
        text: "A triangle has two equal sides. What is it called?",
        options: [
          { text: "Equilateral", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Right-angled", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Isosceles", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Scalene", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "geometry_reasoning",
        difficulty: "easy",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "A triangle with two equal sides is called isosceles",
        streamMapping: ["PCM"],
        skill: "Geometry vocabulary and classification",
        tags: ["geometry", "triangles", "classification"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 14,
        isActive: true,
        metadata: { estimatedTime: 45, weightage: 0.9, reliability: 0.87, validity: 0.85 }
      },
      {
        text: "What is the volume of a cube with side 5 cm?",
        options: [
          { text: "125 cm³", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "100 cm³", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "150 cm³", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "200 cm³", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "spatial_ability",
        difficulty: "easy",
        type: "multiple_choice",
        correctAnswer: "A",
        explanation: "Volume = side³ = 5³ = 125 cm³",
        streamMapping: ["PCM"],
        skill: "3D geometry",
        tags: ["volume", "cube", "3d"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 15,
        isActive: true,
        metadata: { estimatedTime: 60, weightage: 1.0, reliability: 0.86, validity: 0.88 }
      },
      
      // Verbal Questions
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 16,
        isActive: true,
        metadata: { estimatedTime: 75, weightage: 1.1, reliability: 0.88, validity: 0.9 }
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
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 17,
        isActive: true,
        metadata: { estimatedTime: 75, weightage: 1.0, reliability: 0.89, validity: 0.84 }
      },
      {
        text: "If all poets are dreamers, and no dreamers are practical, then:",
        options: [
          { text: "All poets are practical", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Some poets are practical", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "No poet is practical", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Cannot be determined", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "deductive_chain",
        difficulty: "hard",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "All poets are dreamers, no dreamers are practical, therefore no poets are practical",
        streamMapping: ["Humanities"],
        skill: "Validity of syllogisms",
        tags: ["logic", "syllogism", "deduction"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 18,
        isActive: true,
        metadata: { estimatedTime: 90, weightage: 1.3, reliability: 0.9, validity: 0.92 }
      },
      {
        text: "\"All essays must be submitted by Friday. If not, marks will be deducted.\" Which statement is true?",
        options: [
          { text: "Marks are deducted for Friday submissions", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Early submission leads to bonus", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Late submissions lead to mark deduction", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Essays are optional", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "reading_comprehension",
        difficulty: "medium",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "The statement clearly indicates that late submissions (after Friday) will result in mark deduction",
        streamMapping: ["Humanities"],
        skill: "Comprehension of conditional statements",
        tags: ["reading", "comprehension", "conditional"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 19,
        isActive: true,
        metadata: { estimatedTime: 60, weightage: 1.0, reliability: 0.87, validity: 0.89 }
      },
      {
        text: "Which of the following doesn't belong: Integrity, Honesty, Deceit, Loyalty",
        options: [
          { text: "Integrity", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Honesty", isCorrect: false, score: 0, domain: "aptitude" },
          { text: "Deceit", isCorrect: true, score: 10, domain: "aptitude" },
          { text: "Loyalty", isCorrect: false, score: 0, domain: "aptitude" }
        ],
        domain: "aptitude",
        category: "classification_logic",
        difficulty: "easy",
        type: "multiple_choice",
        correctAnswer: "C",
        explanation: "Deceit is the only negative trait among the positive values listed",
        streamMapping: ["Humanities"],
        skill: "Values + verbal analysis skill",
        tags: ["classification", "values", "analysis"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 20,
        isActive: true,
        metadata: { estimatedTime: 45, weightage: 0.9, reliability: 0.85, validity: 0.87 }
      }
    ];
    
    await Question.insertMany(sampleQuestions);
    console.log(`✅ Created ${sampleQuestions.length} sample aptitude questions`);
    
    return sampleQuestions;
  } catch (error) {
    console.error('❌ Error creating sample questions:', error);
    throw error;
  }
};

// Test the aptitude system
const testAptitudeSystem = async () => {
  try {
    console.log('🧪 Testing aptitude question selection system...');
    
    // Test question selection for different streams
    const streams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
    
    for (const stream of streams) {
      console.log(`\n🎯 Testing ${stream} stream...`);
      
      try {
        const questions = await questionSelector.selectAptitudeQuestions(stream, {
          mathLogicCount: 4,
          scientificAbstractCount: 3,
          spatialCount: 2,
          verbalCount: 3
        });
        
        console.log(`   ✅ Selected ${questions.length} questions for ${stream}`);
        
        // Analyze selection
        const categoryCount = {
          mathLogic: 0,
          scientificAbstract: 0,
          spatial: 0,
          verbal: 0
        };
        
        questions.forEach(q => {
          if (questionSelector.categories.MATH_LOGIC.includes(q.category)) {
            categoryCount.mathLogic++;
          } else if (questionSelector.categories.SCIENTIFIC_ABSTRACT.includes(q.category)) {
            categoryCount.scientificAbstract++;
          } else if (questionSelector.categories.SPATIAL.includes(q.category)) {
            categoryCount.spatial++;
          } else if (questionSelector.categories.VERBAL.includes(q.category)) {
            categoryCount.verbal++;
          }
        });
        
        console.log(`   📊 Math/Logic: ${categoryCount.mathLogic}`);
        console.log(`   🔬 Scientific/Abstract: ${categoryCount.scientificAbstract}`);
        console.log(`   🧩 Spatial: ${categoryCount.spatial}`);
        console.log(`   📝 Verbal: ${categoryCount.verbal}`);
        
      } catch (error) {
        console.error(`   ❌ Error testing ${stream}:`, error.message);
      }
    }
    
    // Test statistics
    console.log('\n📈 Testing question statistics...');
    const stats = await questionSelector.getQuestionStats();
    console.log(`   Total questions: ${stats.total}`);
    console.log(`   By category:`, stats.byCategory);
    console.log(`   By stream:`, stats.byStream);
    console.log(`   By difficulty:`, stats.byDifficulty);
    
    console.log('\n🎉 Aptitude system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing aptitude system:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createSampleQuestions();
    await testAptitudeSystem();
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
};

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default testAptitudeSystem;





