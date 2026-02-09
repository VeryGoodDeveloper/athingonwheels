/**
 * Main data source for vehicle listings
 * Integrates scraper, cache, and mock data fallback
 */

import { Vehicle } from "@/types/vehicle";
import { scrapeVehicles } from "./scraper";
import { readCache, writeCache } from "./cache";
import { mockVehicles } from "./mockData";

/**
 * Fetch vehicles with smart caching and fallback
 * 1. Check cache first (15-minute TTL)
 * 2. Try to scrape fresh data
 * 3. Fall back to mock data if scraping fails
 */
export async function fetchVehicles(options?: {
  forceRefresh?: boolean;
}): Promise<{ vehicles: Vehicle[]; source: string }> {
  try {
    // Skip cache if force refresh requested
    if (!options?.forceRefresh) {
      const cached = await readCache();
      if (cached) {
        console.log(`Using cached data (${cached.source}, ${Math.floor((Date.now() - cached.timestamp) / 1000 / 60)}min old)`);
        return {
          vehicles: cached.vehicles,
          source: `cached:${cached.source}`,
        };
      }
    }

    // Try to scrape fresh data
    console.log("Attempting to scrape jsautohaus.com...");
    const scrapedVehicles = await scrapeVehicles();

    if (scrapedVehicles.length > 0) {
      // Success! Cache the results
      await writeCache(scrapedVehicles, "jsautohaus");
      console.log(`Successfully scraped ${scrapedVehicles.length} vehicles`);
      return {
        vehicles: scrapedVehicles,
        source: "jsautohaus",
      };
    }

    // Scraping returned no results - fall back to mock data
    console.warn("Scraping returned no vehicles, using mock data");
    await writeCache(mockVehicles, "mock");
    return {
      vehicles: mockVehicles,
      source: "mock",
    };
  } catch (error) {
    console.error("Error in fetchVehicles:", error);
    
    // On error, try to use cache even if expired
    const cached = await readCache();
    if (cached) {
      console.log("Using expired cache due to error");
      return {
        vehicles: cached.vehicles,
        source: `stale:${cached.source}`,
      };
    }

    // Last resort: mock data
    console.log("Using mock data as final fallback");
    return {
      vehicles: mockVehicles,
      source: "mock:fallback",
    };
  }
}

/**
 * Fetch a single vehicle by slug
 */
export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { vehicles } = await fetchVehicles();
  return vehicles.find(v => v.slug === slug) || null;
}

/**
 * Get unique makes for filtering
 */
export function getUniqueMakes(vehicles: Vehicle[]): string[] {
  const makes = vehicles.map(v => v.make);
  return Array.from(new Set(makes)).sort();
}

/**
 * Filter vehicles by various criteria
 */
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
  return vehicles.filter(vehicle => {
    if (filters.make && filters.make !== "all" && vehicle.make !== filters.make) {
      return false;
    }
    if (filters.minPrice && vehicle.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && vehicle.price > filters.maxPrice) {
      return false;
    }
    if (filters.minYear && vehicle.year < filters.minYear) {
      return false;
    }
    if (filters.maxYear && vehicle.year > filters.maxYear) {
      return false;
    }
    if (filters.maxMileage && vehicle.mileage > filters.maxMileage) {
      return false;
    }
    if (filters.condition && filters.condition !== "all" && vehicle.condition !== filters.condition) {
      return false;
    }
    return true;
  });
}
