const express = require('express');
const Scenario = require('../models/Scenario');
const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const { severity, difficulty, category } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;
    if (difficulty) filter.difficultyLevel = difficulty;
    if (category) filter.category = category;
    const scenarios = await Scenario.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: {
        scenarios,
        count: scenarios.length
      }
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const scenario = await Scenario.findById(id);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    res.json({
      success: true,
      data: { scenario }
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id/hints', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { step } = req.query;
    if (!step || !['identification', 'containment', 'eradication', 'recovery', 'lessons_learned'].includes(step)) {
      return res.status(400).json({
        success: false,
        message: 'Valid step parameter is required'
      });
    }
    const scenario = await Scenario.findById(id);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    const stepKey = step === 'lessons_learned' ? 'lessonsLearned' : step;
    const hints = scenario.responseSteps[stepKey]?.hints || [];
    res.json({
      success: true,
      data: {
        step,
        hints
      }
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;