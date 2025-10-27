# API Integration Guide

This document explains how the frontend has been integrated with the real backend API.

## 🔄 Migration from Mock Data to Real API

### Overview
The application now fetches data from the real MongoDB-backed API instead of static JSON mock files.

### API Integration Points

#### 1. **Products Page** (`/client/pages/Products.tsx`)
- **Before**: Loaded `products.json` from `/mocks/`
- **After**: Calls `api.products.getAll()` with query parameters
- **Filters**: gender, age, category, search, price range
- **Fallback**: Falls back to mock data on API error

#### 2. **Product Detail Page** (`/client/pages/ProductDetail.tsx`)
- **Before**: Loaded from JSON files
- **After**: 
  - Calls `api.products.getBySlug(slug)` for product details
  - Calls `api.comments.getByProduct(productId)` for comments
  - Loads recommended and similar products dynamically
- **Fallback**: Falls back to mock data on API error

#### 3. **API Client** (`/client/lib/api.ts`)
New centralized API client with methods:
```typescript
api.products.getAll(params)
api.products.getBySlug(slug)
api.categories.getAll()
api.categories.getBySlug(slug)
api.comments.getByProduct(productId)
api.comments.create(productId, data)
api.comments.markHelpful(commentId)
```

### Configuration

#### Development
- API calls go to `/api/*` (proxied by Vite dev server)
- Express server runs on port 8080
- MongoDB Atlas connection configured

#### Production
- API calls go to `https://faskids.shop/api`
- Backend deployed separately
- Environment variable: `VITE_API_BASE_URL`

### API Endpoints

#### Products
```
GET /api/products - Get all products with filters
GET /api/products/:slug - Get product by slug
```

#### Categories
```
GET /api/categories - Get all categories
GET /api/categories/:slug - Get category by slug
```

#### Comments
```
GET /api/products/:productId/comments - Get product comments
POST /api/products/:productId/comments - Create comment
POST /api/comments/:commentId/helpful - Mark as helpful
```

### Error Handling

All API calls include try-catch blocks with fallback to mock data:
- Network errors → Fallback to mock JSON files
- Server errors → Logged to console, graceful degradation
- User experience remains smooth even if API fails

### Testing the Integration

1. **Seed the database:**
```bash
npm run seed
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Verify API is working:**
- Visit http://localhost:8080/api-docs
- Test endpoints in Swagger UI

4. **Test frontend:**
- Visit http://localhost:8080
- Browse products, view details, check comments

### Database Models

See:
- `server/models/Product.ts`
- `server/models/Category.ts`
- `server/models/Comment.ts`
- `server/models/User.ts`
- `server/models/Order.ts`

### Future Enhancements

- [ ] Cart API integration
- [ ] Order creation API
- [ ] User authentication API
- [ ] Wishlist API
- [ ] Image upload API
- [ ] Payment gateway integration

### Troubleshooting

**API calls failing?**
- Check MongoDB connection in `.env`
- Verify backend server is running
- Check browser console for errors
- Review network tab in DevTools

**Data not loading?**
- Ensure database is seeded (`npm run seed`)
- Check API responses in Swagger UI
- Verify CORS settings in server/index.ts

**Need to revert to mocks?**
- Simply update `client/lib/api.ts` to return mock data
- Or disable API calls in environment config

---

**Backend API**: https://faskids.shop/api  
**Swagger Docs**: https://faskids.shop/api-docs  
**Database**: MongoDB Atlas

