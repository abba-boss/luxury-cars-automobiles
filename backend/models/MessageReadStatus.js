const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MessageReadStatus = sequelize.define('MessageReadStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'messages',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'message_read_status',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = MessageReadStatus;