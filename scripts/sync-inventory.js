#!/usr/bin/env node

/**
 * Sync inventory with source site
 * 
 * Functions:
 * 1. Detect duplicates (same VIN or same URL)
 * 2. Mark vehicles no longer on source as inactive
 * 3. Identify new vehicles to scrape
 * 4. Generate sync report
 */

const fs = require('fs');

const INVENTORY_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json';
const SOURCE_URLS_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/scripts/all-vehicle-urls.txt';
const REPORT_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/SYNC_REPORT.md';

console.log('Starting inventory sync...\n');

// Load data
const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
const sourceUrls = new Set(
  fs.readFileSync(SOURCE_URLS_FILE, 'utf-8')
    .trim()
    .split('\n')
    .map(url => url.trim())
);

console.log(`Loaded ${inventory.count} vehicles from inventory`);
console.log(`Loaded ${sourceUrls.size} URLs from source site\n`);

// 1. Detect duplicates
const vinMap = new Map();
const urlMap = new Map();
const duplicates = [];

inventory.vehicles.forEach((vehicle, index) => {
  // Check VIN duplicates
  if (vehicle.vin) {
    if (vinMap.has(vehicle.vin)) {
      duplicates.push({
        type: 'VIN',
        vin: vehicle.vin,
        indices: [vinMap.get(vehicle.vin), index],
        vehicles: [
          inventory.vehicles[vinMap.get(vehicle.vin)],
          vehicle
        ]
      });
    } else {
      vinMap.set(vehicle.vin, index);
    }
  }
  
  // Check URL duplicates
  const url = vehicle.sourceUrl || vehicle.detailUrl || vehicle.url;
  if (url) {
    if (urlMap.has(url)) {
      duplicates.push({
        type: 'URL',
        url: url,
        indices: [urlMap.get(url), index],
        vehicles: [
          inventory.vehicles[urlMap.get(url)],
          vehicle
        ]
      });
    } else {
      urlMap.set(url, index);
    }
  }
});

// 2. Check which vehicles are still on source
const activeVehicles = [];
const inactiveVehicles = [];

inventory.vehicles.forEach(vehicle => {
  const url = vehicle.sourceUrl || vehicle.detailUrl || vehicle.url;
  if (url && sourceUrls.has(url)) {
    activeVehicles.push(vehicle);
  } else {
    inactiveVehicles.push(vehicle);
  }
});

// 3. Identify new vehicles to scrape
const scrapedUrls = new Set(
  inventory.vehicles.map(v => v.sourceUrl || v.detailUrl || v.url)
);
const newUrls = Array.from(sourceUrls).filter(url => !scrapedUrls.has(url));

// Generate report
const report = `# Inventory Sync Report

**Generated:** ${new Date().toISOString()}

## Summary

- **Total in inventory:** ${inventory.count}
- **Total on source site:** ${sourceUrls.size}
- **Active (still on source):** ${activeVehicles.length}
- **Inactive (removed from source):** ${inactiveVehicles.length}
- **New vehicles to scrape:** ${newUrls.length}
- **Duplicates found:** ${duplicates.length}

---

## Duplicates Detected

${duplicates.length === 0 ? '*No duplicates found*' : ''}
${duplicates.map((dup, i) => `
### Duplicate ${i + 1}: ${dup.type}
- **${dup.type}:** ${dup.vin || dup.url}
- **Indices:** ${dup.indices.join(', ')}
- **Vehicle 1:** ${dup.vehicles[0].year} ${dup.vehicles[0].make} ${dup.vehicles[0].model}
- **Vehicle 2:** ${dup.vehicles[1].year} ${dup.vehicles[1].make} ${dup.vehicles[1].model}
`).join('\n')}

---

## Inactive Vehicles

${inactiveVehicles.length === 0 ? '*All vehicles are active*' : ''}
${inactiveVehicles.slice(0, 20).map((v, i) => `
${i + 1}. **${v.year} ${v.make} ${v.model}** (${v.stock || v.vin})
   - Price: $${v.price?.toLocaleString() || 'N/A'}
   - Scraped: ${v.scrapedAt || 'Unknown'}
   - URL: ${v.sourceUrl || v.url || 'N/A'}
`).join('\n')}

${inactiveVehicles.length > 20 ? `\n*...and ${inactiveVehicles.length - 20} more*\n` : ''}

---

## New Vehicles to Scrape

${newUrls.length === 0 ? '*No new vehicles*' : `**${newUrls.length} URLs found**`}

${newUrls.slice(0, 10).map((url, i) => `${i + 1}. ${url}`).join('\n')}

${newUrls.length > 10 ? `\n*...and ${newUrls.length - 10} more*\n` : ''}

---

## Recommendations

${duplicates.length > 0 ? `⚠️ **Remove ${duplicates.length} duplicate(s)** from inventory\n` : ''}
${inactiveVehicles.length > 0 ? `⚠️ **Mark ${inactiveVehicles.length} vehicle(s) as inactive**\n` : ''}
${newUrls.length > 0 ? `📥 **Scrape ${newUrls.length} new vehicle(s)**\n` : ''}
${duplicates.length === 0 && inactiveVehicles.length === 0 && newUrls.length === 0 ? '✓ Inventory is fully synced with source\n' : ''}
`;

fs.writeFileSync(REPORT_FILE, report);

console.log('=== SYNC COMPLETE ===\n');
console.log(`✓ Active vehicles: ${activeVehicles.length}`);
console.log(`✗ Inactive vehicles: ${inactiveVehicles.length}`);
console.log(`📥 New vehicles: ${newUrls.length}`);
console.log(`⚠️  Duplicates: ${duplicates.length}`);
console.log(`\n📄 Report saved: ${REPORT_FILE}`);

// Exit with error code if duplicates found
process.exit(duplicates.length > 0 ? 1 : 0);
