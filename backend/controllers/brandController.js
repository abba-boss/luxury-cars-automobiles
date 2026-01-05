const { Brand, Vehicle } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all brands with pagination and search
const getBrands = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      include_vehicle_count = false
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Search functionality
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const options = {
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    };

    // Include vehicle count if requested
    if (include_vehicle_count === 'true') {
      const brands = await Brand.findAll({
        where,
        attributes: {
          include: [
            [
              require('sequelize').literal('(SELECT COUNT(*) FROM vehicles WHERE vehicles.brand_id = Brand.id)'),
              'vehicle_count'
            ]
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });

      const total = await Brand.count({ where });

      return res.json({
        success: true,
        data: brands,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    }

    const { count, rows } = await Brand.findAndCountAll(options);

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

// Get brand by ID
const getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id, {
      include: [{
        model: Vehicle,
        as: 'vehicles',
        attributes: ['id', 'make', 'model', 'year', 'price', 'status']
      }]
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// Create new brand (Admin only)
const createBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, image } = req.body;

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ where: { name } });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand already exists'
      });
    }

    const brand = await Brand.create({ name, image });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// Update brand (Admin only)
const updateBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, image } = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if name is being changed and if it conflicts
    if (name !== brand.name) {
      const existingBrand = await Brand.findOne({ 
        where: { 
          name,
          id: { [Op.ne]: id }
        }
      });
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: 'Brand name already exists'
        });
      }
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
};

// Delete brand (Admin only)
const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if brand has associated vehicles
    const vehicleCount = await Vehicle.count({ where: { brand_id: id } });
    if (vehicleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand. ${vehicleCount} vehicles are associated with this brand.`
      });
    }

    await brand.destroy();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search brands for typeahead
const searchBrands = async (req, res, next) => {
  try {
    const { q = '', limit = 10 } = req.query;

    const brands = await Brand.findAll({
      where: {
        name: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'name', 'image'],
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands
};
