const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to add auth headers to requests
const addAuthHeaders = (headers: Record<string, string> = {}) => {
  const token = getAuthToken();
  return {
    ...headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  color?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
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
  notes?: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  token?: string;
}

export const localDb = {
  vehicles: {
    findMany: async (): Promise<Vehicle[]> => {
      const res = await fetch(`${API_URL}/vehicles`);
      const response = await res.json();
      return response.data || [];
    },

    findById: async (id: number): Promise<Vehicle | undefined> => {
      const res = await fetch(`${API_URL}/vehicles/${id}`);
      const response = await res.json();
      return response.data || null;
    },

    create: async (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> => {
      const res = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    },

    update: async (id: number, data: Partial<Omit<Vehicle, 'id' | 'created_at'>>): Promise<Vehicle> => {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    },

    delete: async (id: number): Promise<boolean> => {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: addAuthHeaders()
      });
      const response = await res.json();
      return response.success || false;
    }
  },

  customers: {
    findMany: async (): Promise<Customer[]> => {
      const res = await fetch(`${API_URL}/customers`);
      const response = await res.json();
      return response.data || [];
    },

    findById: async (id: number): Promise<Customer | undefined> => {
      const res = await fetch(`${API_URL}/customers/${id}`);
      const response = await res.json();
      return response.data || null;
    },

    create: async (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    },

    update: async (id: number, data: Partial<Omit<Customer, 'id' | 'created_at'>>): Promise<Customer> => {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    },

    delete: async (id: number): Promise<boolean> => {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: addAuthHeaders()
      });
      const response = await res.json();
      return response.success || false;
    }
  },

  sales: {
    findMany: async (): Promise<Sale[]> => {
      const res = await fetch(`${API_URL}/sales`);
      const response = await res.json();
      return response.data || [];
    },

    create: async (data: Omit<Sale, 'id' | 'sale_date'>): Promise<Sale> => {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    }
  },

  auth: {
    register: async (email: string, password: string, full_name?: string, phone?: string) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, phone })
      });
      const response: AuthResponse = await res.json();

      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    },

    login: async (email: string, password: string) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const response: AuthResponse = await res.json();

      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    },

    logout: async () => {
      localStorage.removeItem('auth_token');
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: addAuthHeaders()
      });
      return res.json();
    },

    getProfile: async (): Promise<AuthResponse> => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: addAuthHeaders()
      });
      return res.json();
    },

    updateProfile: async (data: Partial<Pick<User, 'full_name' | 'phone'>>) => {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response;
    }
  },

  userProfiles: {
    findMany: async (): Promise<User[]> => {
      const res = await fetch(`${API_URL}/admin/users`, { // Changed to admin users endpoint
        headers: addAuthHeaders()
      });
      const response = await res.json();
      return response.data || [];
    }
  },

  inquiries: {
    findMany: async () => {
      const res = await fetch(`${API_URL}/inquiries`, {
        headers: addAuthHeaders() // Admin access required
      });
      const response = await res.json();
      return response.data || [];
    },

    create: async (data: Omit<any, 'id' | 'created_at'>) => {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    },

    update: async (id: number, data: Partial<{ status: string }>) => {
      const res = await fetch(`${API_URL}/inquiries/${id}`, {
        method: 'PUT',
        headers: addAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return response.data || null;
    }
  }
};
