const express = require('express');
const router = express.Router();
const financingController = require('../controllers/financingController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware for financing application
const financingValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('loan_amount').isDecimal().withMessage('Valid loan amount is required'),
  body('credit_score').optional().isInt({ min: 300, max: 850 }).withMessage('Credit score must be between 300 and 850'),
  body('employment_status').optional().isIn(['employed', 'self-employed', 'unemployed', 'retired']).withMessage('Invalid employment status'),
  body('annual_income').optional().isDecimal().withMessage('Annual income must be a valid decimal')
];

// Validation for status update (admin)
const statusUpdateValidation = [
  body('status').isIn(['pending', 'approved', 'rejected', 'processing']).withMessage('Invalid status'),
  body('interest_rate').optional().isDecimal().withMessage('Interest rate must be a valid decimal'),
  body('term_months').optional().isInt({ min: 12, max: 84 }).withMessage('Term must be between 12 and 84 months')
];

// User routes
router.get('/', authenticateUser, financingController.getUserFinancingApplications);
router.post('/', authenticateUser, financingValidation, financingController.applyForFinancing);
router.put('/:id', authenticateUser, financingValidation, financingController.updateFinancingApplication);

// Admin routes
router.get('/all', authenticateUser, requireAdmin, financingController.getAllFinancingApplications);
router.put('/:id/status', authenticateUser, requireAdmin, statusUpdateValidation, financingController.updateApplicationStatus);

module.exports = router;