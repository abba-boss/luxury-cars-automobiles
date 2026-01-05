const { Brand } = require('./models');

const fixProblematicBrands = async () => {
  try {
    console.log('🔧 Fixing problematic brand images...');
    
    // Use simple placeholder or remove image for problematic brands
    await Brand.update(
      { image: null },
      { where: { name: 'Lexus' } }
    );
    console.log('✅ Removed Lexus image (will show placeholder)');
    
    // Test Mercedes URL first
    await Brand.update(
      { image: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg' },
      { where: { name: 'Mercedes-Benz' } }
    );
    console.log('✅ Updated Mercedes-Benz logo');
    
    console.log('🎉 Problematic brands fixed!');
  } catch (error) {
    console.error('❌ Error fixing brands:', error);
  }
};

if (require.main === module) {
  fixProblematicBrands().then(() => process.exit(0));
}

module.exports = { fixProblematicBrands };
