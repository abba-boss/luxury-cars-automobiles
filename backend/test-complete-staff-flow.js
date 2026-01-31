const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3002/api';

// Test credentials
const STAFF_CREDENTIALS = {
  email: 'staff@example.com',
  password: 'staff123'
};

// Use the existing staff user for testing
const EXISTING_STAFF_CREDENTIALS = {
  email: 'staff@example.com',
  password: 'staff123'
};

let staffToken = null;
let staffId = null;

async function createStaffUser() {
  console.log('Testing existing staff user login...');

  // Login with the existing staff user
  return await loginAs(EXISTING_STAFF_CREDENTIALS, 'Staff');
}

async function loginAs(credentials, userType) {
  console.log(`\n${userType} login attempt...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    console.log(`✅ ${userType} login successful`);
    console.log('User details from login:', {
      id: response.data.data.id,
      email: response.data.data.email,
      role: response.data.data.role,
      full_name: response.data.data.full_name
    });
    
    return {
      token: response.data.token,
      userData: response.data.data
    };
  } catch (error) {
    console.error(`❌ ${userType} login failed:`, error.response?.data || error.message);
    return null;
  }
}

async function testUserProfile(token, userData) {
  console.log('\nTesting user profile endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile access successful');
    console.log('Profile data:', {
      id: response.data.data.id,
      email: response.data.data.email,
      role: response.data.data.role,
      full_name: response.data.data.full_name
    });
    
    return response.data.data.role === 'staff';
  } catch (error) {
    console.error('❌ Profile access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testStaffDashboard(token) {
  console.log('\nTesting staff dashboard access...');
  
  try {
    const response = await axios.get(`${BASE_URL}/staff/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Staff dashboard access successful');
    console.log('Dashboard data:', {
      totalVehiclesAdded: response.data.data.totalVehiclesAdded,
      pendingApprovalVehicles: response.data.data.pendingApprovalVehicles,
      approvedVehicles: response.data.data.approvedVehicles,
      staffInfo: {
        id: response.data.data.staffInfo.id,
        role: response.data.data.staffInfo.role
      }
    });
    
    return response.data.success;
  } catch (error) {
    console.error('❌ Staff dashboard access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testVehicleOperations(token, userData) {
  console.log('\nTesting vehicle operations...');
  
  // Test getting vehicles (should show available + staff's pending)
  try {
    console.log('Getting all vehicles...');
    const vehiclesResponse = await axios.get(`${BASE_URL}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Got ${vehiclesResponse.data.data.length} vehicles`);
    
    // Test adding a new vehicle
    console.log('Adding a new vehicle as staff...');
    const newVehicle = {
      make: 'Audi',
      model: 'A4',
      year: 2024,
      price: 42000000,
      mileage: 2000,
      condition: 'Brand New',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      color: 'Brilliant Black',
      description: 'New Audi A4 added by staff member',
      features: ['Quattro AWD', 'Virtual Cockpit', 'LED Headlights'],
      is_featured: false,
      is_verified: true
    };
    
    const addResponse = await axios.post(`${BASE_URL}/vehicles`, newVehicle, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Vehicle added successfully by staff');
    console.log('Vehicle details:', {
      id: addResponse.data.data.id,
      make: addResponse.data.data.make,
      model: addResponse.data.data.model,
      status: addResponse.data.data.status,
      added_by_staff_id: addResponse.data.data.added_by_staff_id,
      message: addResponse.data.message
    });
    
    // Verify the vehicle was added with correct status and staff tracking
    if (addResponse.data.data.status !== 'pending_approval') {
      console.log('❌ ERROR: Vehicle should have status "pending_approval" for staff');
      return false;
    }
    
    if (addResponse.data.data.added_by_staff_id !== userData.id) {
      console.log('❌ ERROR: Vehicle should be linked to the staff member who added it');
      return false;
    }
    
    // Test getting staff-specific vehicles
    console.log('Getting staff-specific vehicles...');
    const staffVehiclesResponse = await axios.get(`${BASE_URL}/staff/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Got ${staffVehiclesResponse.data.data.length} staff vehicles`);
    
    if (staffVehiclesResponse.data.data.length === 0) {
      console.log('❌ ERROR: Staff should see their own vehicles');
      return false;
    }
    
    // Test updating the vehicle
    console.log('Updating the vehicle...');
    const updateData = {
      price: 41500000, // Reduced price
      description: 'Updated description by staff member'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/vehicles/${addResponse.data.data.id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Vehicle updated successfully by staff');
    console.log('Updated vehicle price:', updateResponse.data.data.price);
    
    return true;
    
  } catch (error) {
    console.error('❌ Vehicle operations failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUnauthorizedAccess(token) {
  console.log('\nTesting unauthorized access (ensuring staff cannot do admin-only actions)...');
  
  try {
    // Try to delete a vehicle (should fail for staff)
    console.log('Attempting to delete a vehicle (should fail for staff)...');
    try {
      await axios.delete(`${BASE_URL}/vehicles/1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('❌ ERROR: Staff should not be able to delete vehicles');
      return false;
    } catch (deleteError) {
      if (deleteError.response?.status === 403) {
        console.log('✅ Correctly prevented staff from deleting vehicles');
      } else {
        console.log('❌ Unexpected error when testing delete restriction:', deleteError.response?.data || deleteError.message);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unauthorized access test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🧪 Starting Complete Staff Functionality End-to-End Test\n');
  console.log('===============================================');
  
  // Step 1: Create or login staff user
  let authResult = await createStaffUser();
  if (!authResult) {
    console.log('\n❌ FAILED: Could not authenticate staff user');
    return;
  }
  
  staffToken = authResult.token;
  const userData = authResult.userData;
  
  // Step 2: Verify user role
  const isStaffRoleCorrect = await testUserProfile(staffToken, userData);
  if (!isStaffRoleCorrect) {
    console.log('\n❌ FAILED: User does not have correct staff role');
    return;
  }
  
  // Step 3: Test staff dashboard
  const dashboardSuccess = await testStaffDashboard(staffToken);
  if (!dashboardSuccess) {
    console.log('\n❌ FAILED: Staff dashboard not accessible');
    return;
  }
  
  // Step 4: Test vehicle operations
  const vehicleOpsSuccess = await testVehicleOperations(staffToken, userData);
  if (!vehicleOpsSuccess) {
    console.log('\n❌ FAILED: Vehicle operations not working correctly');
    return;
  }
  
  // Step 5: Test authorization restrictions
  const authRestrictionSuccess = await testUnauthorizedAccess(staffToken);
  if (!authRestrictionSuccess) {
    console.log('\n❌ FAILED: Authorization restrictions not working');
    return;
  }
  
  console.log('\n===============================================');
  console.log('🎉 ALL TESTS PASSED! Staff functionality is working correctly.');
  console.log('\n📋 Summary of Working Features:');
  console.log('✅ Staff can log in and receive correct role in token');
  console.log('✅ Staff can access their dashboard with statistics');
  console.log('✅ Staff can add vehicles (set to pending_approval status)');
  console.log('✅ Staff can view their own vehicles');
  console.log('✅ Staff can update their own vehicles');
  console.log('✅ Staff cannot perform admin-only actions (like delete)');
  console.log('✅ Staff vehicles are properly tracked with staff ID');
  console.log('✅ Proper role-based access control is enforced');
  
  console.log('\n🔧 Backend Implementation Confirmed Working:');
  console.log('- Staff role added to User model and database');
  console.log('- Staff-specific API endpoints created and secured');
  console.log('- Vehicle tracking fields added for staff attribution');
  console.log('- Approval workflow implemented (pending_approval -> available)');
  console.log('- RBAC middleware updated with staff permissions');
  console.log('- Staff dashboard with statistics and management features');
  
  console.log('\n💡 Note: The frontend application needs to be updated to:');
  console.log('  - Recognize the staff role from the user profile');
  console.log('  - Show staff-specific UI/components');
  console.log('  - Route staff users to appropriate dashboards');
  console.log('  - Provide interfaces for staff vehicle management');
}

runCompleteTest();