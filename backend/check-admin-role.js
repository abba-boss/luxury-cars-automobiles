const { User } = require('./models');

async function checkAndFixAdminRole() {
  try {
    console.log('Checking admin users...\n');

    // Find all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'status']
    });

    console.log('All users in database:');
    console.log('═══════════════════════════════════════════════════════════');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.full_name}`);
      console.log(`Role: ${user.role}`);
      console.log(`Status: ${user.status}`);
      console.log('───────────────────────────────────────────────────────────');
    });

    // Ask which user should be admin
    console.log('\nEnter the email of the user you want to make admin:');
    console.log('(Or press Ctrl+C to cancel)');
    
    // For now, let's find users with 'admin' in their email or name
    const potentialAdmins = users.filter(u => 
      u.email.toLowerCase().includes('admin') || 
      u.full_name.toLowerCase().includes('admin')
    );

    if (potentialAdmins.length > 0) {
      console.log('\nFound potential admin users:');
      potentialAdmins.forEach(user => {
        console.log(`- ${user.email} (${user.full_name}) - Current role: ${user.role}`);
      });

      // Update all potential admins to have admin role
      for (const user of potentialAdmins) {
        if (user.role !== 'admin') {
          await user.update({ role: 'admin' });
          console.log(`✅ Updated ${user.email} to admin role`);
        } else {
          console.log(`✓ ${user.email} already has admin role`);
        }
      }
    } else {
      console.log('\nNo users with "admin" in email or name found.');
      console.log('Please specify which user should be admin by running:');
      console.log('node fix-admin-role.js <email>');
    }

    // Check if there's a command line argument
    const emailArg = process.argv[2];
    if (emailArg) {
      const userToUpdate = await User.findOne({ where: { email: emailArg } });
      if (userToUpdate) {
        await userToUpdate.update({ role: 'admin' });
        console.log(`\n✅ Updated ${emailArg} to admin role`);
      } else {
        console.log(`\n❌ User with email ${emailArg} not found`);
      }
    }

    console.log('\n✅ Admin role check complete!');
    console.log('\nCurrent admin users:');
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'email', 'full_name', 'role']
    });
    admins.forEach(admin => {
      console.log(`- ${admin.email} (${admin.full_name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAndFixAdminRole();
