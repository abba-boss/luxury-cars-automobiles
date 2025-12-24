'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      make: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fuel_type: {
        type: Sequelize.ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric'),
        allowNull: true,
        defaultValue: 'Petrol'
      },
      transmission: {
        type: Sequelize.ENUM('Automatic', 'Manual'),
        allowNull: true,
        defaultValue: 'Automatic'
      },
      condition: {
        type: Sequelize.ENUM('Tokunbo', 'Nigerian Used', 'Brand New'),
        allowNull: false,
        defaultValue: 'Tokunbo'
      },
      body_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_hot_deal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM('available', 'sold', 'reserved', 'inactive'),
        allowNull: false,
        defaultValue: 'available'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('vehicles', ['make']);
    await queryInterface.addIndex('vehicles', ['model']);
    await queryInterface.addIndex('vehicles', ['year']);
    await queryInterface.addIndex('vehicles', ['price']);
    await queryInterface.addIndex('vehicles', ['status']);
    await queryInterface.addIndex('vehicles', ['is_featured']);
    await queryInterface.addIndex('vehicles', ['is_hot_deal']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  }
};
