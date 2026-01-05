const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const bookingValidation = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('booking_date').isDate().withMessage('Valid booking date is required'),
  body('booking_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('type').isIn(['test_drive', 'inspection', 'consultation']).withMessage('Valid booking type is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

// User routes
router.get('/', authenticateUser, bookingController.getUserBookings);
router.post('/', authenticateUser, bookingValidation, bookingController.createBooking);
router.put('/:id', authenticateUser, bookingController.updateBooking);

// Admin routes
router.get('/all', authenticateUser, requireAdmin, bookingController.getAllBookings);
router.put('/admin/:id', authenticateUser, requireAdmin, bookingController.updateBookingStatus);

module.exports = router;
