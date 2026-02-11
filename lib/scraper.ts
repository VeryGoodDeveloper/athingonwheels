/**
 * Real vehicle inventory data from jsautohaus.com
 * Scraped using OpenClaw browser automation
 * Last updated: 2026-02-10
 */

import { Vehicle } from "@/types/vehicle";
import { realInventory } from "./realInventory";

/**
 * Get vehicles from real inventory data
 * This replaces the Puppeteer scraper with pre-scraped data
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  console.log(`✅ Loading ${realInventory.length} vehicles from real inventory`);
  
  // Transform realInventory format to Vehicle format
  const vehicles: Vehicle[] = realInventory.map((v) => {
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
      price: v.price,
      condition: v.condition as "new" | "used",
      mileage: v.mileage,
      bodyType: v.bodyType,
      engine: v.engine,
      transmission: v.transmission,
      drivetrain: v.drivetrain,
      fuelType: v.fuelType,
      exteriorColor: v.exteriorColor,
      interiorColor: v.interiorColor,
      images: v.images || [],
      thumbnailUrl: v.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image",
      features: v.features || [],
      description: v.description,
      location: "Ewing, NJ",
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional fields from real inventory
      stock: v.stock,
      doors: v.doors,
      mpgCity: v.mpgCity,
      mpgHighway: v.mpgHighway,
      carfaxUrl: v.carfaxUrl,
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
