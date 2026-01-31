const { User } = require('./models');

async function createSampleStaff() {
  try {
    // Check if staff user already exists
    const existingStaff = await User.findOne({
      where: {
        email: 'staff@example.com'
      }
    });

    if (existingStaff) {
      console.log('Sample staff user already exists');
      console.log('Staff user:', {
        id: existingStaff.id,
        email: existingStaff.email,
        role: existingStaff.role,
        full_name: existingStaff.full_name
      });
      return;
    }

    // Create a sample staff user
    const staffUser = await User.create({
      email: 'staff@example.com',
      password: 'staff123',
      full_name: 'John Staff',
      phone: '+2348012345678',
      role: 'staff',
      status: 'active'
    });

    console.log('Sample staff user created successfully');
    console.log('Staff user:', {
      id: staffUser.id,
      email: staffUser.email,
      role: staffUser.role,
      full_name: staffUser.full_name,
      password: 'staff123'  // This will be hashed in the database
    });

  } catch (error) {
    console.error('Error creating sample staff:', error);
  }
}

createSampleStaff();