const { Review, User, Vehicle } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get reviews for a vehicle
const getVehicleReviews = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { vehicle_id: vehicleId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name']
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

// Create a review
const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { vehicle_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if user already reviewed this vehicle
    const existingReview = await Review.findOne({
      where: { user_id, vehicle_id }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this vehicle'
      });
    }

    const review = await Review.create({
      user_id,
      vehicle_id,
      rating,
      comment
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: reviewWithUser
    });
  } catch (error) {
    next(error);
  }
};

// Update a review
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const review = await Review.findOne({
      where: { id, user_id }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await review.update({ rating, comment });

    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const review = await Review.findOne({
      where: { id, user_id }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews (admin only)
const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, rating, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Apply filters
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    if (rating && rating !== 'all') {
      whereClause.rating = parseInt(rating);
    }
    if (search) {
      whereClause[Op.or] = [
        { '$user.full_name$': { [Op.like]: `%${search}%` } },
        { comment: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Review.findAndCountAll({
      where: whereClause,
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

// Update review status (admin only)
const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.update({ status });

    res.json({
      success: true,
      message: 'Review status updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Delete review (admin only)
const adminDeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicleReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  adminDeleteReview
};
