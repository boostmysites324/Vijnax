import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../middleware/auth.js';
import { sendOTP, verifyOTP } from '../services/smsService.js';

const router = express.Router();

// In-memory storage for testing
const users = new Map();
const adminUsers = new Map();

// Initialize with test data
adminUsers.set('admin@careercompass.com', {
  id: 'admin-1',
  email: 'admin@careercompass.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin',
  name: 'Admin User'
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to mobile number
// @access  Public
router.post('/send-otp', [
  body('mobile').isMobilePhone().withMessage('Please provide a valid mobile number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { mobile } = req.body;

    // Send OTP
    const otpSent = await sendOTP(mobile);
    
    if (otpSent) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login user
// @access  Public
router.post('/verify-otp', [
  body('mobile').isMobilePhone().withMessage('Please provide a valid mobile number'),
  body('otp').isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { mobile, otp } = req.body;

    // Verify OTP
    const isValidOTP = await verifyOTP(mobile, otp);
    
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Get or create user
    let user = users.get(mobile);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        mobile,
        name: `User ${mobile.slice(-4)}`,
        role: 'user',
        createdAt: new Date()
      };
      users.set(mobile, user);
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          mobile: user.mobile,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Admin login
// @access  Public
router.post('/admin-login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if admin exists
    const admin = adminUsers.get(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', (req, res) => {
  try {
    // This would normally use middleware to get user from token
    // For now, return a mock response
    res.json({
      success: true,
      data: {
        user: {
          id: 'user-1',
          mobile: '1234567890',
          name: 'Test User',
          role: 'user'
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
