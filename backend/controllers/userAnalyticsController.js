const { Vehicle, Favorite, Booking, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const DEMO_MODE = process.env.DEMO_MODE === 'true';

const getUserDemoData = () => ({
  activity: [
    { month: 'Aug', views: 12, saves: 3, bookings: 1 },
    { month: 'Sep', views: 18, saves: 5, bookings: 2 },
    { month: 'Oct', views: 15, saves: 4, bookings: 1 },
    { month: 'Nov', views: 22, saves: 6, bookings: 3 },
    { month: 'Dec', views: 20, saves: 5, bookings: 2 },
    { month: 'Jan', views: 25, saves: 7, bookings: 2 }
  ],
  preferences: [
    { brand: 'BMW', count: 8 },
    { brand: 'Mercedes', count: 6 },
    { brand: 'Toyota', count: 4 },
    { brand: 'Honda', count: 3 }
  ],
  stats: {
    totalViews: 112,
    totalSaves: 30,
    totalBookings: 11,
    favoriteCategory: 'Luxury'
  }
});

// Get user activity analytics
const getUserActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // User activity by month (views, saves, bookings)
    const activityData = await sequelize.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        COUNT(*) as total_activity
      FROM (
        SELECT created_at FROM favorites WHERE user_id = :userId
        UNION ALL
        SELECT created_at FROM bookings WHERE user_id = :userId
      ) as user_activities
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY created_at ASC
    `, { 
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT 
    });

    const demoData = getUserDemoData();
    const hasData = activityData.length > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? demoData.activity : activityData,
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

// Get user preferences (favorite brands)
const getUserPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const preferences = await sequelize.query(`
      SELECT 
        v.make as brand,
        COUNT(*) as count
      FROM favorites f
      JOIN vehicles v ON f.vehicle_id = v.id
      WHERE f.user_id = :userId
      GROUP BY v.make
      ORDER BY count DESC
      LIMIT 5
    `, { 
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT 
    });

    const demoData = getUserDemoData();
    const hasData = preferences.length > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? demoData.preferences : preferences,
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

// Get user stats overview
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalSaves,
      totalBookings,
      recentActivity
    ] = await Promise.all([
      Favorite.count({ where: { user_id: userId } }),
      Booking.count({ where: { user_id: userId } }),
      Favorite.count({ 
        where: { 
          user_id: userId,
          created_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        } 
      })
    ]);

    const demoData = getUserDemoData();
    const hasData = totalSaves > 0 || totalBookings > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? demoData.stats : {
        totalSaves,
        totalBookings,
        recentActivity,
        totalViews: 0 // Would need view tracking
      },
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserActivity,
  getUserPreferences,
  getUserStats
};
