const { User } = require('../models');

// Real-time permission checking middleware that checks database instead of relying on JWT claims
const requirePermissionRealtime = (permissionKey) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated (this assumes authenticateUser middleware runs first)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has the required permission by querying the database in real-time
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
      console.error('Real-time permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Real-time middleware to check multiple permissions (user needs to have at least one)
const requireAnyPermissionRealtime = (permissionKeys) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has any of the required permissions by querying the database in real-time
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
      console.error('Real-time permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Real-time middleware to check multiple permissions (user needs to have all)
const requireAllPermissionsRealtime = (permissionKeys) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has all required permissions by querying the database in real-time
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
      console.error('Real-time permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Enhanced authentication middleware that also loads permissions
const authenticateUserWithPermissions = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify and decode token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate token payload structure
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
        code: 'TOKEN_INVALID_PAYLOAD'
      });
    }

    // Fetch fresh user data from database (never trust token alone)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Verify role hasn't changed (prevent role spoofing)
    if (user.role !== decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'Role mismatch - please login again',
        code: 'ROLE_MISMATCH'
      });
    }

    // Load real-time permissions for the user
    const permissions = await user.getActivePermissions();
    user.permissions = permissions; // Add permissions to the user object

    // Attach user to request
    req.user = user;
    req.tokenData = decoded;

    console.log(`Auth success: User ${user.id} (${user.role}) accessing ${req.method} ${req.path}`);
    next();

  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = {
  requirePermissionRealtime,
  requireAnyPermissionRealtime,
  requireAllPermissionsRealtime,
  authenticateUserWithPermissions
};