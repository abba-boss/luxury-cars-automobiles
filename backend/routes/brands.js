const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const brandValidation = [
  body('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be between 2 and 100 characters'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
];

// Public routes
router.get('/', brandController.getBrands);
router.get('/search', brandController.searchBrands);
router.get('/:id', brandController.getBrandById);

// Admin routes
router.post('/', authenticateUser, requireAdmin, brandValidation, brandController.createBrand);
router.put('/:id', authenticateUser, requireAdmin, brandValidation, brandController.updateBrand);
router.delete('/:id', authenticateUser, requireAdmin, brandController.deleteBrand);

module.exports = router;
