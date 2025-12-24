const { Sale, Vehicle, Customer } = require('../models');
const { validationResult } = require('express-validator');

// Get all sales (Admin only)
const getSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    const { count, rows } = await Sale.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Customer, as: 'customer' }
      ],
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

// Get user's sales/orders
const getUserSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Sale.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Customer, as: 'customer' }
      ],
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

// Create new sale/order
const createSale = async (req, res, next) => {
  const transaction = await Sale.sequelize.transaction();
  
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

    const { vehicle_id, customer_id, sale_price, payment_method, notes } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findByPk(vehicle_id, { transaction });
    if (!vehicle) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (vehicle.status !== 'available') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for sale'
      });
    }

    // Create sale
    const saleData = {
      vehicle_id,
      customer_id,
      sale_price,
      payment_method,
      notes,
      user_id: req.user?.id
    };

    const sale = await Sale.create(saleData, { transaction });

    // Update vehicle status to reserved
    await vehicle.update({ status: 'reserved' }, { transaction });

    await transaction.commit();

    // Fetch the complete sale with associations
    const completeSale = await Sale.findByPk(sale.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Customer, as: 'customer' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: completeSale
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Update sale status
const updateSale = async (req, res, next) => {
  const transaction = await Sale.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const sale = await Sale.findByPk(id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
      transaction
    });

    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && sale.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update sale
    await sale.update({ status, payment_status }, { transaction });

    // Update vehicle status based on sale status
    if (status === 'completed') {
      await sale.vehicle.update({ status: 'sold' }, { transaction });
    } else if (status === 'cancelled') {
      await sale.vehicle.update({ status: 'available' }, { transaction });
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getSales,
  getUserSales,
  createSale,
  updateSale
};
