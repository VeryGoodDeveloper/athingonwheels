/**
 * Improved scraper for jsautohaus.com vehicle listings
 * Handles various data sources: API endpoints, embedded JSON, and HTML parsing
 */

import { Vehicle } from "@/types/vehicle";

const BASE_URL = "https://jsautohaus.com";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Main scraping function - tries multiple methods to extract vehicle data
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  try {
    // Method 1: Try to fetch from their API endpoint (if they have one)
    const apiVehicles = await tryApiEndpoint();
    if (apiVehicles.length > 0) {
      console.log(`Scraped ${apiVehicles.length} vehicles from API`);
      return apiVehicles;
    }

    // Method 2: Try to extract embedded JSON from the inventory page
    const embeddedVehicles = await tryEmbeddedJson();
    if (embeddedVehicles.length > 0) {
      console.log(`Scraped ${embeddedVehicles.length} vehicles from embedded JSON`);
      return embeddedVehicles;
    }

    // Method 3: Parse HTML directly (most fragile)
    const htmlVehicles = await tryHtmlParsing();
    if (htmlVehicles.length > 0) {
      console.log(`Scraped ${htmlVehicles.length} vehicles from HTML`);
      return htmlVehicles;
    }

    console.warn("All scraping methods failed - no vehicles found");
    return [];
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}

/**
 * Method 1: Try common API endpoint patterns
 */
async function tryApiEndpoint(): Promise<Vehicle[]> {
  const endpoints = [
    "/api/inventory",
    "/api/vehicles",
    "/inventory.json",
    "/vehicles.json",
    "/api/v1/inventory",
    "/wp-json/inventory/v1/vehicles",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "application/json",
        },
        // Don't cache during scraping
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const vehicles = parseVehicleData(data);
        if (vehicles.length > 0) {
          return vehicles;
        }
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }

  return [];
}

/**
 * Method 2: Look for embedded JSON in the HTML
 */
