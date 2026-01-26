/*
 * Test script to verify chat functionality between admin and buyer
 */

const axios = require('axios');

async function testChatFunctionality() {
  console.log('Testing chat functionality...\n');
  
  const BASE_URL = 'http://localhost:3002/api';
  
  try {
    // Login as admin
    console.log('1. Logging in as admin...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testadmin@test.com',
      password: 'password123'  // assuming this is the test password
    });
    
    const adminToken = adminLogin.data.token;
    console.log('Admin logged in successfully\n');
    
    // Get admin's conversations
    console.log('2. Getting admin conversations...');
    const adminConversations = await axios.get(`${BASE_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Admin conversations:', adminConversations.data.data.length);
    
    // Login as buyer
    console.log('\n3. Logging in as buyer...');
    const buyerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'buyer@example.com',  // assuming a buyer account exists
      password: 'password123'
    });
    
    const buyerToken = buyerLogin.data.token;
    console.log('Buyer logged in successfully\n');
    
    // Get buyer's conversations
    console.log('4. Getting buyer conversations...');
    const buyerConversations = await axios.get(`${BASE_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('Buyer conversations:', buyerConversations.data.data.length);
    
    // Check if there's an order conversation
    console.log('\n5. Checking order conversations...');
    const orderConversations = await axios.get(`${BASE_URL}/chat/order-conversations`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Order conversations:', orderConversations.data.data.length);
    
    if (orderConversations.data.data.length > 0) {
      const conversation = orderConversations.data.data[0];
      console.log(`Found conversation for order: ${conversation.order_info?.id}`);
      
      // Get messages from this conversation
      console.log('\n6. Getting messages from conversation...');
      const messages = await axios.get(`${BASE_URL}/chat/conversations/${conversation.id}/messages`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`Messages in conversation: ${messages.data.data.length}`);
    }
    
    console.log('\n✅ Chat functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during chat functionality test:', error.response?.data || error.message);
  }
}

testChatFunctionality();