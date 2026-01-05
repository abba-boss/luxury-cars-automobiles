export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  errors?: any[];
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number; // Changed from string to number for consistency
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  condition?: string;
  body_type?: string;
  color?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  features?: string[];
  is_verified?: boolean;
  is_featured?: boolean;
  is_hot_deal?: boolean;
  status?: string;
  brand_id?: number;
  brand?: Brand;
  acceleration?: string;
  top_speed?: string;
  power?: string;
  torque?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  image?: string;
  vehicle_count?: number;
  vehicles?: Vehicle[];
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
  is_verified: boolean;
  status: string;
  brand_id?: number;
  acceleration?: string;
  top_speed?: string;
  power?: string;
  torque?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  vehicle_id: number;
  customer_id: number;
  sale_price: number;
  sale_date: string;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  notes?: string;
}

export interface Inquiry {
  id: number;
  vehicle_id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
  priority?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  token?: string;
}

export interface UploadResponse {
  images: Array<{
    filename: string;
    originalName: string;
    url: string;
    publicId: string;
    size: number;
    format: string;
  }>;
  videos: Array<{
    filename: string;
    originalName: string;
    url: string;
    publicId: string;
    size: number;
    format: string;
    duration?: number;
  }>;
}
