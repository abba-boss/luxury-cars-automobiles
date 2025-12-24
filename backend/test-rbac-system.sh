#!/bin/bash

# Comprehensive RBAC Testing Script
API_URL="http://localhost:3001/api"

echo "🧪 RBAC System Testing"
echo "======================"

# Test 1: Create regular user
echo "1. Creating regular user..."
USER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123",
    "full_name": "Regular User",
    "phone": "+2348012345678"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Regular User Created - ID: $USER_ID"

# Test 2: Login admin user
echo -e "\n2. Logging in admin user..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sarkinmota.com",
    "password": "admin123456"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Admin Login Response: $ADMIN_LOGIN_RESPONSE"

# Test 3: User accessing user dashboard (should work)
echo -e "\n3. User accessing user dashboard..."
USER_DASHBOARD_RESPONSE=$(curl -s -X GET "$API_URL/dashboard" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "User Dashboard Response: $USER_DASHBOARD_RESPONSE"

# Test 4: User accessing admin dashboard (should fail)
echo -e "\n4. User trying to access admin dashboard (should fail)..."
USER_ADMIN_ATTEMPT=$(curl -s -X GET "$API_URL/admin/dashboard" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "User Admin Access Response: $USER_ADMIN_ATTEMPT"

# Test 5: Admin accessing admin dashboard (should work)
echo -e "\n5. Admin accessing admin dashboard..."
ADMIN_DASHBOARD_RESPONSE=$(curl -s -X GET "$API_URL/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Admin Dashboard Response: $ADMIN_DASHBOARD_RESPONSE"

# Test 6: Admin getting all users (should work)
echo -e "\n6. Admin getting all users..."
ALL_USERS_RESPONSE=$(curl -s -X GET "$API_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "All Users Response: $ALL_USERS_RESPONSE"

# Test 7: User accessing their own profile (should work)
echo -e "\n7. User accessing their own profile..."
USER_PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "User Profile Response: $USER_PROFILE_RESPONSE"

# Test 8: User trying to access another user's profile (should fail)
echo -e "\n8. User trying to access another user's profile (should fail)..."
OTHER_USER_ATTEMPT=$(curl -s -X GET "$API_URL/users/999" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "Other User Access Response: $OTHER_USER_ATTEMPT"

# Test 9: Admin accessing any user profile (should work)
echo -e "\n9. Admin accessing user profile..."
ADMIN_USER_ACCESS=$(curl -s -X GET "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Admin User Access Response: $ADMIN_USER_ACCESS"

# Test 10: Invalid token test
echo -e "\n10. Testing invalid token..."
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/dashboard" \
  -H "Authorization: Bearer invalid_token_here")
echo "Invalid Token Response: $INVALID_TOKEN_RESPONSE"

# Test 11: No token test
echo -e "\n11. Testing no token..."
NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/dashboard")
echo "No Token Response: $NO_TOKEN_RESPONSE"

# Test 12: Admin updating user role (should work)
if [ ! -z "$USER_ID" ] && [ ! -z "$ADMIN_TOKEN" ]; then
  echo -e "\n12. Admin updating user role..."
  ROLE_UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/admin/users/$USER_ID/role" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"role": "admin"}')
  echo "Role Update Response: $ROLE_UPDATE_RESPONSE"
fi

echo -e "\n✅ RBAC Testing Complete!"
echo "Review the responses above to verify RBAC is working correctly."
