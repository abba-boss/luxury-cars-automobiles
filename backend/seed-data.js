require('dotenv').config();
const { Vehicle, Brand, User } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create sample brands if they don't exist
    const brands = [
      { name: 'BMW', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW_Logo.svg/240px-BMW_Logo.svg.png' },
      { name: 'Mercedes-Benz', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/240px-Mercedes-Logo.svg.png' },
      { name: 'Toyota', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Symbol_%282016%29.svg/240px-Toyota_Symbol_%282016%29.svg.png' },
      { name: 'Lexus', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Lexus_2022_logo.svg/240px-Lexus_2022_logo.svg.png' },
      { name: 'Audi', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Audi_Logo_2009.svg/240px-Audi_Logo_2009.svg.png' }
    ];

    for (const brandData of brands) {
      await Brand.findOrCreate({
        where: { name: brandData.name },
        defaults: brandData
      });
    }

    // Get brand IDs
    const bmw = await Brand.findOne({ where: { name: 'BMW' } });
    const mercedes = await Brand.findOne({ where: { name: 'Mercedes-Benz' } });
    const toyota = await Brand.findOne({ where: { name: 'Toyota' } });
    const lexus = await Brand.findOne({ where: { name: 'Lexus' } });
    const audi = await Brand.findOne({ where: { name: 'Audi' } });

    // Create sample vehicles
    const vehicles = [
      {
        make: 'BMW',
        model: 'X7',
        year: 2023,
        price: 78900,
        mileage: 15000,
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        condition: 'Excellent',
        body_type: 'SUV',
        color: 'Black Sapphire',
        description: 'Luxury SUV with premium features and exceptional performance.',
        features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound'],
        images: ['https://cdn.pixabay.com/photo/2021/08/29/08/38/bmw-6582162_1280.jpg'],
        is_featured: true,
        is_hot_deal: false,
        brand_id: bmw.id
      },
      {
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2022,
        price: 65900,
        mileage: 12000,
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        condition: 'Excellent',
        body_type: 'Sedan',
        color: 'Obsidian Black',
        description: 'Elegant sedan with cutting-edge technology and comfort.',
        features: ['Heated Seats', 'Blind Spot Assist', 'Apple CarPlay'],
        images: ['https://cdn.pixabay.com/photo/2020/08/20/12/13/mercedes-benz-5502083_1280.jpg'],
        is_featured: true,
        is_hot_deal: true,
        brand_id: mercedes.id
      },
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 28500,
        mileage: 8000,
        fuel_type: 'Hybrid',
        transmission: 'CVT',
        condition: 'Like New',
        body_type: 'Sedan',
        color: 'White Pearl',
        description: 'Reliable and efficient hybrid sedan with advanced safety features.',
        features: ['Safety Sense 2.0', 'Backup Camera', 'Keyless Entry'],
        images: ['https://cdn.pixabay.com/photo/2020/06/16/19/22/toyota-5305281_1280.jpg'],
        is_featured: false,
        is_hot_deal: true,
        brand_id: toyota.id
      },
      {
        make: 'Lexus',
        model: 'RX 350',
        year: 2021,
        price: 48900,
        mileage: 25000,
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        condition: 'Good',
        body_type: 'SUV',
        color: 'Atomic Silver',
        description: 'Luxury SUV with premium interior and smooth ride quality.',
        features: ['Premium Package', 'Mark Levinson Sound', 'Panoramic Roof'],
        images: ['https://cdn.pixabay.com/photo/2019/06/07/12/46/lexus-4258402_1280.jpg'],
        is_featured: true,
        is_hot_deal: false,
        brand_id: lexus.id
      },
      {
        make: 'Audi',
        model: 'A4',
        year: 2022,
        price: 42900,
        mileage: 18000,
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        condition: 'Excellent',
        body_type: 'Sedan',
        color: 'Glacier White',
        description: 'Sporty luxury sedan with Quattro all-wheel drive.',
        features: ['Virtual Cockpit', 'Quattro AWD', 'Matrix LED Headlights'],
        images: ['https://cdn.pixabay.com/photo/2020/05/15/14/17/audi-5175311_1280.jpg'],
        is_featured: false,
        is_hot_deal: true,
        brand_id: audi.id
      }
    ];

    for (const vehicleData of vehicles) {
      await Vehicle.findOrCreate({
        where: { make: vehicleData.make, model: vehicleData.model, year: vehicleData.year },
        defaults: vehicleData
      });
    }

    // Create admin user if not exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        email: 'admin@test.com',
        password: hashedPassword,
        full_name: 'Admin User',
        role: 'admin',
        status: 'active'
      }
    });

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();