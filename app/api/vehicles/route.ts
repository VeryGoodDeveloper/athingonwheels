import { NextResponse } from "next/server";
import { fetchVehicles } from "@/lib/dataSource";

// Revalidate every 15 minutes
export const revalidate = 900;

/**
 * GET /api/vehicles
 * Returns list of all vehicles from integrated data source
 */
export async function GET(request: Request) {
  try {
    // Check for force refresh query param
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const { vehicles, source } = await fetchVehicles({ forceRefresh });

    return NextResponse.json({
      success: true,
      vehicles,
      count: vehicles.length,
      source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vehicles",
        vehicles: [],
        count: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
