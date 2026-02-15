const express = require('express');
const router = express.Router();
const { requirePermissionRealtime, authenticateUserWithPermissions } = require('../middlewares/realTimePermissionMiddleware');
const { requireStaff } = require('../middlewares/rbac');
const { Vehicle, Sale, Customer, Inquiry, Review, Brand, HomepageImage, User } = require('../models');
const { Op } = require('sequelize');

// All staff routes require authentication and appropriate permissions
router.use(authenticateUserWithPermissions);
router.use(requireStaff); // Only staff and admin can access these routes

// Vehicle Management Routes
// GET vehicles - requires 'manage_inventory' permission
router.get('/vehicles', requirePermissionRealtime('manage_inventory'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, make, model } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (status) where.status = status;
    if (make) where.make = make;
    if (model) where.model = model;
    
    const { count, rows } = await Vehicle.findAndCountAll({
      where,
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
});

// POST new vehicle - requires 'manage_inventory' permission
router.post('/vehicles', requirePermissionRealtime('manage_inventory'), async (req, res, next) => {
  try {
    const { make, model, year, price, mileage, fuel_type, transmission, condition, 
           body_type, color, description, features, images, videos, is_featured, 
           is_hot_deal, is_verified, status, brand_id, acceleration, top_speed, power, torque } = req.body;

    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      condition,
      body_type,
      color,
      description,
      features: features || [],
      images: images || [],
      videos: videos || [],
      is_featured: is_featured || false,
      is_hot_deal: is_hot_deal || false,
      is_verified: is_verified || false,
      status: status || 'available',
      brand_id,
      acceleration,
      top_speed,
      power,
      torque,
      user_id: req.user.id // Track who added the vehicle
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// PUT update vehicle - requires 'manage_inventory' permission
router.put('/vehicles/:id', requirePermissionRealtime('manage_inventory'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.update(updates);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// PUT update vehicle status - requires 'update_vehicle_status' permission
router.put('/vehicles/:id/status', requirePermissionRealtime('update_vehicle_status'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'sold', 'reserved', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.update({ status });

    res.json({
      success: true,
      message: 'Vehicle status updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// POST upload vehicle media - requires 'upload_vehicle_media' permission
router.post('/vehicles/:id/media', requirePermissionRealtime('upload_vehicle_media'), async (req, res, next) => {
  try {
    // This would handle file uploads for vehicle media
    // Implementation depends on your upload setup
    res.json({
      success: true,
      message: 'Media upload endpoint - implementation needed',
      data: { vehicleId: req.params.id }
    });
  } catch (error) {
    next(error);
  }
});

// PUT verify vehicle - requires 'verify_vehicles' permission
router.put('/vehicles/:id/verify', requirePermissionRealtime('verify_vehicles'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.update({ is_verified: true });

    res.json({
      success: true,
      message: 'Vehicle verified successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// Order Management Routes
// GET orders - requires 'view_orders' permission
router.get('/orders', requirePermissionRealtime('view_orders'), async (req, res, next) => {
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
});

// PUT update order status - requires 'update_order_status' permission
router.put('/orders/:id/status', requirePermissionRealtime('update_order_status'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const sale = await Sale.findByPk(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await sale.update({ status, payment_status });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: sale
    });
  } catch (error) {
    next(error);
  }
});

// Customer Management Routes
// GET customers - requires 'manage_customers' permission
router.get('/customers', requirePermissionRealtime('manage_customers'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
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
});

// PUT update customer - requires 'manage_customers' permission
router.put('/customers/:id', requirePermissionRealtime('manage_customers'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.update(updates);

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// Sales Processing Routes
// POST process sale - requires 'process_sales' permission
router.post('/sales', requirePermissionRealtime('process_sales'), async (req, res, next) => {
  try {
    const { vehicle_id, customer_id, sale_price, payment_method, notes } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle || vehicle.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not available for sale'
      });
    }

    // Create the sale
    const sale = await Sale.create({
      vehicle_id,
      customer_id,
      sale_price,
      payment_method,
      notes,
      user_id: req.user.id // Staff member who processed the sale
    });

    // Update vehicle status to sold
    await vehicle.update({ status: 'sold' });

    res.status(201).json({
      success: true,
      message: 'Sale processed successfully',
      data: sale
    });
  } catch (error) {
    next(error);
  }
});

// Content Management Routes
// GET brands - requires 'manage_brand_images' permission
router.get('/brands', requirePermissionRealtime('manage_brand_images'), async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
});

// PUT update brand - requires 'manage_brand_images' permission
router.put('/brands/:id', requirePermissionRealtime('manage_brand_images'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    await brand.update({ name, image });

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    next(error);
  }
});

// GET homepage content - requires 'update_homepage_content' permission
router.get('/homepage-content', requirePermissionRealtime('update_homepage_content'), async (req, res, next) => {
  try {
    const homepageImages = await HomepageImage.findAll({
      where: { is_active: true },
      order: [['position', 'ASC']]
    });

    res.json({
      success: true,
      data: homepageImages
    });
  } catch (error) {
    next(error);
  }
});

// PUT update homepage content - requires 'update_homepage_content' permission
router.put('/homepage-content/:id', requirePermissionRealtime('update_homepage_content'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const homepageImage = await HomepageImage.findByPk(id);
    if (!homepageImage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage content not found'
      });
    }

    await homepageImage.update(updates);

    res.json({
      success: true,
      message: 'Homepage content updated successfully',
      data: homepageImage
    });
  } catch (error) {
    next(error);
  }
});

// Customer Service Routes
// GET inquiries - requires 'respond_to_inquiries' permission
router.get('/inquiries', requirePermissionRealtime('respond_to_inquiries'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Inquiry.findAndCountAll({
      where,
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
});

// PUT update inquiry status - requires 'respond_to_inquiries' permission
router.put('/inquiries/:id', requirePermissionRealtime('respond_to_inquiries'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    await inquiry.update(updates);

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
});

// GET reviews - requires 'manage_reviews' permission
router.get('/reviews', requirePermissionRealtime('manage_reviews'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'make', 'model', 'year'] }
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
});

// PUT update review status - requires 'manage_reviews' permission
router.put('/reviews/:id/status', requirePermissionRealtime('manage_reviews'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

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
});

// GET reports - requires 'view_reports' permission
router.get('/reports', requirePermissionRealtime('view_reports'), async (req, res, next) => {
  try {
    // This would return various reports based on the staff member's permissions
    // For now, returning a basic structure
    const reports = {
      salesSummary: {
        totalSales: 42,
        revenue: 8500000,
        avgOrderValue: 202380,
        topSellingModels: [
          { model: 'Toyota Camry', sales: 8 },
          { model: 'BMW X5', sales: 7 },
          { model: 'Mercedes-Benz E-Class', sales: 6 }
        ]
      },
      inventoryStatus: {
        totalVehicles: 120,
        available: 78,
        sold: 32,
        reserved: 10,
        topBrands: [
          { brand: 'Toyota', count: 22 },
          { brand: 'BMW', count: 18 },
          { brand: 'Mercedes-Benz', count: 15 }
        ]
      },
      customerEngagement: {
        inquiries: 125,
        reviews: 89,
        testDrives: 67,
        conversionRate: 34.5
      }
    };

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
});

// GET customers - requires 'manage_customers' permission
router.get('/customers', requirePermissionRealtime('manage_customers'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Customer.findAndCountAll({
      where,
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
});

// PUT update customer - requires 'manage_customers' permission
router.put('/customers/:id', requirePermissionRealtime('manage_customers'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.update(updates);

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;