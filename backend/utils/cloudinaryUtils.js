const cloudinary = require('../config/cloudinary');

/**
 * Delete media files from Cloudinary
 * @param {Array} mediaUrls - Array of Cloudinary URLs to delete
 */
const deleteMediaFromCloudinary = async (mediaUrls) => {
  if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
    return;
  }

  try {
    // Extract public IDs from URLs
    const publicIds = mediaUrls
      .filter(url => typeof url === 'string' && url.includes('cloudinary.com'))
      .map(url => {
        // Extract public ID from Cloudinary URL
        // Cloudinary URLs typically have the format: https://res.cloudinary.com/.../upload/folder/publicId
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1 && parts.length > uploadIndex + 1) {
          // Get everything after 'upload' as the public ID path
          return parts.slice(uploadIndex + 1).join('/').replace(/\.[^/.]+$/, ""); // Remove extension
        }
        return null;
      })
      .filter(id => id !== null);

    if (publicIds.length > 0) {
      // Delete files from Cloudinary in batches (Cloudinary allows up to 100 per request)
      for (let i = 0; i < publicIds.length; i += 100) {
        const batch = publicIds.slice(i, i + 100);
        await cloudinary.api.delete_resources(batch, {
          resource_type: 'auto' // Works for both images and videos
        });
      }
    }
  } catch (error) {
    console.error('Error deleting media from Cloudinary:', error);
    // Don't throw error as this shouldn't prevent the vehicle deletion
  }
};

module.exports = {
  deleteMediaFromCloudinary
};