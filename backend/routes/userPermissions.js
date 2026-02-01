const express = require('express');
const router = express.Router();
const userPermissionController = require('../controllers/userPermissionController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');

// All user permission routes require authentication and admin role
router.use(authenticateUser);
router.use(requireAdmin);

// User permission management routes
router.get('/users/:userId/permissions', userPermissionController.getUserPermissions);
router.post('/users/:userId/permissions', userPermissionController.grantUserPermission);
router.put('/users/:userId/permissions/:permissionId', userPermissionController.updateUserPermission);
router.delete('/users/:userId/permissions/:permissionId', userPermissionController.revokeUserPermission);
router.get('/users-with-permissions', userPermissionController.getAllUsersWithPermissions);
router.get('/users/:userId/check-permission', userPermissionController.checkUserPermission);

module.exports = router;