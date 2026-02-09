/**
 * Server-side scraper for jsautohaus.com
 * This runs on the server to fetch vehicle data
 */

import { Vehicle } from "@/types/vehicle";

const BASE_URL = "https://jsautohaus.com";

/**
 * Scrape vehicle data from jsautohaus.com
 * This will need to be customized based on their actual HTML structure
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  try {
    // Fetch the inventory page
    const response = await fetch(`${BASE_URL}/inventory`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ATOW/1.0; +https://athingonwheels.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inventory: ${response.statusText}`);
    }

    const html = await response.text();

    // Try to extract vehicle data from the HTML
    // Option 1: Look for JSON data embedded in the page
    const jsonMatch = html.match(/<script[^>]*>\s*(?:window\.__INITIAL_STATE__|window\.vehicleData)\s*=\s*({[\s\S]*?})\s*<\/script>/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        return parseVehicleData(data);
      } catch (e) {
        console.error("Failed to parse embedded JSON:", e);
      }
    }

    // Option 2: Look for a data API endpoint
    // Many sites expose their data via /api/ endpoints
    const apiResponse = await fetch(`${BASE_URL}/api/inventory`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ATOW/1.0; +https://athingonwheels.com)",
      },
    }).catch(() => null);

    if (apiResponse?.ok) {
      const data = await apiResponse.json();
      return parseVehicleData(data);
    }

    // Option 3: Parse HTML directly (more fragile)
    // This would require cheerio or similar library
    console.warn("Could not find vehicle data, falling back to mock data");
    
    return [];
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}

/**
 * Parse vehicle data from various formats
 */
function parseVehicleData(data: any): Vehicle[] {
  let vehicles: any[] = [];

  // Handle different data structures
  if (Array.isArray(data)) {
    vehicles = data;
  } else if (data.vehicles && Array.isArray(data.vehicles)) {
    vehicles = data.vehicles;
  } else if (data.data && Array.isArray(data.data)) {
    vehicles = data.data;
  } else if (data.inventory && Array.isArray(data.inventory)) {
    vehicles = data.inventory;
  } else {
    console.warn("Unknown data structure:", Object.keys(data));
    return [];
  }

  return vehicles.map((item: any) => {
    const slug = generateSlug({
      year: item.year,
      make: item.make,
      model: item.model,
      trim: item.trim,
    });

    return {
      id: item.id || item.vin || slug,
      vin: item.vin || item.VIN || "",
      slug,
      make: item.make || item.Make || "",
      model: item.model || item.Model || "",
      year: parseInt(item.year || item.Year) || 0,
      trim: item.trim || item.Trim || undefined,
      price: parseFloat(String(item.price || item.Price || "0").replace(/[^0-9.]/g, "")) || 0,
      originalPrice: item.originalPrice || item.msrp ? parseFloat(String(item.originalPrice || item.msrp).replace(/[^0-9.]/g, "")) : undefined,
      condition: (item.condition || item.Condition || "used").toLowerCase() === "new" ? "new" : "used",
      mileage: parseInt(String(item.mileage || item.Mileage || "0").replace(/[^0-9]/g, "")) || 0,
      images: extractImages(item),
      thumbnailUrl: extractThumbnail(item),
      features: extractFeatures(item),
      description: item.description || item.Description || undefined,
      exteriorColor: item.exteriorColor || item.ExteriorColor || item.color || undefined,
      interiorColor: item.interiorColor || item.InteriorColor || undefined,
      transmission: item.transmission || item.Transmission || undefined,
      fuelType: item.fuelType || item.FuelType || item.fuel || undefined,
      location: item.location || "Ewing, NJ",
      status: item.status === "sold" ? "sold" : item.status === "pending" ? "pending" : "available",
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    };
  }).filter((v: Vehicle) => v.make && v.model && v.year && v.price > 0);
}

/**
 * Extract image URLs from various data structures
 */
function extractImages(item: any): string[] {
  if (Array.isArray(item.images)) return item.images;
  if (Array.isArray(item.Images)) return item.Images;
  if (Array.isArray(item.photos)) return item.photos;
  if (Array.isArray(item.Photos)) return item.Photos;
  if (item.image) return [item.image];
  if (item.Image) return [item.Image];
  if (item.photo) return [item.photo];
  if (item.Photo) return [item.Photo];
  
  // Look for image URLs in object values
  const imageUrls: string[] = [];
  for (const key in item) {
    if (typeof item[key] === "string" && /\.(jpg|jpeg|png|webp)/i.test(item[key])) {
      imageUrls.push(item[key]);
    }
  }
  
  return imageUrls.length > 0 ? imageUrls : ["https://via.placeholder.com/800x600?text=No+Image"];
}

/**
 * Extract thumbnail URL
 */
function extractThumbnail(item: any): string {
  const images = extractImages(item);
  return item.thumbnailUrl || item.thumbnail || images[0] || "https://via.placeholder.com/400x300?text=No+Image";
}

/**
 * Extract vehicle features
 */
function extractFeatures(item: any): string[] {
  if (Array.isArray(item.features)) return item.features;
  if (Array.isArray(item.Features)) return item.Features;
  if (Array.isArray(item.options)) return item.options;
  if (Array.isArray(item.Options)) return item.Options;
  
  // Build features from known fields
  const features: string[] = [];
  
  if (item.sunroof || item.Sunroof) features.push("Sunroof");
  if (item.navigation || item.Navigation) features.push("Navigation System");
  if (item.backupCamera || item.BackupCamera) features.push("Backup Camera");
  if (item.heatedSeats || item.HeatedSeats) features.push("Heated Seats");
  if (item.leatherSeats || item.LeatherSeats) features.push("Leather Seats");
  if (item.bluetooth || item.Bluetooth) features.push("Bluetooth");
  if (item.cruiseControl || item.CruiseControl) features.push("Cruise Control");
  
  return features;
}

/**
 * Generate URL slug
 */
function generateSlug(data: { year?: any; make?: any; model?: any; trim?: any }): string {
  const parts = [
    data.year,
    data.make,
    data.model,
    data.trim,
  ]
    .filter(Boolean)
    .map(part =>
      String(part)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );

  return parts.join("-") || Math.random().toString(36).substring(7);
}
