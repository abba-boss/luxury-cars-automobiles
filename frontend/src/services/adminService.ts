// Re-export from unified services
export * from './index';

// Legacy compatibility - will be removed in future versions
import { 
  vehicleService, 
  adminService as admin, 
  uploadService 
} from './index';

export const adminService = {
  ...admin,
  ...vehicleService,
  uploadMedia: uploadService.uploadVehicleMedia,
  
  // Legacy method names for backward compatibility
  getVehicles: vehicleService.getVehicles,
  getVehicle: vehicleService.getVehicle,
  createVehicle: vehicleService.createVehicle,
  updateVehicle: vehicleService.updateVehicle,
  deleteVehicle: vehicleService.deleteVehicle,
};
