const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');

// Validation middleware
const notificationValidation = [
  body('user_id').isInt().withMessage('Valid user ID is required'),
  body('type').notEmpty().withMessage('Notification type is required'),
  body('title').notEmpty().withMessage('Notification title is required'),
  body('message').notEmpty().withMessage('Notification message is required')
];

// Protected routes - user can access their own notifications
router.get('/', authenticateUser, notificationController.getUserNotifications);
router.put('/:id/read', authenticateUser, notificationController.markAsRead);
router.put('/read-all', authenticateUser, notificationController.markAllAsRead);
router.delete('/:id', authenticateUser, notificationController.deleteNotification);
router.delete('/', authenticateUser, notificationController.deleteAllNotifications);

// Admin routes - for creating notifications
router.post('/', authenticateUser, requireAdmin, notificationValidation, notificationController.createNotification);

module.exports = router;