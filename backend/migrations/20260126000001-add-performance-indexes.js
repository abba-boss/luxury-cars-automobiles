'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add indexes for vehicles table
    await queryInterface.addIndex('vehicles', ['brand_id'], {
      name: 'vehicles_brand_id_idx',
      fields: ['brand_id']
    });

    await queryInterface.addIndex('vehicles', ['price'], {
      name: 'vehicles_price_idx',
      fields: ['price']
    });

    await queryInterface.addIndex('vehicles', ['year'], {
      name: 'vehicles_year_idx',
      fields: ['year']
    });

    await queryInterface.addIndex('vehicles', ['status'], {
      name: 'vehicles_status_idx',
      fields: ['status']
    });

    await queryInterface.addIndex('vehicles', ['created_at'], {
      name: 'vehicles_created_at_idx',
      fields: ['created_at']
    });

    // Add indexes for brands table
    await queryInterface.addIndex('brands', ['name'], {
      name: 'brands_name_idx',
      fields: ['name']
    });

    // Add indexes for sales table
    await queryInterface.addIndex('sales', ['user_id'], {
      name: 'sales_user_id_idx',
      fields: ['user_id']
    });

    await queryInterface.addIndex('sales', ['status'], {
      name: 'sales_status_idx',
      fields: ['status']
    });

    await queryInterface.addIndex('sales', ['created_at'], {
      name: 'sales_created_at_idx',
      fields: ['created_at']
    });

    // Add indexes for users table
    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_idx',
      fields: ['email']
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_idx',
      fields: ['role']
    });
    
    console.log('Performance indexes added successfully');
  },

  async down (queryInterface, Sequelize) {
    // Remove indexes for vehicles table
    await queryInterface.removeIndex('vehicles', 'vehicles_brand_id_idx');
    await queryInterface.removeIndex('vehicles', 'vehicles_price_idx');
    await queryInterface.removeIndex('vehicles', 'vehicles_year_idx');
    await queryInterface.removeIndex('vehicles', 'vehicles_status_idx');
    await queryInterface.removeIndex('vehicles', 'vehicles_created_at_idx');

    // Remove indexes for brands table
    await queryInterface.removeIndex('brands', 'brands_name_idx');

    // Remove indexes for sales table
    await queryInterface.removeIndex('sales', 'sales_user_id_idx');
    await queryInterface.removeIndex('sales', 'sales_status_idx');
    await queryInterface.removeIndex('sales', 'sales_created_at_idx');

    // Remove indexes for users table
    await queryInterface.removeIndex('users', 'users_email_idx');
    await queryInterface.removeIndex('users', 'users_role_idx');
    
    console.log('Performance indexes removed successfully');
  }
};