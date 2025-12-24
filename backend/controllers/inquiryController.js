const { Inquiry, Vehicle } = require('../models');
const { validationResult } = require('express-validator');

// Get all inquiries (Admin only)
const getInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    const { count, rows } = await Inquiry.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', required: false }
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

// Get user's inquiries
const getUserInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Inquiry.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        { model: Vehicle, as: 'vehicle', required: false }
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

// Create new inquiry
const createInquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const inquiryData = { ...req.body };
    if (req.user) {
      inquiryData.user_id = req.user.id;
    }

    const inquiry = await Inquiry.create(inquiryData);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// Update inquiry status (Admin only)
const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    await inquiry.update({ status, priority });

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInquiries,
  getUserInquiries,
  createInquiry,
  updateInquiry
};
