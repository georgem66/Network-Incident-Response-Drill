const express = require('express');
const ScenarioAttempt = require('../models/ScenarioAttempt');
const User = require('../models/User');

const router = express.Router();

/**
 * @swagger
 * /api/scores/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scenario
 *         schema:
 *           type: string
 *         description: Filter by scenario ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { scenario, limit = 10 } = req.query;
    const where = { status: 'completed' };
    
    if (scenario) {
      where.scenarioId = scenario;
    }

    const attempts = await ScenarioAttempt.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }],
      order: [
        ['score', 'DESC'],
        ['timeTaken', 'ASC']
      ],
      limit: parseInt(limit)
    });

    const leaderboard = attempts.map((attempt, index) => ({
      rank: index + 1,
      user: attempt.user ? {
        username: attempt.user.username,
        firstName: attempt.user.firstName,
        lastName: attempt.user.lastName
      } : null,
      scenarioId: attempt.scenarioId,
      score: attempt.score,
      timeTaken: attempt.timeTaken,
      hintsUsed: attempt.hintsUsed,
      completedAt: attempt.endTime
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        total: leaderboard.length,
        filter: { scenario }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/scores/user:
 *   get:
 *     summary: Get current user's scores
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User scores retrieved successfully
 */
router.get('/user', async (req, res, next) => {
  try {
    const attempts = await ScenarioAttempt.findAll({
      where: {
        userId: req.user.id,
        status: 'completed'
      },
      order: [['endTime', 'DESC']]
    });

    const stats = {
      totalAttempts: attempts.length,
      totalScore: attempts.reduce((sum, attempt) => sum + attempt.score, 0),
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0,
      totalTime: attempts.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0),
      scenariosCompleted: [...new Set(attempts.map(a => a.scenarioId))].length
    };

    res.json({
      success: true,
      data: {
        attempts,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;