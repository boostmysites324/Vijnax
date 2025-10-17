import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [500, 'Question text cannot exceed 500 characters']
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Option text cannot exceed 200 characters']
    },
    score: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
      max: [10, 'Score cannot exceed 10']
    },
    domain: {
      type: String,
      required: true,
      enum: ['personality', 'aptitude', 'interest', 'values', 'skills']
    }
  }],
  domain: {
    type: String,
    required: [true, 'Question domain is required'],
    enum: ['personality', 'aptitude', 'interest', 'values', 'skills']
  },
  category: {
    type: String,
    required: [true, 'Question category is required'],
    enum: [
      'personality_traits',
      'numerical_ability', 
      'verbal_ability',
      'logical_reasoning',
      'spatial_ability',
      'career_interests',
      'learning_style',
      'work_values',
      'leadership_style',
      'team_work',
      'problem_solving',
      'creativity',
      'communication',
      'adaptability',
      'stress_management'
    ]
  },
  difficulty: {
    type: String,
    required: [true, 'Question difficulty is required'],
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  type: {
    type: String,
    required: [true, 'Question type is required'],
    enum: ['multiple_choice', 'likert_scale', 'true_false', 'scenario_based'],
    default: 'multiple_choice'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    estimatedTime: {
      type: Number, // in seconds
      default: 60
    },
    weightage: {
      type: Number,
      default: 1,
      min: [0.1, 'Weightage must be at least 0.1'],
      max: [5, 'Weightage cannot exceed 5']
    },
    reliability: {
      type: Number,
      default: 0.8,
      min: [0, 'Reliability must be between 0 and 1'],
      max: [1, 'Reliability must be between 0 and 1']
    },
    validity: {
      type: Number,
      default: 0.8,
      min: [0, 'Validity must be between 0 and 1'],
      max: [1, 'Validity must be between 0 and 1']
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number, // in seconds
    default: 0
  },
  correctAnswerRate: {
    type: Number,
    default: 0,
    min: [0, 'Correct answer rate must be between 0 and 1'],
    max: [1, 'Correct answer rate must be between 0 and 1']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ domain: 1, category: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ tags: 1 });

// Virtual for question number
questionSchema.virtual('questionNumber').get(function() {
  return this.order + 1;
});

// Method to get question statistics
questionSchema.methods.getStats = function() {
  return {
    usageCount: this.usageCount,
    averageResponseTime: this.averageResponseTime,
    correctAnswerRate: this.correctAnswerRate,
    reliability: this.metadata.reliability,
    validity: this.metadata.validity
  };
};

// Method to update usage statistics
questionSchema.methods.updateStats = function(responseTime, isCorrect) {
  this.usageCount += 1;
  
  // Update average response time
  const totalTime = this.averageResponseTime * (this.usageCount - 1) + responseTime;
  this.averageResponseTime = totalTime / this.usageCount;
  
  // Update correct answer rate
  const totalCorrect = this.correctAnswerRate * (this.usageCount - 1) + (isCorrect ? 1 : 0);
  this.correctAnswerRate = totalCorrect / this.usageCount;
  
  return this.save();
};

// Static method to get questions by domain
questionSchema.statics.getByDomain = function(domain, limit = 10) {
  return this.find({ 
    domain, 
    isActive: true 
  })
  .sort({ order: 1, usageCount: -1 })
  .limit(limit);
};

// Static method to get random questions
questionSchema.statics.getRandom = function(domain, category, count = 10) {
  const query = { isActive: true };
  if (domain) query.domain = domain;
  if (category) query.category = category;
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: count } },
    { $sort: { order: 1 } }
  ]);
};

const Question = mongoose.model('Question', questionSchema);

export default Question;

