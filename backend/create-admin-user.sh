#!/bin/bash

# Create admin user for Sarkin Mota Automobiles

API_URL="http://localhost:3001/api"

echo "Creating admin user..."

# Register admin user
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sarkinmota.com",
    "password": "admin123",
    "full_name": "Admin User",
    "phone": "+234-800-000-0000"
  }')

echo "Registration response: $RESPONSE"

# Extract user ID from response
USER_ID=$(echo $RESPONSE | jq -r '.data.id')

if [ "$USER_ID" != "null" ] && [ "$USER_ID" != "" ]; then
  echo "User created with ID: $USER_ID"
  
  # Update user role to admin directly in database
  mysql -u root -p sarkin_mota_db -e "UPDATE users SET role = 'admin' WHERE id = $USER_ID;"
  
  echo "✅ Admin user created successfully!"
  echo "Email: admin@sarkinmota.com"
  echo "Password: admin123"
else
  echo "❌ Failed to create admin user"
  echo "Response: $RESPONSE"
fi
