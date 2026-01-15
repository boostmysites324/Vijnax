# 🎯 Demo Mode Guide - Career Compass

## Quick Access for Testing

### Demo Login Credentials

**Mobile Number**: `9582478664`  
**OTP**: `123456` (Fixed - always works)

### How It Works

1. Go to `http://localhost:3000/otp-login`
2. Enter mobile number: `9582478664`
3. Click "Send Verification Code"
4. Enter OTP: `123456`
5. Click "Verify & Continue"
6. You'll be redirected to the test page with 60 randomized questions

### Features

- ✅ **No Signup Required** - Login creates user automatically
- ✅ **Fixed Demo OTP** - Always `123456` for number `9582478664`
- ✅ **Instant Access** - No SMS delay in dev mode
- ✅ **Full Test Access** - All 60 randomized questions from sections A-G
- ✅ **All Features** - Complete test taking, scoring, and PDF report generation

---

## Technical Details

### Demo Number Configuration

The demo number is hardcoded in `/backend/services/smsService.js`:

```javascript
// DEMO MODE: Fixed OTP for testing number
const isDemoNumber = mobile === '9582478664' || mobile === '+919582478664';
const otp = isDemoNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
```

### Auto User Creation

When you verify OTP with the demo number, the system:
1. Checks if user exists with that mobile number
2. If not, creates a new user automatically
3. Issues JWT token
4. Allows immediate test access

No separate signup is needed!

### Question Loading

The test page now uses the unified endpoint:
- **Endpoint**: `POST /api/tests/generate/randomized`
- **Returns**: 60 fully randomized questions from all 7 sections
- **Shuffled**: Questions appear in random order every time
- **Sections**: A (Aptitude), B (RIASEC), C (Decision), D (ESI), E (Learning), F (Personality), G (Work Values)

---

## For Development

### Console Logs

When using demo number, you'll see in backend console:
```
📱 DEMO OTP for 9582478664: 123456 (Fixed demo number)
   Expires at: [timestamp]
```

### Frontend Demo Banner

The frontend shows a demo mode banner at the top:
```
🔧 Demo Mode
Using demo number: 9582478664 | OTP: 123456
```

---

## For Production

To disable demo mode in production:
1. Set `NODE_ENV=production` in environment
2. Demo OTP will still work but won't be returned in API response
3. Real SMS will be sent via MSG91 for other numbers

### Production Setup

Add to `.env`:
```bash
NODE_ENV=production
MSG91_AUTH_KEY=your-actual-msg91-key
MSG91_TEMPLATE_ID=your-template-id
```

---

## Testing Checklist

✅ **OTP Login**
- [ ] Enter demo number `9582478664`
- [ ] Receive OTP `123456`
- [ ] Verify and get JWT token
- [ ] Redirected to test page

✅ **Test Generation**
- [ ] Questions load automatically
- [ ] See 60 questions loaded
- [ ] Questions are randomized
- [ ] All sections present (A-G)

✅ **Test Taking**
- [ ] Can select answers
- [ ] Can navigate between questions
- [ ] Timer is running
- [ ] Progress is tracked

✅ **Test Completion**
- [ ] Submit test
- [ ] Scores calculated
- [ ] PDF report generated
- [ ] Can download report

---

## Troubleshooting

### Questions Not Loading?

**Error**: `403 Forbidden` on `/api/tests/generate/randomized`

**Fix**: Make sure:
1. Backend server is running
2. JWT token is valid (stored in localStorage)
3. MongoDB is connected with questions imported

### OTP Not Working?

**Check**:
1. Using exact number: `9582478664`
2. OTP is exactly: `123456`
3. Backend console shows OTP generation
4. Not expired (10-minute window)

### Demo Mode Not Showing?

**Frontend Check**:
- Look for demo banner at top of OTP login page
- Should show in development mode automatically
- Check browser console for logs

---

## API Endpoints

### Authentication
```bash
# Send OTP
POST /api/auth/send-otp
Body: { "mobile": "9582478664" }

# Verify OTP (auto-creates user if needed)
POST /api/auth/verify-otp
Body: { "mobile": "9582478664", "otp": "123456" }
```

### Test Generation
```bash
# Generate randomized test
POST /api/tests/generate/randomized
Headers: { "Authorization": "Bearer {token}" }
Body: { "userStream": "PCM" }
```

### Reports
```bash
# Download PDF report
GET /api/reports/:testId/pdf
Headers: { "Authorization": "Bearer {token}" }
```

---

## Demo User Details

After logging in with demo number, a user is created with:
- **Mobile**: `9582478664`
- **Name**: Auto-generated or can be updated
- **Role**: `user`
- **ID**: Auto-generated MongoDB ObjectId

User persists in database and can take multiple tests.

---

## Quick Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
npm run dev
```

### Test OTP System
```bash
cd backend
node scripts/test_complete_flow.js
```

---

## Production Deployment Notes

1. **Remove Demo Banner**: Update frontend to hide demo banner in production
2. **Environment Variables**: Set `NODE_ENV=production`
3. **MSG91 Setup**: Add real MSG91 credentials
4. **Demo Number**: Consider disabling or keeping for testing

---

**Quick Access URL**: `http://localhost:3000/otp-login`  
**Demo Mobile**: `9582478664`  
**Demo OTP**: `123456`  

**Status**: ✅ Fully Functional
