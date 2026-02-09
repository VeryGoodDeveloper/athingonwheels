/**
 * Simple file-based cache for vehicle data
 * Prevents excessive scraping of jsautohaus.com
 */

import { promises as fs } from "fs";
import path from "path";
import { Vehicle } from "@/types/vehicle";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "vehicles.json");
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

interface CacheData {
  vehicles: Vehicle[];
  timestamp: number;
  source: string;
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create cache directory:", error);
  }
}

/**
 * Read cached vehicle data
 */
export async function readCache(): Promise<CacheData | null> {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    const cached: CacheData = JSON.parse(data);
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    
    return null; // Cache expired
  } catch (error) {
    // Cache file doesn't exist or is invalid
    return null;
  }
}

/**
 * Write vehicle data to cache
 */
export async function writeCache(vehicles: Vehicle[], source: string): Promise<void> {
  try {
    await ensureCacheDir();
    const cacheData: CacheData = {
      vehicles,
      timestamp: Date.now(),
      source,
    };
    
    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write cache:", error);
  }
}

/**
 * Clear the cache
 */
export async function clearCache(): Promise<void> {
  try {
    await fs.unlink(CACHE_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
}

/**
 * Get cache age in minutes
 */
export async function getCacheAge(): Promise<number | null> {
  const cached = await readCache();
  if (!cached) return null;
  
  return Math.floor((Date.now() - cached.timestamp) / 1000 / 60);
}
