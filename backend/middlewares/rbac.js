const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Enhanced authentication middleware
const authenticateUser = async (req, res, next) => {
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

// Dynamic role authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Check if user has any of the allowed roles
      if (!req.user.hasAnyRole(allowedRoles)) {
        console.log(`Access denied: User ${req.user.id} (${req.user.role}) attempted to access ${req.method} ${req.path}. Required roles: [${allowedRoles.join(', ')}]`);
        
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required_roles: allowedRoles,
          user_role: req.user.role
        });
      }

      console.log(`Access granted: User ${req.user.id} (${req.user.role}) accessing ${req.method} ${req.path}`);
      next();

    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization failed',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// Convenience middleware for common role checks
const requireUser = authorizeRoles('user', 'staff', 'admin');
const requireStaff = authorizeRoles('staff', 'admin');
const requireAdmin = authorizeRoles('admin');

// Middleware to check if user owns resource or is admin
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Admin can access anything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user has a specific permission to bypass ownership check
      const bypassPermission = await req.user.hasPermission('access_any_resource');
      if (bypassPermission) {
        return next();
      }

      // Staff can access based on their permissions
      if (req.user.role === 'staff') {
        // For now, staff can access their own resources or resources assigned to them
        // This can be expanded based on specific business rules
        const resourceUserId = req.params.userId || req.body[resourceUserIdField] || req.query.userId;

        if (resourceUserId && parseInt(resourceUserId) === req.user.id) {
          return next();
        }

        // Add additional staff access rules here as needed
        // For example, if staff can access resources they created
        return res.status(403).json({
          success: false,
          message: 'Access denied - insufficient permissions for staff',
          code: 'STAFF_INSUFFICIENT_PERMISSIONS'
        });
      }

      // Check ownership - resource user ID should match authenticated user
      const resourceUserId = req.params.userId || req.body[resourceUserIdField] || req.query.userId;

      if (parseInt(resourceUserId) !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - resource ownership required',
          code: 'OWNERSHIP_REQUIRED'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization failed',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// Middleware for staff vehicle management permissions
const requireStaffVehicleManagement = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Admin can do everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user has specific vehicle management permission
      const hasVehiclePermission = await req.user.hasPermission('manage_vehicles');
      if (hasVehiclePermission) {
        return next();
      }

      // Staff can manage vehicles if they have the specific permission
      if (req.user.role === 'staff') {
        // Allow specific vehicle operations for staff
        const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH']; // Staff can view, add, update vehicles
        if (allowedMethods.includes(req.method)) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: 'Staff cannot perform this operation on vehicles',
          code: 'STAFF_VEHICLE_OPERATION_DENIED'
        });
      }

      // Regular users can only view vehicles
      if (req.user.role === 'user') {
        if (req.method === 'GET') {
          return next();
        }
        return res.status(403).json({
          success: false,
          message: 'Regular users cannot modify vehicles',
          code: 'USER_VEHICLE_MODIFICATION_DENIED'
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    } catch (error) {
      console.error('Vehicle management authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization failed',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  requireUser,
  requireStaff,
  requireAdmin,
  requireOwnershipOrAdmin,
  requireStaffVehicleManagement
};
