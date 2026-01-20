'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the status ENUM to include new values
    await queryInterface.changeColumn('sales', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    });

    // Update the payment_status ENUM to include new values
    await queryInterface.changeColumn('sales', 'payment_status', {
      type: Sequelize.ENUM('pending', 'partial', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to the original values
    await queryInterface.changeColumn('sales', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.changeColumn('sales', 'payment_status', {
      type: Sequelize.ENUM('pending', 'partial', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    });
  }
};