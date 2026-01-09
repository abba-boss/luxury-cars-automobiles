const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const paymentValidation = [
  body('sale_id').isInt().withMessage('Valid sale ID is required'),
  body('amount').isDecimal().withMessage('Valid amount is required'),
  body('payment_method').notEmpty().withMessage('Payment method is required')
];

// User routes
router.get('/history', authenticateUser, paymentController.getUserPayments);
router.post('/intent', authenticateUser, paymentValidation, paymentController.createPaymentIntent);
router.get('/status/:paymentId', authenticateUser, paymentController.getPaymentStatus);
router.post('/confirm/:paymentId', authenticateUser, paymentController.confirmPayment);

// Admin routes
router.get('/', authenticateUser, requireAdmin, paymentController.getAllPayments);

module.exports = router;