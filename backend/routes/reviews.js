const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const reviewValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
];

// Public routes
router.get('/vehicle/:vehicleId', reviewController.getVehicleReviews);

// Protected routes
router.post('/', authenticateUser, reviewValidation, reviewController.createReview);
router.put('/:id', authenticateUser, reviewController.updateReview);
router.delete('/:id', authenticateUser, reviewController.deleteReview);

module.exports = router;
