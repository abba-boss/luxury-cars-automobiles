require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

console.log('DB Configuration Debug:');
console.log('DB_USER:', dbUser);
console.log('DB_PASSWORD length:', dbPassword ? dbPassword.length : 'undefined');
console.log('DB_HOST:', dbHost);
console.log('DB_NAME:', dbName);

// Create options object with all required options
const options = {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

let sequelize;

// Add password to options only if provided
if (dbPassword && dbPassword.trim() !== '') {
  console.log('Connecting with password');
  sequelize = new Sequelize(dbName, dbUser, dbPassword, options);
} else {
  console.log('Connecting without password');
  // Create a complete options object when not using separate password parameter
  const completeOptions = {
    ...options,
    database: dbName,
    username: dbUser,
    password: undefined // explicitly set to undefined when not using password
  };
  sequelize = new Sequelize(completeOptions);
}

module.exports = sequelize;
