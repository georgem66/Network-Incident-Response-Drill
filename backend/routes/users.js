const express = require('express');
const { requireRole } = require('../middleware/auth');
const router = express.Router();
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});
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