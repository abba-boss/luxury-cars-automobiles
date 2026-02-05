import { api } from '@/lib/api';
import type { ApiResponse, Vehicle, Sale, Customer, Inquiry, Review } from '@/types/api';

export interface StaffReport {
  salesSummary: {
    totalSales: number;
    revenue: number;
    avgOrderValue: number;
    topSellingModels: Array<{ model: string; sales: number }>;
  };
  inventoryStatus: {
    totalVehicles: number;
    available: number;
    sold: number;
    reserved: number;
    topBrands: Array<{ brand: string; count: number }>;
  };
  customerEngagement: {
    inquiries: number;
    reviews: number;
    testDrives: number;
    conversionRate: number;
  };
}

export const staffService = {
  // Vehicle Management
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    make?: string;
    model?: string;
    search?: string;
  }): Promise<ApiResponse<Vehicle[]>> {
    return api.get<ApiResponse<Vehicle[]>>('/staff/vehicles', params);
  },

  async createVehicle(data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Vehicle>> {
    return api.post<ApiResponse<Vehicle>>('/staff/vehicles', data);
  },

  async updateVehicle(id: number, data: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    return api.put<ApiResponse<Vehicle>>(`/staff/vehicles/${id}`, data);
  },

  async updateVehicleStatus(id: number, status: string): Promise<ApiResponse<Vehicle>> {
    return api.put<ApiResponse<Vehicle>>(`/staff/vehicles/${id}/status`, { status });
  },

  async verifyVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    return api.put<ApiResponse<Vehicle>>(`/staff/vehicles/${id}/verify`, {});
  },

  // Order Management
  async getOrders(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Sale[]>> {
    return api.get<ApiResponse<Sale[]>>('/staff/orders', params);
  },

  async updateOrderStatus(id: number, data: { status: string; payment_status?: string }): Promise<ApiResponse<Sale>> {
    return api.put<ApiResponse<Sale>>(`/staff/orders/${id}/status`, data);
  },

  // Customer Management
  async getCustomers(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<Customer[]>> {
    return api.get<ApiResponse<Customer[]>>('/staff/customers', params);
  },

  async updateCustomer(id: number, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return api.put<ApiResponse<Customer>>(`/staff/customers/${id}`, data);
  },

  // Sales Processing
  async processSale(data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Sale>> {
    return api.post<ApiResponse<Sale>>('/staff/sales', data);
  },

  // Inquiry Management
  async getInquiries(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<Inquiry[]>> {
    return api.get<ApiResponse<Inquiry[]>>('/staff/inquiries', params);
  },

  async updateInquiry(id: number, data: Partial<Inquiry>): Promise<ApiResponse<Inquiry>> {
    return api.put<ApiResponse<Inquiry>>(`/staff/inquiries/${id}`, data);
  },

  // Review Management
  async getReviews(params?: { page?: number; limit?: number; status?: string; rating?: number; search?: string }): Promise<ApiResponse<{ data: Review[]; pagination?: any }>> {
    return api.get<ApiResponse<{ data: Review[]; pagination?: any }>>('/staff/reviews', params);
  },

  async updateReviewStatus(id: number, status: string): Promise<ApiResponse<Review>> {
    return api.put<ApiResponse<Review>>(`/staff/reviews/${id}/status`, { status });
  },

  // Reports
  async getReports(): Promise<ApiResponse<StaffReport>> {
    return api.get<ApiResponse<StaffReport>>('/staff/reports');
  }
};