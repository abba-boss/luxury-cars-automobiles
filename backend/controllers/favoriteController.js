const { Favorite, Vehicle } = require('../models');

// Get user favorites
const getUserFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Favorite.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
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

// Add to favorites
const addToFavorites = async (req, res, next) => {
  try {
    const { vehicle_id } = req.body;
    const user_id = req.user.id;

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { user_id, vehicle_id }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user_id,
      vehicle_id
    });

    const favoriteWithVehicle = await Favorite.findByPk(favorite.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'year', 'price', 'images', 'status']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favoriteWithVehicle
    });
  } catch (error) {
    next(error);
  }
};

// Remove from favorites
const removeFromFavorites = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const user_id = req.user.id;

    const favorite = await Favorite.findOne({
      where: { user_id, vehicle_id: vehicleId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Check if vehicle is favorited
const checkFavorite = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const user_id = req.user.id;

    const favorite = await Favorite.findOne({
      where: { user_id, vehicle_id: vehicleId }
    });

    res.json({
      success: true,
      data: { isFavorite: !!favorite }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
};
