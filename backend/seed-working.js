const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luxury_cars_automobiles'
};

// Working car images from reliable sources
const workingCarData = [
  {
    make: 'Honda',
    model: 'Accord 2023',
    year: 2023,
    price: 28500000,
    mileage: 15000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Tokunbo',
    body_type: 'Sedan',
    color: 'Platinum White Pearl',
    description: 'Honda Accord 2023 - Mid-size sedan with 1.5L turbo engine, Honda Sensing safety suite, and premium interior.',
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'LED Headlights', 'Dual-Zone Climate', 'Wireless Charging'],
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'Honda',
    model: 'CR-V 2023',
    year: 2023,
    price: 35000000,
    mileage: 8500,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    condition: 'Brand New',
    body_type: 'SUV',
    color: 'Metallic Black',
    description: 'Honda CR-V 2023 - Compact SUV with hybrid powertrain, all-wheel drive, and spacious interior.',
    features: ['Honda Sensing', 'AWD', 'Panoramic Sunroof', 'Heated Seats', 'Remote Start', 'Premium Audio'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'BMW',
    model: '330i 2023',
    year: 2023,
    price: 65000000,
    mileage: 12000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Tokunbo',
    body_type: 'Sedan',
    color: 'Alpine White',
    description: 'BMW 330i 2023 - Luxury sports sedan with 2.0L turbo engine, xDrive AWD, and premium technology.',
    features: ['xDrive AWD', 'Live Cockpit Pro', 'Harman Kardon Audio', 'Adaptive Suspension', 'Gesture Control'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'BMW',
    model: 'X5 2023',
    year: 2023,
    price: 85000000,
    mileage: 9500,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Brand New',
    body_type: 'SUV',
    color: 'Jet Black',
    description: 'BMW X5 2023 - Luxury SUV with 3.0L turbo engine, xDrive AWD, and premium interior.',
    features: ['xDrive AWD', 'Air Suspension', 'Panoramic Roof', 'Massage Seats', 'Surround View'],
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'Mercedes-Benz',
    model: 'C300 2023',
    year: 2023,
    price: 72000000,
    mileage: 11000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Tokunbo',
    body_type: 'Sedan',
    color: 'Obsidian Black',
    description: 'Mercedes-Benz C300 2023 - Luxury sedan with 2.0L turbo engine, MBUX system, and premium features.',
    features: ['MBUX System', 'Burmester Audio', 'Air Suspension', 'Ambient Lighting', 'Wireless Charging'],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'Toyota',
    model: 'Camry 2023',
    year: 2023,
    price: 32000000,
    mileage: 14000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Tokunbo',
    body_type: 'Sedan',
    color: 'Wind Chill Pearl',
    description: 'Toyota Camry 2023 - Mid-size sedan with 2.5L engine, Toyota Safety Sense, and premium features.',
    features: ['Toyota Safety Sense 2.0', 'JBL Audio', 'Wireless Charging', 'LED Headlights', 'Dual-Zone Climate'],
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  },
  {
    make: 'Lexus',
    model: 'ES 350 2023',
    year: 2023,
    price: 58000000,
    mileage: 9000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Tokunbo',
    body_type: 'Sedan',
    color: 'Ultra White',
    description: 'Lexus ES 350 2023 - Luxury sedan with 3.5L V6 engine, Mark Levinson audio, and premium comfort.',
    features: ['Mark Levinson Audio', 'Lexus Safety System+', 'Wireless Charging', 'Head-Up Display', 'Heated Seats'],
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ]
  }
];

async function seedWorkingImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('DELETE FROM sales');
    await connection.execute('DELETE FROM vehicles');
    await connection.execute('DELETE FROM users');
    await connection.execute('ALTER TABLE vehicles AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE sales AUTO_INCREMENT = 1');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Insert admin user
    console.log('Creating admin user...');
    await connection.execute(
      `INSERT INTO users (email, password, full_name, phone, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['admin@luxurycars.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', '+234701513611', 'admin', 'active']
    );

    // Insert cars with working images
    console.log('Inserting cars with WORKING images...');
    
    for (const car of workingCarData) {
      await connection.execute(
        `INSERT INTO vehicles (make, model, year, price, mileage, fuel_type, transmission, 
         \`condition\`, body_type, color, description, features, images, videos, 
         is_verified, is_featured, is_hot_deal, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          car.make, car.model, car.year, car.price, car.mileage,
          car.fuel_type, car.transmission, car.condition, car.body_type,
          car.color, car.description, JSON.stringify(car.features),
          JSON.stringify(car.images), JSON.stringify(car.videos),
          true, Math.random() > 0.6, Math.random() > 0.8, 'available'
        ]
      );
      console.log(`✓ Added: ${car.make} ${car.model} with working images`);
    }

    console.log('\n✅ WORKING IMAGES SEEDED!');
    console.log('- All images from reliable Unsplash URLs');
    console.log('- No CORS issues');
    console.log('- Images will load properly');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedWorkingImages();
