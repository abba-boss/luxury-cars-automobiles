const jwt = require('jsonwebtoken');
const { User } = require('./models');
require('dotenv').config();

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Testing login for: ${email}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found in database:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}\n`);

    // Check password
    const isValidPassword = await user.checkPassword(password);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return;
    }

    console.log('✅ Password is correct\n');

    // Generate token (same as authController)
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ JWT Token generated:');
    console.log(`   ${token.substring(0, 50)}...\n`);

    // Decode token to verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token decoded successfully:');
    console.log(`   User ID: ${decoded.userId}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role: ${decoded.role}`);
    console.log(`   Expires: ${new Date(decoded.exp * 1000).toLocaleString()}\n`);

    // Verify role matches
    if (decoded.role === user.role) {
      console.log('✅ Token role matches database role');
    } else {
      console.log('❌ Token role does NOT match database role!');
      console.log(`   Token role: ${decoded.role}`);
      console.log(`   Database role: ${user.role}`);
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ Login test completed successfully!');
    console.log(`\nYou should be able to login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${user.role}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error during login test:', error);
  } finally {
    process.exit(0);
  }
}

// Get email and password from command line
const email = process.argv[2] || 'admin@luxurycars.com';
const password = process.argv[3] || 'admin123';

console.log('\n🧪 Login Test Script');
console.log('═══════════════════════════════════════════════════════════');
console.log('Usage: node test-login.js <email> <password>');
console.log('Default: admin@luxurycars.com / admin123');
console.log('═══════════════════════════════════════════════════════════');

testLogin(email, password);
