#!/usr/bin/env node

/**
 * Remove duplicate vehicles from inventory
 * 
 * Strategy:
 * - Keep the vehicle with more complete data (more images, non-zero price, etc.)
 * - If tied, keep the first occurrence
 * - Create backup before modifying
 */

const fs = require('fs');

const INVENTORY_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json';
const BACKUP_FILE = INVENTORY_FILE.replace('.json', '.before-dedup.json');

console.log('Removing duplicates from inventory...\n');

// Backup
const originalData = fs.readFileSync(INVENTORY_FILE, 'utf-8');
fs.writeFileSync(BACKUP_FILE, originalData);
console.log(`✓ Backup created: ${BACKUP_FILE}\n`);

const inventory = JSON.parse(originalData);
const originalCount = inventory.count;

console.log(`Original count: ${originalCount} vehicles\n`);

// Score vehicles by data completeness
function scoreVehicle(v) {
  let score = 0;
  if (v.price > 0) score += 10;
  if (v.images && v.images.length > 0) score += v.images.length;
  if (v.description) score += 5;
  if (v.carfaxUrl) score += 3;
  if (v.specs && Object.keys(v.specs).length > 0) score += 2;
  return score;
}

// Deduplicate by VIN
const vinMap = new Map();
let vinDuplicates = 0;

inventory.vehicles.forEach(vehicle => {
  if (!vehicle.vin) return;
  
  if (vinMap.has(vehicle.vin)) {
    const existing = vinMap.get(vehicle.vin);
    const existingScore = scoreVehicle(existing);
    const newScore = scoreVehicle(vehicle);
    
    if (newScore > existingScore) {
      vinMap.set(vehicle.vin, vehicle);
      console.log(`Replacing VIN ${vehicle.vin} (better data)`);
    } else {
      vinDuplicates++;
    }
  } else {
    vinMap.set(vehicle.vin, vehicle);
  }
});

// Deduplicate by URL (for vehicles without VIN)
const urlMap = new Map();
let urlDuplicates = 0;

inventory.vehicles.forEach(vehicle => {
  const url = vehicle.sourceUrl || vehicle.detailUrl || vehicle.url;
  if (!url || vehicle.vin) return; // Skip if has VIN (already handled)
  
  if (urlMap.has(url)) {
    const existing = urlMap.get(url);
    const existingScore = scoreVehicle(existing);
    const newScore = scoreVehicle(vehicle);
    
    if (newScore > existingScore) {
      urlMap.set(url, vehicle);
      console.log(`Replacing URL ${url} (better data)`);
    } else {
      urlDuplicates++;
    }
  } else {
    urlMap.set(url, vehicle);
  }
});

// Combine deduplicated vehicles
const uniqueVehicles = [
  ...Array.from(vinMap.values()),
  ...Array.from(urlMap.values())
];

// Remove any remaining duplicates (edge case: same vehicle with both VIN and URL entries)
const finalMap = new Map();
uniqueVehicles.forEach(vehicle => {
  const key = vehicle.vin || vehicle.sourceUrl || vehicle.detailUrl || vehicle.url || vehicle.id;
  if (!finalMap.has(key)) {
    finalMap.set(key, vehicle);
  }
});

const dedupedVehicles = Array.from(finalMap.values());

// Update inventory
inventory.vehicles = dedupedVehicles;
inventory.count = dedupedVehicles.length;
inventory.scrapedAt = new Date().toISOString();

// Save
fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));

console.log('\n=== DEDUPLICATION COMPLETE ===');
console.log(`Original count: ${originalCount}`);
console.log(`VIN duplicates removed: ${vinDuplicates}`);
console.log(`URL duplicates removed: ${urlDuplicates}`);
console.log(`Final count: ${inventory.count}`);
console.log(`Total removed: ${originalCount - inventory.count}`);
console.log(`\n✓ Saved to: ${INVENTORY_FILE}`);
console.log(`✓ Backup at: ${BACKUP_FILE}`);
