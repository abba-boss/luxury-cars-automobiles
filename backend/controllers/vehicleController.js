const { Vehicle, Brand } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { deleteMediaFromCloudinary } = require('../utils/cloudinaryUtils');

// Get all vehicles with filtering and pagination
const getVehicles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      make,
      model,
      year_min,
      year_max,
      price_min,
      price_max,
      condition,
      transmission,
      fuel_type,
      body_type,
      status,
      is_featured,
      is_hot_deal,
      search,
      brand_id
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Different default status based on user role
    if (req.user && req.user.role === 'staff') {
      // Staff can see their pending approval vehicles plus available ones
      where[Op.or] = [
        { status: 'available' },
        { status: 'pending_approval', added_by_staff_id: req.user.id }
      ];
    } else if (req.user && req.user.role === 'admin') {
      // Admin can see all statuses
      if (status) {
        where.status = status;
      }
    } else {
      // Regular users and unauthenticated users only see available vehicles
      where.status = 'available';
    }

    // Add filters
    if (make) where.make = { [Op.like]: `%${make}%` };
    if (model) where.model = { [Op.like]: `%${model}%` };
    if (brand_id) where.brand_id = parseInt(brand_id);
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
    if (condition) where.condition = condition;
    if (transmission) where.transmission = transmission;
    if (fuel_type) where.fuel_type = fuel_type;
    if (body_type) where.body_type = body_type;
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (is_hot_deal !== undefined) where.is_hot_deal = is_hot_deal === 'true';

    // Search functionality
    if (search) {
      where[Op.or] = [
        { make: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // If staff, only show their pending vehicles and available ones
    if (req.user && req.user.role === 'staff') {
      where[Op.or] = [
        { status: 'available' },
        { status: 'pending_approval', added_by_staff_id: req.user.id }
      ];
    }

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      include: [{
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'image']
      }],
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

// Get vehicle by ID
const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id, {
      include: [{
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'image']
      }]
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// Create new vehicle (Admin and Staff)
const createVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const vehicleData = { ...req.body };

    // If staff is creating the vehicle, set status to pending approval and track who added it
    if (req.user.role === 'staff') {
      vehicleData.status = 'pending_approval';
      vehicleData.added_by_staff_id = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin can set status directly, but if not specified, default to available
      vehicleData.status = vehicleData.status || 'available';
    }

    const vehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      success: true,
      message: req.user.role === 'staff'
        ? 'Vehicle created successfully and awaiting admin approval'
        : 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// Update vehicle (Admin and Staff)
const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check permissions for staff
    if (req.user.role === 'staff') {
      // Staff can only update vehicles they added (if tracking this)
      if (vehicle.added_by_staff_id && vehicle.added_by_staff_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Cannot update vehicle added by another staff member'
        });
      }

      // Prevent staff from changing status to 'available' without approval
      if (req.body.status === 'available' && vehicle.status !== 'pending_approval') {
        return res.status(403).json({
          success: false,
          message: 'Only admin can approve vehicle for sale'
        });
      }

      // If staff is approving their own vehicle, set approval details
      if (req.body.status === 'available' && vehicle.status === 'pending_approval') {
        req.body.approved_by_admin_id = req.user.id;
        req.body.approval_date = new Date();
      }
    }

    await vehicle.update(req.body);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// Delete vehicle (Admin only)
const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Delete media files from Cloudinary before deleting the vehicle
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      await deleteMediaFromCloudinary(vehicle.images);
    }

    if (vehicle.videos && Array.isArray(vehicle.videos) && vehicle.videos.length > 0) {
      await deleteMediaFromCloudinary(vehicle.videos);
    }

    await vehicle.destroy();

    res.json({
      success: true,
      message: 'Vehicle and associated media deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
