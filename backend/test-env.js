require('dotenv').config();

console.log('Environment Variables Check:');
console.log('DB_NAME from env:', process.env.DB_NAME);
console.log('DB_PASSWORD from env:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_HOST from env:', process.env.DB_HOST);
console.log('DB_PORT from env:', process.env.DB_PORT);