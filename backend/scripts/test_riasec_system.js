import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RIASECQuestion from '../models/RIASECQuestion.js';
import riasecAnalyzer from '../services/riasecAnalyzer.js';

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

// Create sample RIASEC questions for testing
const createSampleRIASECQuestions = async () => {
  try {
    console.log('🔧 Creating sample RIASEC questions...');
    
    // Clear existing questions
    await RIASECQuestion.deleteMany({ category: 'career_interest' });
    
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Create 20 sample RIASEC questions
    const sampleQuestions = [
      {
        questionNumber: 1,
        text: "During a power outage at school, what are you most likely to do?",
        options: [
          { text: "Check the fuse box or try to restore basic wiring.", riasecType: "R", description: "Realistic" },
          { text: "Think about how electricity flows and what might have caused the fault.", riasecType: "I", description: "Investigative" },
          { text: "Imagine what it would be like if we lived without electricity and write a short story.", riasecType: "A", description: "Artistic" },
          { text: "Calm others down and make sure everyone feels safe.", riasecType: "S", description: "Social" }
        ],
        category: "career_interest",
        tags: ["problem-solving", "crisis-management"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 1,
        isActive: true,
        metadata: { estimatedTime: 30, weightage: 1.0, reliability: 0.85, validity: 0.8 }
      },
      {
        questionNumber: 2,
        text: "You have been given ₹1,000 to organize a classroom activity. What would you do?",
        options: [
          { text: "Purchase tools or materials to build something useful or fun.", riasecType: "R", description: "Realistic" },
          { text: "Conduct a survey and present your findings with graphs.", riasecType: "I", description: "Investigative" },
          { text: "Create a themed performance or mural with your classmates.", riasecType: "A", description: "Artistic" },
          { text: "Invite a speaker and coordinate the session with responsibilities assigned.", riasecType: "E", description: "Enterprising" }
        ],
        category: "career_interest",
        tags: ["leadership", "organization"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 2,
        isActive: true,
        metadata: { estimatedTime: 30, weightage: 1.0, reliability: 0.85, validity: 0.8 }
      },
      {
        questionNumber: 3,
        text: "You're volunteering at a village science camp. What role do you pick?",
        options: [
          { text: "Set up models and experiment kits for display.", riasecType: "R", description: "Realistic" },
          { text: "Explain the scientific concepts behind each experiment.", riasecType: "I", description: "Investigative" },
          { text: "Design the posters and visual elements for the event.", riasecType: "A", description: "Artistic" },
          { text: "Interact with visitors and guide them warmly through the exhibits.", riasecType: "S", description: "Social" }
        ],
        category: "career_interest",
        tags: ["volunteering", "science-communication"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 3,
        isActive: true,
        metadata: { estimatedTime: 30, weightage: 1.0, reliability: 0.85, validity: 0.8 }
      },
      {
        questionNumber: 4,
        text: "If your school launched a podcast, which role would excite you most?",
        options: [
          { text: "Handling the recording equipment and audio editing.", riasecType: "R", description: "Realistic" },
          { text: "Researching and scripting the content with depth.", riasecType: "I", description: "Investigative" },
          { text: "Performing, voice acting, or composing background scores.", riasecType: "A", description: "Artistic" },
          { text: "Hosting interviews and leading listener interactions.", riasecType: "E", description: "Enterprising" }
        ],
        category: "career_interest",
        tags: ["media", "communication"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 4,
        isActive: true,
        metadata: { estimatedTime: 30, weightage: 1.0, reliability: 0.85, validity: 0.8 }
      },
      {
        questionNumber: 5,
        text: "You see a broken bicycle on the road. What are you most inclined to do?",
        options: [
          { text: "Examine it mechanically to see if it can be fixed.", riasecType: "R", description: "Realistic" },
          { text: "Wonder what force or accident caused the damage.", riasecType: "I", description: "Investigative" },
          { text: "Capture a photo and write a social caption or story about it.", riasecType: "A", description: "Artistic" },
          { text: "Offer to help the person and calm the situation.", riasecType: "S", description: "Social" }
        ],
        category: "career_interest",
        tags: ["problem-solving", "empathy"],
        createdBy: adminUserId,
        lastModifiedBy: adminUserId,
        order: 5,
        isActive: true,
        metadata: { estimatedTime: 30, weightage: 1.0, reliability: 0.85, validity: 0.8 }
      }
    ];
    
    await RIASECQuestion.insertMany(sampleQuestions);
    console.log(`✅ Created ${sampleQuestions.length} sample RIASEC questions`);
    
    return sampleQuestions;
  } catch (error) {
    console.error('❌ Error creating sample RIASEC questions:', error);
    throw error;
  }
};

// Test RIASEC analysis system
const testRIASECSystem = async () => {
  try {
    console.log('🧪 Testing RIASEC analysis system...');
    
    // Create sample responses for different RIASEC profiles
    const testProfiles = [
      {
        name: "Science Student",
        responses: [
          { selectedRIASECType: "I" }, { selectedRIASECType: "I" }, { selectedRIASECType: "I" },
          { selectedRIASECType: "R" }, { selectedRIASECType: "R" }, { selectedRIASECType: "R" },
          { selectedRIASECType: "C" }, { selectedRIASECType: "C" }, { selectedRIASECType: "C" },
          { selectedRIASECType: "I" }, { selectedRIASECType: "I" }, { selectedRIASECType: "I" },
          { selectedRIASECType: "R" }, { selectedRIASECType: "R" }, { selectedRIASECType: "R" },
          { selectedRIASECType: "C" }, { selectedRIASECType: "C" }, { selectedRIASECType: "C" },
          { selectedRIASECType: "I" }, { selectedRIASECType: "I" }
        ]
      },
      {
        name: "Arts Student",
        responses: [
          { selectedRIASECType: "A" }, { selectedRIASECType: "A" }, { selectedRIASECType: "A" },
          { selectedRIASECType: "S" }, { selectedRIASECType: "S" }, { selectedRIASECType: "S" },
          { selectedRIASECType: "E" }, { selectedRIASECType: "E" }, { selectedRIASECType: "E" },
          { selectedRIASECType: "A" }, { selectedRIASECType: "A" }, { selectedRIASECType: "A" },
          { selectedRIASECType: "S" }, { selectedRIASECType: "S" }, { selectedRIASECType: "S" },
          { selectedRIASECType: "E" }, { selectedRIASECType: "E" }, { selectedRIASECType: "E" },
          { selectedRIASECType: "A" }, { selectedRIASECType: "A" }
        ]
      },
      {
        name: "Business Student",
        responses: [
          { selectedRIASECType: "E" }, { selectedRIASECType: "E" }, { selectedRIASECType: "E" },
          { selectedRIASECType: "C" }, { selectedRIASECType: "C" }, { selectedRIASECType: "C" },
          { selectedRIASECType: "I" }, { selectedRIASECType: "I" }, { selectedRIASECType: "I" },
          { selectedRIASECType: "E" }, { selectedRIASECType: "E" }, { selectedRIASECType: "E" },
          { selectedRIASECType: "C" }, { selectedRIASECType: "C" }, { selectedRIASECType: "C" },
          { selectedRIASECType: "I" }, { selectedRIASECType: "I" }, { selectedRIASECType: "I" },
          { selectedRIASECType: "E" }, { selectedRIASECType: "E" }
        ]
      }
    ];
    
    // Test each profile
    for (const profile of testProfiles) {
      console.log(`\n🎯 Testing ${profile.name} profile...`);
      
      try {
        // Calculate RIASEC scores
        const riasecAnalysis = riasecAnalyzer.calculateScores(profile.responses);
        console.log(`   📊 RIASEC Scores:`, riasecAnalysis.percentages);
        console.log(`   🏆 Top Two: ${riasecAnalysis.topTwo[0]?.name} (${riasecAnalysis.topTwo[0]?.percentage}%), ${riasecAnalysis.topTwo[1]?.name} (${riasecAnalysis.topTwo[1]?.percentage}%)`);
        
        // Generate stream recommendations
        const streamRecommendations = riasecAnalyzer.generateStreamRecommendations(riasecAnalysis);
        console.log(`   🎓 Primary Recommendation: ${streamRecommendations.primaryRecommendation.stream} (${streamRecommendations.primaryRecommendation.fitPercentage}% fit)`);
        console.log(`   💡 Reasoning: ${streamRecommendations.reasoning.dominantTraits}`);
        
        // Generate comprehensive report
        const report = riasecAnalyzer.generateReport(riasecAnalysis, streamRecommendations, { name: profile.name });
        console.log(`   📋 Report generated with ${report.insights.length} insights`);
        
      } catch (error) {
        console.error(`   ❌ Error testing ${profile.name}:`, error.message);
      }
    }
    
    // Test RIASEC types and stream mapping
    console.log('\n📚 Testing RIASEC types and stream mapping...');
    const riasecTypes = riasecAnalyzer.riasecTypes;
    const streamMapping = riasecAnalyzer.streamMapping;
    
    console.log('   RIASEC Types:', Object.keys(riasecTypes).join(', '));
    console.log('   Stream Mappings:', Object.keys(streamMapping).join(', '));
    
    // Test question statistics
    console.log('\n📈 Testing question statistics...');
    const totalQuestions = await RIASECQuestion.countDocuments({ isActive: true });
    console.log(`   Total RIASEC questions: ${totalQuestions}`);
    
    const riasecDistribution = await RIASECQuestion.getRIASECDistribution();
    console.log('   RIASEC Distribution:', riasecDistribution);
    
    console.log('\n🎉 RIASEC system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing RIASEC system:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createSampleRIASECQuestions();
    await testRIASECSystem();
    console.log('\n✅ All RIASEC tests completed successfully!');
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

export default testRIASECSystem;





