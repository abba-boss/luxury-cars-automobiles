const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Advanced search with filters
router.get('/advanced', searchController.advancedSearch);

// Get filter options for the frontend
router.get('/filters', searchController.getFilterOptions);

module.exports = router;