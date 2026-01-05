export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: "Tokunbo" | "Nigerian Used" | "Brand New";
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  bodyType?: string;
  color: string;
  images: string[];
  videos?: string[];
  description: string;
  features: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  status?: string;
  brandId?: number;
  brand?: {
    id: number;
    name: string;
    image?: string;
  };
  createdAt: string;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  models: string[];
  yearRange: [number, number];
  transmission: string[];
  condition: string[];
  mileageRange: [number, number];
}
