// Simple test to check if controller can be loaded
try {
  const chatController = require('./controllers/chatController');
  console.log('Controller loaded successfully');
  console.log('Available methods:', Object.keys(chatController));
} catch (error) {
  console.error('Error loading controller:', error.message);
  console.error('Stack:', error.stack);
}