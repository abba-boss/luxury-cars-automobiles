const { HomepageImage } = require('../models');
const { Op } = require('sequelize');

const homepageImageController = {
  // Get all homepage images
  async getAllImages(req, res) {
    try {
      const { section_type, is_active } = req.query;
      
      const whereClause = {};
      if (section_type) whereClause.section_type = section_type;
      if (is_active !== undefined) whereClause.is_active = is_active === 'true';
      
      const images = await HomepageImage.findAll({
        where: whereClause,
        order: [['position', 'ASC']]
      });

      res.json({
        success: true,
        message: 'Homepage images retrieved successfully',
        data: images
      });
    } catch (error) {
      console.error('Error fetching homepage images:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving homepage images',
        error: error.message
      });
    }
  },

  // Get active homepage images by section
  async getActiveImagesBySection(req, res) {
    try {
      const { section_type } = req.params;
      
      const images = await HomepageImage.findAll({
        where: {
          section_type,
          is_active: true
        },
        order: [['position', 'ASC']]
      });

      res.json({
        success: true,
        message: 'Active homepage images retrieved successfully',
        data: images
      });
    } catch (error) {
      console.error('Error fetching active homepage images:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving active homepage images',
        error: error.message
      });
    }
  },

  // Get single homepage image
  async getImageById(req, res) {
    try {
      const { id } = req.params;
      
      const image = await HomepageImage.findByPk(id);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Homepage image not found'
        });
      }

      res.json({
        success: true,
        message: 'Homepage image retrieved successfully',
        data: image
      });
    } catch (error) {
      console.error('Error fetching homepage image:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving homepage image',
        error: error.message
      });
    }
  },

  // Create new homepage image
  async createImage(req, res) {
    try {
      const { title, subtitle, image_url, cta_text, cta_link, position, section_type } = req.body;
      
      // Validate required fields
      if (!title || !image_url) {
        return res.status(400).json({
          success: false,
          message: 'Title and image URL are required'
        });
      }

      // Check if position is already taken for this section
      const existingImage = await HomepageImage.findOne({
        where: {
          position,
          section_type
        }
      });

      if (existingImage) {
        return res.status(400).json({
          success: false,
          message: `Position ${position} is already taken for section ${section_type}`
        });
      }

      const newImage = await HomepageImage.create({
        title,
        subtitle,
        image_url,
        cta_text,
        cta_link,
        position: position || 0,
        section_type: section_type || 'hero'
      });

      res.status(201).json({
        success: true,
        message: 'Homepage image created successfully',
        data: newImage
      });
    } catch (error) {
      console.error('Error creating homepage image:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating homepage image',
        error: error.message
      });
    }
  },

  // Update homepage image
  async updateImage(req, res) {
    try {
      const { id } = req.params;
      const { title, subtitle, image_url, cta_text, cta_link, position, is_active, section_type } = req.body;
      
      const image = await HomepageImage.findByPk(id);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Homepage image not found'
        });
      }

      // Check if new position is already taken by another image in the same section
      if (position !== undefined) {
        const existingImage = await HomepageImage.findOne({
          where: {
            id: { [Op.ne]: id }, // Not equal to current image id
            position,
            section_type: section_type || image.section_type
          }
        });

        if (existingImage) {
          return res.status(400).json({
            success: false,
            message: `Position ${position} is already taken for section ${section_type || image.section_type}`
          });
        }
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (cta_text !== undefined) updateData.cta_text = cta_text;
      if (cta_link !== undefined) updateData.cta_link = cta_link;
      if (position !== undefined) updateData.position = position;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (section_type !== undefined) updateData.section_type = section_type;

      await image.update(updateData);

      res.json({
        success: true,
        message: 'Homepage image updated successfully',
        data: image
      });
    } catch (error) {
      console.error('Error updating homepage image:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating homepage image',
        error: error.message
      });
    }
  },

  // Delete homepage image
  async deleteImage(req, res) {
    try {
      const { id } = req.params;
      
      const image = await HomepageImage.findByPk(id);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Homepage image not found'
        });
      }

      await image.destroy();

      res.json({
        success: true,
        message: 'Homepage image deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting homepage image:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting homepage image',
        error: error.message
      });
    }
  },

  // Bulk update positions
  async updatePositions(req, res) {
    try {
      const { images } = req.body;
      
      if (!Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request format. Expected an array of images with positions.'
        });
      }

      // Update each image's position
      for (const imageData of images) {
        const { id, position } = imageData;
        
        if (id && position !== undefined) {
          await HomepageImage.update(
            { position },
            { where: { id } }
          );
        }
      }

      res.json({
        success: true,
        message: 'Positions updated successfully'
      });
    } catch (error) {
      console.error('Error updating positions:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating positions',
        error: error.message
      });
    }
  }
};

module.exports = homepageImageController;