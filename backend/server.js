import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import testRoutes from './routes/tests.js';
import questionRoutes from './routes/questions.js';
import aptitudeRoutes from './routes/aptitude.js';
import riasecRoutes from './routes/riasec.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/reports.js';
import valuesRoutes from './routes/values.js';
import personalityRoutes from './routes/personality.js';
import decisionRoutes from './routes/decision.js';
import learningRoutes from './routes/learning.js';
import esiRoutes from './routes/esi.js';
import valuesWorkRoutes from './routes/valuesWork.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Career Compass API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/riasec', riasecRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/values', valuesRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/decision', decisionRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/esi', esiRoutes);
app.use('/api/values-work', valuesWorkRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careercompass';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log(`🗄️  MongoDB connected: ${uri}`);
}

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Career Compass API server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;
