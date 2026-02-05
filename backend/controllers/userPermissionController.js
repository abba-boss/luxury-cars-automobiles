const { User, UserPermission, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all permissions for a specific user
const getUserPermissions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findByPk(userId, {
      attributes: ['id', 'full_name', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let permissions = [];
    try {
      permissions = await UserPermission.findAll({
        where: {
          user_id: userId,
          is_active: true
        },
        include: [
          {
            model: User,
            as: 'grantingUser',
            attributes: ['id', 'full_name', 'email']
          }
        ],
        order: [['granted_at', 'DESC']]
      });
    } catch (error) {
      // If there's an error querying the UserPermission table (likely doesn't exist),
      // return empty permissions array
      console.warn('Warning: Could not fetch permissions, UserPermission table may not exist:', error.message);
      permissions = [];
    }

    res.json({
      success: true,
      data: {
        user,
        permissions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Grant a permission to a user
const grantUserPermission = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { permission_key, permission_value, expires_at } = req.body;

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    try {
      // Check if permission already exists and is active
      const existingPermission = await UserPermission.findOne({
        where: {
          user_id: userId,
          permission_key,
          is_active: true
        }
      });

      if (existingPermission) {
        return res.status(400).json({
          success: false,
          message: 'Permission already exists for this user'
        });
      }

      // Create the new permission
      const permission = await UserPermission.create({
        user_id: userId,
        permission_key,
        permission_value,
        granted_by: req.user.id,
        expires_at: expires_at || null
      });

      // Populate the granting user for the response
      const populatedPermission = await UserPermission.findByPk(permission.id, {
        include: [
          {
            model: User,
            as: 'grantingUser',
            attributes: ['id', 'full_name', 'email']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Permission granted successfully',
        data: populatedPermission
      });
    } catch (dbError) {
      // If there's an error with the UserPermission table, return appropriate error
      console.error('Error granting permission:', dbError);
      if (dbError.name === 'SequelizeDatabaseError' && dbError.message.includes('doesn\'t exist')) {
        return res.status(500).json({
          success: false,
          message: 'Permission system not initialized. Please run database migrations.'
        });
      }
      next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

// Revoke a permission from a user
const revokeUserPermission = async (req, res, next) => {
  try {
    const { userId, permissionId } = req.params;

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    try {
      // Find the permission
      const permission = await UserPermission.findOne({
        where: {
          id: permissionId,
          user_id: userId,
          is_active: true
        }
      });

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found or already revoked'
        });
      }

      // Update the permission to inactive instead of deleting
      await permission.update({
        is_active: false
      });

      res.json({
        success: true,
        message: 'Permission revoked successfully'
      });
    } catch (dbError) {
      // If there's an error with the UserPermission table
      console.error('Error revoking permission:', dbError);
      if (dbError.name === 'SequelizeDatabaseError' && dbError.message.includes('doesn\'t exist')) {
        return res.status(500).json({
          success: false,
          message: 'Permission system not initialized. Please run database migrations.'
        });
      }
      next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

// Update a permission (change value or expiration)
const updateUserPermission = async (req, res, next) => {
  try {
    const { userId, permissionId } = req.params;
    const { permission_value, expires_at, is_active } = req.body;

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    try {
      // Find the permission
      const permission = await UserPermission.findOne({
        where: {
          id: permissionId,
          user_id: userId
        }
      });

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }

      // Update the permission
      await permission.update({
        permission_value: permission_value !== undefined ? permission_value : permission.permission_value,
        expires_at: expires_at !== undefined ? expires_at : permission.expires_at,
        is_active: is_active !== undefined ? is_active : permission.is_active
      });

      // Populate the updated permission for response
      const updatedPermission = await UserPermission.findByPk(permission.id, {
        include: [
          {
            model: User,
            as: 'grantingUser',
            attributes: ['id', 'full_name', 'email']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Permission updated successfully',
        data: updatedPermission
      });
    } catch (dbError) {
      // If there's an error with the UserPermission table
      console.error('Error updating permission:', dbError);
      if (dbError.name === 'SequelizeDatabaseError' && dbError.message.includes('doesn\'t exist')) {
        return res.status(500).json({
          success: false,
          message: 'Permission system not initialized. Please run database migrations.'
        });
      }
      next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

// Get all users with their permissions
const getAllUsersWithPermissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('full_name')), 'LIKE', `%${search.toLowerCase()}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), 'LIKE', `%${search.toLowerCase()}%`)
      ];
    }

    // Check if UserPermission table exists before including it
    let users;
    try {
      users = await User.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'full_name', 'email', 'role', 'status', 'created_at'],
        include: [
          {
            model: UserPermission,
            as: 'permissions',
            attributes: ['id', 'permission_key', 'permission_value', 'granted_at', 'expires_at', 'is_active'],
            where: { is_active: true },
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
    } catch (includeError) {
      // If there's an error including UserPermission (likely table doesn't exist),
      // fetch users without permissions
      console.warn('Warning: Could not include permissions, UserPermission table may not exist:', includeError.message);

      users = await User.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'full_name', 'email', 'role', 'status', 'created_at'],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      // Add empty permissions array to each user
      users.rows = users.rows.map(user => ({
        ...user.toJSON(),
        permissions: []
      }));
    }

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(users.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Check if a user has a specific permission
const checkUserPermission = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { permission_key } = req.query;

    if (!permission_key) {
      return res.status(400).json({
        success: false,
        message: 'Permission key is required'
      });
    }

    try {
      // Check if user has the specific permission
      const permission = await UserPermission.findOne({
        where: {
          user_id: userId,
          permission_key,
          is_active: true
        }
      });

      res.json({
        success: true,
        data: {
          has_permission: !!permission,
          permission: permission || null
        }
      });
    } catch (dbError) {
      // If there's an error with the UserPermission table
      console.error('Error checking user permission:', dbError);
      if (dbError.name === 'SequelizeDatabaseError' && dbError.message.includes('doesn\'t exist')) {
        return res.status(500).json({
          success: true,
          data: {
            has_permission: false,
            permission: null
          },
          message: 'Permission system not initialized. Please run database migrations.'
        });
      }
      next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserPermissions,
  grantUserPermission,
  revokeUserPermission,
  updateUserPermission,
  getAllUsersWithPermissions,
  checkUserPermission
};