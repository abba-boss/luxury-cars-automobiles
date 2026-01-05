const { Brand } = require('./models');

const cleanupBrands = async () => {
  try {
    console.log('🧹 Cleaning up duplicate and invalid brands...');
    
    // Remove duplicate VW entries
    const vwBrands = await Brand.findAll({
      where: {
        name: ['vw', 'VW']
      }
    });
    
    for (const brand of vwBrands) {
      await brand.destroy();
      console.log(`🗑️  Removed duplicate: ${brand.name}`);
    }
    
    // Ensure Volkswagen has correct image
    await Brand.update(
      { image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/volkswagen.svg' },
      { where: { name: 'Volkswagen' } }
    );
    console.log('✅ Fixed Volkswagen logo');
    
    console.log('🎉 Brand cleanup completed!');
  } catch (error) {
    console.error('❌ Error cleaning up brands:', error);
  }
};

if (require.main === module) {
  cleanupBrands().then(() => process.exit(0));
}

module.exports = { cleanupBrands };
