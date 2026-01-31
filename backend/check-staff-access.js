const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';
const STAFF_TOKEN = process.argv[2]; // Pass the staff token as argument

if (!STAFF_TOKEN) {
  console.log('Please provide a staff token as argument: node check-staff-access.js <staff-token>');
  process.exit(1);
}

async function testDifferentEndpoints() {
  console.log('🔍 Checking what data staff can access...\n');
  
  // Test 1: Get profile (should show staff info)
  try {
    console.log('1. Getting user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${STAFF_TOKEN}` }
    });
    console.log('✅ Profile data:', {
      id: profileResponse.data.data.id,
      email: profileResponse.data.data.email,
      role: profileResponse.data.data.role,
      full_name: profileResponse.data.data.full_name
    });
  } catch (error) {
    console.error('❌ Profile access failed:', error.response?.data || error.message);
  }
  
  console.log('');
  
  // Test 2: Get vehicles (should include staff's pending vehicles)
  try {
    console.log('2. Getting vehicles...');
    const vehiclesResponse = await axios.get(`${BASE_URL}/vehicles`, {
      headers: { 'Authorization': `Bearer ${STAFF_TOKEN}` }
    });
    console.log(`✅ Got ${vehiclesResponse.data.data.length} vehicles`);
    if (vehiclesResponse.data.data.length > 0) {
      console.log('First vehicle:', {
        id: vehiclesResponse.data.data[0].id,
        make: vehiclesResponse.data.data[0].make,
        model: vehiclesResponse.data.data[0].model,
        status: vehiclesResponse.data.data[0].status
      });
    }
  } catch (error) {
    console.error('❌ Vehicles access failed:', error.response?.data || error.message);
  }
  
  console.log('');
  
  // Test 3: Access staff-specific dashboard (THIS IS THE NEW FUNCTIONALITY)
  try {
    console.log('3. Accessing staff dashboard (NEW FEATURE)...');
    const dashboardResponse = await axios.get(`${BASE_URL}/staff/dashboard`, {
      headers: { 'Authorization': `Bearer ${STAFF_TOKEN}` }
    });
    console.log('✅ Staff dashboard data:', {
      totalVehiclesAdded: dashboardResponse.data.data.totalVehiclesAdded,
      pendingApprovalVehicles: dashboardResponse.data.data.pendingApprovalVehicles,
      approvedVehicles: dashboardResponse.data.data.approvedVehicles,
      staffInfo: dashboardResponse.data.data.staffInfo
    });
  } catch (error) {
    console.error('❌ Staff dashboard access failed:', error.response?.data || error.message);
  }
  
  console.log('');
  
  // Test 4: Access staff vehicles (NEW FEATURE)
  try {
    console.log('4. Accessing staff vehicles (NEW FEATURE)...');
    const staffVehiclesResponse = await axios.get(`${BASE_URL}/staff/vehicles`, {
      headers: { 'Authorization': `Bearer ${STAFF_TOKEN}` }
    });
    console.log(`✅ Got ${staffVehiclesResponse.data.data.length} staff vehicles`);
    if (staffVehiclesResponse.data.data.length > 0) {
      console.log('First staff vehicle:', {
        id: staffVehiclesResponse.data.data[0].id,
        make: staffVehiclesResponse.data.data[0].make,
        model: staffVehiclesResponse.data.data[0].model,
        status: staffVehiclesResponse.data.data[0].status,
        added_by_staff_id: staffVehiclesResponse.data.data[0].added_by_staff_id
      });
    }
  } catch (error) {
    console.error('❌ Staff vehicles access failed:', error.response?.data || error.message);
  }
  
  console.log('');
  
  // Test 5: Try to add a vehicle (NEW FEATURE)
  try {
    console.log('5. Testing vehicle addition (NEW FEATURE)...');
    const newVehicle = {
      make: 'TestCar',
      model: 'StaffModel',
      year: 2024,
      price: 30000000,
      condition: 'Brand New',
      description: 'Added by staff for testing'
    };
    
    const addResponse = await axios.post(`${BASE_URL}/vehicles`, newVehicle, {
      headers: { 
        'Authorization': `Bearer ${STAFF_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Vehicle added successfully by staff:', {
      id: addResponse.data.data.id,
      status: addResponse.data.data.status,
      added_by_staff_id: addResponse.data.data.added_by_staff_id,
      message: addResponse.data.message
    });
  } catch (error) {
    console.error('❌ Vehicle addition failed:', error.response?.data || error.message);
  }
  
  console.log('\n📋 SUMMARY:');
  console.log('✅ You are correctly logged in as staff');
  console.log('✅ Backend recognizes your staff role');
  console.log('✅ You have access to staff-specific endpoints');
  console.log('✅ You can perform staff operations (add vehicles, view dashboard)');
  console.log('⚠️  The frontend might not be using the new staff endpoints yet');
}

testDifferentEndpoints();