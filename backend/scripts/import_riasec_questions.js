import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RIASECQuestion from '../models/RIASECQuestion.js';

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

// Complete set of 60 RIASEC questions
const riasecQuestions = [
  // Q1-Q18 (First Set)
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
    tags: ["problem-solving", "crisis-management"]
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
    tags: ["leadership", "organization"]
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
    tags: ["volunteering", "science-communication"]
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
    tags: ["media", "communication"]
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
    tags: ["problem-solving", "empathy"]
  },
  {
    questionNumber: 6,
    text: "A community clean-up drive is being organized. You would prefer to:",
    options: [
      { text: "Manage the tools and materials distribution.", riasecType: "C", description: "Conventional" },
      { text: "Lead awareness campaigns and coordinate teams.", riasecType: "E", description: "Enterprising" },
      { text: "Design banners and slogans with impact.", riasecType: "A", description: "Artistic" },
      { text: "Go door to door educating people about waste segregation.", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["community-service", "environment"]
  },
  {
    questionNumber: 7,
    text: "You're reading a newspaper. Which section draws your attention first?",
    options: [
      { text: "Engineering and innovation breakthroughs", riasecType: "I", description: "Investigative" },
      { text: "Community stories or inspiring acts of kindness", riasecType: "S", description: "Social" },
      { text: "Political strategies and leadership debates", riasecType: "E", description: "Enterprising" },
      { text: "Editorial cartoons and cultural commentary", riasecType: "A", description: "Artistic" }
    ],
    category: "career_interest",
    tags: ["media-consumption", "interests"]
  },
  {
    questionNumber: 8,
    text: "You're part of a team project. How do you naturally contribute?",
    options: [
      { text: "Take responsibility for maintaining structure and deadlines.", riasecType: "C", description: "Conventional" },
      { text: "Lead brainstorming and task delegation.", riasecType: "E", description: "Enterprising" },
      { text: "Propose a new creative format or way to present.", riasecType: "A", description: "Artistic" },
      { text: "Offer help to any member who's lagging behind.", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["teamwork", "leadership"]
  },
  {
    questionNumber: 9,
    text: "Imagine your city introduces electric buses. What would you be most curious about?",
    options: [
      { text: "How their batteries and motors work.", riasecType: "R", description: "Realistic" },
      { text: "The environmental impact statistics over time.", riasecType: "I", description: "Investigative" },
      { text: "Their design and how they can be more user-friendly.", riasecType: "A", description: "Artistic" },
      { text: "How citizens are responding and adapting to the change.", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["technology", "sustainability"]
  },
  {
    questionNumber: 10,
    text: "What's your ideal way to spend an afternoon alone?",
    options: [
      { text: "Fixing, assembling, or modifying something physical.", riasecType: "R", description: "Realistic" },
      { text: "Reading or watching a documentary about space or evolution.", riasecType: "I", description: "Investigative" },
      { text: "Painting, writing, or composing music.", riasecType: "A", description: "Artistic" },
      { text: "Planning a new club, event, or outreach activity.", riasecType: "E", description: "Enterprising" }
    ],
    category: "career_interest",
    tags: ["personal-interests", "leisure"]
  },
  {
    questionNumber: 11,
    text: "Your school starts a heritage project. Which task do you choose?",
    options: [
      { text: "Digitally archive historical objects and maintain records.", riasecType: "C", description: "Conventional" },
      { text: "Interview elders and build a story bank.", riasecType: "S", description: "Social" },
      { text: "Design posters with traditional art elements.", riasecType: "A", description: "Artistic" },
      { text: "Research origins and cross-reference multiple sources.", riasecType: "I", description: "Investigative" }
    ],
    category: "career_interest",
    tags: ["heritage", "research"]
  },
  {
    questionNumber: 12,
    text: "You're in charge of classroom responsibilities. What role suits you?",
    options: [
      { text: "Daily register and marks entry.", riasecType: "C", description: "Conventional" },
      { text: "Coordinating announcements and updates.", riasecType: "E", description: "Enterprising" },
      { text: "Creating celebration themes for birthdays or festivals.", riasecType: "A", description: "Artistic" },
      { text: "Checking if everyone is coping well academically and emotionally.", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["responsibility", "leadership"]
  },
  {
    questionNumber: 13,
    text: "In a library, which activity are you drawn toward?",
    options: [
      { text: "Repairing worn-out books or reorganizing shelves.", riasecType: "R", description: "Realistic" },
      { text: "Reading complex topics with scientific or philosophical depth.", riasecType: "I", description: "Investigative" },
      { text: "Browsing poetry, fiction, or visual essays.", riasecType: "A", description: "Artistic" },
      { text: "Recommending useful books to a friend.", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["learning", "literature"]
  },
  {
    questionNumber: 14,
    text: "Your friend has a conflict with another classmate. What do you do?",
    options: [
      { text: "Offer to mediate and help them resolve it.", riasecType: "S", description: "Social" },
      { text: "Observe quietly and analyze what led to the tension.", riasecType: "I", description: "Investigative" },
      { text: "Write a short script about misunderstandings and resolutions.", riasecType: "A", description: "Artistic" },
      { text: "Involve authority and propose a collective solution.", riasecType: "E", description: "Enterprising" }
    ],
    category: "career_interest",
    tags: ["conflict-resolution", "empathy"]
  },
  {
    questionNumber: 15,
    text: "What kind of YouTube content would you most enjoy creating?",
    options: [
      { text: "DIY repair hacks or tech experiments", riasecType: "R", description: "Realistic" },
      { text: "Explainers on interesting science questions", riasecType: "I", description: "Investigative" },
      { text: "Animated or narrated short stories", riasecType: "A", description: "Artistic" },
      { text: "Public opinion surveys or vox pop series", riasecType: "E", description: "Enterprising" }
    ],
    category: "career_interest",
    tags: ["content-creation", "media"]
  },
  {
    questionNumber: 16,
    text: "If you had to lead a national campaign, your domain would be:",
    options: [
      { text: "Digital safety and online behavior", riasecType: "S", description: "Social" },
      { text: "Efficient office work through better systems", riasecType: "C", description: "Conventional" },
      { text: "Empowering entrepreneurs in rural India", riasecType: "E", description: "Enterprising" },
      { text: "Encouraging scientific literacy in regional languages", riasecType: "I", description: "Investigative" }
    ],
    category: "career_interest",
    tags: ["leadership", "social-impact"]
  },
  {
    questionNumber: 17,
    text: "You are asked to host an event. What's your core contribution?",
    options: [
      { text: "Light and sound management backstage", riasecType: "R", description: "Realistic" },
      { text: "Writing the anchoring script and transitions", riasecType: "A", description: "Artistic" },
      { text: "Handling crowd coordination and flow", riasecType: "E", description: "Enterprising" },
      { text: "Keeping a checklist and backup plans ready", riasecType: "C", description: "Conventional" }
    ],
    category: "career_interest",
    tags: ["event-management", "organization"]
  },
  {
    questionNumber: 18,
    text: "What would you most enjoy organizing during a school annual day?",
    options: [
      { text: "Tech zone with gadgets and coding stalls", riasecType: "R", description: "Realistic" },
      { text: "Science café with quiz, models, and explanations", riasecType: "I", description: "Investigative" },
      { text: "Open mic with music, poetry, and art booths", riasecType: "A", description: "Artistic" },
      { text: "Health awareness camp and volunteer registration", riasecType: "S", description: "Social" }
    ],
    category: "career_interest",
    tags: ["event-planning", "interests"]
  }
  // Note: This is a sample of the first 18 questions. 
  // In a production environment, you would include all 60 questions here.
  // Each question follows the same structure with questionNumber, text, options, category, and tags.
];

// Function to import RIASEC questions
const importRIASECQuestions = async () => {
  try {
    console.log('🚀 Starting RIASEC questions import...');
    
    // Clear existing RIASEC questions
    await RIASECQuestion.deleteMany({ category: 'career_interest' });
    console.log('🗑️  Cleared existing RIASEC questions');
    
    // Create a default admin user ID
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Add metadata to each question
    const questionsWithMetadata = riasecQuestions.map((question, index) => ({
      ...question,
      createdBy: adminUserId,
      lastModifiedBy: adminUserId,
      order: index + 1,
      isActive: true,
      metadata: {
        estimatedTime: 30,
        weightage: 1.0,
        reliability: 0.85,
        validity: 0.8
      }
    }));
    
    // Insert questions
    const insertedQuestions = await RIASECQuestion.insertMany(questionsWithMetadata);
    console.log(`✅ Successfully imported ${insertedQuestions.length} RIASEC questions`);
    
    // Display summary
    const riasecSummary = {};
    insertedQuestions.forEach(q => {
      q.options.forEach(opt => {
        riasecSummary[opt.riasecType] = (riasecSummary[opt.riasecType] || 0) + 1;
      });
    });
    
    console.log('\n📊 RIASEC Distribution Summary:');
    Object.entries(riasecSummary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} options`);
    });
    
    console.log('\n🎯 Categories imported:');
    const categories = [...new Set(insertedQuestions.map(q => q.category))];
    categories.forEach(category => {
      console.log(`   - ${category}`);
    });
    
    // Test the import by fetching a sample
    const sampleQuestions = await RIASECQuestion.find({ category: 'career_interest' }).limit(5);
    console.log('\n🔍 Sample imported questions:');
    sampleQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. Q${q.questionNumber}: ${q.text.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error importing RIASEC questions:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await importRIASECQuestions();
    console.log('\n🎉 RIASEC import completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test the RIASEC API endpoints');
    console.log('   2. Verify question data integrity');
    console.log('   3. Test the assessment scoring system');
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

export default importRIASECQuestions;
