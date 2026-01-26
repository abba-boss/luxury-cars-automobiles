'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'profile_image', {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: 'status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'profile_image');
  }
};