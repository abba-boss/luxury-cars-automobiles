const { User } = require('./models');

async function resetAdminPassword() {
  try {
    const email = process.argv[2] || 'admin@luxurycars.com';
    const newPassword = process.argv[3] || 'admin123';

    console.log(`\n🔑 Resetting password for: ${email}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Current Role: ${user.role}\n`);

    // Update password
    user.password = newPassword;
    await user.save();

    console.log('✅ Password updated successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('New credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    console.log(`   Role: ${user.role}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test the new password
    const isValid = await user.checkPassword(newPassword);
    if (isValid) {
      console.log('✅ Password verification successful!');
      console.log('You can now login with these credentials.\n');
    } else {
      console.log('❌ Password verification failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

console.log('\n🔐 Admin Password Reset Script');
console.log('═══════════════════════════════════════════════════════════');
console.log('Usage: node reset-admin-password.js <email> <new_password>');
console.log('Default: admin@luxurycars.com / admin123');
console.log('═══════════════════════════════════════════════════════════');

resetAdminPassword();
