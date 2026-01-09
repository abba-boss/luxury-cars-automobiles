const { Payment, Sale, User, Vehicle } = require('../models');
const { validationResult } = require('express-validator');

// Get user payment history
const getUserPayments = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      include: [
        {
          model: Sale,
          as: 'sale',
          include: [
            {
              model: Vehicle,
              as: 'vehicle',
              attributes: ['id', 'make', 'model', 'year']
            }
          ]
        }
      ],
      where: {
        '$sale.user_id$': user_id
      },
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

// Create payment intent (for frontend to process with payment gateway)
const createPaymentIntent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sale_id, amount, payment_method } = req.body;
    const user_id = req.user.id;

    // Verify sale belongs to user
    const sale = await Sale.findOne({
      where: { id: sale_id, user_id }
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found or unauthorized'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      sale_id,
      amount,
      payment_method,
      status: 'pending'
    });

    // Update sale payment status
    await sale.update({
      payment_status: 'pending',
      payment_method
    });

    res.status(201).json({
      success: true,
      message: 'Payment intent created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment (called after payment gateway confirms)
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { transaction_id } = req.body;

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // In a real implementation, you would verify with the payment gateway here
    await payment.update({
      transaction_id,
      status: 'completed'
    });

    // Update sale status
    const sale = await Sale.findByPk(payment.sale_id);
    if (sale) {
      await sale.update({
        payment_status: 'completed',
        status: 'confirmed' // or 'paid'
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Get payment status
const getPaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const user_id = req.user.id;

    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [{
        model: Sale,
        as: 'sale',
        where: { user_id },
        attributes: ['id', 'status', 'payment_status']
      }]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all payments
const getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Payment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Sale,
          as: 'sale',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'full_name', 'email']
            },
            {
              model: Vehicle,
              as: 'vehicle',
              attributes: ['id', 'make', 'model', 'year']
            }
          ]
        }
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

module.exports = {
  getUserPayments,
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  getAllPayments
};