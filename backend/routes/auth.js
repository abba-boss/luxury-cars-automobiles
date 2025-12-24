const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser, requireUser } = require('../middlewares/rbac');
const { registerValidation, loginValidation, updateProfileValidation } = require('../middlewares/validation');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes (requires authentication)
router.get('/me', authenticateUser, authController.getProfile);
router.put('/me', authenticateUser, updateProfileValidation, authController.updateProfile);
router.post('/logout', authenticateUser, authController.logout);

module.exports = router;
