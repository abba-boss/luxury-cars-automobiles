const { Brand } = require('./models');

const updateBrandImages = async () => {
  try {
    console.log('🔄 Updating brand images...');
    
    const updates = [
      { name: 'BMW', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg' },
      { name: 'Mercedes-Benz', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg' },
      { name: 'Toyota', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/toyota.svg' },
      { name: 'Honda', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/honda.svg' },
      { name: 'Lexus', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lexus.svg' },
      { name: 'Audi', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg' },
      { name: 'Ford', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ford.svg' },
      { name: 'Nissan', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nissan.svg' },
      { name: 'Hyundai', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hyundai.svg' },
      { name: 'Volkswagen', image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/volkswagen.svg' }
    ];
    
    for (const update of updates) {
      await Brand.update(
        { image: update.image },
        { where: { name: update.name } }
      );
      console.log(`✅ Updated ${update.name} logo`);
    }
    
    console.log('🎉 Brand image update completed!');
  } catch (error) {
    console.error('❌ Error updating brand images:', error);
  }
};

if (require.main === module) {
  updateBrandImages().then(() => process.exit(0));
}

module.exports = { updateBrandImages };
