const { Brand } = require('./models');

const sampleBrands = [
  {
    name: 'BMW',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg'
  },
  {
    name: 'Mercedes-Benz',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg'
  },
  {
    name: 'Toyota',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/toyota.svg'
  },
  {
    name: 'Honda',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/honda.svg'
  },
  {
    name: 'Lexus',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lexus.svg'
  },
  {
    name: 'Audi',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg'
  },
  {
    name: 'Ford',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ford.svg'
  },
  {
    name: 'Nissan',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nissan.svg'
  },
  {
    name: 'Hyundai',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hyundai.svg'
  },
  {
    name: 'Volkswagen',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/volkswagen.svg'
  },
  {
    name: 'Mazda',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mazda.svg'
  },
  {
    name: 'Subaru',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/subaru.svg'
  },
  {
    name: 'Chevrolet',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/chevrolet.svg'
  },
  {
    name: 'Dodge',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/dodge.svg'
  },
  {
    name: 'Jeep',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jeep.svg'
  },
  {
    name: 'Cadillac',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/cadillac.svg'
  },
  {
    name: 'Kia',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kia.svg'
  },
  {
    name: 'Genesis',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/genesis.svg'
  },
  {
    name: 'Ferrari',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ferrari.svg'
  },
  {
    name: 'Lamborghini',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lamborghini.svg'
  },
  {
    name: 'Maserati',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maserati.svg'
  },
  {
    name: 'Rolls-Royce',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/rollsroyce.svg'
  },
  {
    name: 'Bentley',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bentley.svg'
  },
  {
    name: 'Land Rover',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/landrover.svg'
  },
  {
    name: 'Jaguar',
    image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jaguar.svg'
  }
];

const seedBrands = async () => {
  try {
    console.log('🌱 Seeding brands...');
    
    for (const brandData of sampleBrands) {
      const [brand, created] = await Brand.findOrCreate({
        where: { name: brandData.name },
        defaults: brandData
      });
      
      if (created) {
        console.log(`✅ Created brand: ${brand.name}`);
      } else {
        console.log(`⚠️  Brand already exists: ${brand.name}`);
      }
    }
    
    console.log('🎉 Brand seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding brands:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedBrands().then(() => process.exit(0));
}

module.exports = { seedBrands };
