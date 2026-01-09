const { Notification, User } = require('../models');
const { validationResult } = require('express-validator');

// Get user notifications
const getUserNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10, is_read } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { user_id };
    if (is_read !== undefined) {
      whereClause.is_read = is_read === 'true';
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
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

// Create a notification (internal use, typically called by other services)
const createNotification = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { user_id, type, title, message } = req.body;

    const notification = await Notification.create({
      user_id,
      type,
      title,
      message
    });

    const notificationWithUser = await Notification.findByPk(notification.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notificationWithUser
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const notification = await Notification.findOne({
      where: { id, user_id }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or unauthorized'
      });
    }

    await notification.update({ is_read: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const notification = await Notification.findOne({
      where: { id, user_id }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or unauthorized'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await Notification.destroy({
      where: { user_id }
    });

    res.json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};