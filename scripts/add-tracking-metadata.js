#!/usr/bin/env node

/**
 * Add tracking metadata to existing scraped inventory
 * 
 * Adds:
 * - scrapedAt: timestamp from file
 * - sourceUrl: same as detailUrl
 * - importBatch: date-based identifier
 * - lastVerified: same as scrapedAt
 * - isActive: true
 */

const fs = require('fs');

const INPUT_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json';
const OUTPUT_FILE = INPUT_FILE; // Overwrite in place
const BACKUP_FILE = INPUT_FILE.replace('.json', '.backup.json');

console.log('Adding tracking metadata to scraped inventory...\n');

// Backup original
const originalData = fs.readFileSync(INPUT_FILE, 'utf-8');
fs.writeFileSync(BACKUP_FILE, originalData);
console.log(`✓ Backup created: ${BACKUP_FILE}`);

// Load data
const inventory = JSON.parse(originalData);
const scrapedAt = inventory.scrapedAt || new Date().toISOString();
const importBatch = scrapedAt.split('T')[0] + '-full';

console.log(`\nProcessing ${inventory.count} vehicles...`);
console.log(`Import batch: ${importBatch}`);
console.log(`Scraped at: ${scrapedAt}\n`);

// Update each vehicle
let updatedCount = 0;
inventory.vehicles.forEach((vehicle, index) => {
  // Add tracking fields if missing
  if (!vehicle.scrapedAt) vehicle.scrapedAt = scrapedAt;
  if (!vehicle.sourceUrl) vehicle.sourceUrl = vehicle.detailUrl || vehicle.url;
  if (!vehicle.importBatch) vehicle.importBatch = importBatch;
  if (!vehicle.lastVerified) vehicle.lastVerified = vehicle.scrapedAt;
  if (vehicle.isActive === undefined) vehicle.isActive = true;
  
  updatedCount++;
  
  if ((index + 1) % 100 === 0) {
    console.log(`Processed ${index + 1}/${inventory.count} vehicles...`);
  }
});

// Save updated data
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2));

console.log(`\n✓ Updated ${updatedCount} vehicles with tracking metadata`);
console.log(`✓ Saved to: ${OUTPUT_FILE}`);
console.log(`✓ Backup at: ${BACKUP_FILE}`);
console.log('\nTracking fields added:');
console.log('  - scrapedAt');
console.log('  - sourceUrl');
console.log('  - importBatch');
console.log('  - lastVerified');
console.log('  - isActive');
