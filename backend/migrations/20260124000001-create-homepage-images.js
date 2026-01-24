'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('homepage_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subtitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cta_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cta_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      section_type: {
        type: Sequelize.ENUM('hero', 'banner', 'testimonial', 'feature', 'promotion'),
        allowNull: false,
        defaultValue: 'hero'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create index for position and section_type
    await queryInterface.addIndex('homepage_images', ['position', 'section_type'], {
      unique: true,
      name: 'homepage_images_position_section_type_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('homepage_images');
  }
};