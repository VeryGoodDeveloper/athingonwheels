import { Vehicle } from "@/types/vehicle";

/**
 * Data source for fetching vehicles from jsautohaus.com
 * This will be the main integration point for real data
 */

const DATA_SOURCE_URL = "https://jsautohaus.com";
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

interface CachedData {
  vehicles: Vehicle[];
  timestamp: number;
}

let cache: CachedData | null = null;

/**
 * Fetch vehicles from jsautohaus.com
 * Uses caching to avoid excessive requests
 */
export async function fetchVehicles(): Promise<Vehicle[]> {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.vehicles;
  }

  try {
    // TODO: Implement actual scraping/API integration
    // For now, we'll need to use a server-side scraper
    const response = await fetch(`${DATA_SOURCE_URL}/api/vehicles`, {
      next: { revalidate: 900 }, // Revalidate every 15 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    const data = await response.json();
    const vehicles = parseVehicleData(data);

    // Update cache
    cache = {
      vehicles,
      timestamp: Date.now(),
    };

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    
    // Fallback to mock data if fetch fails
    const { mockVehicles } = await import("./mockData");
    return mockVehicles;
  }
}

/**
 * Parse raw vehicle data into our Vehicle type
 */
function parseVehicleData(data: any): Vehicle[] {
  // TODO: Parse actual jsautohaus.com data structure
  // This will need to be customized based on their actual API/HTML structure
  
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.id || item.vin || Math.random().toString(36).substring(7),
    vin: item.vin || "",
    slug: generateSlug(item),
    make: item.make || "",
    model: item.model || "",
    year: parseInt(item.year) || 0,
    trim: item.trim,
    price: parseFloat(item.price) || 0,
    originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
    condition: item.condition === "new" ? "new" : "used",
    mileage: parseInt(item.mileage) || 0,
    images: Array.isArray(item.images) ? item.images : [],
    thumbnailUrl: item.thumbnailUrl || item.images?.[0] || "",
    features: Array.isArray(item.features) ? item.features : [],
    description: item.description,
    exteriorColor: item.exteriorColor,
    interiorColor: item.interiorColor,
    transmission: item.transmission,
    fuelType: item.fuelType,
    location: item.location || "Ewing, NJ",
    status: item.status || "available",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
}

/**
 * Generate URL-friendly slug from vehicle data
 */
function generateSlug(vehicle: any): string {
  const year = vehicle.year || "";
  const make = vehicle.make || "";
  const model = vehicle.model || "";
  const trim = vehicle.trim || "";
  
  const parts = [year, make, model, trim]
    .filter(Boolean)
    .map(part => part.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  
  return parts.join("-");
}

/**
 * Fetch a single vehicle by slug
 */
export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await fetchVehicles();
  return vehicles.find(v => v.slug === slug) || null;
}

/**
 * Clear the cache (useful for forcing fresh data)
 */
export function clearCache(): void {
  cache = null;
}
