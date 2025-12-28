const requiredEnvVars = [
  'DB_HOST',
  'DB_USER', 
  'DB_NAME',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const validateEnvironment = () => {
  const missing = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
  
  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long');
  }
};

module.exports = { validateEnvironment };
