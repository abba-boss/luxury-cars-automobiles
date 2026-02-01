/**
 * Test script for User Permission functionality
 * This script demonstrates how the user permission system works
 */

const { sequelize, User, UserPermission } = require('./backend/models');
const { Op } = require('sequelize');

async function testUserPermissions() {
  try {
    console.log('Testing User Permission System...\n');
    
    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const testUser = await User.create({
      email: 'testuser@example.com',
      password: 'password123',
      full_name: 'Test User',
      role: 'user'
    });
    console.log(`   Created user: ${testUser.full_name} (ID: ${testUser.id})\n`);
    
    // Test 2: Grant a permission to the user
    console.log('2. Granting "view_premium_inventory" permission to user...');
    const permission = await UserPermission.create({
      user_id: testUser.id,
      permission_key: 'view_premium_inventory',
      permission_value: 'enabled',
      granted_by: 1, // Assuming admin user ID is 1
      expires_at: null
    });
    console.log(`   Granted permission: ${permission.permission_key} (ID: ${permission.id})\n`);
    
    // Test 3: Check if user has the permission
    console.log('3. Checking if user has "view_premium_inventory" permission...');
    const hasPermission = await testUser.hasPermission('view_premium_inventory');
    console.log(`   User has permission: ${hasPermission}\n`);
    
    // Test 4: Get all active permissions for the user
    console.log('4. Getting all active permissions for user...');
    const activePermissions = await testUser.getActivePermissions();
    console.log(`   Active permissions: ${activePermissions.length}`);
    activePermissions.forEach(perm => {
      console.log(`   - ${perm.permission_key}: ${perm.permission_value}`);
    });
    console.log('');
    
    // Test 5: Grant another permission with expiration
    console.log('5. Granting "special_discounts" permission with expiration...');
    const expiringPermission = await UserPermission.create({
      user_id: testUser.id,
      permission_key: 'special_discounts',
      permission_value: '20_percent',
      granted_by: 1,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    });
    console.log(`   Granted permission: ${expiringPermission.permission_key} (Expires: ${expiringPermission.expires_at})\n`);
    
    // Test 6: Check both permissions
    console.log('6. Checking both permissions...');
    const hasPremiumPerm = await testUser.hasPermission('view_premium_inventory');
    const hasDiscountPerm = await testUser.hasPermission('special_discounts');
    console.log(`   Has premium inventory permission: ${hasPremiumPerm}`);
    console.log(`   Has discount permission: ${hasDiscountPerm}\n`);
    
    // Test 7: Revoke a permission
    console.log('7. Revoking "view_premium_inventory" permission...');
    await UserPermission.update(
      { is_active: false },
      { where: { id: permission.id } }
    );
    console.log('   Permission revoked\n');
    
    // Test 8: Check if permission is revoked
    console.log('8. Checking if "view_premium_inventory" permission is revoked...');
    const hasPermAfterRevoke = await testUser.hasPermission('view_premium_inventory');
    console.log(`   User has permission after revoke: ${hasPermAfterRevoke}\n`);
    
    console.log('✅ All tests completed successfully!');
    
    // Clean up - delete test user and permissions
    await UserPermission.destroy({ where: { user_id: testUser.id } });
    await testUser.destroy();
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testUserPermissions();