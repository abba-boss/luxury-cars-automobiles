import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";
import { Car } from "@/types/car";

export const featuredCars: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 18500000,
    mileage: 25000,
    condition: "Tokunbo",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "White",
    images: [car1],
    description: "Well-maintained Toyota Camry with full service history.",
    features: ["Leather Seats", "Sunroof", "Backup Camera", "Bluetooth"],
    isVerified: true,
    isFeatured: true,
    isHotDeal: false,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    make: "Lexus",
    model: "RX 350",
    year: 2021,
    price: 32000000,
    mileage: 35000,
    condition: "Tokunbo",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "Black",
    images: [car2],
    description: "Luxury Lexus RX 350 in excellent condition.",
    features: ["Navigation", "Premium Sound", "Heated Seats", "360 Camera"],
    isVerified: true,
    isFeatured: true,
    isHotDeal: true,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2020,
    price: 28500000,
    mileage: 45000,
    condition: "Tokunbo",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "Silver",
    images: [car3],
    description: "Elegant Mercedes E-Class with premium features.",
    features: ["Ambient Lighting", "Apple CarPlay", "Lane Assist", "Panoramic Roof"],
    isVerified: true,
    isFeatured: true,
    isHotDeal: false,
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    make: "Toyota",
    model: "Highlander",
    year: 2023,
    price: 42000000,
    mileage: 8000,
    condition: "Brand New",
    transmission: "Automatic",
    fuelType: "Hybrid",
    color: "Red",
    images: [car4],
    description: "Brand new Toyota Highlander Hybrid with warranty.",
    features: ["Third Row", "Wireless Charging", "JBL Audio", "AWD"],
    isVerified: true,
    isFeatured: false,
    isHotDeal: true,
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    make: "Honda",
    model: "Accord",
    year: 2019,
    price: 14500000,
    mileage: 55000,
    condition: "Nigerian Used",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "Blue",
    images: [car5],
    description: "Clean Honda Accord with low mileage for its year.",
    features: ["Honda Sensing", "Leather Interior", "Push Start", "Cruise Control"],
    isVerified: true,
    isFeatured: false,
    isHotDeal: false,
    createdAt: "2024-01-12",
  },
  {
    id: "6",
    make: "Range Rover",
    model: "Sport",
    year: 2022,
    price: 85000000,
    mileage: 15000,
    condition: "Tokunbo",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "White",
    images: [car6],
    description: "Stunning Range Rover Sport in pristine condition.",
    features: ["Terrain Response", "Meridian Sound", "Air Suspension", "Massage Seats"],
    isVerified: true,
    isFeatured: true,
    isHotDeal: false,
    createdAt: "2024-01-18",
  },
];

export const brands = [
  "Toyota", "Lexus", "Mercedes-Benz", "BMW", "Audi", "Honda", "Range Rover", 
  "Porsche", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Volkswagen", 
  "Jeep", "Mazda", "Infiniti", "Acura", "Volvo", "Jaguar", "Bentley", 
  "Ferrari", "Lamborghini", "Tesla"
];
export const conditions = ["Tokunbo", "Nigerian Used", "Brand New"];
export const transmissions = ["Automatic", "Manual"];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("en-NG").format(mileage) + " km";
};
