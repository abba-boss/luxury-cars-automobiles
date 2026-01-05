const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Optional name for the conversation (e.g., for group chats)'
  },
  type: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: false,
    defaultValue: 'private',
    comment: 'Type of conversation'
  },
  status: {
    type: DataTypes.ENUM('active', 'archived', 'deleted'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Status of the conversation'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who created the conversation'
  }
}, {
  tableName: 'conversations',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = Conversation;