const { User } = require('./models');

async function makeUserAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log('\n❌ Please provide an email address');
      console.log('Usage: node make-admin.js <email>\n');
      console.log('Example: node make-admin.js user@example.com\n');
      process.exit(1);
    }

    console.log(`\n👑 Making user admin: ${email}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found');
      console.log(`\nNo user with email: ${email}\n`);
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Status: ${user.status}\n`);

    if (user.role === 'admin') {
      console.log('ℹ️  User is already an admin!\n');
      process.exit(0);
    }

    // Update role to admin
    await user.update({ role: 'admin' });

    console.log('✅ User role updated to admin!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Updated user:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Role: admin`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✅ User can now login as admin!');
    console.log(`\nLogin credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: (their existing password)`);
    console.log(`\nNote: User needs to logout and login again to get admin access.\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

console.log('\n👑 Make User Admin Script');
console.log('═══════════════════════════════════════════════════════════');
console.log('This script promotes a user to admin role');
console.log('═══════════════════════════════════════════════════════════');

makeUserAdmin();
