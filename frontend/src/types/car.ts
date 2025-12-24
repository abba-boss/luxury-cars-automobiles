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
  color: string;
  images: string[];
  description: string;
  features: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
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
