const { User } = require('../models');

// Middleware to check if user has a specific permission
const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated (this assumes authenticateUser middleware runs first)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has the required permission
      const hasPermission = await req.user.hasPermission(permissionKey);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Permission '${permissionKey}' required.`
        });
      }

      // User has permission, proceed to next middleware
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Middleware to check multiple permissions (user needs to have at least one)
const requireAnyPermission = (permissionKeys) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has any of the required permissions
      let hasAnyPermission = false;
      for (const permissionKey of permissionKeys) {
        const hasPermission = await req.user.hasPermission(permissionKey);
        if (hasPermission) {
          hasAnyPermission = true;
          break;
        }
      }

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. At least one of the following permissions required: ${permissionKeys.join(', ')}.`
        });
      }

      // User has at least one required permission, proceed to next middleware
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Middleware to check multiple permissions (user needs to have all)
const requireAllPermissions = (permissionKeys) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has all required permissions
      for (const permissionKey of permissionKeys) {
        const hasPermission = await req.user.hasPermission(permissionKey);
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied. Permission '${permissionKey}' required.`
          });
        }
      }

      // User has all required permissions, proceed to next middleware
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions
};