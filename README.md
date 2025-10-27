# Kidding - Kidswear E-commerce App

Modern, kid-friendly e-commerce platform built with React SPA + Express backend.

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite
- **Styling**: Tailwind CSS 3 + Framer Motion animations
- **UI Components**: shadcn/ui (Button, Input, Dialog, Tabs, etc.)
- **State Management**: Zustand (cart, filters, UI state)
- **HTTP Client**: Axios (configured for API integration)
- **Query Management**: TanStack React Query
- **Backend**: Express server (same process during dev)

## Features

### Home Page

- Animated hero carousel (3 slides with CTAs)
- Category slider with hover effects
- Age-range quick filter chips
- New arrivals & bestsellers product scrollers
- Trust badges & newsletter signup
- Sticky header with cart counter

### Catalog & Filters

- Advanced filtering (gender, age, category, colors, price, season, material)
- Multiple sort options (newest, price ↑/↓, rating)
- URL-driven state (filters persist in URL)
- Responsive grid (2-4 cols based on breakpoint)
- Empty & loading states with skeletons

### Product Detail

- Image gallery with thumbnails
- Variant picker (colors, sizes)
- Material & care instructions
- Rating display
- Add to cart with instant drawer opening
- Buy now button

### Cart

- CartDrawer (header-accessible) + full /cart page
- Qty stepper, remove items
- Subtotal, tax, shipping calculation
- Free shipping threshold indicator (150k so'm)
- Promo input (mock)

### Checkout

- 3-step flow: Shipping → Payment → Review
- Form validation
- Payment mock (card fields or pay-on-delivery)
- Order summary with totals
- Successful order redirect with mock storage

### Profile

- Tabs: Dashboard, Orders, Addresses, Wishlist
- Mock data with recent orders
- Address book with default address
- MoySklad integration placeholder

### Additional Pages

- /about: Company info & contact details
- /contact: Contact form (mock)
- /orders/[id]: Order detail page with status
- /gender/[boy|girl]: Pre-filtered catalog
- /category/[slug]: Category-specific listings
- 404 page with playful design

## Installation

```bash
pnpm install
```

## Running the App

### Development

```bash
pnpm dev
```

Open http://localhost:8080 in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

### Type Checking

```bash
pnpm typecheck
```

### Testing

```bash
pnpm test
```

## Project Structure

```
client/
  components/
    core/           # Header, Footer, Container, Logo
    home/           # HeroBanner, CategorySlider, AgeChips, ProductScroller
    catalog/        # Filters, ProductCard, ProductGrid
    cart/           # CartDrawer
    checkout/       # (embedded in Checkout.tsx)
    product/        # (embedded in ProductDetail.tsx)
    profile/        # (embedded in Profile.tsx)
    common/         # Price, RatingStars, BadgeDot
    ui/             # shadcn/ui components (pre-built)
  pages/            # Route components
  lib/
    axios.ts        # Axios config (baseURL for API)
    queryClient.ts  # TanStack Query setup
    format.ts       # Utilities (price, date, tax, shipping)
    config.ts       # Constants (age ranges, genders, sizes, colors, etc.)
    utils.ts        # Helper functions (cn, sleep, clamp, slugify)
  store/            # Zustand stores
    useCart.ts      # Cart state (add, remove, qty, total)
    useFilters.ts   # Catalog filters (gender, age, colors, price, sort)
    useUI.ts        # UI state (drawer, mobile menu, etc.)
  pages/            # Route page components
  global.css        # Tailwind setup + brand colors (HSL variables)
  App.tsx           # Routes & global layout

public/
  mocks/            # Mock JSON data
    products.json   # 20 products with images from Unsplash
    categories.json # 6 categories
    orders.json     # Mock orders
    users.json      # Mock users & addresses

shared/
  api.ts            # Shared TypeScript types

tailwind.config.ts  # Tailwind customization
```

## Switching to Real API

Replace mock data fetch logic with real API calls:

1. **Update `lib/axios.ts`**: Change `baseURL` to your API endpoint
2. **Replace mock fetches**: Use TanStack Query + Axios instead of `fetch("/mocks/...")`
3. **Example**:

   ```typescript
   // Before (mock):
   const res = await fetch("/mocks/products.json");
   const data = await res.json();

   // After (real API):
   import { useQuery } from "@tanstack/react-query";
   import axios from "@/lib/axios";

   const { data, isLoading } = useQuery({
     queryKey: ["products"],
     queryFn: () => axios.get("/products").then((r) => r.data),
   });
   ```

## MoySklad Integration

The profile page has a placeholder section for MoySklad stock integration. To enable:

1. Get MoySklad API credentials
2. Create backend endpoint to proxy MoySklad API
3. Fetch real-time inventory from `/api/moysklad/stock/:productId`
4. Update ProductDetail & ProductCard to show real stock status

## Image Source

All product images use Unsplash URLs (parametrized for consistent sizing):

```
https://images.unsplash.com/photo-{id}?w=500&h=500&fit=crop
```

To replace with your own images, update `public/mocks/products.json`.

## Animations

Subtle Framer Motion animations throughout:

- Hero slide entrance (staggered text/images)
- Card hover lift (y: -8px)
- Page transitions (fade/slide)
- Cart item entrance
- Button spring effects

Durations: 180–260ms, easeOut for soft, kid-friendly feel.

## Color Scheme

- **Primary**: #E74C3C (red/coral) — calls-to-action, highlights
- **Secondary**: #FBC93D (yellow) — accents, badges
- **Accent**: #3498DB (blue) — interactive elements
- **Neutral**: Grays (slate-800, slate-300) for text/backgrounds
- **Success**: Green for confirmations
- **Destructive**: Red for warnings/remove actions

See `client/global.css` for full HSL variable definitions.

## Performance Notes

- **Lazy Loading**: Routes use React Router code-splitting
- **Images**: Optimized Unsplash URLs with fixed dimensions
- **Mock Data**: ~40 products max, ~6 categories
- **State Persistence**: Cart persisted to localStorage via Zustand

## Troubleshooting

### Dev server not starting?

```bash
pnpm install
pnpm dev
```

### Colors look yellow/weird?

Check that CSS variables in `global.css` are in HSL format (not RGB). Tailwind expects `hsl(var(--primary))`.

### Cart not persisting?

Ensure localStorage is enabled. Cart uses Zustand's persist middleware.

### Filters not updating URL?

Check that `useFilters` store is being updated and pages are using `useSearchParams()` from React Router.

## Future Enhancements

- [ ] Real Stripe/Payme payment integration
- [ ] MoySklad inventory sync
- [ ] User authentication (JWT)
- [ ] Wishlist persistence
- [ ] Recently viewed products (localStorage)
- [ ] Multi-language (uz/ru/en)
- [ ] Admin dashboard for orders/products
- [ ] SMS notifications
- [ ] Analytics integration

## License

MIT
