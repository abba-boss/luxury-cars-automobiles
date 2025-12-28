// Legacy compatibility layer - use new services instead
import { 
  vehicleService, 
  customerService, 
  saleService, 
  authService, 
  adminService,
  inquiryService 
} from '@/services';

// Re-export types for backward compatibility
export type { Vehicle, Customer, Sale, User, AuthResponse } from '@/types/api';

// Legacy database interface - redirects to new services
export const localDb = {
  vehicles: {
    findMany: () => vehicleService.getVehicles().then(res => res.data || []),
    findById: (id: number) => vehicleService.getVehicle(id).then(res => res.data),
    create: (data: any) => vehicleService.createVehicle(data).then(res => res.data),
    update: (id: number, data: any) => vehicleService.updateVehicle(id, data).then(res => res.data),
    delete: (id: number) => vehicleService.deleteVehicle(id).then(res => res.success)
  },

  customers: {
    findMany: () => customerService.getCustomers().then(res => res.data || []),
    findById: (id: number) => customerService.getCustomer(id).then(res => res.data),
    create: (data: any) => customerService.createCustomer(data).then(res => res.data),
    update: (id: number, data: any) => customerService.updateCustomer(id, data).then(res => res.data),
    delete: (id: number) => customerService.deleteCustomer(id).then(res => res.success)
  },

  sales: {
    findMany: () => saleService.getSales().then(res => res.data || []),
    create: (data: any) => saleService.createSale(data).then(res => res.data)
  },

  auth: {
    register: authService.register,
    login: authService.login,
    logout: authService.logout,
    getProfile: authService.getProfile,
    updateProfile: authService.updateProfile
  },

  userProfiles: {
    findMany: () => adminService.getUsers().then(res => res.data || [])
  },

  inquiries: {
    findMany: () => inquiryService.getInquiries().then(res => res.data || []),
    create: (data: any) => inquiryService.createInquiry(data).then(res => res.data),
    update: (id: number, data: any) => inquiryService.updateInquiry(id, data).then(res => res.data)
  }
};
