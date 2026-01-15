# Career Compass - Question Import System

## Overview

I've created a comprehensive question import system that parses all questions from the Content MD files and imports them into MongoDB with proper randomization support.

## What's Been Created

### 1. Import Script (`scripts/import_all_sections.js`)
- Parses all 7 sections (A-G) from the MD files
- Handles the single-line format of the content files
- Imports questions into proper MongoDB collections
- Supports **randomization** as per the test blueprint

### 2. Enhanced Question Selector (`services/enhancedQuestionSelector.js`)
- Implements proper randomization logic
- Selects 10 questions per section (60 total)
- Ensures balanced distribution across categories
- Shuffles questions using Fisher-Yates algorithm
- Returns structured test data

### 3. New API Endpoint (`/api/tests/generate/enhanced`)
- Generates randomized 60-question tests
- Follows Career Compass Test Blueprint structure
- Supports user stream preference (PCM/PCB/Commerce/Humanities)

## Test Structure

The system generates tests with this structure:

| Section | Name | Questions | Description |
|---------|------|-----------|-------------|
| A | Aptitude | 10 | Mathematical, Verbal, Pattern, Scientific, Quantitative |
| B | Career Interest (RIASEC) | 10 | R, I, A, S, E, C types |
| C | Decision Making | 10 | Ethical scenarios |
| D | Emotional Intelligence | 10 | Empathy, regulation, conflict |
| E | Learning Orientation | 10 | Study habits, persistence |
| F | Big Five Personality | 10 | C, O, A, E, S traits |
| **Total** | | **60** | |

## How to Run the Import

### Step 1: Ensure MongoDB is Running

```bash
# Start MongoDB (if using local installation)
mongod

# Or if using MongoDB service
brew services start mongodb-community

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 2: Set Environment Variables

Make sure your `.env` file has:

```env
MONGODB_URI=mongodb://localhost:27017/careercompass
```

### Step 3: Run the Import Script

```bash
cd /Users/animesh/Documents/BoostMySites/Vijnax/backend
node scripts/import_all_sections.js
```

### Expected Output:

```
🚀 Starting comprehensive question import...

✅ Connected to MongoDB

📖 Parsing Section A - Aptitude Questions...
   Parsed 160 questions
✅ Imported 160 aptitude questions

📖 Parsing Section B - RIASEC Questions...
   Parsed 60 questions
✅ Imported 60 RIASEC questions

📖 Parsing Section C - Decision Making Questions...
   Parsed 90 questions
✅ Imported 90 decision-making questions

📖 Parsing Section D - ESI Questions...
   Parsed 60 questions
✅ Imported 60 ESI questions

📖 Parsing Section E - Learning Orientation Questions...
   Parsed 60 questions
✅ Imported 60 learning orientation questions

📖 Parsing Section F - Big Five Personality Questions...
   Parsed 108 questions
✅ Imported 108 Big Five personality questions

📖 Parsing Section G - Work Values Questions...
   Parsed 36 questions
✅ Imported 36 work values questions

============================================================
📊 IMPORT SUMMARY
============================================================
Aptitude Questions:        160
RIASEC Questions:           60
Decision Making Questions:  90
ESI Questions:              60
Learning Questions:         60
Big Five Questions:        108
Work Values Questions:      36
============================================================
TOTAL QUESTIONS:           574
============================================================

