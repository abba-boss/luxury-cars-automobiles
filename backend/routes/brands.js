const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create temporary directory for file uploads
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Storage configuration for temporary files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'brand-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 1 // Only one file at a time
  }
});

// Validation middleware
const brandValidation = [
  body('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be between 2 and 100 characters'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
];

// Public routes
router.get('/', brandController.getBrands);
router.get('/search', brandController.searchBrands);
router.get('/:id', brandController.getBrandById);

// Admin routes
router.post('/', authenticateUser, requireAdmin, brandValidation, brandController.createBrand);
router.put('/:id', authenticateUser, requireAdmin, brandValidation, brandController.updateBrand);
router.delete('/:id', authenticateUser, requireAdmin, brandController.deleteBrand);

// Admin routes for file uploads
router.post('/upload', authenticateUser, requireAdmin, upload.single('image'), brandController.createBrandWithFile);
router.put('/:id/upload', authenticateUser, requireAdmin, upload.single('image'), brandController.updateBrandWithFile);

module.exports = router;
