/**
 * Test Puppeteer browser automation
 */

const puppeteer = require('puppeteer');

async function testPuppeteer() {
  console.log('🚀 Testing Puppeteer browser automation...\n');
  
  try {
    console.log('🔧 Launching browser...\n');
    
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      userDataDir: `/tmp/puppeteer-${Date.now()}`,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    console.log('📄 Navigating to jsautohaus.com/inventory...');
    await page.goto('https://jsautohaus.com/inventory', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('✅ Page loaded! Waiting for JavaScript to render...\n');
    await page.waitForTimeout(3000);

    console.log('🔍 Extracting data from page...\n');
    const data = await page.evaluate(() => {
      // Count different element types
      const linkCount = document.querySelectorAll('a[href*="/cars/"]').length;
      const imgCount = document.querySelectorAll('img').length;
      const priceCount = document.body.textContent?.match(/\$/g)?.length || 0;
      
      // Get sample links
      const links = Array.from(document.querySelectorAll('a'))
        .slice(0, 10)
        .map(a => ({
          href: a.getAttribute('href'),
          text: a.textContent?.substring(0, 50),
        }))
        .filter(l => l.href && l.href.includes('/'));
      
      return {
        linkCount,
        imgCount,
        priceCount,
        sampleLinks: links,
        bodyText: document.body.textContent?.substring(0, 500),
      };
    });

    console.log('📊 Results:');
    console.log(`  Links with /cars/: ${data.linkCount}`);
    console.log(`  Images found: ${data.imgCount}`);
    console.log(`  Price symbols ($): ${data.priceCount}`);
    console.log('\n📝 Sample links:');
    data.sampleLinks.forEach((link, i) => {
      console.log(`  ${i + 1}. ${link.href} - "${link.text}"`);
    });
    
    console.log('\n📄 Page text preview:');
    console.log(data.bodyText);

    await browser.close();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testPuppeteer();
