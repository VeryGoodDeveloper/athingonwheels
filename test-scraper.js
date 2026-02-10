/**
 * Test script to check if the scraper is working
 */

const cheerio = require('cheerio');

async function testScraper() {
  console.log('🔍 Testing scraper on jsautohaus.com...\n');
  
  try {
    const response = await fetch('https://jsautohaus.com/inventory', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      console.error(`❌ Failed: ${response.status}`);
      return;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    console.log('✅ Page fetched successfully!\n');
    console.log('📊 Analyzing page structure...\n');
    
    // Check for vehicle-related elements
    const selectors = [
      { name: 'Links to vehicle pages', selector: 'a[href*="/shop/"]' },
      { name: 'Links to car pages', selector: 'a[href*="/cars/"]' },
      { name: 'Vehicle cards', selector: '[class*="vehicle"]' },
      { name: 'Car cards', selector: '[class*="car"]' },
      { name: 'Price elements', selector: '[class*="price"]' },
      { name: 'Images', selector: 'img[src*="vehicle"], img[src*="car"]' },
    ];
    
    selectors.forEach(({ name, selector }) => {
      const elements = $(selector);
      console.log(`${name}: ${elements.length} found`);
    });
    
    console.log('\n📝 Sample vehicle links:');
    $('a[href*="/shop/"], a[href*="/cars/"]').slice(0, 5).each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim().substring(0, 50);
      console.log(`  ${i + 1}. ${href} - "${text}"`);
    });
    
    console.log('\n📸 Sample image URLs:');
    $('img').slice(0, 5).each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.length < 100) {
        console.log(`  ${i + 1}. ${src}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testScraper();
