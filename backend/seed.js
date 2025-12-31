const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luxury_cars_automobiles'
};

const carMakes = ['Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Nissan', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'Porsche'];
const models = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Crossover'];
const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Green', 'Brown', 'Gold', 'Orange'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Manual', 'Automatic'];
const conditions = ['Brand New', 'Tokunbo', 'Nigerian Used'];
const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Crossover'];

const availableImages = [
  'vehicles/camry-1.jpg', 'vehicles/camry-2.jpg', 'vehicles/camry-3.jpg',
  'vehicles/accord-1.jpg', 'vehicles/accord-2.jpg', 'vehicles/accord-3.jpg',
  'vehicles/eclass-1.jpg', 'vehicles/eclass-2.jpg', 'vehicles/eclass-3.jpg',
  'vehicles/rx350-1.jpg', 'vehicles/rx350-2.jpg', 'vehicles/rx350-3.jpg',
  'vehicles/x5-1.jpg', 'vehicles/x5-2.jpg', 'vehicles/x5-3.jpg',
  'vehicles/q7-1.jpg', 'vehicles/q7-2.jpg', 'vehicles/q7-3.jpg',
  'vehicles/tesla-model-s.jpg', 'vehicles/bmw-x6.jpg', 'vehicles/mercedes-amg.jpg'
];

const availableVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

function getRandomImages(count = 3) {
  const shuffled = [...availableImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomVideo() {
  return availableVideos[Math.floor(Math.random() * availableVideos.length)];
}

const features = [
  'Sunroof', 'Heated Seats', 'Cruise Control', 'Keyless Entry', 'Premium Sound System',
  'Parking Sensors', 'Lane Departure Warning', 'Blind Spot Monitoring', 'Adaptive Cruise Control',
  'Apple CarPlay', 'Android Auto', 'Wireless Charging', 'Panoramic Roof', 'Ventilated Seats',
  'Memory Seats', 'Power Liftgate', 'Third Row Seating', 'All-Wheel Drive', 'Turbo Engine'
];

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateVehicle(index) {
  const make = carMakes[Math.floor(Math.random() * carMakes.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  const year = 2015 + Math.floor(Math.random() * 10);
  const price = (15000 + Math.random() * 85000).toFixed(2);
  const mileage = Math.floor(Math.random() * 150000);
  
  return {
    make,
    model: `${model} ${year}`,
    year,
    price,
    mileage,
    fuel_type: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
    transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    body_type: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    description: `Beautiful ${year} ${make} ${model} in excellent condition. Well maintained with full service history.`,
    features: getRandomElements(features, 3 + Math.floor(Math.random() * 5)),
    images: getRandomImages(3),
    videos: [getRandomVideo()],
    is_verified: Math.random() > 0.3,
    is_featured: Math.random() > 0.7,
    is_hot_deal: Math.random() > 0.8,
    status: 'available'
  };
}

function generateUser(index) {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Alex', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    full_name: `${firstName} ${lastName}`,
    phone: `+234${Math.floor(Math.random() * 900000000) + 100000000}`,
    role: index < 5 ? 'admin' : 'user',
    status: 'active'
  };
}

async function seedDatabase() {
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

    // Insert users
    console.log('Inserting users...');
    for (let i = 1; i <= 35; i++) {
      const user = generateUser(i);
      await connection.execute(
        `INSERT INTO users (email, password, full_name, phone, role, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.email, user.password, user.full_name, user.phone, user.role, user.status]
      );
    }

    // Insert vehicles
    console.log('Inserting vehicles...');
    for (let i = 1; i <= 55; i++) {
      const vehicle = generateVehicle(i);
      await connection.execute(
        `INSERT INTO vehicles (make, model, year, price, mileage, fuel_type, transmission, 
         \`condition\`, body_type, color, description, features, images, videos, 
         is_verified, is_featured, is_hot_deal, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.make, vehicle.model, vehicle.year, vehicle.price, vehicle.mileage,
          vehicle.fuel_type, vehicle.transmission, vehicle.condition, vehicle.body_type,
          vehicle.color, vehicle.description, JSON.stringify(vehicle.features),
          JSON.stringify(vehicle.images), JSON.stringify(vehicle.videos),
          vehicle.is_verified, vehicle.is_featured, vehicle.is_hot_deal, vehicle.status
        ]
      );
    }

    console.log('Database seeded successfully!');
    console.log('- 35 users created (5 admins, 30 customers)');
    console.log('- 55 vehicles created with full details');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
