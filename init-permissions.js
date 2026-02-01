#!/usr/bin/env node

/**
 * Simple script to initialize the UserPermission table if it doesn't exist
 * This script creates the table directly using raw SQL if migrations can't run
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the database configuration
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('No .env file found in backend directory');
}

const mysql = require('mysql2/promise');

async function createTableIfNotExists() {
  console.log('Checking if UserPermission table exists...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'luxury_cars_automobiles'
  });

  try {
    // Check if table exists
    const [rows] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'user_permissions'
    `, [process.env.DB_NAME || 'luxury_cars_automobiles']);

    if (rows.length > 0) {
      console.log('✅ UserPermission table already exists');
    } else {
      console.log('❌ UserPermission table does not exist. Creating it...');
      
      // Create the table
      await connection.execute(`
        CREATE TABLE user_permissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          permission_key VARCHAR(100) NOT NULL,
          permission_value TEXT,
          granted_by INT NOT NULL,
          granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      
      console.log('✅ UserPermission table created successfully');
    }
  } catch (error) {
    console.error('❌ Error checking/creating UserPermission table:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the initialization
createTableIfNotExists()
  .then(() => {
    console.log('\n🎉 UserPermission system initialized successfully!');
    console.log('You can now use the permission management features.');
  })
  .catch(err => {
    console.error('\n💥 Failed to initialize UserPermission system:', err.message);
    console.log('\n💡 Make sure your database is running and credentials are correct in backend/.env');
    process.exit(1);
  });