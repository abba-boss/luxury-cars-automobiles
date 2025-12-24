const { User } = require('../models');
const { validationResult } = require('express-validator');

// User dashboard - accessible by authenticated users
const getUserDashboard = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Simulate user-specific data
    const dashboardData = {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      stats: {
        profile_completion: user.phone ? 100 : 80,
        last_login: new Date().toISOString(),
        account_age_days: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
      }
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Get user dashboard error:', error);
    next(error);
  }
};

// Admin dashboard - admin only
const getAdminDashboard = async (req, res, next) => {
  try {
    // Get system statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'active' } });
    const adminUsers = await User.count({ where: { role: 'admin' } });

    const dashboardData = {
      admin: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name
      },
      system_stats: {
        total_users: totalUsers,
        active_users: activeUsers,
        admin_users: adminUsers,
        inactive_users: totalUsers - activeUsers
      },
      recent_activity: {
        last_updated: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    next(error);
  }
};

// Get all users - admin only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Get all users error:', error);
    next(error);
  }
};

// Update user role - admin only
const updateUserRole = async (req, res, next) => {
  const transaction = await User.sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (parseInt(userId) === req.user.id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ role }, { transaction });
    await transaction.commit();

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    console.log(`Admin ${req.user.id} updated user ${userId} role to ${role}`);

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Update user role error:', error);
    next(error);
  }
};

// Get user profile by ID - admin or owner only
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    next(error);
  }
};

module.exports = {
  getUserDashboard,
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  getUserById
};
