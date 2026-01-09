const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const reviewValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
];

const adminReviewValidation = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
];

// Public routes
router.get('/vehicle/:vehicleId', reviewController.getVehicleReviews);

// Protected routes
router.post('/', authenticateUser, reviewValidation, reviewController.createReview);
router.put('/:id', authenticateUser, reviewController.updateReview);
router.delete('/:id', authenticateUser, reviewController.deleteReview);

// Admin routes
router.get('/', authenticateUser, requireAdmin, reviewController.getAllReviews);
router.put('/:id/status', authenticateUser, requireAdmin, adminReviewValidation, reviewController.updateReviewStatus);
router.delete('/:id/admin', authenticateUser, requireAdmin, reviewController.adminDeleteReview);

module.exports = router;
