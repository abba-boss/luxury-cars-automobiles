const express = require('express');
const router = express.Router();
const homepageImageController = require('../controllers/homepageImageController');
const { authenticateUser, authorizeRoles } = require('../middlewares/rbac');

// Apply authentication and authorization to all routes
router.use(authenticateUser);

// GET /api/homepage-images - Get all homepage images
router.get('/', authorizeRoles(['admin']), homepageImageController.getAllImages);

// GET /api/homepage-images/active/:section_type - Get active images by section
router.get('/active/:section_type', homepageImageController.getActiveImagesBySection);

// GET /api/homepage-images/:id - Get single image
router.get('/:id', homepageImageController.getImageById);

// POST /api/homepage-images - Create new image (admin only)
router.post('/', authorizeRoles(['admin']), homepageImageController.createImage);

// PUT /api/homepage-images/:id - Update image (admin only)
router.put('/:id', authorizeRoles(['admin']), homepageImageController.updateImage);

// DELETE /api/homepage-images/:id - Delete image (admin only)
router.delete('/:id', authorizeRoles(['admin']), homepageImageController.deleteImage);

// PUT /api/homepage-images/update-positions - Bulk update positions (admin only)
router.put('/update-positions', authorizeRoles(['admin']), homepageImageController.updatePositions);

module.exports = router;