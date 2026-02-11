// Vehicle data types based on jsautohaus.com analysis

export interface Vehicle {
  id: string;
  vin: string;
  slug: string; // URL-friendly: "2020-audi-a4-premium"
  
  // Basic Info
  make: string;
  model: string;
  year: number;
  trim?: string;
  
  // Pricing
  price: number;
  originalPrice?: number; // For showing discounts
  
  // Condition
  condition: "new" | "used";
  mileage: number;
  
  // Media
  images: string[];
  thumbnailUrl: string;
  
  // Details
  features: string[];
  description?: string;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  engine?: string;
  drivetrain?: string;
  doors?: number;
  mpgCity?: number;
  mpgHighway?: number;
  stock?: string;
  carfaxUrl?: string;
  detailUrl?: string;
  
  // Metadata
  location: string;
  status: "available" | "sold" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilter {
  make?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  condition?: ("new" | "used")[];
}

export interface SellTradeFormData {
  // Vehicle Info (VIN lookup OR manual)
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  
  // Owner Info
  ownerName: string;
  email: string;
  phone: string;
  
  // Additional
  comments?: string;
  tradeIn: boolean; // Trade-in vs straight sale
}
