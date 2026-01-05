#!/bin/bash

echo "🧪 Testing Brand Management System"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_pattern="$3"
    
    echo -n "Testing $test_name... "
    
    result=$(eval "$command" 2>/dev/null)
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Expected: $expected_pattern"
        echo "Got: $result"
        ((TESTS_FAILED++))
    fi
}

# Get admin token
echo "🔐 Getting admin authentication token..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' | jq -r '.token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get admin token. Make sure backend is running and admin user exists.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Admin token obtained${NC}"
echo ""

# Test 1: Get all brands
run_test "Get all brands" \
    "curl -s http://localhost:3001/api/brands" \
    '"success":true'

# Test 2: Search brands
run_test "Search brands (BMW)" \
    "curl -s 'http://localhost:3001/api/brands/search?q=BMW'" \
    '"name":"BMW"'

# Test 3: Get specific brand
run_test "Get specific brand" \
    "curl -s http://localhost:3001/api/brands/1" \
    '"success":true'

# Test 4: Create new brand (admin only)
run_test "Create new brand (admin)" \
    "curl -s -X POST http://localhost:3001/api/brands \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer $ADMIN_TOKEN' \
      -d '{\"name\":\"Test Brand $(date +%s)\",\"image\":\"https://example.com/logo.png\"}'" \
    '"success":true'

# Test 5: Get vehicles with brand information
run_test "Get vehicles with brands" \
    "curl -s 'http://localhost:3001/api/vehicles?limit=1'" \
    '"brand":'

# Test 6: Unauthorized brand creation (should fail)
run_test "Unauthorized brand creation (should fail)" \
    "curl -s -X POST http://localhost:3001/api/brands \
      -H 'Content-Type: application/json' \
      -d '{\"name\":\"Unauthorized Brand\"}'" \
    '"success":false'

# Test 7: Invalid brand creation (missing name)
run_test "Invalid brand creation (missing name)" \
    "curl -s -X POST http://localhost:3001/api/brands \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer $ADMIN_TOKEN' \
      -d '{\"image\":\"https://example.com/logo.png\"}'" \
    '"success":false'

# Test 8: Brand search with no results
run_test "Brand search with no results" \
    "curl -s 'http://localhost:3001/api/brands/search?q=NonExistentBrand123'" \
    '"data":\[\]'

echo ""
echo "🏁 Test Results"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Brand management system is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the implementation.${NC}"
    exit 1
fi
