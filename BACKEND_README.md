# FasKids Backend API

A comprehensive RESTful API for the FasKids children's clothing e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (Atlas cloud database configured)
- npm or pnpm

### Installation

1. **Install dependencies** (already included in main project)
```bash
npm install
```

2. **Environment Setup**
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. **Start Development Server**
```bash
npm run dev
```

The API will be available at:
- **Production**: https://faskids.shop/api
- **Development**: http://localhost:8080/api
- **Swagger Docs**: http://localhost:8080/api-docs

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:8080/api-docs
```

## 🔌 Database

- **Database Type**: MongoDB Atlas
- **Connection**: `mongodb+srv://edevzi:edevzi1234@cluster0.cwdvaas.mongodb.net/faskids`
- **Database Name**: `faskids`

## 🗄️ Database Models

### 1. **Product**
- Products with full details including gender, age range, colors, sizes, images
- Supports recommendations and similar products
- Rating and review count tracking

### 2. **Category**
- Product categories with slugs and icons

### 3. **Comment**
- Product reviews with ratings, images, and helpful votes
- Automatic product rating calculation

### 4. **User**
- User accounts with authentication
- Address management
- Wishlist and recently viewed products

### 5. **Order**
- Order management with cart items
- Shipping address and totals
- Order status tracking

## 🛣️ API Endpoints

### Products

#### Get All Products
```
GET /api/products
```

**Query Parameters:**
- `search` - Search term
- `gender` - Filter by gender (boy, girl, unisex)
- `age` - Filter by age range
- `category` - Filter by category slug
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `available` - Filter by availability
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "products": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### Get Product by Slug
```
GET /api/products/:slug
```

**Response:**
```json
{
  "id": "...",
  "slug": "graphic-tshirt-boy-green",
  "title": "Printli futbolka",
  "gender": "boy",
  "ageRange": "7-10y",
  "price": 99000,
  ...
}
```

### Categories

#### Get All Categories
```
GET /api/categories
```

#### Get Category by Slug
```
GET /api/categories/:slug
```

### Comments

#### Get Product Comments
```
GET /api/products/:productId/comments
```

**Query Parameters:**
- `sort` - Sort order: newest, helpful, rating
- `filter` - Filter: all, verified, withImages

#### Create Comment
```
POST /api/products/:productId/comments
```

**Request Body:**
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "rating": 5,
  "title": "Great product!",
  "content": "Very satisfied with the quality",
  "images": ["url1", "url2"],
  "size": "104",
  "color": "qora"
}
```

#### Mark Comment as Helpful
```
POST /api/comments/:commentId/helpful
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Deployment

### Production Deployment

1. **Update environment variables** in `.env`
2. **Build the application:**
```bash
npm run build
```

3. **Start the server:**
```bash
npm start
```

### Database Migration

To seed initial data, create a migration script or use MongoDB Compass to import the mock JSON files from `public/mocks/`.

## 🔒 Security Features

- CORS configured for specific origins
- Input validation and sanitization
- MongoDB injection prevention
- Rate limiting (recommended to add)

## 🎯 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Cart management endpoints
- [ ] Order creation endpoints
- [ ] Admin panel endpoints
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Analytics tracking

## 📝 Swagger Schemas

All endpoints are documented with OpenAPI 3.0 specifications. View the complete schema at `/api-docs`.

## 🤝 Contributing

1. Follow existing code style
2. Add Swagger documentation for new endpoints
3. Update this README with new features

## 📞 Support

For issues or questions:
- Email: support@faskids.shop
- Website: https://faskids.shop

---

**Built with ❤️ for kids**

