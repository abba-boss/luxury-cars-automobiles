const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'staff', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'users',
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Class method to find user by email
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

// Instance method to check if user has role
User.prototype.hasRole = function(role) {
  return this.role === role;
};

// Instance method to check if user has any of the roles
User.prototype.hasAnyRole = function(roles) {
  return roles.includes(this.role);
};

// Class method to get valid roles
User.getValidRoles = function() {
  return ['user', 'staff', 'admin'];
};

// Instance method to check if user has a specific permission
User.prototype.hasPermission = async function(permissionKey) {
  const { UserPermission } = require('./index'); // Import here to avoid circular dependency
  const { Op } = require('sequelize');

  const permission = await UserPermission.findOne({
    where: {
      user_id: this.id,
      permission_key: permissionKey,
      is_active: true,
      [Op.or]: [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } }
      ]
    }
  });

  return !!permission;
};

// Instance method to get all active permissions for a user
User.prototype.getActivePermissions = async function() {
  const { UserPermission } = require('./index'); // Import here to avoid circular dependency
  const { Op } = require('sequelize');

  const permissions = await UserPermission.findAll({
    where: {
      user_id: this.id,
      is_active: true,
      [Op.or]: [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } }
      ]
    }
  });

  return permissions;
};

module.exports = User;
