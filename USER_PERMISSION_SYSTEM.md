# User Permission System Documentation

## Overview
The user permission system allows administrators to grant specific access rights to users for premium features and restricted areas of the application. This system provides fine-grained control over what users can access and do within the platform.

## Database Schema

### UserPermission Table
- `id`: Primary key
- `user_id`: Foreign key referencing the user who has the permission
- `permission_key`: String identifier for the permission (e.g., 'view_premium_inventory')
- `permission_value`: Optional value associated with the permission (e.g., '20_percent_discount')
- `granted_by`: Foreign key referencing the admin who granted the permission
- `granted_at`: Timestamp when the permission was granted
- `expires_at`: Optional timestamp when the permission expires
- `is_active`: Boolean indicating if the permission is currently active

## Available Permissions

### Standard Permissions
- `view_premium_inventory`: Allows viewing premium/high-value vehicles
- `schedule_test_drive`: Allows scheduling test drives for vehicles
- `access_financing_calculator`: Access to advanced financing calculation tools
- `early_access_new_models`: Early access to new vehicle listings
- `exclusive_promotions`: Access to exclusive promotional offers
- `priority_customer_support`: Priority access to customer support
- `special_discounts`: Eligibility for special discounts
- `extended_warranty_info`: Access to extended warranty information
- `trade_in_valuation`: Access to trade-in valuation tools
- `virtual_tour_access`: Access to virtual tour features

## API Endpoints

### Admin Endpoints
- `GET /api/admin/user-permissions/users/:userId/permissions` - Get all permissions for a user
- `POST /api/admin/user-permissions/users/:userId/permissions` - Grant a permission to a user
- `PUT /api/admin/user-permissions/users/:userId/permissions/:permissionId` - Update a permission
- `DELETE /api/admin/user-permissions/users/:userId/permissions/:permissionId` - Revoke a permission
- `GET /api/admin/user-permissions/users-with-permissions` - Get all users with their permissions
- `GET /api/admin/user-permissions/users/:userId/check-permission?permission_key=:key` - Check if user has specific permission

### Premium Feature Endpoints
- `GET /api/premium` - Access to premium inventory (requires 'view_premium_inventory' permission)
- `POST /api/premium/test-drive` - Schedule test drive (requires 'schedule_test_drive' permission)
- `GET /api/premium/promotions/exclusive` - Access exclusive promotions (requires 'exclusive_promotions' permission)

## Frontend Components

### Admin User Permissions Page
Located at `/admin/user-permissions`, this page allows administrators to:
- View all users and their current permissions
- Search and filter users
- Grant new permissions to users
- Revoke existing permissions
- Set expiration dates for permissions

### User Permission Management Component
Located in `/components/admin/UserPermissionManagement.tsx`, this component allows admins to:
- View specific user's permissions
- Grant new permissions to a specific user
- Modify existing permissions
- Revoke permissions

## Middleware Protection

The system includes middleware functions to protect routes based on permissions:

- `requirePermission(permissionKey)`: Ensures user has a specific permission
- `requireAnyPermission(permissionKeys)`: Ensures user has at least one of the specified permissions
- `requireAllPermissions(permissionKeys)`: Ensures user has all of the specified permissions

## Implementation Example

### Protecting a Route
```javascript
const { requirePermission } = require('../middlewares/permissionMiddleware');

// This route requires the 'view_premium_inventory' permission
router.get('/premium', authenticateUser, requirePermission('view_premium_inventory'), async (req, res, next) => {
  // Implementation here
});
```

### Checking Permissions in Code
```javascript
// Check if user has a specific permission
const hasPermission = await user.hasPermission('view_premium_inventory');

// Get all active permissions for a user
const activePermissions = await user.getActivePermissions();
```

## Security Considerations

1. All permission checks happen server-side to prevent client-side manipulation
2. Permissions are validated on each protected request
3. Expired permissions are automatically considered invalid
4. The system includes audit trails showing who granted permissions and when
5. Administrators can revoke permissions at any time

## Best Practices

1. Use descriptive permission keys that clearly indicate what access they provide
2. Regularly audit user permissions to ensure appropriate access levels
3. Set expiration dates for temporary permissions
4. Log permission grants and revocations for audit purposes
5. Use the minimum required permissions for each feature