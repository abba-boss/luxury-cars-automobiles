const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Customer = require('./Customer');
const Sale = require('./Sale');
const Inquiry = require('./Inquiry');

// Initialize all models
const models = {
  User,
  Vehicle,
  Customer,
  Sale,
  Inquiry
};

// Set up associations
User.hasMany(models.Customer, { foreignKey: 'user_id', as: 'customers' });
models.Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Sale, { foreignKey: 'vehicle_id', as: 'sales' });
models.Sale.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

models.Customer.hasMany(models.Sale, { foreignKey: 'customer_id', as: 'sales' });
models.Sale.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });

User.hasMany(models.Sale, { foreignKey: 'user_id', as: 'sales' });
models.Sale.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Inquiry, { foreignKey: 'vehicle_id', as: 'inquiries' });
models.Inquiry.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(models.Inquiry, { foreignKey: 'user_id', as: 'inquiries' });
models.Inquiry.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  ...models
};
