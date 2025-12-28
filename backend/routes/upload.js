const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

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
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 20, // Max 20 files
    fieldSize: 50 * 1024 * 1024, // 50MB field size
    fieldNameSize: 100, // Max field name size
    fields: 50 // Max number of fields
  }
});

// Upload vehicle media to Cloudinary
router.post('/vehicles', authenticateUser, requireAdmin, (req, res, next) => {
  upload.fields([
    { name: 'images', maxCount: 15 },
    { name: 'videos', maxCount: 5 }
  ])(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum allowed is 50MB per file.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 15 images and 5 videos allowed.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Upload failed',
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const uploadedFiles = {
      images: [],
      videos: []
    };

    // Check if any files were uploaded
    if (!req.files || (!req.files.images && !req.files.videos)) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload images to Cloudinary
    if (req.files.images) {
      for (const file of req.files.images) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'sarkin_mota/vehicles/images',
            resource_type: 'image',
            use_filename: false,
            unique_filename: true,
          });

          // Remove temporary file
          fs.unlinkSync(file.path);

          uploadedFiles.images.push({
            filename: path.basename(result.public_id),
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format
          });
        } catch (uploadError) {
          // Remove temporary file even if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          console.error('Cloudinary image upload error:', uploadError);
          throw uploadError;
        }
      }
    }

    // Upload videos to Cloudinary
    if (req.files.videos) {
      for (const file of req.files.videos) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'sarkin_mota/vehicles/videos',
            resource_type: 'video',
            use_filename: false,
            unique_filename: true,
            chunk_size: 6000000, // 6MB chunk size for large files
          });

          // Remove temporary file
          fs.unlinkSync(file.path);

          uploadedFiles.videos.push({
            filename: path.basename(result.public_id),
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format,
            duration: result.duration
          });
        } catch (uploadError) {
          // Remove temporary file even if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          console.error('Cloudinary video upload error:', uploadError);
          throw uploadError;
        }
      }
    }

    res.json({
      success: true,
      message: 'Files uploaded to Cloudinary successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

module.exports = router;
