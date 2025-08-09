const express = require('express');
const ScenarioAttempt = require('../models/ScenarioAttempt');
const Scenario = require('../models/Scenario');

const router = express.Router();

/**
 * @swagger
 * /api/incidents:
 *   post:
 *     summary: Start a new incident response scenario
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scenarioId
 *             properties:
 *               scenarioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Incident started successfully
 *       404:
 *         description: Scenario not found
 */
router.post('/', async (req, res, next) => {
  try {
    const { scenarioId } = req.body;

    // Verify scenario exists
    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    // Check if user has an active attempt for this scenario
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

    // Create new attempt
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

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Get user's incident attempts
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Incidents retrieved successfully
 */
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

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Get incident attempt details
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Incident retrieved successfully
 *       404:
 *         description: Incident not found
 */
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

    // Get scenario details
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

/**
 * @swagger
 * /api/incidents/{id}/step:
 *   put:
 *     summary: Update incident response step
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - step
 *             properties:
 *               step:
 *                 type: string
 *                 enum: [identification, containment, eradication, recovery, lessons_learned]
 *               score:
 *                 type: integer
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Step updated successfully
 *       404:
 *         description: Incident not found
 */
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

    // Update attempt
    const updateData = {
      currentStep: step,
      score: attempt.score + score
    };

    // If completing the final step, mark as completed
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

/**
 * @swagger
 * /api/incidents/{id}/hint:
 *   post:
 *     summary: Use a hint (reduces score)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Hint used successfully
 *       404:
 *         description: Incident not found
 */
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

    // Get scenario to calculate penalty
    const scenario = await Scenario.findById(attempt.scenarioId);
    const penalty = scenario?.scoringCriteria?.penaltyPerHint || 2;

    // Update hints used and reduce score
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