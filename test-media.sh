#!/bin/bash

echo "Testing image and video accessibility..."
echo "======================================="

# Test placeholder image
echo "1. Testing placeholder image:"
curl -s -I http://localhost:3001/uploads/placeholder-car.svg | head -1

# Test API response for vehicles
echo -e "\n2. Testing API response (first vehicle images):"
curl -s http://localhost:3001/api/vehicles | jq -r '.data[0].images[]' | head -3

# Test external image URLs
echo -e "\n3. Testing external image URLs:"
curl -s -I "https://images.unsplash.com/photo-1494976688153-018c804d2e12?w=800" | head -1

# Test if any uploaded vehicle images exist
echo -e "\n4. Checking for uploaded vehicle images:"
ls -la /home/abba-boss/Desktop/luxury_cars_automobiles/backend/uploads/vehicles/images/ | head -5

echo -e "\n5. Testing video URLs from API:"
curl -s http://localhost:3001/api/vehicles | jq -r '.data[0].videos[]' | head -3

echo -e "\nTest completed!"
