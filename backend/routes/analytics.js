const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');

// All analytics routes require admin authentication
router.use(authenticateUser);
router.use(requireAdmin);

// Analytics endpoints
router.get('/overview', analyticsController.getOverview);
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/inventory', analyticsController.getInventoryAnalytics);
router.get('/users', analyticsController.getUserAnalytics);

module.exports = router;
