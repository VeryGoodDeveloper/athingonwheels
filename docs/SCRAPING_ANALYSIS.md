# jsautohaus.com - Data Structure Analysis

## Site Structure

### Homepage (/)
- **Hero Section**: Brand message "Built to Impress"
- **Value Propositions**:
  - Buying/inventory link
  - Selling service
  - Vehicle servicing
- **CTA**: Links to main actions

### Inventory Page (/inventory)
- **Title**: "Our New & Used Acura, Alfa Romeo, Audi Vehicles, and more"
- **Location**: Ewing, NJ
- **Features**:
  - Sort functionality
  - Vehicle listing (React-based, dynamic loading)
  - Filter/search capabilities
- **Tech**: React components with CSS modules
- **Classes**: 
  - `Inventory-module__vehiclesList`
  - `InventorySearch-module__vehiclesListSearch`
  - `Inventory-module__vehiclesListContent`

### Sell Your Car Page (/sell-your-car)
- **3-Step Process**:
  1. **Get an Instant Offer**: Enter License Plate or VIN
  2. **Confirm Condition**: In-person verification
  3. **Cash Out or Trade-In**: Payment or trade
- **Contact**: (609) 245-6634
- **Features**:
  - Real-time valuation
  - VIN/License plate lookup
  - Trade-in calculator

## Data Structure (Inferred)

### Vehicle Object
```typescript
interface Vehicle {
  id: string;
  vin: string;
  make: string;           // e.g., "Acura", "Alfa Romeo", "Audi"
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: "new" | "used";
  images: string[];
  features: string[];
  location: string;       // "Ewing, NJ"
  status: "available" | "sold" | "pending";
}
```

### Sell/Trade Form
```typescript
interface SellTradeForm {
  vehicleInfo: {
    vin?: string;
    licensePlate?: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
  };
  ownerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  vehicleCondition: {
    exterior: string;
    interior: string;
    mechanical: string;
  };
}
```

## Scraping Strategy

### Option 1: API Discovery (Recommended)
- Monitor network requests on inventory page
- Find API endpoints for vehicle data
- Use those endpoints directly

### Option 2: Headless Browser Scraping
- Use Playwright/Puppeteer to render React app
- Extract vehicle data after JS execution
- Cache results to avoid excessive requests

### Option 3: RSS/Feed (if available)
- Check for inventory feeds
- Parse structured data

## Next Steps

1. ✅ Document structure (DONE)
2. ⏳ Build sitemap for ATOW
3. ⏳ Create wireframes
4. ⏳ Scaffold site with mock data
5. ⏳ Implement actual scraping/API integration
