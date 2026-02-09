# A Thing On Wheels (ATOW)

**Your Next Ride Awaits** 🚗

A modern, responsive car dealership website built with Next.js, TypeScript, and Tailwind CSS. Fetches inventory data from jsautohaus.com and provides a sleek browsing and inquiry experience.

---

## 🚀 Features

### ✅ Completed
- **Homepage** - Hero section, featured vehicles, value propositions
- **Shop/Inventory** - Searchable vehicle grid with advanced filters
  - Filter by make, price range, year, mileage, condition
  - Responsive grid layout
  - Live filtering
- **Vehicle Detail Pages** - Full specs, image gallery, similar vehicles
- **Sell/Trade Form** - VIN lookup or manual entry, lead capture
- **API Integration** - Backend data scraping from jsautohaus.com
- **Form Submissions** - Email notifications for sell inquiries
- **Responsive Design** - Mobile-first, works on all devices
- **TypeScript** - Full type safety
- **Server Components** - Optimized performance with Next.js 15

### 🔜 Coming Soon
- Real-time VIN lookup API integration
- Admin dashboard for inventory management
- Financing calculator
- Vehicle comparison tool
- Blog/resources section
- Live chat support

---

## 📁 Project Structure

```
athingonwheels/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── shop/
│   │   ├── page.tsx                # Inventory listing
│   │   └── [slug]/
│   │       └── page.tsx            # Vehicle detail page
│   ├── sell/
│   │   └── page.tsx                # Sell/trade form
│   └── api/
│       ├── vehicles/
│       │   └── route.ts            # Vehicle data API
│       └── sell/
│           └── route.ts            # Form submission API
├── lib/
│   ├── mockData.ts                 # Sample vehicle data
│   ├── dataSource.ts               # Data abstraction layer
│   └── scraper.ts                  # jsautohaus.com scraper
├── types/
│   └── vehicle.ts                  # TypeScript interfaces
├── docs/
│   ├── SCRAPING_ANALYSIS.md        # Data source analysis
│   ├── SITEMAP.md                  # Site architecture
│   ├── WIREFRAMES.md               # Page wireframes
│   └── PROGRESS.md                 # Development progress
└── public/                         # Static assets
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Source:** jsautohaus.com (scraped)
- **Deployment:** Vercel (recommended)
- **Email:** Resend / SendGrid / Webhook (configurable)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/VeryGoodDeveloper/athingonwheels.git
   cd athingonwheels
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your email service credentials:
   - For Resend: Add `RESEND_API_KEY`
   - For SendGrid: Add `SENDGRID_API_KEY`
   - For webhook: Add `WEBHOOK_URL`

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:3000

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy!

Vercel will auto-detect Next.js and configure everything correctly.

### Environment Variables for Production

Add these in your Vercel dashboard:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@athingonwheels.com
SALES_EMAIL=sales@athingonwheels.com
NEXT_PUBLIC_API_URL=https://athingonwheels.vercel.app
```

---

## 📧 Email Notifications

The sell/trade form supports multiple email providers:

### Option 1: Resend (Recommended)
- Sign up at [resend.com](https://resend.com)
- Get API key
- Set `RESEND_API_KEY` in environment variables

### Option 2: SendGrid
- Sign up at [sendgrid.com](https://sendgrid.com)
- Get API key
- Set `SENDGRID_API_KEY` in environment variables

### Option 3: Custom Webhook
- Set `WEBHOOK_URL` to your endpoint
- Receive POST requests with form data

---

## 🔄 Data Integration

### Current Setup
- Scrapes vehicle data from jsautohaus.com
- Falls back to mock data if scraping fails
- Caches data for 15 minutes
- Server-side rendering for SEO

### Customizing Data Source
Edit `lib/scraper.ts` to adjust:
- Parsing logic
- Field mappings
- Error handling
- Cache duration

---

## 🎨 Customization

### Branding
- Logo: Update in `app/layout.tsx`
- Colors: Edit `tailwind.config.ts`
- Fonts: Configured in `app/layout.tsx`

### Content
- Homepage: `app/page.tsx`
- Shop page: `app/shop/page.tsx`
- Sell page: `app/sell/page.tsx`

---

## 📊 Data Structure

Vehicles follow this TypeScript interface:

```typescript
interface Vehicle {
  id: string;
  vin: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: "new" | "used";
  mileage: number;
  images: string[];
  features: string[];
  // ... more fields
}
```

See `types/vehicle.ts` for complete schema.

---

## 🧪 Development

### Run tests (when added)
```bash
npm test
```

### Lint code
```bash
npm run lint
```

### Type checking
```bash
npm run type-check
```

---

## 📝 Documentation

- **SCRAPING_ANALYSIS.md** - How data is fetched from jsautohaus.com
- **SITEMAP.md** - Complete site architecture
- **WIREFRAMES.md** - Page layouts and design
- **PROGRESS.md** - Development timeline and status

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Contact

- **Website:** [athingonwheels.com](https://athingonwheels.com)
- **Email:** sales@athingonwheels.com
- **Phone:** (609) 245-6634
- **Location:** Ewing, NJ

---

## 🙏 Credits

- Built by **SoCLAW** for **SAVE**
- Data sourced from jsautohaus.com
- Powered by Next.js and Vercel

---

Made with ❤️ for car enthusiasts
