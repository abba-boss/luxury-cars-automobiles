const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticateUser } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const favoriteValidation = [
  body('vehicle_id').isInt({ min: 1 }).withMessage('Valid vehicle ID is required')
];

// All routes require authentication
router.get('/', authenticateUser, favoriteController.getUserFavorites);
router.post('/', authenticateUser, favoriteValidation, favoriteController.addToFavorites);
router.delete('/:vehicleId', authenticateUser, favoriteController.removeFromFavorites);
router.get('/check/:vehicleId', authenticateUser, favoriteController.checkFavorite);

module.exports = router;
