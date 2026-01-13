import { api } from '@/lib/api';
import type { ApiResponse } from '@/types/api';

interface ProductSearchQuery {
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  bodyType?: string;
  fuelType?: string;
  keyword?: string;
}

export interface ExternalProduct {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  body_type: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  videos?: string[];
  source: string;
  sourceUrl: string;
}

export const productSearchService = {
  async searchExternalProducts(query: ProductSearchQuery): Promise<ApiResponse<ExternalProduct[]>> {
    // Call the backend API to search for external products
    const queryParams = new URLSearchParams();
    
    if (query.make) queryParams.append('make', query.make);
    if (query.model) queryParams.append('model', query.model);
    if (query.year) queryParams.append('year', query.year.toString());
    if (query.minPrice) queryParams.append('minPrice', query.minPrice.toString());
    if (query.maxPrice) queryParams.append('maxPrice', query.maxPrice.toString());
    if (query.bodyType) queryParams.append('bodyType', query.bodyType);
    if (query.fuelType) queryParams.append('fuelType', query.fuelType);
    if (query.keyword) queryParams.append('keyword', query.keyword);
    
    const queryString = queryParams.toString();
    const url = `/admin/products/search${queryString ? '?' + queryString : ''}`;
    
    return api.get<ApiResponse<ExternalProduct[]>>(url);
  },
  
  async getExternalProductDetails(productId: string): Promise<ApiResponse<ExternalProduct>> {
    // Call the backend API to get details for a specific external product
    return api.get<ApiResponse<ExternalProduct>>(`/admin/products/details/${productId}`);
  }
};