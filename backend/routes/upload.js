const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middlewares/rbac');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');

// Function to compress image if it exceeds size limit
const compressImageIfNeeded = async (filePath, maxSizeBytes = 10 * 1024 * 1024) => {
  const stats = fs.statSync(filePath);
  if (stats.size <= maxSizeBytes) {
    // File is already under the size limit
    return filePath;
  }

  // Generate a temporary compressed file path
  const ext = path.extname(filePath);
  const dir = path.dirname(filePath);
  const name = path.basename(filePath, ext);
  const compressedFilePath = path.join(dir, `${name}_compressed${ext}`);

  try {
    // Compress the image using Sharp
    await sharp(filePath)
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .png({ quality: 80 }) // Or PNG with 80% quality
      .webp({ quality: 80 }) // Or WebP with 80% quality
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true }) // Resize to max 1920x1080
      .toFile(compressedFilePath);

    // Check if the compressed file is now under the size limit
    const compressedStats = fs.statSync(compressedFilePath);
    if (compressedStats.size <= maxSizeBytes) {
      // Remove original file and return path to compressed file
      fs.unlinkSync(filePath);
      return compressedFilePath;
    } else {
      // If still too large, try more aggressive compression
      await sharp(filePath)
        .jpeg({ quality: 60 })
        .png({ quality: 60 })
        .webp({ quality: 60 })
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true }) // Resize to max 1280x720
        .toFile(compressedFilePath);

      const moreCompressedStats = fs.statSync(compressedFilePath);
      if (moreCompressedStats.size <= maxSizeBytes) {
        // Remove original file and return path to compressed file
        fs.unlinkSync(filePath);
        return compressedFilePath;
      } else {
        // If still too large, remove the compressed file and return original
        // Let Cloudinary handle the error
        fs.unlinkSync(compressedFilePath);
        return filePath;
      }
    }
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, return the original file
    return filePath;
  }
};

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
        let filePath = file.path; // Start with the original file path

        try {
          // Determine resource type based on file extension and MIME type
          const fileExtension = path.extname(file.originalname).toLowerCase();
          const isVideo = file.mimetype.startsWith('video/');
          const isImage = file.mimetype.startsWith('image/');

          // Determine the appropriate resource type for Cloudinary
          let resourceType = 'image'; // Default for images field
          let folder = 'sarkin_mota/vehicles/images';

          if (isImage || ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
            resourceType = 'image';
            folder = 'sarkin_mota/vehicles/images';

            // Compress image if it exceeds Cloudinary's size limit (10MB)
            filePath = await compressImageIfNeeded(file.path);
          } else if (isVideo || ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(fileExtension)) {
            resourceType = 'video';
            folder = 'sarkin_mota/vehicles/videos';
          }

          const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            use_filename: false,
            unique_filename: true,
          });

          // Remove temporary file (original or compressed)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          const mediaFile = {
            filename: path.basename(result.public_id),
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format
          };

          // Add duration for videos
          if (resourceType === 'video' || (result.resource_type && result.resource_type === 'video')) {
            mediaFile.duration = result.duration;
          }

          // Add to images array since it was uploaded to the images field
          uploadedFiles.images.push(mediaFile);
        } catch (uploadError) {
          // Remove temporary file even if upload fails
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          console.error('Cloudinary image upload error:', uploadError);
          throw uploadError;
        }
      }
    }

    // Upload videos to Cloudinary
    if (req.files.videos) {
      for (const file of req.files.videos) {
        let filePath = file.path; // Start with the original file path

        try {
          // Determine resource type based on file extension and MIME type
          const fileExtension = path.extname(file.originalname).toLowerCase();
          const isVideo = file.mimetype.startsWith('video/');
          const isImage = file.mimetype.startsWith('image/');

          // Determine the appropriate resource type for Cloudinary
          let resourceType = 'video'; // Default for videos field
          let folder = 'sarkin_mota/vehicles/videos';

          if (isImage || ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
            resourceType = 'image';
            folder = 'sarkin_mota/vehicles/images';
          } else if (isVideo || ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(fileExtension)) {
            resourceType = 'video';
            folder = 'sarkin_mota/vehicles/videos';
          }

          const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            use_filename: false,
            unique_filename: true,
            chunk_size: 6000000, // 6MB chunk size for large files
          });

          // Remove temporary file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          const mediaFile = {
            filename: path.basename(result.public_id),
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format
          };

          // Add duration for videos
          if (resourceType === 'video' || (result.resource_type && result.resource_type === 'video')) {
            mediaFile.duration = result.duration;
          }

          // Add to videos array since it was uploaded to the videos field
          uploadedFiles.videos.push(mediaFile);
        } catch (uploadError) {
          // Remove temporary file even if upload fails
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          console.error('Cloudinary upload error:', uploadError);
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
