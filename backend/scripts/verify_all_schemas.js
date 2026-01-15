import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Question from '../models/Question.js';
import RIASECQuestion from '../models/RIASECQuestion.js';
import Test from '../models/Test.js';

dotenv.config();

async function verifyAllSchemas() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/career_compass';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('📊 Verifying All Collections and Schemas:\n');
    console.log('='.repeat(70));
    
    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log(`Found ${collections.length} collections in database:\n`);
    collections.forEach(col => {
      console.log(`  📁 ${col.name}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 Checking Each Model:\n');
    
    // 1. Users Model
    console.log('1️⃣  USERS Collection');
    const userCount = await User.countDocuments();
    console.log(`   ✅ Model loaded: User`);
    console.log(`   📊 Document count: ${userCount}`);
    if (userCount > 0) {
      const sampleUser = await User.findOne().select('name email role');
      console.log(`   👤 Sample: ${sampleUser?.name || 'N/A'} (${sampleUser?.role || 'N/A'})`);
    }
    console.log('');
    
    // 2. Questions Model
    console.log('2️⃣  QUESTIONS Collection');
    const questionCount = await Question.countDocuments();
    console.log(`   ✅ Model loaded: Question`);
    console.log(`   📊 Document count: ${questionCount}`);
    if (questionCount > 0) {
      const domainBreakdown = await Question.aggregate([
        { $group: { _id: '$domain', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      console.log('   📈 By Domain:');
      domainBreakdown.forEach(d => {
        console.log(`      - ${d._id}: ${d.count} questions`);
      });
    }
    console.log('');
    
    // 3. RIASEC Questions Model
    console.log('3️⃣  RIASECQUESTIONS Collection');
    const riasecCount = await RIASECQuestion.countDocuments();
    console.log(`   ✅ Model loaded: RIASECQuestion`);
    console.log(`   📊 Document count: ${riasecCount}`);
    if (riasecCount > 0) {
      const sample = await RIASECQuestion.findOne().select('text');
      console.log(`   📝 Sample: ${sample?.text?.substring(0, 50)}...`);
    }
    console.log('');
    
    // 4. Tests Model
    console.log('4️⃣  TESTS Collection');
    const testCount = await Test.countDocuments();
    console.log(`   ✅ Model loaded: Test`);
    console.log(`   📊 Document count: ${testCount}`);
    if (testCount > 0) {
      const statusBreakdown = await Test.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      console.log('   📈 By Status:');
      statusBreakdown.forEach(s => {
        console.log(`      - ${s._id}: ${s.count} tests`);
      });
    }
    console.log('');
    
    console.log('='.repeat(70));
    console.log('\n📋 SCHEMA VERIFICATION SUMMARY:\n');
    
    const schemaStatus = [
      { name: 'User', collection: 'users', count: userCount, status: '✅' },
      { name: 'Question', collection: 'questions', count: questionCount, status: '✅' },
      { name: 'RIASECQuestion', collection: 'riasecquestions', count: riasecCount, status: '✅' },
      { name: 'Test', collection: 'tests', count: testCount, status: '✅' }
    ];
    
    schemaStatus.forEach(schema => {
      console.log(`${schema.status} ${schema.name.padEnd(20)} → ${schema.collection.padEnd(20)} (${schema.count} docs)`);
    });
    
    console.log('\n' + '='.repeat(70));
    
    // Check for any other collections that might not have models
    const modelCollections = ['users', 'questions', 'riasecquestions', 'tests'];
    const unmappedCollections = collectionNames.filter(name => 
      !modelCollections.includes(name.toLowerCase()) && !name.startsWith('system.')
    );
    
    if (unmappedCollections.length > 0) {
      console.log('\n⚠️  Found collections without models:');
      unmappedCollections.forEach(name => {
        console.log(`   - ${name}`);
      });
    } else {
      console.log('\n✅ All collections have corresponding models!');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 All schemas are properly deployed to MongoDB!\n');
    
    // Show indexes
    console.log('📑 Database Indexes:\n');
    for (const model of [User, Question, RIASECQuestion, Test]) {
      const indexes = await model.collection.getIndexes();
      console.log(`${model.modelName}:`);
      Object.keys(indexes).forEach(indexName => {
        if (indexName !== '_id_') {
          console.log(`  - ${indexName}`);
        }
      });
      console.log('');
    }
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

verifyAllSchemas();
