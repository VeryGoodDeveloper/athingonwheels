/**
 * Real vehicle inventory data from jsautohaus.com
 * Scraped using OpenClaw browser automation
 * Last updated: 2026-02-12 (100 vehicles)
 */

import { Vehicle } from "@/types/vehicle";
import scrapedData from "./scrapedInventory.json";

/**
 * Get vehicles from scraped inventory data
 * 100 vehicles with complete data (images, specs, descriptions)
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  console.log(`✅ Loading ${scrapedData.count} vehicles from scraped inventory`);
  
  // Transform scraped format to Vehicle format
  const vehicles: Vehicle[] = scrapedData.vehicles.map((v: any) => {
    const slug = generateSlug({
      year: v.year,
      make: v.make,
      model: v.model,
      trim: v.trim,
    });
    
    return {
      id: v.id || v.vin,
      vin: v.vin,
      slug,
      make: v.make,
      model: v.model,
      year: v.year,
      trim: v.trim,
      price: v.price || 0, // Some prices not scraped, default to 0
      condition: "used", // All from jsautohaus are used
      mileage: v.mileage,
      bodyType: v.specs?.bodyType || "Sedan",
      engine: v.specs?.engine || "Unknown",
      transmission: v.specs?.transmission || "Automatic",
      drivetrain: v.specs?.drivetrain || "FWD",
      fuelType: v.specs?.engine?.toLowerCase().includes("electric") ? "Electric" : "Gasoline",
      exteriorColor: "Various", // Not scraped
      interiorColor: "Various", // Not scraped
      images: v.images || [],
      thumbnailUrl: v.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image",
      features: [], // Not scraped
      description: v.description || `${v.year} ${v.make} ${v.model} ${v.trim}`,
      location: "Ewing, NJ",
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional fields from scraped inventory
      stock: v.stock,
      doors: v.specs?.doors || 4,
      mpgCity: v.specs?.mpgCity,
      mpgHighway: v.specs?.mpgHighway,
      carfaxUrl: v.carfaxUrl,
      detailUrl: v.detailUrl,
    };
  });
  
  return vehicles;
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(data: { year?: any; make?: any; model?: any; trim?: any }): string {
  const parts = [data.year, data.make, data.model, data.trim]
    .filter(Boolean)
    .map(part =>
      String(part)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );

  return parts.join("-") || `vehicle-${Math.random().toString(36).substring(7)}`;
}
