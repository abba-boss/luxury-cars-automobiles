const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luxury_cars_automobiles'
};

const users = [
  { email: 'john.doe@email.com', full_name: 'John Doe', phone: '+2348012345678', role: 'user' },
  { email: 'jane.smith@email.com', full_name: 'Jane Smith', phone: '+2348023456789', role: 'user' },
  { email: 'mike.johnson@email.com', full_name: 'Mike Johnson', phone: '+2348034567890', role: 'user' },
  { email: 'sarah.wilson@email.com', full_name: 'Sarah Wilson', phone: '+2348045678901', role: 'user' },
  { email: 'david.brown@email.com', full_name: 'David Brown', phone: '+2348056789012', role: 'user' },
  { email: 'lisa.davis@email.com', full_name: 'Lisa Davis', phone: '+2348067890123', role: 'user' },
  { email: 'chris.miller@email.com', full_name: 'Chris Miller', phone: '+2348078901234', role: 'user' },
  { email: 'emma.garcia@email.com', full_name: 'Emma Garcia', phone: '+2348089012345', role: 'user' },
  { email: 'alex.martinez@email.com', full_name: 'Alex Martinez', phone: '+2348090123456', role: 'user' },
  { email: 'maria.rodriguez@email.com', full_name: 'Maria Rodriguez', phone: '+2348001234567', role: 'user' },
  { email: 'james.anderson@email.com', full_name: 'James Anderson', phone: '+2348012345679', role: 'user' },
  { email: 'olivia.taylor@email.com', full_name: 'Olivia Taylor', phone: '+2348023456780', role: 'user' },
  { email: 'william.thomas@email.com', full_name: 'William Thomas', phone: '+2348034567891', role: 'user' },
  { email: 'sophia.jackson@email.com', full_name: 'Sophia Jackson', phone: '+2348045678902', role: 'user' },
  { email: 'benjamin.white@email.com', full_name: 'Benjamin White', phone: '+2348056789013', role: 'user' },
  { email: 'ava.harris@email.com', full_name: 'Ava Harris', phone: '+2348067890124', role: 'user' },
  { email: 'lucas.clark@email.com', full_name: 'Lucas Clark', phone: '+2348078901235', role: 'user' },
  { email: 'mia.lewis@email.com', full_name: 'Mia Lewis', phone: '+2348089012346', role: 'user' },
  { email: 'ethan.walker@email.com', full_name: 'Ethan Walker', phone: '+2348090123457', role: 'user' },
  { email: 'charlotte.hall@email.com', full_name: 'Charlotte Hall', phone: '+2348001234568', role: 'user' }
];

async function addUsers() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');

    console.log('Adding 20 users...');
    
    for (const user of users) {
      await connection.execute(
        `INSERT INTO users (email, password, full_name, phone, role, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.email, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', user.full_name, user.phone, user.role, 'active']
      );
      console.log(`✓ Added: ${user.full_name} (${user.email})`);
    }

    console.log('\n✅ 20 users added successfully!');
    console.log('Password for all users: password');
    
  } catch (error) {
    console.error('❌ Error adding users:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addUsers();
