const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const path = require('path');

// Upload vehicle media
router.post('/vehicles', authenticateUser, requireAdmin, upload.fields([
  { name: 'images', maxCount: 15 },
  { name: 'videos', maxCount: 5 }
]), (req, res) => {
  try {
    const uploadedFiles = {
      images: [],
      videos: []
    };

    if (req.files.images) {
      uploadedFiles.images = req.files.images.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/vehicles/images/${file.filename}`,
        size: file.size
      }));
    }

    if (req.files.videos) {
      uploadedFiles.videos = req.files.videos.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/vehicles/videos/${file.filename}`,
        size: file.size
      }));
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

module.exports = router;
