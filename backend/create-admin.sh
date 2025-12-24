#!/bin/bash

# Create admin user for RBAC testing
API_URL="http://localhost:3001/api"

echo "🔧 Creating Admin User for RBAC Testing"
echo "======================================="

# Create admin user
echo "1. Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sarkinmota.com",
    "password": "admin123456",
    "full_name": "System Administrator",
    "phone": "+2348099999999"
  }')

echo "Admin Registration Response: $ADMIN_RESPONSE"

# Extract admin user ID from response
ADMIN_ID=$(echo $ADMIN_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Admin User ID: $ADMIN_ID"

# Update user role to admin directly in database
if [ ! -z "$ADMIN_ID" ]; then
  echo -e "\n2. Updating user role to admin in database..."
  mysql -u root -e "USE sarkin_mota_db; UPDATE users SET role='admin' WHERE id=$ADMIN_ID;"
  
  # Verify the update
  ADMIN_CHECK=$(mysql -u root -e "USE sarkin_mota_db; SELECT id, email, role FROM users WHERE id=$ADMIN_ID;" 2>/dev/null)
  echo "Admin User Verification:"
  echo "$ADMIN_CHECK"
  
  echo -e "\n✅ Admin user created successfully!"
  echo "Email: admin@sarkinmota.com"
  echo "Password: admin123456"
  echo "Role: admin"
else
  echo "❌ Failed to create admin user"
fi
