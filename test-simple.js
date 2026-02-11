const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      executablePath: '/home/ubuntu/.cache/puppeteer/chrome/linux-145.0.7632.46/chrome-linux64/chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    console.log('Browser launched! Opening page...');
    const page = await browser.newPage();
    await page.goto('https://jsautohaus.com/inventory', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Page loaded! Getting title...');
    const title = await page.title();
    console.log('Title:', title);
    
    const vehicleCount = await page.evaluate(() => {
      return document.querySelectorAll('a[href*="/cars/"]').length;
    });
    console.log('Vehicle links found:', vehicleCount);
    
    await browser.close();
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
