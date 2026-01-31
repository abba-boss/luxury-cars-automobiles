const { Vehicle, User } = require('../models');
const { Op } = require('sequelize');

// Get staff dashboard statistics
const getStaffDashboard = async (req, res, next) => {
  try {
    // Only staff can access this
    if (req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff only.'
      });
    }

    // Get statistics for this staff member
    const totalVehiclesAdded = await Vehicle.count({
      where: { added_by_staff_id: req.user.id }
    });

    const pendingApprovalVehicles = await Vehicle.count({
      where: { 
        added_by_staff_id: req.user.id,
        status: 'pending_approval'
      }
    });

    const approvedVehicles = await Vehicle.count({
      where: { 
        added_by_staff_id: req.user.id,
        status: 'available'
      }
    });

    const reservedVehicles = await Vehicle.count({
      where: { 
        added_by_staff_id: req.user.id,
        status: 'reserved'
      }
    });

    const soldVehicles = await Vehicle.count({
      where: { 
        added_by_staff_id: req.user.id,
        status: 'sold'
      }
    });

    res.json({
      success: true,
      data: {
        totalVehiclesAdded,
        pendingApprovalVehicles,
        approvedVehicles,
        reservedVehicles,
        soldVehicles,
        staffInfo: {
          id: req.user.id,
          full_name: req.user.full_name,
          email: req.user.email,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get vehicles added by this staff member
const getStaffVehicles = async (req, res, next) => {
  try {
    // Only staff can access this
    if (req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff only.'
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      make,
      model,
      year_min,
      year_max,
      price_min,
      price_max
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { added_by_staff_id: req.user.id };

    // Add filters
    if (status) where.status = status;
    if (make) where.make = { [Op.like]: `%${make}%` };
    if (model) where.model = { [Op.like]: `%${model}%` };
    if (year_min || year_max) {
      where.year = {};
      if (year_min) where.year[Op.gte] = year_min;
      if (year_max) where.year[Op.lte] = year_max;
    }
    if (price_min || price_max) {
      where.price = {};
      if (price_min) where.price[Op.gte] = price_min;
      if (price_max) where.price[Op.lte] = price_max;
    }

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
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

// Get pending approval vehicles for this staff member
const getPendingApprovalVehicles = async (req, res, next) => {
  try {
    // Only staff can access this
    if (req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff only.'
      });
    }

    const vehicles = await Vehicle.findAll({
      where: {
        added_by_staff_id: req.user.id,
        status: 'pending_approval'
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// Submit vehicle for approval (change status from pending to available)
const submitForApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find the vehicle
    const vehicle = await Vehicle.findOne({
      where: {
        id: id,
        added_by_staff_id: req.user.id
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or does not belong to you'
      });
    }

    // Only allow submission if status is pending_approval
    if (vehicle.status !== 'pending_approval') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not in pending approval status'
      });
    }

    // Update status to available (this would normally be reviewed by admin, but for now staff can approve their own)
    await vehicle.update({
      status: 'available',
      approved_by_admin_id: req.user.id, // Staff member approving their own vehicle
      approval_date: new Date()
    });

    res.json({
      success: true,
      message: 'Vehicle submitted for approval successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaffDashboard,
  getStaffVehicles,
  getPendingApprovalVehicles,
  submitForApproval
};