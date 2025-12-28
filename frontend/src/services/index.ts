import { api } from '@/lib/api';
import type { 
  ApiResponse, 
  User, 
  Vehicle, 
  Customer, 
  Sale, 
  Inquiry, 
  AuthResponse,
  UploadResponse 
} from '@/types/api';

export const authService = {
  async register(email: string, password: string, full_name: string, phone?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email, password, full_name, phone
    });
    
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email, password
    });
    
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>('/auth/me');
  },

  async updateProfile(data: Partial<Pick<User, 'full_name' | 'phone'>>): Promise<ApiResponse<User>> {
    return api.put<ApiResponse<User>>('/auth/me', data);
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  }
};

export const vehicleService = {
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    make?: string;
    model?: string;
    year_min?: number;
    year_max?: number;
    price_min?: number;
    price_max?: number;
    condition?: string;
    transmission?: string;
    fuel_type?: string;
    status?: string;
    is_featured?: boolean;
    is_hot_deal?: boolean;
  }): Promise<ApiResponse<Vehicle[]>> {
    return api.get<ApiResponse<Vehicle[]>>('/vehicles', params);
  },

  async getVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    return api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
  },

  async createVehicle(data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Vehicle>> {
    return api.post<ApiResponse<Vehicle>>('/vehicles', data);
  },

  async updateVehicle(id: number, data: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    return api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
  },

  async deleteVehicle(id: number): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/vehicles/${id}`);
  }
};

export const customerService = {
  async getCustomers(params?: { page?: number; limit?: number }): Promise<ApiResponse<Customer[]>> {
    return api.get<ApiResponse<Customer[]>>('/customers', params);
  },

  async getCustomer(id: number): Promise<ApiResponse<Customer>> {
    return api.get<ApiResponse<Customer>>(`/customers/${id}`);
  },

  async createCustomer(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Customer>> {
    return api.post<ApiResponse<Customer>>('/customers', data);
  },

  async updateCustomer(id: number, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
  },

  async deleteCustomer(id: number): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/customers/${id}`);
  }
};

export const saleService = {
  async getSales(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Sale[]>> {
    return api.get<ApiResponse<Sale[]>>('/sales', params);
  },

  async getMyOrders(): Promise<ApiResponse<Sale[]>> {
    return api.get<ApiResponse<Sale[]>>('/sales/my-orders');
  },

  async createSale(data: Omit<Sale, 'id' | 'sale_date'>): Promise<ApiResponse<Sale>> {
    return api.post<ApiResponse<Sale>>('/sales', data);
  },

  async updateSale(id: number, data: Partial<Sale>): Promise<ApiResponse<Sale>> {
    return api.put<ApiResponse<Sale>>(`/sales/${id}`, data);
  }
};

export const inquiryService = {
  async getInquiries(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Inquiry[]>> {
    return api.get<ApiResponse<Inquiry[]>>('/inquiries', params);
  },

  async getMyInquiries(): Promise<ApiResponse<Inquiry[]>> {
    return api.get<ApiResponse<Inquiry[]>>('/inquiries/my-inquiries');
  },

  async createInquiry(data: Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Inquiry>> {
    return api.post<ApiResponse<Inquiry>>('/inquiries', data);
  },

  async updateInquiry(id: number, data: Partial<Inquiry>): Promise<ApiResponse<Inquiry>> {
    return api.put<ApiResponse<Inquiry>>(`/inquiries/${id}`, data);
  }
};

export const adminService = {
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>('/admin/dashboard');
  },

  async getUsers(params?: { page?: number; limit?: number; role?: string }): Promise<ApiResponse<User[]>> {
    return api.get<ApiResponse<User[]>>('/admin/users', params);
  },

  async updateUser(id: number, data: { role?: string; status?: string }): Promise<ApiResponse<User>> {
    return api.put<ApiResponse<User>>(`/admin/users/${id}`, data);
  },

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/admin/users/${id}`);
  }
};

export const uploadService = {
  async uploadVehicleMedia(files: { images?: FileList; videos?: FileList }): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    
    if (files.images) {
      Array.from(files.images).forEach(file => {
        formData.append('images', file);
      });
    }
    
    if (files.videos) {
      Array.from(files.videos).forEach(file => {
        formData.append('videos', file);
      });
    }

    return api.upload<ApiResponse<UploadResponse>>('/upload/vehicles', formData);
  }
};
