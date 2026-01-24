const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const chatController = require('../controllers/chatController');
const { authenticateUser } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validationErrorHandler');

// Configure multer for temporary file storage during chat file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 5 // Max 5 files per message
  },
  fileFilter: (req, file, cb) => {
    // Allow images, documents, and other common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, DOCs, TXT, ZIP, and RAR files are allowed.'));
    }
  }
});

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

// Send message - with file upload support
router.post('/conversations/:conversationId/messages',
  [
    param('conversationId').isInt().withMessage('Conversation ID must be an integer'),
    body('content').optional().isString().withMessage('Message content must be a string'),
    body('messageType').optional().isIn(['text', 'image', 'video', 'file', 'system']).withMessage('Invalid message type'),
  ],
  // Handle file uploads if present
  (req, res, next) => {
    // Use upload.fields to handle multiple files with the name 'files'
    const uploadFields = upload.array('files', 5); // Allow up to 5 files

    uploadFields(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum allowed is 50MB per file.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 5 files allowed per message.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      next();
    });
  },
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

// Get order-related conversations (admin only)
router.get('/order-conversations',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('status').optional().isIn(['active', 'archived', 'closed']).withMessage('Status must be active, archived, or closed')
  ],
  handleValidationErrors,
  chatController.getOrderConversations
);

module.exports = router;