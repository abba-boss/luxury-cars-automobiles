const { Booking, User, Vehicle } = require('../models');
const { validationResult } = require('express-validator');

// Get user bookings
const getUserBookings = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'images']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['booking_date', 'DESC'], ['booking_time', 'DESC']]
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

// Create a booking
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { vehicle_id, booking_date, booking_time, type, notes } = req.body;
    const user_id = req.user.id;

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check for existing booking at same time
    const existingBooking = await Booking.findOne({
      where: {
        vehicle_id,
        booking_date,
        booking_time,
        status: ['pending', 'confirmed']
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const booking = await Booking.create({
      user_id,
      vehicle_id,
      booking_date,
      booking_time,
      type,
      notes
    });

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookingWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status
const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user_id = req.user.id;

    const booking = await Booking.findOne({
      where: { id, user_id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or unauthorized'
      });
    }

    await booking.update({ status, notes });

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'images']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (Admin)
const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'images']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['booking_date', 'DESC'], ['booking_time', 'DESC']]
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

// Update booking status (Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({ status, notes });

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'images']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookings,
  createBooking,
  updateBooking,
  getAllBookings,
  updateBookingStatus
};
