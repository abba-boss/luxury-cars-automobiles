const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderConversation = sequelize.define('OrderConversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sale_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'sales',
      key: 'id'
    },
    comment: 'Link to the sale/order'
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'conversations',
      key: 'id'
    },
    comment: 'Link to the conversation'
  },
  status: {
    type: DataTypes.ENUM('active', 'archived', 'closed'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Status of the order conversation'
  }
}, {
  tableName: 'order_conversations',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = OrderConversation;
