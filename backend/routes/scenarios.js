const express = require('express');
const Scenario = require('../models/Scenario');

const router = express.Router();

/**
 * @swagger
 * /api/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by severity
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty level
 *     responses:
 *       200:
 *         description: Scenarios retrieved successfully
 */
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

/**
 * @swagger
 * /api/scenarios/{id}:
 *   get:
 *     summary: Get scenario by ID
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scenario ID
 *     responses:
 *       200:
 *         description: Scenario retrieved successfully
 *       404:
 *         description: Scenario not found
 */
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

/**
 * @swagger
 * /api/scenarios/{id}/hints:
 *   get:
 *     summary: Get hints for a specific scenario step
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scenario ID
 *       - in: query
 *         name: step
 *         required: true
 *         schema:
 *           type: string
 *           enum: [identification, containment, eradication, recovery, lessons_learned]
 *         description: Response step
 *     responses:
 *       200:
 *         description: Hints retrieved successfully
 *       404:
 *         description: Scenario not found
 */
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