const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateUser, requireAdmin, requireStaff } = require('../middlewares/rbac');
const { body } = require('express-validator');
const { staffVehicleValidation, staffVehicleUpdateValidation } = require('../middlewares/staffValidation');

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

// Staff and Admin routes
router.post('/', authenticateUser, requireStaff, staffVehicleValidation, vehicleController.createVehicle);
router.put('/:id', authenticateUser, requireStaff, staffVehicleUpdateValidation, vehicleController.updateVehicle);
router.delete('/:id', authenticateUser, requireAdmin, vehicleController.deleteVehicle); // Only admin can delete

module.exports = router;
