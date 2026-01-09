const { FinancingApplication, User, Vehicle } = require('../models');
const { validationResult } = require('express-validator');

// Get user financing applications
const getUserFinancingApplications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await FinancingApplication.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images']
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

// Apply for financing
const applyForFinancing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { vehicle_id, loan_amount, down_payment, credit_score, employment_status, annual_income } = req.body;
    const user_id = req.user.id;

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user already has a pending application for this vehicle
    const existingApplication = await FinancingApplication.findOne({
      where: { user_id, vehicle_id, status: 'pending' }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending financing application for this vehicle'
      });
    }

    const financingApplication = await FinancingApplication.create({
      user_id,
      vehicle_id,
      loan_amount,
      down_payment,
      credit_score,
      employment_status,
      annual_income
    });

    const applicationWithDetails = await FinancingApplication.findByPk(financingApplication.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Financing application submitted successfully',
      data: applicationWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// Update financing application (for user to update info)
const updateFinancingApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { loan_amount, down_payment, credit_score, employment_status, annual_income } = req.body;
    const user_id = req.user.id;

    const application = await FinancingApplication.findOne({
      where: { id, user_id }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Financing application not found or unauthorized'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application that is not pending'
      });
    }

    await application.update({
      loan_amount,
      down_payment,
      credit_score,
      employment_status,
      annual_income
    });

    const updatedApplication = await FinancingApplication.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Financing application updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all financing applications
const getAllFinancingApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await FinancingApplication.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images']
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

// Admin: Update financing application status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, interest_rate, term_months } = req.body;

    const application = await FinancingApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Financing application not found'
      });
    }

    // Calculate monthly payment if approved
    let monthly_payment = null;
    if (status === 'approved' && interest_rate && term_months) {
      const loanAmount = application.loan_amount;
      const monthlyRate = (interest_rate / 100) / 12;
      const numberOfPayments = term_months;
      
      if (monthlyRate > 0) {
        monthly_payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      } else {
        monthly_payment = loanAmount / numberOfPayments;
      }
    }

    await application.update({
      status,
      interest_rate,
      term_months,
      monthly_payment
    });

    const updatedApplication = await FinancingApplication.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Financing application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFinancingApplications,
  applyForFinancing,
  updateFinancingApplication,
  getAllFinancingApplications,
  updateApplicationStatus
};