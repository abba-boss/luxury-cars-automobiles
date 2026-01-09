'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_conversations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'sales',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Link to the sale/order'
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'conversations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Link to the conversation'
      },
      status: {
        type: Sequelize.ENUM('active', 'archived', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Status of the order conversation'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('order_conversations', ['sale_id']);
    await queryInterface.addIndex('order_conversations', ['conversation_id']);
    await queryInterface.addIndex('order_conversations', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_conversations');
  }
};