✨ All questions successfully imported!
```

## How to Use the Enhanced Test Generator

### API Request

```http
POST /api/tests/generate/enhanced
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "userStream": "PCM"
}
```

### API Response

```json
{
  "success": true,
  "message": "Test generated successfully with randomization",
  "data": {
    "total": 60,
    "sections": [
      {
        "section": "A",
        "name": "Aptitude",
        "count": 10
      },
      {
        "section": "B",
        "name": "Career Interest",
        "count": 10
      },
      ...
    ],
    "questions": [
      {
        "questionNumber": 1,
        "questionId": "...",
        "text": "Question text...",
        "options": [
          {
            "text": "Option A",
            "isCorrect": false,
            "score": 0
          },
          ...
        ],
        "domain": "aptitude",
        "category": "mathematical_logic",
        "tags": ["PCM"],
        "metadata": {
          "estimatedTime": 60,
          "weightage": 1
        }
      },
      ...
    ],
    "metadata": {
      "generatedAt": "2026-01-14T...",
      "userStream": "PCM",
      "version": "2.0",
      "structure": "Career Compass 60Q Blueprint"
    }
  }
}
```

## Randomization Features

### 1. Section-Level Randomization
- Questions within each section are randomly selected from the pool
- Each test attempt gets different questions

### 2. Balanced Distribution
- Aptitude: 2 questions per category (Math, Verbal, Pattern, Scientific, Quantitative)
- RIASEC: Ensures all 6 types are represented
- Big Five: Balanced across C, O, A, E, S traits

### 3. Stream-Aware Selection
- If user stream is provided, prefers stream-relevant questions
- Falls back to generic questions if stream-specific pool is insufficient

### 4. Fisher-Yates Shuffle
- Uses proper randomization algorithm
- Prevents predictable patterns
- Ensures fair distribution

## Database Collections

### `questions` Collection
Stores questions for:
- Section A (Aptitude)
- Section C (Decision Making)
- Section D (ESI)
- Section E (Learning Orientation)
- Section F (Big Five Personality)

Fields:
```javascript
{
  questionNumber: Number,
  text: String,
  options: [
    {
      text: String,
      isCorrect: Boolean,
      score: Number,
      mappedStream: String,
      mappedTrait: String
    }
  ],
  domain: String,        // 'aptitude', 'personality', 'values', 'skills'
  category: String,      // specific category
  difficulty: String,
  type: String,
  isActive: Boolean,
  tags: [String],
  streamMapping: [String],
  metadata: {
    estimatedTime: Number,
    weightage: Number,
    reliability: Number,
    validity: Number
  }
}
```

### `riasecquestions` Collection
Stores Section B (Career Interest) questions:

Fields:
```javascript
{
  questionNumber: Number,
  text: String,
  options: [
    {
      text: String,
      riasecType: String,  // 'R', 'I', 'A', 'S', 'E', 'C'
      description: String
    }
  ],
  category: 'career_interest',
  isActive: Boolean,
  order: Number,
  tags: [String],
  metadata: { ... }
}
```

## Testing the System

### 1. Check Question Counts

```bash
# Connect to MongoDB
mongosh

# Switch to database
use careercompass

# Count questions by category
db.questions.countDocuments({ domain: 'aptitude' })
db.questions.countDocuments({ category: 'decision_making' })
db.questions.countDocuments({ category: 'emotional_intelligence' })
db.questions.countDocuments({ category: 'learning_style' })
db.questions.countDocuments({ category: 'personality_traits' })
db.riasecquestions.countDocuments()
```

### 2. Test the Enhanced Selector

```bash
# Create a test file
node -e "
import selector from './services/enhancedQuestionSelector.js';
const test = await selector.selectAllTestQuestions('PCM');
console.log('Total questions:', test.total);
console.log('Sections:', test.structure.map(s => ({ name: s.name, count: s.count })));
"
```

### 3. Test the API Endpoint

```bash
# First, get a JWT token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Then use the token to generate a test
curl -X POST http://localhost:5000/api/tests/generate/enhanced \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"userStream":"PCM"}'
```

## Troubleshooting

### Issue: "No questions found"
- **Solution**: Run the import script first to populate the database

### Issue: "Fewer than 10 questions in a section"
- **Solution**: Check if all questions were imported correctly
- Run diagnostics: `db.questions.countDocuments({ category: 'category_name' })`

### Issue: "Same questions appearing repeatedly"
- **Solution**: Increase the question pool by importing more questions
- The randomization works but needs sufficient pool size

### Issue: Import script fails
- **Solution**: Check MongoDB connection
- Ensure content MD files are in the correct location
- Check file encoding (should be UTF-8)

## Next Steps

1. **Run the import** to populate your database
2. **Test the enhanced endpoint** to verify randomization
3. **Integrate frontend** to use the new endpoint
4. **Add scoring logic** for each section type
5. **Create report generation** based on responses

## Files Modified/Created

- ✅ `/backend/scripts/import_all_sections.js` - Import script
- ✅ `/backend/services/enhancedQuestionSelector.js` - Selection service
- ✅ `/backend/routes/tests.js` - Added `/generate/enhanced` endpoint
- ✅ `/backend/IMPORT_QUESTIONS_README.md` - This documentation

## Questions Imported

Based on the content files:

- **Section A**: ~160 Aptitude questions (all difficulty levels, all streams)
- **Section B**: ~60 RIASEC questions (covering all 6 types)
- **Section C**: ~90 Decision Making scenarios
- **Section D**: ~60 ESI questions (Empathy, Regulation, Conflict, Self-awareness)
- **Section E**: ~60 Learning Orientation questions
- **Section F**: ~108 Big Five Personality questions (C, O, A, E, S traits)
- **Section G**: ~36 Work Values questions

**Total Pool**: ~574 questions

This provides **9.5x redundancy** for the 60-question test, ensuring excellent randomization and minimal repetition.

---

**Created by**: AI Assistant
**Date**: January 14, 2026
**Version**: 2.0
