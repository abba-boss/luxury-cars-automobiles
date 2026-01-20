const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validationErrorHandler');

// Validation middleware for create
const saleValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('customer_id').isInt().withMessage('Valid customer ID is required'),
  body('sale_price').isFloat({ min: 0 }).withMessage('Valid sale price is required')
];

// Validation middleware for update
const updateSaleValidation = [
  param('id').isInt().withMessage('Valid sale ID is required'),
  body('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('payment_status').optional().isIn(['pending', 'partial', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status')
];

// Protected routes
router.get('/', authenticateUser, requireAdmin, saleController.getSales);
router.get('/my-orders', authenticateUser, saleController.getUserSales);
router.post('/', authenticateUser, saleValidation, handleValidationErrors, saleController.createSale);
router.put('/:id', authenticateUser, updateSaleValidation, handleValidationErrors, saleController.updateSale);

module.exports = router;
