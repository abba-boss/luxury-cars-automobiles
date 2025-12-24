#!/bin/bash

# Test script for authentication system
API_URL="http://localhost:3001/api"

echo "🧪 Testing Authentication System"
echo "================================"

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_URL/../health")
echo "Health Response: $HEALTH_RESPONSE"

# Test 2: Register User
echo -e "\n2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "+2348012345678"
  }')

echo "Register Response: $REGISTER_RESPONSE"

# Extract token from registration response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Extracted Token: $TOKEN"

# Test 3: Login User
echo -e "\n3. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Test 4: Get Profile (Protected Route)
echo -e "\n4. Testing protected route (get profile)..."
if [ ! -z "$TOKEN" ]; then
  PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  echo "Profile Response: $PROFILE_RESPONSE"
else
  echo "No token available, skipping profile test"
fi

# Test 5: Verify Database Insert
echo -e "\n5. Verifying database insert..."
DB_CHECK=$(mysql -u root -e "USE sarkin_mota_db; SELECT id, email, full_name, phone, role, status FROM users WHERE email='test@example.com';" 2>/dev/null)
echo "Database Record:"
echo "$DB_CHECK"

# Test 6: Test Duplicate Registration
echo -e "\n6. Testing duplicate registration (should fail)..."
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User 2",
    "phone": "+2348012345679"
  }')

echo "Duplicate Registration Response: $DUPLICATE_RESPONSE"

# Test 7: Test Invalid Login
echo -e "\n7. Testing invalid login..."
INVALID_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')

echo "Invalid Login Response: $INVALID_LOGIN_RESPONSE"

echo -e "\n✅ Testing Complete!"
echo "Check the responses above to verify everything is working correctly."
