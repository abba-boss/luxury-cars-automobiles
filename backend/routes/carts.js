const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const cartItemValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

const updateItemValidation = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
];

// Routes
router.get('/', authenticateUser, cartController.getUserCart);
router.post('/items', authenticateUser, cartItemValidation, cartController.addItemToCart);
router.put('/items/:id', authenticateUser, updateItemValidation, cartController.updateCartItem);
router.delete('/items/:id', authenticateUser, cartController.removeCartItem);
router.delete('/', authenticateUser, cartController.clearCart);

module.exports = router;