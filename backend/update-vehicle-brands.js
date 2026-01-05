const { Vehicle, Brand } = require('./models');

const updateVehicleBrands = async () => {
  try {
    console.log('🔄 Updating vehicle brands...');
    
    // Get all brands
    const brands = await Brand.findAll();
    const brandMap = {};
    brands.forEach(brand => {
      brandMap[brand.name.toLowerCase()] = brand.id;
    });
    
    // Get all vehicles
    const vehicles = await Vehicle.findAll();
    
    for (const vehicle of vehicles) {
      const make = vehicle.make.toLowerCase();
      let brandId = null;
      
      // Map vehicle makes to brands
      if (make.includes('bmw')) brandId = brandMap['bmw'];
      else if (make.includes('mercedes')) brandId = brandMap['mercedes-benz'];
      else if (make.includes('toyota')) brandId = brandMap['toyota'];
      else if (make.includes('honda')) brandId = brandMap['honda'];
      else if (make.includes('lexus')) brandId = brandMap['lexus'];
      else if (make.includes('audi')) brandId = brandMap['audi'];
      else if (make.includes('ford')) brandId = brandMap['ford'];
      else if (make.includes('nissan')) brandId = brandMap['nissan'];
      else if (make.includes('hyundai')) brandId = brandMap['hyundai'];
      else if (make.includes('volkswagen')) brandId = brandMap['volkswagen'];
      
      if (brandId) {
        await vehicle.update({ brand_id: brandId });
        console.log(`✅ Updated ${vehicle.make} ${vehicle.model} with brand ID ${brandId}`);
      } else {
        console.log(`⚠️  No brand found for ${vehicle.make}`);
      }
    }
    
    console.log('🎉 Vehicle brand update completed!');
  } catch (error) {
    console.error('❌ Error updating vehicle brands:', error);
  }
};

// Run if called directly
if (require.main === module) {
  updateVehicleBrands().then(() => process.exit(0));
}

module.exports = { updateVehicleBrands };
