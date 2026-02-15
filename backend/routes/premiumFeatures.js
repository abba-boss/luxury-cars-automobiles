const express = require('express');
const router = express.Router();
const { requirePermissionRealtime, authenticateUserWithPermissions } = require('../middlewares/realTimePermissionMiddleware');
const { Vehicle } = require('../models');

// Route to get premium inventory - requires 'view_premium_inventory' permission
router.get('/premium', authenticateUserWithPermissions, requirePermissionRealtime('view_premium_inventory'), async (req, res, next) => {
  try {
    // Get premium inventory (e.g., vehicles with special features)
    const premiumVehicles = await Vehicle.findAll({
      where: {
        is_featured: true,  // Assuming featured vehicles are premium
        status: 'available'
      },
      order: [['price', 'DESC']]
    });

    res.json({
      success: true,
      data: premiumVehicles,
      message: 'Premium inventory retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Route to schedule test drive - requires 'schedule_test_drive' permission
router.post('/test-drive', authenticateUserWithPermissions, requirePermissionRealtime('schedule_test_drive'), async (req, res, next) => {
  try {
    const { vehicleId, dateTime } = req.body;
    const userId = req.user.id;

    // In a real implementation, you would create a booking record
    // For now, we just validate the permission

    res.json({
      success: true,
      message: 'Test drive scheduled successfully',
      data: {
        vehicleId,
        dateTime,
        userId
      }
    });
  } catch (error) {
    next(error);
  }
});

// Route to access exclusive promotions - requires 'exclusive_promotions' permission
router.get('/promotions/exclusive', authenticateUserWithPermissions, requirePermissionRealtime('exclusive_promotions'), async (req, res, next) => {
  try {
    // In a real implementation, you would fetch exclusive promotions
    // For now, returning mock data

    const exclusivePromotions = [
      {
        id: 1,
        title: 'VIP Early Access',
        description: 'Get first access to new luxury models',
        discount: '5% off next purchase',
        valid_until: '2024-12-31'
      },
      {
        id: 2,
        title: 'Premium Service Package',
        description: 'Complimentary detailing and maintenance',
        discount: 'Free service for 1 year',
        valid_until: '2024-11-30'
      }
    ];

    res.json({
      success: true,
      data: exclusivePromotions,
      message: 'Exclusive promotions retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;