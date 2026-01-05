const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { getUserActivity, getUserPreferences, getUserStats } = require('../controllers/userAnalyticsController');

// All routes require authentication
router.use(authenticateToken);

// User analytics routes
router.get('/activity', getUserActivity);
router.get('/preferences', getUserPreferences);
router.get('/stats', getUserStats);

module.exports = router;
