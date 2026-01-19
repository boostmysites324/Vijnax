import axios from 'axios';

// In-memory OTP storage
const otpStore = new Map();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [mobile, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(mobile);
    }
  }
}, 5 * 60 * 1000);

// Send OTP via MSG91
export const sendOTP = async (mobile) => {
  try {
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      sentAt: Date.now()
    });

    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${mobile}: ${otp}`);
      console.log(`   Expires at: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString()}`);
      return { success: true, message: 'OTP sent (dev mode)', otp }; // Return OTP in dev mode for testing
    }

    // In production, use MSG91
    if (process.env.MSG91_AUTH_KEY) {
      const msg91Url = 'https://api.msg91.com/api/v5/otp';
      
      const response = await axios.post(msg91Url, {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: mobile.replace('+91', ''), // MSG91 expects 10-digit number
        authkey: process.env.MSG91_AUTH_KEY,
        otp: otp,
        otp_expiry: 10 // minutes
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authkey': process.env.MSG91_AUTH_KEY
        }
      });

      if (response.data.type === 'success') {
        console.log(`✅ OTP sent to ${mobile} via MSG91`);
        return { success: true, message: 'OTP sent successfully' };
      } else {
        throw new Error('MSG91 API returned error');
      }
    }

    // Fallback to console log if MSG91 not configured
    console.log(`📱 OTP for ${mobile}: ${otp} (MSG91 not configured)`);
    return { success: true, message: 'OTP sent (fallback mode)', otp };
    
  } catch (error) {
    console.error('Send OTP error:', error.message);
    // In case of error, still return success in dev mode
    if (process.env.NODE_ENV === 'development') {
      const data = otpStore.get(mobile);
      return { success: true, message: 'OTP sent (dev fallback)', otp: data?.otp };
    }
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Verify OTP
export const verifyOTP = async (mobile, otp) => {
  try {
    const storedData = otpStore.get(mobile);
    
    if (!storedData) {
      return { success: false, message: 'OTP not found or expired' };
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      return { success: false, message: 'OTP has expired' };
    }

    // Increment attempts
    storedData.attempts = (storedData.attempts || 0) + 1;

    // Block after 5 failed attempts
    if (storedData.attempts > 5) {
      otpStore.delete(mobile);
      return { success: false, message: 'Too many attempts. Please request a new OTP' };
    }

    // Check if OTP matches
    if (storedData.otp === otp) {
      otpStore.delete(mobile);
      console.log(`✅ OTP verified successfully for ${mobile}`);
      return { success: true, message: 'OTP verified successfully' };
    }

    // Update attempts in store
    otpStore.set(mobile, storedData);
    return { success: false, message: `Invalid OTP. ${5 - storedData.attempts} attempts remaining` };
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: 'Error verifying OTP' };
  }
};

// Resend OTP (with rate limiting)
export const resendOTP = async (mobile) => {
  const storedData = otpStore.get(mobile);
  
  // Rate limiting: Allow resend only after 1 minute
  if (storedData && (Date.now() - (storedData.sentAt || 0)) < 60000) {
    return { success: false, message: 'Please wait before requesting a new OTP' };
  }
  
  return sendOTP(mobile);
};
