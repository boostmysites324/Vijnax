console.log('🚀 Starting simple test...');

try {
  console.log('✅ Basic Node.js execution works');
  console.log('📦 Testing imports...');
  
  // Test basic import
  import('./models/Question.js').then(() => {
    console.log('✅ Question model import successful');
  }).catch(err => {
    console.error('❌ Question model import failed:', err.message);
  });
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
}





