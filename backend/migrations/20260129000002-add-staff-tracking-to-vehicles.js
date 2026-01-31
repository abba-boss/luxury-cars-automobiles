'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns for staff tracking
    await queryInterface.addColumn('vehicles', 'added_by_staff_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('vehicles', 'approved_by_admin_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('vehicles', 'approval_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update the status enum to include 'pending_approval' for staff-added vehicles
    await queryInterface.sequelize.query(`
      ALTER TABLE vehicles 
      MODIFY COLUMN status ENUM('available', 'sold', 'reserved', 'inactive', 'pending_approval')
      NOT NULL DEFAULT 'pending_approval'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove the added columns
    await queryInterface.removeColumn('vehicles', 'added_by_staff_id');
    await queryInterface.removeColumn('vehicles', 'approved_by_admin_id');
    await queryInterface.removeColumn('vehicles', 'approval_date');

    // Revert the status enum
    await queryInterface.sequelize.query(`
      ALTER TABLE vehicles 
      MODIFY COLUMN status ENUM('available', 'sold', 'reserved', 'inactive')
      NOT NULL DEFAULT 'available'
    `);
  }
};