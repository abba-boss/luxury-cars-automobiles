# Complete Permission Workflow Guide

## How the Permission System Works

### For Admins (Granting Permissions):

1. **Login as Admin**
   - Use admin credentials (admin@luxurycars.com / admin123)
   - Navigate to `/admin/user-permissions`

2. **Grant Permissions to Staff/User**
   - Find the staff/user in the list
   - Click "Manage Permissions" for that user
   - Click "Grant Permission" button
   - Select the permission (e.g., "manage_inventory", "view_orders", etc.)
   - Click "Grant Permission"

3. **Available Permissions:**
   - `manage_inventory` - Manage vehicle inventory
   - `view_orders` - View orders
   - `manage_customers` - Manage customers
   - `manage_reviews` - Manage reviews
   - `view_reports` - View reports
   - `access_system_settings` - Access system settings
   - `respond_to_inquiries` - Respond to inquiries
   - `update_order_status` - Update order statuses
   - `process_sales` - Process sales
   - `upload_vehicle_media` - Upload vehicle media
   - `verify_vehicles` - Verify vehicles
   - `update_vehicle_status` - Update vehicle statuses

### For Staff/Users (Using Permissions):

1. **After Admin Grants Permission:**
   - The staff/user receives the permission in the database
   - The staff/user needs to refresh their permissions to see the changes

2. **How to Refresh Permissions:**
   - On the dashboard, click the "Refresh Permissions" button
   - OR refresh the browser page (F5)
   - OR log out and log back in

3. **Access New Features:**
   - After refreshing, new features will appear in the sidebar
   - New buttons and functionality will become available
   - The user can now access the features they were granted

### Complete Workflow Example:

**Scenario:** Admin wants to allow a staff member to manage inventory

**Step 1 - Admin Action:**
- Admin logs in to `/admin`
- Goes to `/admin/user-permissions`
- Finds the staff user
- Grants "manage_inventory" permission

**Step 2 - Staff Action:**
- Staff user is notified (or checks their dashboard)
- Staff user clicks "Refresh Permissions" button on their dashboard
- OR staff user refreshes their browser

**Step 3 - Result:**
- Staff user now sees "Inventory" in their sidebar
- Staff user can navigate to `/staff/vehicles`
- Staff user can add, edit, and manage vehicles
- All functionality is available based on the granted permission

### Troubleshooting:

**If staff doesn't see new features:**
1. Make sure they clicked "Refresh Permissions" after the admin granted it
2. Try refreshing the browser page
3. Try logging out and logging back in
4. Check that the permission is active and not expired

**If features are still not accessible:**
1. Verify the admin granted the correct permission
2. Check that the staff user is logged in with the correct account
3. Ensure the permission hasn't expired

### Key Points:

- Permissions are checked in REAL-TIME from the database
- No more stale JWT token issues
- Staff can see their permissions on their dashboard
- Navigation items appear/disappear based on permissions
- Route access is protected by permissions
- API endpoints are protected by permissions
- Staff can refresh permissions without logging out

The system is designed to be seamless - once an admin grants a permission, the staff user just needs to refresh their permissions to gain access to the new features!