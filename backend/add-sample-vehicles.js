const { Vehicle } = require('./models');

const sampleVehicles = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 25000000,
    mileage: 15000,
    condition: 'Tokunbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Pearl White',
    description: 'Pristine 2023 Toyota Camry with advanced safety features, premium interior, and excellent fuel economy. Perfect for both city driving and long trips.',
    features: ['Leather Seats', 'Sunroof', 'Backup Camera', 'Bluetooth', 'Navigation System', 'Heated Seats', 'Lane Departure Warning', 'Adaptive Cruise Control'],
    images: ['/uploads/vehicles/camry-1.jpg', '/uploads/vehicles/camry-2.jpg', '/uploads/vehicles/camry-3.jpg'],
    videos: ['/uploads/vehicles/camry-video.mp4'],
    is_featured: true,
    is_verified: true,
    is_hot_deal: false,
    engine_size: '2.5L',
    body_type: 'Sedan',
    drive_type: 'FWD',
    doors: 4,
    seats: 5,
    vin: 'JTDKARFP5N3123456'
  },
  {
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    price: 45000000,
    mileage: 25000,
    condition: 'Tokunbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Obsidian Black',
    description: 'Luxury Mercedes-Benz E-Class with premium amenities, advanced technology, and exceptional comfort. A perfect blend of performance and elegance.',
    features: ['Premium Leather', 'Panoramic Sunroof', '360 Camera', 'Wireless Charging', 'Ambient Lighting', 'Massage Seats', 'Burmester Sound', 'MBUX Infotainment'],
    images: ['/uploads/vehicles/eclass-1.jpg', '/uploads/vehicles/eclass-2.jpg', '/uploads/vehicles/eclass-3.jpg'],
    videos: ['/uploads/vehicles/eclass-video.mp4'],
    is_featured: true,
    is_verified: true,
    is_hot_deal: true,
    engine_size: '2.0L Turbo',
    body_type: 'Sedan',
    drive_type: 'RWD',
    doors: 4,
    seats: 5,
    vin: 'WDDZF4JB5NA123456'
  },
  {
    make: 'BMW',
    model: 'X5',
    year: 2023,
    price: 55000000,
    mileage: 8000,
    condition: 'Brand New',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Alpine White',
    description: 'Brand new BMW X5 with cutting-edge technology, spacious luxury interior, and powerful performance. The ultimate driving machine for families.',
    features: ['iDrive 8', 'Harman Kardon Audio', 'Panoramic Roof', 'Gesture Control', 'Wireless Apple CarPlay', 'Head-Up Display', 'Adaptive LED Lights', 'Air Suspension'],
    images: ['/uploads/vehicles/x5-1.jpg', '/uploads/vehicles/x5-2.jpg', '/uploads/vehicles/x5-3.jpg'],
    videos: ['/uploads/vehicles/x5-video.mp4'],
    is_featured: true,
    is_verified: true,
    is_hot_deal: false,
    engine_size: '3.0L Twin Turbo',
    body_type: 'SUV',
    drive_type: 'AWD',
    doors: 5,
    seats: 7,
    vin: 'WBAJA7C55PCG12345'
  },
  {
    make: 'Lexus',
    model: 'RX 350',
    year: 2022,
    price: 38000000,
    mileage: 18000,
    condition: 'Tokunbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Caviar',
    description: 'Reliable Lexus RX 350 with exceptional build quality, smooth ride, and advanced safety features. Perfect luxury SUV for discerning buyers.',
    features: ['Mark Levinson Audio', 'Lexus Safety System+', 'Wireless Charging', 'Triple-Beam LED Headlights', 'Power Tailgate', 'Heated/Cooled Seats', 'Navigation', 'Blind Spot Monitor'],
    images: ['/uploads/vehicles/rx350-1.jpg', '/uploads/vehicles/rx350-2.jpg', '/uploads/vehicles/rx350-3.jpg'],
    videos: ['/uploads/vehicles/rx350-video.mp4'],
    is_featured: true,
    is_verified: true,
    is_hot_deal: true,
    engine_size: '3.5L V6',
    body_type: 'SUV',
    drive_type: 'AWD',
    doors: 5,
    seats: 5,
    vin: 'JTJBZMCA5N3123456'
  },
  {
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    price: 22000000,
    mileage: 12000,
    condition: 'Tokunbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Platinum White Pearl',
    description: 'Fuel-efficient Honda Accord with spacious interior, advanced safety features, and reliable performance. Great value for money.',
    features: ['Honda Sensing', 'Wireless Apple CarPlay', 'Dual-Zone Climate', 'Remote Start', 'LED Headlights', 'Power Driver Seat', 'Blind Spot Information', 'Collision Mitigation'],
    images: ['/uploads/vehicles/accord-1.jpg', '/uploads/vehicles/accord-2.jpg', '/uploads/vehicles/accord-3.jpg'],
    videos: ['/uploads/vehicles/accord-video.mp4'],
    is_featured: false,
    is_verified: true,
    is_hot_deal: false,
    engine_size: '1.5L Turbo',
    body_type: 'Sedan',
    drive_type: 'FWD',
    doors: 4,
    seats: 5,
    vin: 'JHMCV3F16NC123456'
  },
  {
    make: 'Audi',
    model: 'Q7',
    year: 2022,
    price: 48000000,
    mileage: 22000,
    condition: 'Tokunbo',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    color: 'Glacier White',
    description: 'Premium Audi Q7 with quattro all-wheel drive, luxurious interior, and advanced technology. Perfect for families who demand excellence.',
    features: ['Virtual Cockpit Plus', 'Bang & Olufsen Audio', 'Adaptive Air Suspension', 'Matrix LED Headlights', 'Wireless Charging', 'Panoramic Sunroof', 'Driver Assistance Package', 'Third Row Seating'],
    images: ['/uploads/vehicles/q7-1.jpg', '/uploads/vehicles/q7-2.jpg', '/uploads/vehicles/q7-3.jpg'],
    videos: ['/uploads/vehicles/q7-video.mp4'],
    is_featured: true,
    is_verified: true,
    is_hot_deal: false,
    engine_size: '3.0L TFSI',
    body_type: 'SUV',
    drive_type: 'AWD',
    doors: 5,
    seats: 7,
    vin: 'WA1BVAF77MD123456'
  }
];

async function addSampleVehicles() {
  try {
    // Clear existing vehicles
    await Vehicle.destroy({ where: {} });
    console.log('Cleared existing vehicles');

    // Add new vehicles
    for (const vehicleData of sampleVehicles) {
      const vehicle = await Vehicle.create(vehicleData);
      console.log(`Added ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`);
    }

    console.log('Successfully added all sample vehicles');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample vehicles:', error);
    process.exit(1);
  }
}

addSampleVehicles();
