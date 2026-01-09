const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FinancingApplication = sequelize.define('FinancingApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  loan_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  down_payment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  term_months: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  monthly_payment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'processing'),
    allowNull: false,
    defaultValue: 'pending'
  },
  credit_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  employment_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  annual_income: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  }
}, {
  tableName: 'financing_applications',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = FinancingApplication;