require('dotenv').config();
const { validateEnvironment } = require('./config/envValidation');

// Validate environment variables
validateEnvironment();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');
const { sanitizeInput } = require('./middlewares/sanitize');

const app = express();
const server = http.createServer(app);
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

// Brand routes
const brandRoutes = require('./routes/brands');
app.use('/api/brands', brandRoutes);

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

// New feature routes
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

const favoriteRoutes = require('./routes/favorites');
app.use('/api/favorites', favoriteRoutes);

// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/admin/analytics', analyticsRoutes);

// User analytics routes
const userAnalyticsRoutes = require('./routes/userAnalytics');
app.use('/api/user/analytics', userAnalyticsRoutes);

// Chat routes
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

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

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Socket.IO connection handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify JWT token using the same logic as rbac middleware
    const jwt = require('jsonwebtoken');
    const { User } = require('./models');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate token payload structure
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return next(new Error('Invalid token payload'));
    }

    // Fetch fresh user data from database (never trust token alone)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Verify user is active
    if (user.status !== 'active') {
      return next(new Error('Account is not active'));
    }

    // Verify role hasn't changed (prevent role spoofing)
    if (user.role !== decoded.role) {
      return next(new Error('Role mismatch'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.user.full_name} connected with socket ID: ${socket.id}`);

  // Join user to their own room for direct messages
  socket.join(`user_${socket.user.id}`);

  // Join user to their role room for system notifications
  socket.join(`role_${socket.user.role}`);

  // Handle joining conversation rooms
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
  });

  // Handle leaving conversation rooms
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User ${socket.user.id} left conversation ${conversationId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content, messageType = 'text', fileUrl, fileName } = data;

      // Verify user is participant in conversation
      const { ConversationParticipant, Message, User } = require('./models');
      const participant = await ConversationParticipant.findOne({
        where: {
          conversation_id: conversationId,
          user_id: socket.user.id
        }
      });

      if (!participant) {
        socket.emit('error', { message: 'Not authorized to send message in this conversation' });
        return;
      }

      // Create message in database
      const message = await Message.create({
        conversation_id: conversationId,
        sender_id: socket.user.id,
        content,
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName
      });

      // Get full message with sender info
      const fullMessage = await Message.findByPk(message.id, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'full_name', 'role']
          }
        ]
      });

      // Emit message to conversation room
      io.to(`conversation_${conversationId}`).emit('new_message', fullMessage);

      // Update message status to delivered for all participants except sender
      const participants = await ConversationParticipant.findAll({
        where: { conversation_id: conversationId }
      });

      for (const participant of participants) {
        if (participant.user_id !== socket.user.id) {
          io.to(`user_${participant.user_id}`).emit('message_delivered', {
            messageId: message.id,
            conversationId
          });
        }
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { conversationId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.user.id,
      userName: socket.user.full_name,
      conversationId
    });
  });

  socket.on('typing_stop', (data) => {
    const { conversationId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_stopped_typing', {
      userId: socket.user.id,
      conversationId
    });
  });

  // Handle read receipts
  socket.on('message_read', async (data) => {
    try {
      const { conversationId, messageId } = data;

      // Update message status to read in database
      const { Message, MessageReadStatus } = require('./models');
      await Message.update(
        { status: 'read' },
        { where: { id: messageId, conversation_id: conversationId } }
      );

      // Create or update read status
      await MessageReadStatus.upsert({
        message_id: messageId,
        user_id: socket.user.id,
        read_at: new Date()
      });

      // Emit read receipt to sender
      const message = await Message.findByPk(messageId);
      if (message && message.sender_id !== socket.user.id) {
        io.to(`user_${message.sender_id}`).emit('message_read', {
          messageId,
          userId: socket.user.id,
          conversationId
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle user online/offline status
  socket.on('set_online_status', async (status) => {
    // In a real implementation, you would update user status in database
    console.log(`User ${socket.user.id} set status to ${status}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

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
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`🔒 Security: Rate limiting enabled`);
      console.log(`💬 Socket.IO: Enabled`);
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
  server.close(() => {
    console.log('HTTP server closed');
  });
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await sequelize.close();
  server.close(() => {
    console.log('HTTP server closed');
  });
  process.exit(0);
});

startServer();
