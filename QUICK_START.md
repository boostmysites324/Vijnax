# 🚀 Quick Start Guide - Career Compass

## ✅ What's Done

**All 451 questions from sections A-G are now in your MongoDB database and fully randomized!**

---

## 🎯 Start Using It Right Now

### 1. **Start the Backend Server**
```bash
cd backend
MONGODB_URI="mongodb+srv://Vijnax:UXa7NeoPBb6aoUCy@cluster0.v6qes9v.mongodb.net/career_compass" node server.js
```

### 2. **Generate a Test** (using curl)
```bash
curl -X POST http://localhost:5000/api/tests/generate/randomized \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"userStream": "PCM"}' \
  | jq '.' > test_output.json
```

Or use this simplified version:
```bash
curl -X POST http://localhost:5000/api/tests/generate/randomized \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"userStream": "PCM"}'
```

### 3. **View the Results**
The response will contain:
- **60 fully randomized questions**
- Question text and options
- Section metadata
- Stream mappings
- Categories and tags

---

## 📱 Frontend Integration

### Update your React test component:

```typescript
// src/pages/test/page.tsx

const fetchTest = async () => {
  try {
    const response = await fetch('/api/tests/generate/randomized', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` // or use 'Bearer demo-token'
      },
      body: JSON.stringify({ 
        userStream: userStream || 'PCM' 
      })
    });

    const result = await response.json();
    
    if (result.success) {
      const { questions, sections, metadata } = result.data;
      
      // Set state with questions
      setQuestions(questions);
      setSections(sections);
      setTotalQuestions(result.data.total);
      
      console.log(`✅ Loaded ${questions.length} randomized questions`);
      console.log('Sections:', sections);
    }
  } catch (error) {
    console.error('Failed to load test:', error);
  }
};
```

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
# MongoDB
MONGODB_URI=mongodb+srv://Vijnax:UXa7NeoPBb6aoUCy@cluster0.v6qes9v.mongodb.net/career_compass

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

---

## 📊 Question Pools

| Section | Questions | Selected per Test |
|---------|-----------|-------------------|
| A - Aptitude | 99 | 15 |
| B - RIASEC | 56 | 10 |
| C - Decision Making | 38 | 6 |
| D - ESI | 60 | 6 |
| E - Learning | 58 | 8 |
| F - Personality | 105 | 10 |
| G - Work Values | 35 | 5 |
| **TOTAL** | **451** | **60** |

---

## ⚡ Quick Commands

### Import Questions (if needed)
```bash
cd backend
MONGODB_URI="mongodb+srv://Vijnax:UXa7NeoPBb6aoUCy@cluster0.v6qes9v.mongodb.net/career_compass" \
node scripts/import_all_sections.js
```

### Test Question Selection
```bash
cd backend
MONGODB_URI="mongodb+srv://Vijnax:UXa7NeoPBb6aoUCy@cluster0.v6qes9v.mongodb.net/career_compass" \
node scripts/test_question_selection.js
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd ../
npm run dev
```

---

## 🎓 Response Format

```json
{
  "success": true,
  "message": "Test generated successfully with complete randomization",
  "data": {
    "total": 60,
    "sections": [
      { "section": "A", "name": "Aptitude", "count": 15 },
      { "section": "B", "name": "Career Interests (RIASEC)", "count": 10 },
      { "section": "C", "name": "Decision Making", "count": 6 },
      { "section": "D", "name": "Emotional & Social Intelligence", "count": 6 },
      { "section": "E", "name": "Learning Orientation", "count": 8 },
      { "section": "F", "name": "Personality Traits", "count": 10 },
      { "section": "G", "name": "Work Values", "count": 5 }
    ],
    "questions": [
      {
        "questionNumber": 1,
        "questionId": "...",
        "text": "Question text here",
        "options": [
          {
            "text": "Option A",
            "score": 5,
            "domain": "aptitude",
            "isCorrect": false
          },
          // ... more options
        ],
        "domain": "aptitude",
        "category": "numerical_ability",
        "tags": ["PCM", "PCB"],
        "section": "A"
      },
      // ... 59 more questions
    ],
    "metadata": {
      "generatedAt": "2026-01-15T...",
      "userStream": "PCM",
      "version": "3.0",
      "structure": "Career Compass - Fully Randomized",
      "totalPool": {
        "aptitude": 99,
        "riasec": 56,
        "decision": 38,
        "esi": 60,
        "learning": 58,
        "personality": 105,
        "workValues": 35
      }
    }
  }
}
```

---

## 🎯 Next Steps (Optional)

### 1. **Implement Scoring** (TODO)
- Create scoring logic for each section type
- Calculate RIASEC profile (R, I, A, S, E, C scores)
- Calculate Big Five profile (C, O, A, E, S scores)
- Determine dominant learning style
- Identify top work values

### 2. **Generate Reports** (TODO)
- Create PDF/HTML reports with results
- Add career recommendations based on scores
- Include stream-specific guidance
- Add charts and visualizations

### 3. **Frontend Polish** (TODO)
- Update UI to show randomized questions
- Add progress indicators
- Implement answer submission
- Create results page

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
Check your connection string in `.env` file

### Import Errors
Make sure you're in the `backend` directory when running import scripts

---

## 📞 Support Files

- `IMPLEMENTATION_COMPLETE.md` - Complete technical documentation
- `QUESTION_IMPORT_SUMMARY.md` - High-level overview
- `backend/IMPORT_QUESTIONS_README.md` - Import process details

---

**Status**: ✅ **READY TO USE**

Your Career Compass application now has a fully functional, randomized question system with 451 questions across 7 sections!
