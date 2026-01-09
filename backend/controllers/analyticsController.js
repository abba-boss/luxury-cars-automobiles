const { Vehicle, Sale, User, Booking, Review } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const DEMO_MODE = process.env.DEMO_MODE === 'true';

const getDemoData = () => ({
  overview: {
    totalRevenue: 15750000,
    totalVehicles: 45,
    totalUsers: 128,
    totalBookings: 23
  },
  salesByMonth: [
    { month: 'Aug', total: 2100000 },
    { month: 'Sep', total: 2850000 },
    { month: 'Oct', total: 3200000 },
    { month: 'Nov', total: 2950000 },
    { month: 'Dec', total: 2800000 },
    { month: 'Jan', total: 1850000 }
  ],
  topBrands: [
    { brand: 'BMW', sales_count: 8 },
    { brand: 'Mercedes', sales_count: 6 },
    { brand: 'Toyota', sales_count: 5 },
    { brand: 'Honda', sales_count: 4 }
  ],
  statusDistribution: [
    { status: 'Available', count: 28 },
    { status: 'Sold', count: 12 },
    { status: 'Reserved', count: 5 }
  ],
  vehiclesByBrand: [
    { brand: 'BMW', count: 12 },
    { brand: 'Mercedes', count: 10 },
    { brand: 'Toyota', count: 8 },
    { brand: 'Honda', count: 7 },
    { brand: 'Audi', count: 5 },
    { brand: 'Lexus', count: 3 }
  ],
  userGrowth: [
    { month: 'Aug', users: 15 },
    { month: 'Sep', users: 22 },
    { month: 'Oct', users: 18 },
    { month: 'Nov', users: 25 },
    { month: 'Dec', users: 20 },
    { month: 'Jan', users: 28 }
  ],
  recentActivity: {
    bookings: 8,
    reviews: 12
  }
});

// Get overview analytics
const getOverview = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      totalSales,
      totalUsers,
      totalBookings,
      totalRevenue
    ] = await Promise.all([
      Vehicle.count(),
      Sale.count(),
      User.count({ where: { role: 'user' } }),
      Booking.count(),
      Sale.sum('sale_price') || 0
    ]);

    const demoData = getDemoData();
    const hasData = totalVehicles > 0 || totalSales > 0 || totalUsers > 0 || totalBookings > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? demoData.overview : {
        totalVehicles,
        totalSales,
        totalUsers,
        totalBookings,
        totalRevenue: parseFloat(totalRevenue) || 0
      },
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

// Get sales analytics
const getSalesAnalytics = async (req, res, next) => {
  try {
    // Sales by month (last 12 months)
    const salesByMonth = await sequelize.query(`
      SELECT
        DATE_FORMAT(sale_date, '%Y-%m') as month,
        COUNT(*) as count,
        SUM(sale_price) as revenue
      FROM sales
      WHERE sale_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
      ORDER BY month ASC
    `, { type: sequelize.QueryTypes.SELECT });

    // Top selling brands
    const topBrands = await sequelize.query(`
      SELECT
        v.make as brand,
        COUNT(s.id) as sales_count,
        SUM(s.sale_price) as total_revenue
      FROM sales s
      JOIN vehicles v ON s.vehicle_id = v.id
      GROUP BY v.make
      ORDER BY sales_count DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    const demoData = getDemoData();
    const hasData = salesByMonth.length > 0 || topBrands.length > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? {
        salesByMonth: demoData.salesByMonth,
        topBrands: demoData.topBrands
      } : {
        salesByMonth,
        topBrands
      },
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory analytics
const getInventoryAnalytics = async (req, res, next) => {
  try {
    // Vehicle status distribution
    const statusDistribution = await Vehicle.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Vehicles by brand
    const vehiclesByBrand = await Vehicle.findAll({
      attributes: [
        'make',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['make'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    const inventoryData = {
      statusDistribution: statusDistribution.map(item => ({
        status: item.status,
        count: parseInt(item.dataValues.count)
      })),
      vehiclesByBrand: vehiclesByBrand.map(item => ({
        brand: item.make,
        count: parseInt(item.dataValues.count)
      }))
    };

    const demoData = getDemoData();
    const hasData = statusDistribution.length > 0 || vehiclesByBrand.length > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? {
        statusDistribution: demoData.statusDistribution,
        vehiclesByBrand: demoData.vehiclesByBrand
      } : inventoryData,
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

// Get user analytics
const getUserAnalytics = async (req, res, next) => {
  try {
    // User growth by month (last 12 months)
    const userGrowth = await sequelize.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as new_users
      FROM users
      WHERE role = 'user' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, { type: sequelize.QueryTypes.SELECT });

    // Recent activity
    const recentBookings = await Booking.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const recentReviews = await Review.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const demoData = getDemoData();
    const hasData = userGrowth.length > 0 || recentBookings > 0 || recentReviews > 0;

    res.json({
      success: true,
      data: (DEMO_MODE && !hasData) ? {
        userGrowth: demoData.userGrowth,
        recentActivity: demoData.recentActivity
      } : {
        userGrowth,
        recentActivity: {
          bookings: recentBookings,
          reviews: recentReviews
        }
      },
      isDemo: DEMO_MODE && !hasData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getSalesAnalytics,
  getInventoryAnalytics,
  getUserAnalytics
};
