const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const vehicleValidation = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('condition').isIn(['Tokunbo', 'Nigerian Used', 'Brand New']).withMessage('Valid condition is required')
];

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Admin routes
router.post('/', authenticateUser, requireAdmin, vehicleValidation, vehicleController.createVehicle);
router.put('/:id', authenticateUser, requireAdmin, vehicleController.updateVehicle);
router.delete('/:id', authenticateUser, requireAdmin, vehicleController.deleteVehicle);

module.exports = router;
