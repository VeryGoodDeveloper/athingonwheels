import { Vehicle } from "@/types/vehicle";

// Mock vehicle data for development
export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vin: "WAUZZZ8V8KA123456",
    slug: "2020-audi-a4-premium",
    make: "Audi",
    model: "A4",
    year: 2020,
    trim: "Premium",
    price: 32999,
    originalPrice: 35999,
    condition: "used",
    mileage: 32500,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    features: [
      "Leather Interior",
      "Sunroof",
      "Navigation System",
      "Backup Camera",
      "Heated Seats",
    ],
    description: "Pristine 2020 Audi A4 Premium with low miles and full service history.",
    exteriorColor: "Black",
    interiorColor: "Black Leather",
    transmission: "Automatic",
    fuelType: "Gasoline",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "2",
    vin: "WBA5A5C59JD123789",
    slug: "2021-bmw-330i",
    make: "BMW",
    model: "330i",
    year: 2021,
    price: 38500,
    condition: "used",
    mileage: 28100,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
    features: [
      "M Sport Package",
      "Premium Sound",
      "Adaptive Cruise Control",
      "Wireless Charging",
    ],
    description: "Stunning BMW 330i with M Sport package. Barely driven, like new condition.",
    exteriorColor: "Alpine White",
    interiorColor: "Black",
    transmission: "Automatic",
    fuelType: "Gasoline",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-02-05T11:00:00Z",
  },
  {
    id: "3",
    vin: "5YJ3E1EA8KF123456",
    slug: "2019-tesla-model-3",
    make: "Tesla",
    model: "Model 3",
    year: 2019,
    trim: "Long Range",
    price: 35000,
    condition: "used",
    mileage: 45200,
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
    features: [
      "Autopilot",
      "Premium Interior",
      "Long Range Battery",
      "Glass Roof",
      "Supercharging Enabled",
    ],
    description: "Tesla Model 3 Long Range with Autopilot. Electric efficiency meets luxury.",
    exteriorColor: "Pearl White",
    interiorColor: "Black & White",
    transmission: "Single Speed",
    fuelType: "Electric",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-02-03T16:45:00Z",
  },
  {
    id: "4",
    vin: "1HGCV1F36JA123456",
    slug: "2018-honda-accord",
    make: "Honda",
    model: "Accord",
    year: 2018,
    trim: "Sport",
    price: 21500,
    condition: "used",
    mileage: 52800,
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
    features: [
      "Sport Package",
      "Apple CarPlay",
      "Lane Keep Assist",
      "Adaptive Cruise",
    ],
    description: "Reliable Honda Accord Sport. Perfect daily driver with excellent fuel economy.",
    exteriorColor: "Modern Steel",
    interiorColor: "Black Cloth",
    transmission: "CVT",
    fuelType: "Gasoline",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-01-25T12:00:00Z",
    updatedAt: "2024-02-07T10:15:00Z",
  },
  {
    id: "5",
    vin: "5UXCR6C09L9D12345",
    slug: "2020-bmw-x5",
    make: "BMW",
    model: "X5",
    year: 2020,
    trim: "xDrive40i",
    price: 52900,
    condition: "used",
    mileage: 38000,
    images: [
      "https://images.unsplash.com/photo-1606016159991-4019eedc2b88?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1606016159991-4019eedc2b88?w=400",
    features: [
      "Premium Package",
      "Panoramic Roof",
      "3rd Row Seating",
      "Harman Kardon Sound",
      "Gesture Control",
    ],
    description: "Luxurious BMW X5 with all the bells and whistles. Premium SUV experience.",
    exteriorColor: "Phytonic Blue",
    interiorColor: "Cognac Leather",
    transmission: "Automatic",
    fuelType: "Gasoline",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-02-01T14:00:00Z",
    updatedAt: "2024-02-08T09:30:00Z",
  },
  {
    id: "6",
    vin: "1G1YY25U185123456",
    slug: "2024-chevrolet-corvette",
    make: "Chevrolet",
    model: "Corvette",
    year: 2024,
    trim: "Stingray",
    price: 72500,
    condition: "new",
    mileage: 150,
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    features: [
      "6.2L V8 Engine",
      "Performance Exhaust",
      "Magnetic Ride Control",
      "Head-Up Display",
      "Bose Premium Audio",
    ],
    description: "Brand new 2024 Corvette Stingray. American muscle meets cutting-edge technology.",
    exteriorColor: "Torch Red",
    interiorColor: "Jet Black",
    transmission: "8-Speed Automatic",
    fuelType: "Gasoline",
    location: "Ewing, NJ",
    status: "available",
    createdAt: "2024-02-05T11:00:00Z",
    updatedAt: "2024-02-09T08:00:00Z",
  },
];

// Helper function to filter vehicles
export function filterVehicles(
  vehicles: Vehicle[],
  filters: {
    make?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    maxMileage?: number;
    condition?: "new" | "used" | "all";
  }
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.make && filters.make !== "all" && vehicle.make !== filters.make) return false;
    if (filters.minPrice && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
    if (filters.minYear && vehicle.year < filters.minYear) return false;
    if (filters.maxYear && vehicle.year > filters.maxYear) return false;
    if (filters.maxMileage && vehicle.mileage > filters.maxMileage) return false;
    if (filters.condition && filters.condition !== "all" && vehicle.condition !== filters.condition) return false;
    return true;
  });
}

// Get unique makes for filter dropdown
export function getUniqueMakes(vehicles: Vehicle[]): string[] {
  const makes = vehicles.map((v) => v.make);
  return Array.from(new Set(makes)).sort();
}
