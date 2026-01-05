const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  make: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  fuel_type: {
    type: DataTypes.ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric'),
    allowNull: true,
    defaultValue: 'Petrol'
  },
  transmission: {
    type: DataTypes.ENUM('Automatic', 'Manual'),
    allowNull: true,
    defaultValue: 'Automatic'
  },
  condition: {
    type: DataTypes.ENUM('Tokunbo', 'Nigerian Used', 'Brand New'),
    allowNull: false,
    defaultValue: 'Tokunbo'
  },
  body_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_hot_deal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'reserved', 'inactive'),
    allowNull: false,
    defaultValue: 'available'
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  acceleration: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '0-60 mph time (e.g., "5.8s")'
  },
  top_speed: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Top speed (e.g., "155 mph")'
  },
  power: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Engine power (e.g., "335 hp")'
  },
  torque: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Engine torque (e.g., "368 lb-ft")'
  }
}, {
  tableName: 'vehicles',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = Vehicle;
