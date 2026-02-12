#!/usr/bin/env node

const fs = require('fs');
const puppeteer = require('puppeteer');

const URLS_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/scripts/all-vehicle-urls.txt';
const OUTPUT_FILE = '/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json';
const SAVE_INTERVAL = 10;
const START_INDEX = 1; // We already scraped index 0

// Read URLs
const urls = fs.readFileSync(URLS_FILE, 'utf-8').trim().split('\n').slice(0, 100);

// Read existing data
let inventory = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));

// Extraction function to run in browser context
function extractVehicleData() {
  const data = {
    url: window.location.href,
    detailUrl: window.location.href
  };

  // Extract title (year, make, model)
  const titleEl = document.querySelector('h1');
  const titleText = titleEl ? titleEl.innerText.trim() : '';
  const match = titleText.match(/(\d{4})\s+(.+)$/);
  if (match) {
    data.year = parseInt(match[1]);
    const makeModel = match[2].trim();
    const parts = makeModel.split(/\s+/);
    data.make = parts[0].replace(/®/g, '');
    data.model = parts.slice(1).join(' ');
  }

  // Extract trim
  const trimDiv = document.querySelector('h1 + div');
  const trimP = trimDiv ? trimDiv.querySelector('p:first-child') : null;
  data.trim = trimP ? trimP.innerText.trim() : 'Base';

  // Extract VIN
  const allButtons = Array.from(document.querySelectorAll('button'));
  const vinButton = allButtons.find(b => /^[A-HJ-NPR-Z0-9]{17}$/.test(b.innerText.replace(/content_copy/g, '').trim()));
  data.vin = vinButton ? vinButton.innerText.replace(/content_copy/g, '').trim() : '';

  // Extract stock number
  const h4 = Array.from(document.querySelectorAll('h4')).find(h => h.innerText === 'Basic information');
  if (h4) {
    const section = h4.parentElement;
    const allText = section.innerText;
    const stockMatch = allText.match(/Stock #\s*([A-Z0-9]+)/i);
    data.stock = stockMatch ? stockMatch[1] : '';
  }

  // Extract mileage
  const allPs = Array.from(document.querySelectorAll('p'));
  const milesLabel = allPs.find(p => p.innerText === 'Miles');
  if (milesLabel) {
    const parent = milesLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) data.mileage = parseInt(valueDiv.innerText.replace(/,/g, ''));
  }

  // Extract specs
  const specs = {};
  
  const engineLabel = allPs.find(p => p.innerText === 'Engine');
  if (engineLabel) {
    const parent = engineLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) specs.engine = valueDiv.innerText.trim();
  }

  const transLabel = allPs.find(p => p.innerText === 'Transmission');
  if (transLabel) {
    const parent = transLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) specs.transmission = valueDiv.innerText.trim();
  }

  const driveLabel = allPs.find(p => p.innerText === 'Drivetrain');
  if (driveLabel) {
    const parent = driveLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) specs.drivetrain = valueDiv.innerText.trim();
  }

  const bodyLabel = allPs.find(p => p.innerText === 'Body Type');
  if (bodyLabel) {
    const parent = bodyLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) specs.bodyType = valueDiv.innerText.trim();
  }

  const doorsLabel = allPs.find(p => p.innerText === 'Doors');
  if (doorsLabel) {
    const parent = doorsLabel.closest('div').parentElement;
    const valueDiv = parent.querySelector('div:last-child');
    if (valueDiv) specs.doors = parseInt(valueDiv.innerText);
  }

  data.specs = specs;

  // Extract images
  const images = Array.from(document.querySelectorAll('img[alt^="image-"]'))
    .map(img => img.src)
    .filter(src => src.includes('ridemotive'));
  data.images = [...new Set(images)];

  // Extract Carfax URL
  const carfaxLink = document.querySelector('a[href*="carfax.com"]');
  data.carfaxUrl = carfaxLink ? carfaxLink.href : null;

  // Extract price
  const priceEl = document.querySelector('h1 ~ p');
  const priceText = priceEl ? priceEl.innerText : '';
  data.price = priceText.toLowerCase().includes('call') ? 0 : parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

  // Description (placeholder)
  data.description = '';

  // ID from URL
  const id = data.url.split('/').pop();
  data.id = id;

  return data;
}

async function scrapeVehicles() {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222'
  });

  const page = await browser.newPage();
  
  let successCount = inventory.count;
  let failCount = 0;

  for (let i = START_INDEX; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Scraping ${i + 1}/100: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('h1', { timeout: 10000 });

      const vehicleData = await page.evaluate(extractVehicleData);
      
      inventory.vehicles.push(vehicleData);
      inventory.count++;
      successCount++;

      console.log(`✓ Scraped: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} (${vehicleData.stock})`);

      // Save every 10 vehicles
      if (inventory.count % SAVE_INTERVAL === 0) {
        inventory.scrapedAt = new Date().toISOString();
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2));
        console.log(`💾 Progress saved: ${inventory.count}/100 vehicles`);
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`✗ Failed to scrape ${url}: ${error.message}`);
      failCount++;
      
      // If failed, retry once
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('h1', { timeout: 10000 });
        const vehicleData = await page.evaluate(extractVehicleData);
        inventory.vehicles.push(vehicleData);
        inventory.count++;
        successCount++;
        console.log(`✓ Retry successful: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`);
      } catch (retryError) {
        console.error(`✗ Retry also failed, skipping vehicle`);
      }
    }
  }

  // Final save
  inventory.scrapedAt = new Date().toISOString();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2));

  await page.close();
  await browser.disconnect();

  console.log('\n=== SCRAPING COMPLETE ===');
  console.log(`✓ Successfully scraped: ${successCount}/100`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`📁 Output file: ${OUTPUT_FILE}`);
}

scrapeVehicles().catch(console.error);
