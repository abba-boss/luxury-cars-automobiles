require('dotenv').config();
const { validateEnvironment } = require('./config/envValidation');

// Validate environment variables
validateEnvironment();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');
const { sanitizeInput } = require('./middlewares/sanitize');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting - DISABLED FOR TESTING
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: { success: false, message: 'Too many requests, please try again later.' }
// });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth requests per windowMs
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3001", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
    },
  },
}));
// app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));

// Upload routes BEFORE body parsing (to avoid JSON parsing limits)
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Input sanitization
app.use(sanitizeInput);

// Additional CORS headers for file uploads
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Vehicle routes
const vehicleRoutes = require('./routes/vehicles');
app.use('/api/vehicles', vehicleRoutes);

// Customer routes
const customerRoutes = require('./routes/customers');
app.use('/api/customers', customerRoutes);

// Sales routes
const salesRoutes = require('./routes/sales');
app.use('/api/sales', salesRoutes);

// Inquiry routes
const inquiryRoutes = require('./routes/inquiries');
app.use('/api/inquiries', inquiryRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Serve static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Serve frontend public files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// RBAC demonstration routes
const rbacRoutes = require('./routes/rbac');
app.use('/api', rbacRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  let retries = 5;
  
  while (retries > 0) {
    try {
      // Test database connection
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      break;
    } catch (error) {
      retries--;
      console.error(`❌ Database connection failed. Retries left: ${retries}`);
      
      if (retries === 0) {
        console.error('❌ Unable to connect to database after multiple attempts:', error);
        process.exit(1);
      }
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`🔒 Security: Rate limiting enabled`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

startServer();
