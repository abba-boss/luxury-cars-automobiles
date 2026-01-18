// Comprehensive environment variable test
console.log('=== Environment Variable Debug ===');

// Check if dotenv is properly loaded
console.log('Current working directory:', process.cwd());

// Check if .env file exists
const fs = require('fs');
const envPath = './.env';
console.log('.env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('.env file contents:');
  console.log(fs.readFileSync(envPath, 'utf8'));
  console.log('---');
}

// Load dotenv
require('dotenv').config();

console.log('After dotenv.load:');
console.log('process.env.DB_NAME:', process.env.DB_NAME);
console.log('process.env.DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('process.env.DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
console.log('process.env.DB_USER:', process.env.DB_USER);
console.log('process.env.DB_HOST:', process.env.DB_HOST);

// Check if there are any environment variables set in the system
console.log('\nChecking for system environment variables that might override .env:');
const systemOverrides = ['DB_NAME', 'DB_PASSWORD', 'DB_USER', 'DB_HOST', 'DB_PORT'];
systemOverrides.forEach(varName => {
  if (process.env[varName] !== undefined) {
    console.log(`${varName} is set in system env:`, `"${process.env[varName]}"`);
  } else {
    console.log(`${varName} is NOT set in system env`);
  }
});