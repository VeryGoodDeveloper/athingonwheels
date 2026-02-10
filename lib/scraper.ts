/**
 * Browser automation scraper for jsautohaus.com
 * Uses HTML parsing to extract vehicle data from rendered pages
 */

import { Vehicle } from "@/types/vehicle";
import * as cheerio from "cheerio";

const BASE_URL = "https://jsautohaus.com";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Scrape vehicles from jsautohaus.com inventory page
 */
export async function scrapeVehicles(): Promise<Vehicle[]> {
  try {
    console.log("🔍 Starting browser automation scraper...");
    
    // Fetch the inventory page
    const response = await fetch(`${BASE_URL}/inventory`, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch inventory page: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for vehicle cards/listings in the HTML
    // This targets common patterns used by car dealer websites
    const vehicles: Vehicle[] = [];
    
    // Try multiple selectors to find vehicle cards
    const cardSelectors = [
      '.vehicle-card',
      '[data-vehicle]',
      'article[class*="vehicle"]',
      'div[class*="vehicle-item"]',
      'div[class*="car-card"]',
      'a[href*="/shop/"]',
    ];

    let foundElements = false;
    for (const selector of cardSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`✓ Found ${elements.length} elements with selector: ${selector}`);
        foundElements = true;
        
        elements.each((_, element) => {
          const vehicle = extractVehicleFromElement($, element);
          if (vehicle) {
            vehicles.push(vehicle);
          }
        });
        
        if (vehicles.length > 0) break;
      }
    }

    if (!foundElements) {
      console.warn("⚠️ No vehicle elements found with standard selectors");
      console.log("📝 Attempting fallback: extracting from links...");
      
      // Fallback: Look for links to vehicle detail pages
      $('a[href*="/shop/"], a[href*="/cars/"], a[href*="/inventory/"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/')) {
          const slug = href.split('/').filter(Boolean).pop();
          if (slug && slug.length > 5) {
            // Try to extract basic info from link text/attributes
            const text = $(element).text().trim();
            const vehicle = parseVehicleFromText(text, slug);
            if (vehicle) vehicles.push(vehicle);
          }
        }
      });
    }

    // Remove duplicates by slug
    const uniqueVehicles = Array.from(
      new Map(vehicles.map(v => [v.slug, v])).values()
    );

    console.log(`✅ Successfully scraped ${uniqueVehicles.length} vehicles`);
    return uniqueVehicles;

  } catch (error) {
    console.error("❌ Scraping error:", error);
    return [];
  }
}

/**
 * Extract vehicle data from a DOM element
 */
function extractVehicleFromElement($: cheerio.CheerioAPI, element: any): Vehicle | null {
  try {
    const $el = $(element);
    
    // Extract text content
    const text = $el.text();
    const href = $el.attr('href') || $el.find('a').first().attr('href');
    
    // Try to find year, make, model
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0]) : 0;
    
    // Common car makes
    const makes = ['Audi', 'BMW', 'Mercedes', 'Tesla', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 
                   'Nissan', 'Mazda', 'Lexus', 'Porsche', 'Jaguar', 'Land Rover', 'Acura',
                   'Infiniti', 'Cadillac', 'Buick', 'GMC', 'Ram', 'Jeep', 'Dodge', 'Chrysler',
                   'Volkswagen', 'Volvo', 'Subaru', 'Kia', 'Hyundai', 'Genesis', 'Alfa Romeo'];
    
    let make = '';
    let model = '';
    
    for (const testMake of makes) {
      const regex = new RegExp(`\\b${testMake}\\b`, 'i');
      if (regex.test(text)) {
        make = testMake;
        // Try to extract model (usually the word after make)
        const modelMatch = text.match(new RegExp(`${testMake}\\s+([A-Z][A-Za-z0-9\\-]+)`, 'i'));
        if (modelMatch) {
          model = modelMatch[1];
        }
        break;
      }
    }
    
    if (!make || !model || !year) {
      return null;
    }
    
    // Extract price
    const priceMatch = text.match(/\$[\d,]+/);
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/[$,]/g, '')) : 0;
    
    // Extract mileage
    const mileageMatch = text.match(/([\d,]+)\s*(mi|miles|km)/i);
    const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : 0;
    
    // Determine condition
    const isNew = /\bnew\b/i.test(text);
    const condition: "new" | "used" = isNew ? "new" : "used";
    
    // Extract image
    const img = $el.find('img').first();
    const thumbnailUrl = img.attr('src') || img.attr('data-src') || 
                        "https://via.placeholder.com/400x300?text=No+Image";
    
    // Generate slug
    const slug = href ? 
                 href.split('/').filter(Boolean).pop() || generateSlug({ year, make, model }) :
                 generateSlug({ year, make, model });
    
    return {
      id: slug,
      vin: "",
      slug,
      make,
      model,
      year,
      price,
      condition,
      mileage,
      images: [thumbnailUrl],
      thumbnailUrl,
      features: [],
      location: "Ewing, NJ",
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error("Error extracting vehicle from element:", error);
    return null;
  }
}

/**
 * Parse vehicle from text content
 */
function parseVehicleFromText(text: string, slug: string): Vehicle | null {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (!yearMatch) return null;
  
  const year = parseInt(yearMatch[0]);
  
  // Try to extract make and model
  const words = text.split(/\s+/).filter(w => w.length > 2);
  if (words.length < 2) return null;
  
  return {
    id: slug,
    vin: "",
    slug,
    make: words[0],
    model: words[1],
    year,
    price: 0,
    condition: "used",
    mileage: 0,
    images: ["https://via.placeholder.com/400x300?text=No+Image"],
    thumbnailUrl: "https://via.placeholder.com/400x300?text=No+Image",
    features: [],
    location: "Ewing, NJ",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
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
