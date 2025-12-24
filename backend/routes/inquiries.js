const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const inquiryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public routes
router.post('/', inquiryValidation, inquiryController.createInquiry);

// Protected routes
router.get('/', authenticateUser, requireAdmin, inquiryController.getInquiries);
router.get('/my-inquiries', authenticateUser, inquiryController.getUserInquiries);
router.put('/:id', authenticateUser, requireAdmin, inquiryController.updateInquiry);

module.exports = router;
