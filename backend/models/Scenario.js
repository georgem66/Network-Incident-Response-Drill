const mongoose = require('mongoose');
const scenarioSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  learningObjectives: [{
    type: String,
    trim: true
  }],
  attackVector: {
    type: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    initialAccess: {
      type: Date,
      required: true
    }
  },
  indicatorsOfCompromise: {
    ipAddresses: [String],
    suspiciousQueries: [String],
    fileHashes: [String],
    domains: [String],
    userAgents: [String]
  },
  timeline: [{
    timestamp: {
      type: Date,
      required: true
    },
    event: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    }
  }],
  networkTopology: {
    segments: [String],
    affectedHosts: [String]
  },
  responseSteps: {
    identification: {
      tasks: [String],
      hints: [String]
    },
    containment: {
      tasks: [String],
      hints: [String]
    },
    eradication: {
      tasks: [String],
      hints: [String]
    },
    recovery: {
      tasks: [String],
      hints: [String]
    },
    lessonsLearned: {
      tasks: [String],
      hints: [String]
    }
  },
  scoringCriteria: {
    speedBonus: {
      type: Number,
      default: 20
    },
    accuracyWeight: {
      type: Number,
      default: 40
    },
    completenessWeight: {
      type: Number,
      default: 40
    },
    penaltyPerHint: {
      type: Number,
      default: 2
    }
  },
  estimatedCompletionTime: {
    type: Number, // in minutes
    required: true
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
scenarioSchema.index({ severity: 1 });
scenarioSchema.index({ category: 1 });
scenarioSchema.index({ difficultyLevel: 1 });
scenarioSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Scenario', scenarioSchema);