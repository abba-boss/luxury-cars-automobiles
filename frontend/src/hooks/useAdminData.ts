import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/supabase/client';
import type { Vehicle, Customer, Sale, User } from '@/lib/database';

export type Car = Vehicle;
export type Profile = User; // Changed from Customer to User for proper user profiles

// Define an Inquiry type that matches what the AdminDashboard expects
export interface Inquiry {
  id: number;
  name: string;
  message: string;
  status: 'pending' | 'resolved' | 'in-progress';
  created_at: string;
}

// Fetch all vehicles (for admin)
export const useAdminCars = () => {
  return useQuery({
    queryKey: ['admin-cars'],
    queryFn: async () => {
      return await localDb.vehicles.findMany();
    },
  });
};

// Fetch all user profiles (for admin)
export const useAdminProfiles = () => {
  return useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      return await localDb.userProfiles.findMany(); // Changed to use user profiles
    },
  });
};

// Fetch all inquiries (messages/contact forms)
export const useAdminInquiries = () => {
  return useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      return await localDb.inquiries.findMany();
    },
  });
};

// Fetch user roles (still mock for now, but can be extended)
export const useAdminUserRoles = () => {
  return useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      // In a real implementation, this would fetch from an API
      return [];
    },
  });
};

// Fetch favorites count (mock for local database)
export const useAdminFavorites = () => {
  return useQuery({
    queryKey: ['admin-favorites'],
    queryFn: async () => {
      // In a real implementation, this would fetch from an API
      return {};
    },
  });
};

// Dashboard stats
export const useAdminDashboardStats = () => {
  const { data: cars = [], isLoading: carsLoading } = useAdminCars();
  const { data: profiles = [], isLoading: profilesLoading } = useAdminProfiles();
  const { data: inquiries = [], isLoading: inquiriesLoading } = useAdminInquiries();

  const isLoading = carsLoading || profilesLoading || inquiriesLoading;

  // Calculate various stats
  const publishedCars = cars.filter(car => car.is_published).length;
  const featuredCars = cars.filter(car => car.is_featured).length;
  const newArrivals = cars.filter(car => car.is_new_arrival).length;
  const soldCars = cars.filter(car => car.is_sold).length;
  const pendingInquiries = inquiries.filter(inquiry => inquiry.status === 'pending').length;

  const stats = {
    totalCars: cars.length,
    totalUsers: profiles.length,
    totalInquiries: inquiries.length,
    publishedCars,
    featuredCars,
    newArrivals,
    soldCars,
    pendingInquiries,
  };

  return {
    stats,
    categoryData: [], // Will be populated with actual data in a real implementation
    brandData: [], // Will be populated with actual data in a real implementation
    recentCars: cars.slice(0, 5),
    recentInquiries: inquiries.slice(0, 5),
    isLoading,
  };
};
