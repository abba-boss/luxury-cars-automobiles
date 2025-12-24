const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbacController');
const { authenticateUser, requireAdmin, requireOwnershipOrAdmin } = require('../middlewares/rbac');
const { updateUserRoleValidation } = require('../middlewares/rbacValidation');

// User routes - requires authentication
router.get('/dashboard', authenticateUser, rbacController.getUserDashboard);

// Admin routes - requires admin role
router.get('/admin/dashboard', authenticateUser, requireAdmin, rbacController.getAdminDashboard);
router.get('/admin/users', authenticateUser, requireAdmin, rbacController.getAllUsers);
router.put('/admin/users/:userId/role', authenticateUser, requireAdmin, updateUserRoleValidation, rbacController.updateUserRole);

// Mixed access routes - admin or resource owner
router.get('/users/:userId', authenticateUser, requireOwnershipOrAdmin(), rbacController.getUserById);

module.exports = router;
