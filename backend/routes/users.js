const express = require('express');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin/instructor only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', requireRole(['admin', 'instructor']), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;