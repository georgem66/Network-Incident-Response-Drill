const express = require('express');
const ScenarioAttempt = require('../models/ScenarioAttempt');
const Scenario = require('../models/Scenario');
const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    const { scenarioId } = req.body;
    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    const activeAttempt = await ScenarioAttempt.findOne({
      where: {
        userId: req.user.id,
        scenarioId,
        status: 'active'
      }
    });
    if (activeAttempt) {
      return res.json({
        success: true,
        message: 'Active attempt already exists',
        data: { attempt: activeAttempt }
      });
    }
    const attempt = await ScenarioAttempt.create({
      userId: req.user.id,
      scenarioId,
      maxScore: 100
    });
    res.status(201).json({
      success: true,
      message: 'Incident started successfully',
      data: { attempt }
    });
  } catch (error) {
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) {
      where.status = status;
    }
    const attempts = await ScenarioAttempt.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      data: {
        attempts,
        count: attempts.length
      }
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const attempt = await ScenarioAttempt.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Incident attempt not found'
      });
    }
    const scenario = await Scenario.findById(attempt.scenarioId);
    res.json({
      success: true,
      data: {
        attempt,
        scenario
      }
    });
  } catch (error) {
    next(error);
  }
});
router.put('/:id/step', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { step, score = 0, actions = [] } = req.body;
    const validSteps = ['identification', 'containment', 'eradication', 'recovery', 'lessons_learned'];
    if (!validSteps.includes(step)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step'
      });
    }
    const attempt = await ScenarioAttempt.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Incident attempt not found'
      });
    }
    const updateData = {
      currentStep: step,
      score: attempt.score + score
    };
    if (step === 'lessons_learned') {
      updateData.status = 'completed';
      updateData.endTime = new Date();
      updateData.timeTaken = Math.floor((new Date() - attempt.startTime) / 1000);
    }
    await attempt.update(updateData);
    res.json({
      success: true,
      message: 'Step updated successfully',
      data: { attempt }
    });
  } catch (error) {
    next(error);
  }
});
router.post('/:id/hint', async (req, res, next) => {
  try {
    const { id } = req.params;
    const attempt = await ScenarioAttempt.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Incident attempt not found'
      });
    }
    const scenario = await Scenario.findById(attempt.scenarioId);
    const penalty = scenario?.scoringCriteria?.penaltyPerHint || 2;
    await attempt.update({
      hintsUsed: attempt.hintsUsed + 1,
      score: Math.max(0, attempt.score - penalty)
    });
    res.json({
      success: true,
      message: 'Hint used successfully',
      data: { 
        attempt,
        penalty
      }
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;