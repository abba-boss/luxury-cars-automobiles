// Advanced search and filtering functionality
// This service handles complex search queries with multiple filters

const { Vehicle, Brand, sequelize } = require('../models');
const { Op } = require('sequelize');

class SearchService {
  /**
   * Perform advanced search with multiple filters
   * @param {Object} filters - Search and filter parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  async advancedSearch(filters = {}) {
    const {
      page = 1,
      limit = 12,
      search = '',
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      brands = [],
      conditions = [],
      transmissions = [],
      fuelTypes = [],
      colors = [],
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    // Search term (applies to make, model, or description)
    if (search) {
      where[Op.or] = [
        { make: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Year range filter
    if (minYear !== undefined || maxYear !== undefined) {
      where.year = {};
      if (minYear !== undefined) where.year[Op.gte] = parseInt(minYear);
      if (maxYear !== undefined) where.year[Op.lte] = parseInt(maxYear);
    }

    // Mileage range filter
    if (minMileage !== undefined || maxMileage !== undefined) {
      where.mileage = {};
      if (minMileage !== undefined) where.mileage[Op.gte] = parseInt(minMileage);
      if (maxMileage !== undefined) where.mileage[Op.lte] = parseInt(maxMileage);
    }

    // Brand filter
    if (Array.isArray(brands) && brands.length > 0) {
      where.brand_id = { [Op.in]: brands.map(id => parseInt(id)) };
    }

    // Condition filter
    if (Array.isArray(conditions) && conditions.length > 0) {
      where.condition = { [Op.in]: conditions };
    }

    // Transmission filter
    if (Array.isArray(transmissions) && transmissions.length > 0) {
      where.transmission = { [Op.in]: transmissions };
    }

    // Fuel type filter
    if (Array.isArray(fuelTypes) && fuelTypes.length > 0) {
      where.fuel_type = { [Op.in]: fuelTypes };
    }

    // Color filter
    if (Array.isArray(colors) && colors.length > 0) {
      where.color = { [Op.in]: colors };
    }

    // Status filter (only show available vehicles)
    where.status = 'available';

    // Sorting options
    const validSortColumns = ['price', 'year', 'mileage', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    try {
      const { count, rows } = await Vehicle.findAndCountAll({
        where,
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'image']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortColumn, sortDirection]]
      });

      return {
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Advanced search error:', error);
      return {
        success: false,
        message: 'Search failed',
        error: error.message
      };
    }
  }

  /**
   * Get filter options for the frontend
   * @returns {Promise<Object>} Available filter options
   */
  async getFilterOptions() {
    try {
      // Get unique brands
      const brands = await Brand.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
      });

      // Get unique conditions
      const conditions = await sequelize.query(
        'SELECT DISTINCT condition FROM vehicles WHERE condition IS NOT NULL ORDER BY condition',
        { type: sequelize.QueryTypes.SELECT }
      );

      // Get unique transmissions
      const transmissions = await sequelize.query(
        'SELECT DISTINCT transmission FROM vehicles WHERE transmission IS NOT NULL ORDER BY transmission',
        { type: sequelize.QueryTypes.SELECT }
      );

      // Get unique fuel types
      const fuelTypes = await sequelize.query(
        'SELECT DISTINCT fuel_type FROM vehicles WHERE fuel_type IS NOT NULL ORDER BY fuel_type',
        { type: sequelize.QueryTypes.SELECT }
      );

      // Get unique colors
      const colors = await sequelize.query(
        'SELECT DISTINCT color FROM vehicles WHERE color IS NOT NULL ORDER BY color',
        { type: sequelize.QueryTypes.SELECT }
      );

      // Get min/max values for range filters
      const stats = await Vehicle.findOne({
        attributes: [
          [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
          [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
          [sequelize.fn('MIN', sequelize.col('year')), 'minYear'],
          [sequelize.fn('MAX', sequelize.col('year')), 'maxYear'],
          [sequelize.fn('MIN', sequelize.col('mileage')), 'minMileage'],
          [sequelize.fn('MAX', sequelize.col('mileage')), 'maxMileage']
        ],
        where: { status: 'available' }
      });

      return {
        success: true,
        data: {
          brands: brands.map(b => ({ id: b.id, name: b.name })),
          conditions: conditions.map(c => c.condition).filter(Boolean),
          transmissions: transmissions.map(t => t.transmission).filter(Boolean),
          fuelTypes: fuelTypes.map(f => f.fuel_type).filter(Boolean),
          colors: colors.map(c => c.color).filter(Boolean),
          priceRange: {
            min: stats ? Math.floor(stats.minPrice) : 0,
            max: stats ? Math.ceil(stats.maxPrice) : 1000000
          },
          yearRange: {
            min: stats ? stats.minYear : new Date().getFullYear() - 30,
            max: stats ? stats.maxYear : new Date().getFullYear()
          },
          mileageRange: {
            min: stats ? Math.floor(stats.minMileage) : 0,
            max: stats ? Math.ceil(stats.maxMileage) : 200000
          }
        }
      };
    } catch (error) {
      console.error('Get filter options error:', error);
      return {
        success: false,
        message: 'Failed to get filter options',
        error: error.message
      };
    }
  }
}

module.exports = new SearchService();