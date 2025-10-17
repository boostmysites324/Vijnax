#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Aptitude Questions Import Process...\n');

const runImport = async () => {
  try {
    console.log('📦 Running aptitude questions import...');
    
    // Run the import script
    const { stdout, stderr } = await execAsync(
      `node ${path.join(__dirname, 'import_all_aptitude_questions.js')}`,
      { cwd: path.join(__dirname, '..') }
    );
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr) {
      console.error('⚠️  Warnings:', stderr);
    }
    
    console.log('\n✅ Import process completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
};

// Run the import
runImport();





