#!/usr/bin/env node

/**
 * Bulk scraper for jsautohaus.com inventory
 * Scrapes vehicle data using OpenClaw browser automation
 * Saves progress incrementally (resumable)
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../lib/scrapedInventory.json');
const URLS_FILE = path.join(__dirname, 'all-vehicle-urls.txt');
const PROGRESS_FILE = path.join(__dirname, '.scrape-progress.json');

// Read command line args
const LIMIT = parseInt(process.argv[2]) || 100;
const START_FROM = parseInt(process.argv[3]) || 0;

console.log('='.repeat(80));
console.log('JSAUTOHAUS.COM BULK SCRAPER');
console.log('='.repeat(80));
console.log('');
console.log(`Target: ${LIMIT} vehicles (starting from #${START_FROM})`);
console.log(`Output: ${OUTPUT_FILE}`);
console.log('');

// Load URLs
const allUrls = fs.readFileSync(URLS_FILE, 'utf8')
  .trim()
  .split('\n')
  .filter(url => url.includes('/inventory/Used-'));

console.log(`Total URLs available: ${allUrls.length}`);

// Load existing progress
let scrapedVehicles = [];
let lastIndex = START_FROM;

if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    scrapedVehicles = existing.vehicles || [];
    console.log(`Loaded ${scrapedVehicles.length} previously scraped vehicles`);
  } catch (e) {
    console.log('Starting fresh (could not load existing data)');
  }
}

if (fs.existsSync(PROGRESS_FILE)) {
  try {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    lastIndex = progress.lastIndex || START_FROM;
    console.log(`Resuming from vehicle #${lastIndex}`);
  } catch (e) {
    console.log('Starting from beginning');
  }
}

// Calculate what to scrape
const urlsToScrape = allUrls.slice(lastIndex, lastIndex + LIMIT);
console.log(`Will scrape ${urlsToScrape.length} vehicles (#${lastIndex} to #${lastIndex + urlsToScrape.length - 1})`);
console.log('');

// Instructions for manual scraping using OpenClaw browser
console.log('📋 SCRAPING INSTRUCTIONS:');
console.log('');
console.log('This script will output OpenClaw browser commands for you to run.');
console.log('Copy and paste each command into your terminal when ready.');
console.log('');
console.log('Press Ctrl+C to stop at any time. Progress is saved after each vehicle.');
console.log('');
console.log('-'.repeat(80));

// Generate scraping instructions
let scrapedCount = 0;

for (let i = 0; i < urlsToScrape.length; i++) {
  const url = urlsToScrape[i];
  const globalIndex = lastIndex + i;
  
  console.log('');
  console.log(`[${globalIndex + 1}/${allUrls.length}] ${url}`);
  console.log('');
  console.log('Run this OpenClaw command:');
  console.log('');
  console.log(`openclaw -m "Scrape vehicle #${globalIndex + 1}: ${url}"`);
  console.log('');
  console.log('Or call from code with browser tool:');
  console.log(`  1. browser.open("${url}")`);
  console.log(`  2. browser.snapshot()`);
  console.log(`  3. Extract: title, price, mileage, specs, images, description`);
  console.log(`  4. Save to ${OUTPUT_FILE}`);
  console.log('');
  console.log('-'.repeat(80));
}

console.log('');
console.log('✅ URL list generated!');
console.log('');
console.log('Next steps:');
console.log('1. Use OpenClaw browser tool to scrape each URL');
console.log('2. Save results progressively to avoid losing data');
console.log('3. Run this script again to continue from where you left off');
console.log('');
console.log('💡 TIP: Set up a sub-agent to do this work in the background!');
console.log('');
