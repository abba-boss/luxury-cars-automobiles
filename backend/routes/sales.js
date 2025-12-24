const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const saleValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('customer_id').isInt().withMessage('Valid customer ID is required'),
  body('sale_price').isFloat({ min: 0 }).withMessage('Valid sale price is required')
];

// Protected routes
router.get('/', authenticateUser, requireAdmin, saleController.getSales);
router.get('/my-orders', authenticateUser, saleController.getUserSales);
router.post('/', authenticateUser, saleValidation, saleController.createSale);
router.put('/:id', authenticateUser, saleController.updateSale);

module.exports = router;
