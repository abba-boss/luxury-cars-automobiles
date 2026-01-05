'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'acceleration', {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: '0-60 mph time (e.g., "5.8s")'
    });
    
    await queryInterface.addColumn('vehicles', 'top_speed', {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: 'Top speed (e.g., "155 mph")'
    });
    
    await queryInterface.addColumn('vehicles', 'power', {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: 'Engine power (e.g., "335 hp")'
    });
    
    await queryInterface.addColumn('vehicles', 'torque', {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: 'Engine torque (e.g., "368 lb-ft")'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'acceleration');
    await queryInterface.removeColumn('vehicles', 'top_speed');
    await queryInterface.removeColumn('vehicles', 'power');
    await queryInterface.removeColumn('vehicles', 'torque');
  }
};
