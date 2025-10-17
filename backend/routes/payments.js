import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/payments/create
// @desc    Create payment (placeholder)
// @access  Private
router.post('/create', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Payment endpoint - to be implemented'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

