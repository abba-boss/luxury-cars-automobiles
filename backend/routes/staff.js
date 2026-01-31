const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateUser, requireStaff } = require('../middlewares/rbac');
const { query, param } = require('express-validator');

// Staff dashboard routes
router.get('/dashboard', authenticateUser, requireStaff, staffController.getStaffDashboard);

// Staff vehicle management routes
router.get('/vehicles', authenticateUser, requireStaff, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['available', 'sold', 'reserved', 'inactive', 'pending_approval']).withMessage('Invalid status'),
  query('make').optional().trim().escape(),
  query('model').optional().trim().escape(),
], staffController.getStaffVehicles);

// Get pending approval vehicles
router.get('/vehicles/pending', authenticateUser, requireStaff, staffController.getPendingApprovalVehicles);

// Submit vehicle for approval
router.put('/vehicles/:id/approve', authenticateUser, requireStaff, [
  param('id').isInt().withMessage('Vehicle ID must be an integer')
], staffController.submitForApproval);

module.exports = router;