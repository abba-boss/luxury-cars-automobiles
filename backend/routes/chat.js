const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const chatController = require('../controllers/chatController');
const { authenticateUser } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validationErrorHandler');

// Apply authentication to all routes
router.use(authenticateUser);

// Create conversation
router.post('/conversations',
  [
    body('recipientId').isInt().withMessage('Recipient ID must be an integer')
  ],
  handleValidationErrors,
  chatController.createConversation
);

// Get user's conversations
router.get('/conversations',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['active', 'archived', 'deleted']).withMessage('Status must be active, archived, or deleted')
  ],
  handleValidationErrors,
  chatController.getUserConversations
);

// Get conversation messages
router.get('/conversations/:conversationId/messages',
  [
    param('conversationId').isInt().withMessage('Conversation ID must be an integer'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  handleValidationErrors,
  chatController.getConversationMessages
);

// Send message
router.post('/conversations/:conversationId/messages',
  [
    param('conversationId').isInt().withMessage('Conversation ID must be an integer'),
    body('content').notEmpty().withMessage('Message content is required'),
    body('messageType').optional().isIn(['text', 'image', 'video', 'file', 'system']).withMessage('Invalid message type'),
    body('fileUrl').optional().isURL().withMessage('File URL must be a valid URL'),
    body('fileName').optional().isString().withMessage('File name must be a string')
  ],
  handleValidationErrors,
  chatController.sendMessage
);

// Mark messages as read
router.post('/conversations/:conversationId/read',
  [
    param('conversationId').isInt().withMessage('Conversation ID must be an integer')
  ],
  handleValidationErrors,
  chatController.markMessagesAsRead
);

// Get unread message count
router.get('/unread-count',
  chatController.getUnreadCount
);

module.exports = router;