import { NextResponse } from "next/server";
import { scrapeVehicles } from "@/lib/scraper";
import { mockVehicles } from "@/lib/mockData";

// Cache duration in seconds
const CACHE_DURATION = 900; // 15 minutes

export const revalidate = CACHE_DURATION;

/**
 * GET /api/vehicles
 * Returns list of all vehicles
 */
export async function GET(request: Request) {
  try {
    // Try to fetch real data
    const vehicles = await scrapeVehicles();

    // If scraping returns empty, use mock data
    if (vehicles.length === 0) {
      console.log("Scraping returned no vehicles, using mock data");
      return NextResponse.json({
        vehicles: mockVehicles,
        source: "mock",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      vehicles,
      source: "jsautohaus",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API error:", error);
    
    // Fallback to mock data on error
    return NextResponse.json({
      vehicles: mockVehicles,
      source: "mock",
      error: "Failed to fetch live data",
      timestamp: new Date().toISOString(),
    });
  }
}
