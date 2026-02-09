# A Thing On Wheels (ATOW) - Sitemap

## Site Architecture

```
athingonwheels.com
│
├── / (Home)
│   ├── Hero Section
│   │   └── "A Thing On Wheels" - Your Next Ride Awaits
│   ├── Featured Vehicles (3-6 cards)
│   ├── Why Choose ATOW
│   │   ├── Handpicked Selection
│   │   ├── Fair Pricing
│   │   └── Easy Process
│   └── CTA Sections
│       ├── "Shop Now" → /shop
│       └── "Sell Your Car" → /sell
│
├── /shop (Inventory)
│   ├── Hero/Header
│   ├── Search & Filters
│   │   ├── Make/Model
│   │   ├── Price Range
│   │   ├── Year Range
│   │   ├── Mileage
│   │   └── Condition (New/Used)
│   ├── Sort Options
│   │   ├── Price: Low to High
│   │   ├── Price: High to Low
│   │   ├── Year: Newest First
│   │   └── Mileage: Low to High
│   ├── Vehicle Grid/List
│   │   └── Vehicle Cards
│   │       ├── Primary Image
│   │       ├── Make/Model/Year
│   │       ├── Price
│   │       ├── Mileage
│   │       └── "View Details" → /shop/[vehicle-id]
│   └── Pagination
│
├── /shop/[vehicle-id] (Vehicle Detail)
│   ├── Image Gallery
│   ├── Vehicle Info
│   │   ├── Make/Model/Year
│   │   ├── Price
│   │   ├── VIN
│   │   ├── Mileage
│   │   └── Condition
│   ├── Features List
│   ├── Description
│   ├── Contact Form
│   │   └── "Inquire About This Vehicle"
│   └── Similar Vehicles
│
├── /sell (Sell/Trade Your Car)
│   ├── Hero
│   │   └── "Get Top Dollar for Your Ride"
│   ├── How It Works (3 Steps)
│   │   ├── 1. Submit Vehicle Info
│   │   ├── 2. Get Instant Estimate
│   │   └── 3. Schedule Inspection
│   ├── Instant Quote Form
│   │   ├── VIN or License Plate
│   │   ├── OR Manual Entry
│   │   │   ├── Make
│   │   │   ├── Model
│   │   │   ├── Year
│   │   │   └── Mileage
│   │   └── Contact Info
│   │       ├── Name
│   │       ├── Email
│   │       └── Phone
│   └── Trade-In vs Sell Info
│
├── /about (Optional - Future)
│   └── About ATOW
│
└── /contact (Optional - Future)
    └── Contact Form
```

## Page Priorities

### Phase 1 (MVP - Current Sprint)
1. ✅ Home - Brand introduction
2. 🔨 Shop - Vehicle listing
3. 🔨 Sell - Lead generation form

### Phase 2 (Future)
4. Vehicle Detail pages
5. About page
6. Contact page
7. Financing calculator
8. Blog/Resources

## URL Structure

- Homepage: `/`
- Shop/Inventory: `/shop`
- Vehicle Detail: `/shop/[vehicle-slug]` (e.g., `/shop/2020-audi-a4-premium`)
- Sell/Trade: `/sell`

## Navigation Structure

**Header:**
- Logo (ATOW)
- Shop
- Sell
- [Future: About, Contact]

**Footer:**
- Quick Links (Shop, Sell)
- Contact Info
- Social Media
- Legal (Privacy, Terms)

## Data Flow

1. **Shop Page**: Fetch vehicles from jsautohaus.com API/scraper
2. **Vehicle Details**: Deep link to specific vehicle data
3. **Sell Form**: Submit to backend → email notification / CRM integration
