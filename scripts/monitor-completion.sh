#!/bin/bash

OUTPUT_FILE="/home/ssystem/.openclaw/workspace/athingonwheels/lib/scrapedInventory.json"
LOG_FILE="/home/ssystem/.openclaw/workspace/athingonwheels/scripts/scrape-progress.log"

echo "=== Monitoring scraping progress ===" > "$LOG_FILE"
echo "Started at: $(date)" >> "$LOG_FILE"

while true; do
  count=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUTPUT_FILE', 'utf-8')).count)")
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] Progress: $count/100 vehicles" >> "$LOG_FILE"
  
  if [ "$count" -ge 100 ]; then
    echo "[$timestamp] ✓ COMPLETE! All 100 vehicles scraped" >> "$LOG_FILE"
    
    # Generate summary
    node -e "
      const data = JSON.parse(require('fs').readFileSync('$OUTPUT_FILE', 'utf-8'));
      console.log('\\n=== SCRAPING COMPLETE ===');
      console.log('Total vehicles: ' + data.count);
      console.log('Source: ' + data.source);
      console.log('Scraped at: ' + data.scrapedAt);
      console.log('\\nSample vehicles:');
      data.vehicles.slice(0, 5).forEach((v, i) => {
        console.log((i+1) + '. ' + v.year + ' ' + v.make + ' ' + v.model + ' - Stock: ' + v.stock);
      });
      console.log('\\nOutput file: $OUTPUT_FILE');
    " >> "$LOG_FILE"
    
    cat "$LOG_FILE"
    break
  fi
  
  sleep 60
done
