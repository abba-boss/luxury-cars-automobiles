const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const customerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required')
];

// Protected routes
router.get('/', authenticateUser, requireAdmin, customerController.getCustomers);
router.get('/:id', authenticateUser, customerController.getCustomerById);
router.post('/', customerValidation, customerController.createCustomer);
router.put('/:id', authenticateUser, customerController.updateCustomer);
router.delete('/:id', authenticateUser, requireAdmin, customerController.deleteCustomer);

module.exports = router;