async function tryEmbeddedJson(): Promise<Vehicle[]> {
  try {
    const response = await fetch(`${BASE_URL}/inventory`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    // Look for common patterns of embedded data
    const patterns = [
      /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/,
      /window\.vehicleData\s*=\s*({[\s\S]*?});/,
      /var\s+inventory\s*=\s*({[\s\S]*?});/,
      /<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/,
      /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        try {
          const jsonStr = match[1];
          const data = JSON.parse(jsonStr);
          const vehicles = parseVehicleData(data);
          if (vehicles.length > 0) {
            return vehicles;
          }
        } catch (e) {
          // Try next pattern
          continue;
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Embedded JSON extraction error:", error);
    return [];
  }
}

/**
 * Method 3: Parse HTML structure
 */
async function tryHtmlParsing(): Promise<Vehicle[]> {
  try {
    const response = await fetch(`${BASE_URL}/inventory`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    // This is a basic parser - would need to be customized based on actual HTML structure
    // Look for structured data in common formats
    const vehicles: Vehicle[] = [];

    // Try to find JSON-LD structured data
    const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        if (data["@type"] === "Car" || data["@type"] === "Vehicle") {
          const vehicle = parseStructuredVehicle(data);
          if (vehicle) vehicles.push(vehicle);
        } else if (Array.isArray(data)) {
          for (const item of data) {
            if (item["@type"] === "Car" || item["@type"] === "Vehicle") {
              const vehicle = parseStructuredVehicle(item);
              if (vehicle) vehicles.push(vehicle);
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    return vehicles;
  } catch (error) {
    console.error("HTML parsing error:", error);
    return [];
  }
}

/**
 * Parse vehicle data from various JSON structures
 */
function parseVehicleData(data: any): Vehicle[] {
  let rawVehicles: any[] = [];

  // Handle different data structures
  if (Array.isArray(data)) {
    rawVehicles = data;
  } else if (data.vehicles && Array.isArray(data.vehicles)) {
    rawVehicles = data.vehicles;
  } else if (data.data && Array.isArray(data.data)) {
    rawVehicles = data.data;
  } else if (data.inventory && Array.isArray(data.inventory)) {
    rawVehicles = data.inventory;
  } else if (data.results && Array.isArray(data.results)) {
    rawVehicles = data.results;
  } else if (data.items && Array.isArray(data.items)) {
    rawVehicles = data.items;
  } else if (data.props?.pageProps?.vehicles) {
    rawVehicles = data.props.pageProps.vehicles;
  } else {
    // Try to find any array in the data
    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        // Check if it looks like vehicle data
        const first = data[key][0];
        if (first && (first.make || first.model || first.vin || first.year)) {
          rawVehicles = data[key];
          break;
        }
      }
    }
  }

  return rawVehicles
    .map(parseVehicle)
    .filter((v): v is Vehicle => v !== null);
}

/**
 * Parse a single vehicle from raw data
 */
function parseVehicle(item: any): Vehicle | null {
  try {
    // Extract basic info with various field name variations
    const make = item.make || item.Make || item.brand || item.Brand || "";
    const model = item.model || item.Model || "";
    const year = parseInt(String(item.year || item.Year || item.modelYear || "0")) || 0;
    
    if (!make || !model || !year) {
      return null; // Invalid vehicle data
    }

    const trim = item.trim || item.Trim || item.trimLevel || undefined;
    const vin = item.vin || item.VIN || item.vinNumber || "";
    
    // Generate slug
    const slug = generateSlug({ year, make, model, trim });

    // Parse price
    const priceStr = String(item.price || item.Price || item.internetPrice || item.salePrice || "0");
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    
    const originalPriceStr = String(item.originalPrice || item.msrp || item.MSRP || "");
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr.replace(/[^0-9.]/g, "")) : undefined;

    // Parse mileage
    const mileageStr = String(item.mileage || item.Mileage || item.odometer || "0");
    const mileage = parseInt(mileageStr.replace(/[^0-9]/g, "")) || 0;

    // Determine condition
    const conditionStr = (item.condition || item.Condition || item.type || "used").toLowerCase();
    const condition: "new" | "used" = conditionStr.includes("new") ? "new" : "used";

    // Extract images
    const images = extractImages(item);
    const thumbnailUrl = item.thumbnailUrl || item.thumbnail || images[0] || 
      "https://via.placeholder.com/400x300?text=No+Image";

    // Extract features
    const features = extractFeatures(item);

    // Other details
    const exteriorColor = item.exteriorColor || item.ExteriorColor || item.color || item.Color || undefined;
    const interiorColor = item.interiorColor || item.InteriorColor || undefined;
    const transmission = item.transmission || item.Transmission || item.trans || undefined;
    const fuelType = item.fuelType || item.FuelType || item.fuel || item.Fuel || undefined;
    const description = item.description || item.Description || item.comments || undefined;

    return {
      id: item.id || vin || slug,
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
      images,
      thumbnailUrl,
      features,
      description,
      exteriorColor,
      interiorColor,
      transmission,
      fuelType,
      location: item.location || "Ewing, NJ",
      status: item.status === "sold" ? "sold" : item.status === "pending" ? "pending" : "available",
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error parsing vehicle:", error);
    return null;
  }
}

/**
 * Parse structured data (JSON-LD) vehicle
 */
function parseStructuredVehicle(data: any): Vehicle | null {
  try {
    const make = data.brand?.name || data.manufacturer || "";
    const model = data.model || data.name || "";
    const year = parseInt(data.modelDate || data.vehicleModelDate || "0") || 0;

    if (!make || !model) return null;

    const slug = generateSlug({ year, make, model });
    const vin = data.vehicleIdentificationNumber || "";
    const price = parseFloat(data.offers?.price || data.price || "0") || 0;
    const mileage = parseInt(data.mileageFromOdometer?.value || "0") || 0;

    return {
      id: vin || slug,
      vin,
      slug,
      make,
      model,
      year,
      price,
      condition: data.itemCondition === "NewCondition" ? "new" : "used",
      mileage,
      images: [data.image].flat().filter(Boolean),
      thumbnailUrl: data.image || "https://via.placeholder.com/400x300?text=No+Image",
      features: [],
      location: "Ewing, NJ",
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extract image URLs from various data structures
 */
function extractImages(item: any): string[] {
  const imageArrays = [
    item.images,
    item.Images,
    item.photos,
    item.Photos,
    item.pictures,
    item.Pictures,
    item.media,
  ];

  for (const arr of imageArrays) {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.map((img: any) => {
        if (typeof img === "string") return img;
        if (img.url) return img.url;
        if (img.src) return img.src;
        if (img.href) return img.href;
        return null;
      }).filter(Boolean);
    }
  }

  // Single image fields
  const singleFields = [item.image, item.Image, item.photo, item.Photo];
  for (const field of singleFields) {
    if (typeof field === "string" && field) {
      return [field];
    }
  }

  return ["https://via.placeholder.com/800x600?text=No+Image"];
}

/**
 * Extract vehicle features/options
 */
function extractFeatures(item: any): string[] {
  const featureArrays = [
    item.features,
    item.Features,
    item.options,
    item.Options,
    item.equipment,
    item.Equipment,
  ];

  for (const arr of featureArrays) {
    if (Array.isArray(arr)) {
      return arr.map(f => typeof f === "string" ? f : f.name || f.label || "").filter(Boolean);
    }
  }

  // Build from boolean flags
  const features: string[] = [];
  const flags = {
    sunroof: "Sunroof",
    navigation: "Navigation System",
    backupCamera: "Backup Camera",
    heatedSeats: "Heated Seats",
    leatherSeats: "Leather Seats",
    bluetooth: "Bluetooth",
    cruiseControl: "Cruise Control",
    allWheelDrive: "All-Wheel Drive",
    parkingSensors: "Parking Sensors",
    remoteStart: "Remote Start",
  };

  for (const [key, label] of Object.entries(flags)) {
    if (item[key] === true || item[key] === "true" || item[key] === "yes") {
      features.push(label);
    }
  }

  return features;
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
