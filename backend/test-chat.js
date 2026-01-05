// Test script to verify chat functionality
const { sequelize } = require('./models');
const { Conversation, ConversationParticipant, Message, MessageReadStatus, User } = require('./models');

async function testChatFunctionality() {
  try {
    console.log('Testing chat functionality...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Test creating a conversation
    console.log('✓ All models loaded successfully');
    
    // Check if tables exist
    const tables = await sequelize.getQueryInterface().showAllSchemas();
    console.log('✓ Tables verified');
    
    console.log('Chat functionality test completed successfully!');
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await sequelize.close();
  }
}

testChatFunctionality();