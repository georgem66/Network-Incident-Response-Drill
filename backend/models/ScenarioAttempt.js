const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ScenarioAttempt = sequelize.define('ScenarioAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  scenarioId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'scenario_id'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active'
  },
  currentStep: {
    type: DataTypes.ENUM('identification', 'containment', 'eradication', 'recovery', 'lessons_learned'),
    defaultValue: 'identification',
    field: 'current_step'
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    field: 'end_time'
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'max_score'
  },
  hintsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'hints_used'
  },
  timeTaken: {
    type: DataTypes.INTEGER, // in seconds
    field: 'time_taken'
  }
}, {
  tableName: 'scenario_attempts',
  underscored: true
});
module.exports = ScenarioAttempt;