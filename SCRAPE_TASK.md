# Vehicle Scraping Task

## Goal
Scrape 100 vehicles from jsautohaus.com and save to `lib/scrapedInventory.json`

## URLs to Scrape
Read from: `scripts/all-vehicle-urls.txt` (lines 0-99)

## Method
For each URL:
1. Open URL with `browser.open(url)`
2. Take snapshot with `browser.snapshot()`
3. Extract vehicle data:
   - **Title**: year + make + model + trim
   - **Price**: from price display
   - **Mileage**: from odometer
   - **Images**: all gallery image URLs (ridemotive.com CDN)
   - **Specs**: engine, drivetrain, mpg, doors, body type, transmission
   - **VIN**: vehicle identification number
   - **Stock #**: dealer stock number
   - **Description**: full vehicle description text
   - **Carfax URL**: if available
   - **Detail URL**: the current page URL

4. Save to JSON file progressively (don't wait until end)

## Output Format
```json
{
  "scrapedAt": "2026-02-12T13:00:00.000Z",
  "source": "jsautohaus.com",
  "count": 100,
  "vehicles": [
    {
      "id": "unique-slug",
      "year": 2022,
      "make": "Ferrari",
      "model": "812 GTS",
      "trim": "Base",
      "price": 549995,
      "mileage": 1234,
      "images": ["url1", "url2", ...],
      "specs": {
        "engine": "6.5L V12",
        "drivetrain": "RWD",
        "transmission": "7-Speed Automatic",
        "mpgCity": 12,
        "mpgHighway": 16,
        "doors": 2,
        "bodyType": "Convertible"
      },
      "vin": "...",
      "stock": "25897",
      "description": "...",
      "carfaxUrl": "...",
      "detailUrl": "https://jsautohaus.com/inventory/..."
    }
  ]
}
```

## Save Location
`/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json`

## Progress Tracking
- Save after every 10 vehicles
- Log progress: "Scraped X/100 vehicles"
- If interrupted, can resume from last saved point

## Error Handling
- If a vehicle page 404s, log it and skip
- If scraping fails, retry once, then skip
- Keep going even if some fail

## Completion
When done, report:
- Total vehicles scraped successfully
- Total failures/skips
- Output file location
- Estimated total if we scraped all 812 vehicles

## Time Estimate
~2-3 hours for 100 vehicles (based on previous 6-vehicle scrape taking 13 minutes)
