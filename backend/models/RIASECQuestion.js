import mongoose from 'mongoose';

const riasecQuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: [true, 'Question number is required'],
    unique: true
  },
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
    riasecType: {
      type: String,
      required: true,
      enum: ['R', 'I', 'A', 'S', 'E', 'C'],
      uppercase: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  category: {
    type: String,
    required: [true, 'Question category is required'],
    enum: ['career_interest', 'personality_assessment', 'value_based']
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
      default: 30
    },
    weightage: {
      type: Number,
      default: 1.0,
      min: [0.1, 'Weightage must be at least 0.1'],
      max: [2.0, 'Weightage cannot exceed 2.0']
    },
    reliability: {
      type: Number,
      default: 0.85,
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
  }
}, {
  timestamps: true
});

// Indexes for better query performance
riasecQuestionSchema.index({ questionNumber: 1 });
riasecQuestionSchema.index({ isActive: 1 });
riasecQuestionSchema.index({ category: 1 });

// Virtual for question display
riasecQuestionSchema.virtual('displayText').get(function() {
  return `Q${this.questionNumber}. ${this.text}`;
});

// Method to get question statistics
riasecQuestionSchema.methods.getStats = function() {
  return {
    usageCount: this.usageCount,
    averageResponseTime: this.averageResponseTime,
    reliability: this.metadata.reliability,
    validity: this.metadata.validity
  };
};

// Method to update usage statistics
riasecQuestionSchema.methods.updateStats = function(responseTime) {
  this.usageCount += 1;
  
  // Update average response time
  const totalTime = this.averageResponseTime * (this.usageCount - 1) + responseTime;
  this.averageResponseTime = totalTime / this.usageCount;
  
  return this.save();
};

// Static method to get questions by RIASEC type
riasecQuestionSchema.statics.getByRIASECType = function(riasecType, limit = 10) {
  return this.find({ 
    'options.riasecType': riasecType,
    isActive: true 
  })
  .sort({ order: 1, questionNumber: 1 })
  .limit(limit);
};

// Static method to get all active questions
riasecQuestionSchema.statics.getAllActive = function() {
  return this.find({ isActive: true }).sort({ questionNumber: 1 });
};

// Static method to get RIASEC distribution
riasecQuestionSchema.statics.getRIASECDistribution = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$options' },
    { $group: { _id: '$options.riasecType', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

const RIASECQuestion = mongoose.model('RIASECQuestion', riasecQuestionSchema);

export default RIASECQuestion;





