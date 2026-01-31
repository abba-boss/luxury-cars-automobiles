'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the role column to include 'staff' in the ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('user', 'staff', 'admin') 
      NOT NULL DEFAULT 'user'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert the role column to exclude 'staff' from the ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('user', 'admin') 
      NOT NULL DEFAULT 'user'
    `);
  }
};