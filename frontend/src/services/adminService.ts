const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  body_type?: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  videos: string[];
  is_verified: boolean;
  is_featured: boolean;
  is_hot_deal: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  body_type?: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  videos: string[];
  is_featured: boolean;
  is_hot_deal: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UploadResponse {
  images: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
  }>;
  videos: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
  }>;
}

class AdminService {
  // Vehicle Management
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<Vehicle[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_URL}/vehicles?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  async getVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  async createVehicle(data: CreateVehicleData): Promise<ApiResponse<Vehicle>> {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateVehicle(id: number, data: Partial<CreateVehicleData>): Promise<ApiResponse<Vehicle>> {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteVehicle(id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }

  // Media Upload
  async uploadMedia(files: { images?: FileList; videos?: FileList }): Promise<ApiResponse<UploadResponse>> {
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

    const response = await fetch(`${API_URL}/upload/vehicles`, {
      method: 'POST',
      headers: getAuthHeadersForUpload(),
      body: formData
    });
    return response.json();
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  // User Management
  async getUsers(params?: { page?: number; limit?: number; role?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);

    const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  async updateUser(id: number, data: { role?: string; status?: string }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }

  // Inquiries Management
  async getInquiries(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_URL}/inquiries?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  async updateInquiry(id: number, data: { status?: string; priority?: string }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/inquiries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Sales Management
  async getSales(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_URL}/sales?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }

  async updateSale(id: number, data: { status?: string; payment_status?: string }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const adminService = new AdminService();
