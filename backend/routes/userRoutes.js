const express = require('express');
const { getLeaderboard,getUserProfile } = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/leaderboard', requireAuth, getLeaderboard);
router.get('/profile', requireAuth, getUserProfile);
module.exports = router;