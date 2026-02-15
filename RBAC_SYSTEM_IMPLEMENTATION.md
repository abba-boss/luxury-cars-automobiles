# Complete Role-Based Access Control (RBAC) System

## Overview
This document describes the comprehensive RBAC system implemented for the luxury cars application that provides granular permission control for users, staff, and administrators.

## System Architecture

### 1. Backend Implementation
- **Real-time permission checking**: Permissions are checked directly from the database on each request
- **Enhanced middleware**: New middleware functions for real-time permission validation
- **JWT integration**: Authentication tokens include user roles and permissions are loaded on each request

### 2. Frontend Implementation
- **Dynamic navigation**: Sidebar and menu items are rendered based on user permissions
- **Route protection**: Routes are protected based on required permissions
- **Component-level protection**: Individual UI elements can be conditionally rendered based on permissions
- **Permission refresh**: Users can refresh their permissions without logging out

## Permission Structure

### Available Permissions

#### Premium Features
- `view_premium_inventory` - Access to premium/high-value vehicles
- `schedule_test_drive` - Ability to schedule test drives
- `access_financing_calculator` - Access to advanced financing tools
- `exclusive_promotions` - Access to exclusive offers
- `special_discounts` - Eligibility for special discounts

#### Staff Permissions
- `manage_inventory` - Manage vehicle inventory
- `update_vehicle_status` - Update vehicle statuses
- `upload_vehicle_media` - Upload vehicle images/videos
- `verify_vehicles` - Verify vehicles
- `view_orders` - View orders
- `update_order_status` - Update order statuses
- `manage_customers` - Manage customers
- `process_sales` - Process sales
- `respond_to_inquiries` - Respond to inquiries
- `manage_reviews` - Manage reviews
- `view_reports` - View reports
- `access_system_settings` - Access system settings

## Implementation Details

### 1. Protected Routes
Routes can be protected using the enhanced ProtectedRoute component:

```jsx
<Route path="/staff/vehicles" element={
  <ProtectedRoute requireStaff requirePermission="manage_inventory">
    <StaffLayout>
      <StaffVehicles />
    </StaffLayout>
  </ProtectedRoute>
} />
```

### 2. Permission-Based Navigation
Navigation items are automatically shown/hidden based on user permissions:

```jsx
<PermissionBasedNavigation variant="sidebar" />
```

### 3. Conditional UI Elements
Components can be conditionally rendered based on permissions:

```jsx
<RequirePermission permission="manage_inventory">
  <Button>Add Vehicle</Button>
</RequirePermission>
```

### 4. Permission Buttons
Buttons that respect permissions:

```jsx
<PermissionButton permission="manage_inventory" onClick={handleAddVehicle}>
  Add Vehicle
</PermissionButton>
```

## Usage Guide

### For Administrators

#### Granting Permissions
1. Log in as admin
2. Navigate to `/admin/user-permissions`
3. Select the user to grant permissions to
4. Click "Grant Permission"
5. Select the appropriate permission from the list
6. Optionally set an expiration date
7. Click "Grant Permission"

#### Managing Permissions
- View all users and their permissions at `/admin/user-permissions`
- Revoke permissions by clicking the trash icon
- Update permissions by clicking the edit icon
- Set expiration dates for temporary permissions

### For Staff Users

#### Viewing Permissions
- Permissions are displayed on the user dashboard
- Use the "Refresh Permissions" button to see newly granted permissions
- Permissions are also visible in the sidebar navigation

#### Using Permissions
- Access features based on granted permissions
- Navigation items will appear/disappear based on permissions
- Route access is controlled by permissions

## Security Features

1. **Real-time validation**: Permissions are checked from the database on each request
2. **No stale tokens**: Eliminates issues with JWT tokens becoming stale
3. **Frontend and backend protection**: Both client and server-side validation
4. **Dynamic UI**: Interface adapts based on user permissions
5. **Audit trail**: All permission changes are logged

## Development Integration

### Adding New Protected Routes
```jsx
<Route path="/new-feature" element={
  <ProtectedRoute requirePermission="access_new_feature">
    <NewFeatureComponent />
  </ProtectedRoute>
} />
```

### Adding Permission-Based UI Elements
```jsx
<RequirePermission permission="manage_inventory">
  <div className="inventory-controls">
    <button onClick={handleAddVehicle}>Add Vehicle</button>
  </div>
</RequirePermission>
```

### Checking Permissions in Components
```jsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

if (hasPermission('manage_inventory')) {
  // Show inventory management features
}
```

## Best Practices

1. **Principle of Least Privilege**: Grant only the minimum permissions required
2. **Regular Audits**: Periodically review user permissions
3. **Temporary Permissions**: Use expiration dates for temporary access
4. **Clear Naming**: Use descriptive permission names
5. **Consistent Implementation**: Apply the same protection patterns throughout the application

## Troubleshooting

### Permissions Not Appearing
- Ensure the user refreshes their permissions after they're granted
- Check that the permission is active and not expired
- Verify the user is logged in with the correct account

### Route Access Issues
- Confirm the route is properly protected with ProtectedRoute
- Check that the user has the required permissions
- Verify the permission spelling matches exactly

## Migration Notes

- All existing routes continue to work with role-based protection
- New permission-based protection is additive
- No breaking changes to existing functionality
- Users can refresh permissions without logging out