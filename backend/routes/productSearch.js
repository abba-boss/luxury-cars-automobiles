const express = require('express');
const router = express.Router();
const productSearchController = require('../controllers/productSearchController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { query } = require('express-validator');

// Validation middleware for search
const searchValidation = [
  query('make').optional().isString().withMessage('Make must be a string'),
  query('model').optional().isString().withMessage('Model must be a string'),
  query('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Year must be a valid year'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('bodyType').optional().isString().withMessage('Body type must be a string'),
  query('fuelType').optional().isString().withMessage('Fuel type must be a string'),
  query('keyword').optional().isString().withMessage('Keyword must be a string')
];

// Admin routes for searching external products
router.get('/search', authenticateUser, requireAdmin, searchValidation, productSearchController.searchExternalProducts);
router.get('/details/:productId', authenticateUser, requireAdmin, productSearchController.getExternalProductDetails);

module.exports = router;