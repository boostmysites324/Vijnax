# 🐛 OTP Not Received - Debug Steps

## Current Status:
✅ Backend is in production mode
✅ Response says "OTP sent successfully"
❌ User not receiving OTP on phone

---

## Issue Analysis from Screenshots:

### MSG91 Logs Show:
- ✅ 2 Delivered (11:52, 11:50) - to 919530447XXX0
- ❌ 2 Failed (10:12, 10:03) - older attempts

### Possible Issues:

1. **Phone Number Format Issue**
2. **MSG91 API Error (silent failure)**
3. **Template Not Approved**
4. **Wrong Template ID**
5. **DND (Do Not Disturb) on number**

---

## Debug Steps:

### Step 1: Check Render Real-Time Logs

1. Go to Render Dashboard → Your Service
2. Click on **Logs** tab
3. Keep logs open
4. Go to vijnax.com/otp-login
5. Enter phone number and click "Send OTP"
6. **Watch the logs** for:

**Looking for:**
```
✅ OTP sent to 9530447010 via MSG91
```

**Or error:**
```
❌ Send OTP error: [error message]
```

### Step 2: Check MSG91 API Response

The code should show if MSG91 returned an error. Look for logs showing the actual MSG91 response.

### Step 3: Check Phone Number Format

Backend sends to MSG91 as: `mobile.replace('+91', '')` (10 digits only)

Make sure MSG91 template is set to send to Indian numbers.

---

## Quick Fixes to Try:

### Fix 1: Update SMS Service with Better Error Logging

The current code might be hiding MSG91 errors. We need to log the full response.

### Fix 2: Check MSG91 Template Status

1. Go to: https://control.msg91.com/app/sms/templates
2. Find your OTP template
3. Make sure status is **APPROVED** (not pending/rejected)

### Fix 3: Test with MSG91 Test API

Try sending a test SMS directly from MSG91 dashboard to verify your account works.

---

## Most Likely Issues:

### 1. Template Not Approved ⚠️
MSG91 requires templates to be approved before they work in production.

**Check:** MSG91 Dashboard → Templates → Status should be "Approved"

### 2. Wrong Template ID ⚠️
Using wrong template ID will cause silent failure.

**Check:** Make sure `MSG91_TEMPLATE_ID` in Render matches the template ID in MSG91

### 3. Phone Number DND ⚠️
If your number has DND (Do Not Disturb) enabled, promotional SMS won't work.

**Fix:** Use Transactional SMS route or disable DND

---

## What to Check Now:

1. **Render Logs:** Do you see "✅ OTP sent to ... via MSG91"?
2. **MSG91 Template:** Is it approved?
3. **MSG91 Template ID:** Does it match Render env var?
4. **Phone Number:** Try a different number to test

---

## Need the Backend Logs

Can you share the Render logs from when you click "Send OTP"?
Not the startup logs, but the **real-time logs** showing the OTP request.
