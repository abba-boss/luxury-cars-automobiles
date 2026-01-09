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

export interface Review {
  id: number;
  user_id: number;
  vehicle_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
  };
}

export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  booking_date: string;
  booking_time: string;
  type: 'test_drive' | 'inspection' | 'consultation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    images: string[];
  };
}

export interface Favorite {
  id: number;
  user_id: number;
  vehicle_id: number;
  created_at: string;
  updated_at: string;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    status: string;
  };
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

export interface Payment {
  id: number;
  sale_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  sale: {
    id: number;
    vehicle: {
      id: number;
      make: string;
      model: string;
      year: number;
    };
  };
}

export interface FinancingApplication {
  id: number;
  user_id: number;
  vehicle_id: number;
  loan_amount: number;
  down_payment: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  credit_score: number;
  employment_status: string;
  annual_income: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
  };
}

export interface CartItem {
  id: number;
  cart_id: number;
  vehicle_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    status: string;
  };
}

export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartData {
  cart: Cart;
  items: CartItem[];
  totals: {
    subtotal: number;
    itemCount: number;
  };
}
