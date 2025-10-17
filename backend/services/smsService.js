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

// Send OTP
export const sendOTP = async (mobile) => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${mobile}: ${otp}`);
      return true;
    }

    // In production, use Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await twilio.messages.create({
        body: `Your Career Compass OTP is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile
      });
      
      return true;
    }

    // Fallback to console log if Twilio not configured
    console.log(`📱 OTP for ${mobile}: ${otp}`);
    return true;
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (mobile, otp) => {
  try {
    const storedData = otpStore.get(mobile);
    
    if (!storedData) {
      return false;
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      return false;
    }

    // Check if OTP matches
    if (storedData.otp === otp) {
      otpStore.delete(mobile);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return false;
  }
};
