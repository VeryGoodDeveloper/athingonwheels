/**
 * Scraper for jsautohaus.com using their Algolia search API
 */

import { Vehicle } from "@/types/vehicle";

const ALGOLIA_APP_ID = "G58LKO3ETJ";
const ALGOLIA_API_KEY = "cc3dce06acb2d9fc715bc10c9a624d80";
const ALGOLIA_INDEX = "production-inventory-659"; // dealer_id 659
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

/**
 * Scrape vehicles using Algolia search API
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  try {
    // Try Algolia API (the site uses this for search)
    const algoliaUrl = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`;
    
    const response = await fetch(algoliaUrl, {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key": ALGOLIA_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({
        query: "",
        hitsPerPage: 100,
        filters: "car_condition:New OR car_condition:Used",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Algolia API failed:", response.status);
      return [];
    }

    const data = await response.json();
    
    if (!data.hits || !Array.isArray(data.hits)) {
      console.error("No hits in Algolia response");
      return [];
    }

    console.log(`Scraped ${data.hits.length} vehicles from Algolia`);
    return data.hits.map(parseAlgoliaVehicle).filter((v: Vehicle | null): v is Vehicle => v !== null);
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}

/**
 * Parse Algolia vehicle data
 */
function parseAlgoliaVehicle(hit: any): Vehicle | null {
  try {
    const make = hit.make || "";
    const model = hit.model || "";
    const year = parseInt(hit.make_year || hit.year || "0") || 0;
    
    if (!make || !model || !year) {
      return null;
    }

    const trim = hit.car_trim || hit.trim || undefined;
    const vin = hit.vin || hit.VIN || "";
    const slug = generateSlug({ year, make, model, trim, vin });

    const price = parseFloat(hit.price || hit.dealer_price || "0") || 0;
    const originalPrice = hit.msrp ? parseFloat(hit.msrp) : undefined;
    const mileage = parseInt(hit.odometer || "0") || 0;
    const condition: "new" | "used" = 
      (hit.car_condition || "").toLowerCase() === "new" ? "new" : "used";

    // Extract images
    const images: string[] = [];
    if (hit.images && Array.isArray(hit.images)) {
      images.push(...hit.images.filter((img: any) => typeof img === "string"));
    } else if (hit.image_urls && Array.isArray(hit.image_urls)) {
      images.push(...hit.image_urls.filter((img: any) => typeof img === "string"));
    }
    
    const thumbnailUrl = images[0] || 
      hit.primary_photo ||
      "https://via.placeholder.com/400x300?text=No+Image";

    // Features
    const features: string[] = [];
    if (hit.parsed_features && Array.isArray(hit.parsed_features)) {
      features.push(...hit.parsed_features);
    }

    return {
      id: hit.id || vin || slug,
      vin,
      slug,
      make,
      model,
      year,
      trim,
      price,
      originalPrice,
      condition,
      mileage,
      images: images.length > 0 ? images : [thumbnailUrl],
      thumbnailUrl,
      features,
      description: hit.comments || hit.description || undefined,
      exteriorColor: hit.exterior_color || undefined,
      interiorColor: hit.interior_color || undefined,
      transmission: hit.transmission || undefined,
      fuelType: hit.fuel_type || undefined,
      location: hit.location || "Ewing, NJ",
      status: hit.status === "sold" ? "sold" : "available",
      createdAt: hit.created_at || new Date().toISOString(),
      updatedAt: hit.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error parsing Algolia vehicle:", error);
    return null;
  }
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(data: { year?: any; make?: any; model?: any; trim?: any; vin?: any }): string {
  const parts = [data.year, data.make, data.model, data.trim]
    .filter(Boolean)
    .map(part =>
      String(part)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );

  if (parts.length === 0 && data.vin) {
    return `vehicle-${String(data.vin).toLowerCase().slice(-8)}`;
  }

  return parts.join("-") || `vehicle-${Math.random().toString(36).substring(7)}`;
}
