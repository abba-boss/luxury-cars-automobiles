const { Brand } = require('./models');

const fixAllBrandImages = async () => {
  try {
    console.log('🔧 Fixing all brand images...');
    
    // Update Tesla with correct URL
    await Brand.update(
      { image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg' },
      { where: { name: 'Tesla' } }
    );
    console.log('✅ Fixed Tesla logo');
    
    // Update Volkswagen (check if it exists)
    await Brand.update(
      { image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/volkswagen.svg' },
      { where: { name: 'Volkswagen' } }
    );
    console.log('✅ Fixed Volkswagen logo');
    
    // Remove test brands with invalid images
    const testBrands = await Brand.findAll({
      where: {
        image: 'https://example.com/logo.png'
      }
    });
    
    for (const brand of testBrands) {
      await brand.destroy();
      console.log(`🗑️  Removed test brand: ${brand.name}`);
    }
    
    console.log('🎉 All brand images fixed!');
  } catch (error) {
    console.error('❌ Error fixing brand images:', error);
  }
};

if (require.main === module) {
  fixAllBrandImages().then(() => process.exit(0));
}

module.exports = { fixAllBrandImages };
