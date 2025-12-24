const { User, Vehicle, Sale, Customer, Inquiry } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalVehicles,
      totalSales,
      totalInquiries,
      recentSales,
      recentInquiries
    ] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Vehicle.count(),
      Sale.count(),
      Inquiry.count(),
      Sale.findAll({
        limit: 5,
        include: [
          { model: Vehicle, as: 'vehicle' },
          { model: Customer, as: 'customer' }
        ],
        order: [['created_at', 'DESC']]
      }),
      Inquiry.findAll({
        limit: 5,
        include: [
          { model: Vehicle, as: 'vehicle', required: false }
        ],
        order: [['created_at', 'DESC']]
      })
    ]);

    // Calculate revenue
    const revenue = await Sale.sum('sale_price', {
      where: { status: 'completed' }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalVehicles,
          totalSales,
          totalInquiries,
          revenue: revenue || 0
        },
        recentSales,
        recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (role) where.role = role;
    if (status) where.status = status;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user status/role (Admin only)
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    await user.update({ role, status });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser
};
