const searchService = require('../services/searchService');

/**
 * Advanced search with multiple filters
 */
const advancedSearch = async (req, res, next) => {
  try {
    const result = await searchService.advancedSearch(req.query);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get filter options for the frontend
 */
const getFilterOptions = async (req, res, next) => {
  try {
    const result = await searchService.getFilterOptions();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  advancedSearch,
  getFilterOptions
};