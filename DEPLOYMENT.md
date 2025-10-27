# 🚀 FasKids Deployment Guide

## Quick Start for Production

### 1. Prepare Environment

```bash
# Copy environment variables
cp .env.example .env

# Edit .env file with your production values
nano .env
```

### 2. Seed Database

```bash
npm run seed
```

This will populate MongoDB with:
- Products
- Categories  
- Comments

### 3. Build Application

```bash
npm run build
```

Creates production-ready files in:
- `dist/spa/` - Frontend
- `dist/server/` - Backend

### 4. Start Server

```bash
npm start
```

Server runs on port 8080

### 5. Verify Deployment

- **API**: http://localhost:8080/api/ping
- **API Docs**: http://localhost:8080/api-docs
- **Frontend**: http://localhost:8080

## Environment Configuration

```env
# Development
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb+srv://edevzi:edevzi1234@cluster0.cwdvaas.mongodb.net/faskids
CLIENT_URL=http://localhost:5173

# Production
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://edevzi:edevzi1234@cluster0.cwdvaas.mongodb.net/faskids
CLIENT_URL=https://faskids.shop
```

## Production Deployment

### Option A: Single Server (Current)

Both frontend and backend on same server:

```bash
npm run build
npm start
```

### Option B: Separate Deployment

**Backend API**: 
- Deploy `server/server.ts`
- Use Railway, Render, or DigitalOcean
- Set environment variables

**Frontend**:
- Deploy `dist/spa/`
- Use Vercel or Netlify
- Set `VITE_API_BASE_URL`

## Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run build:client` - Build only frontend
- `npm run build:server` - Build only backend
- `npm run start` - Start production server
- `npm run start:dev` - Start development API server
- `npm run seed` - Seed database with mock data
- `npm run test` - Run tests
- `npm run typecheck` - Type check TypeScript

## Deployment Platforms

### Vercel (Recommended)

1. Connect GitHub repository
2. Build command: `npm run build:client`
3. Output directory: `dist/spa`
4. Environment variables in dashboard

### Netlify

1. Connect GitHub
2. Build command: `npm run build:client`
3. Publish directory: `dist/spa`
4. Redirects: `/* /index.html`

### Railway/Render (Backend)

1. Connect GitHub
2. Build command: `npm run build`
3. Start command: `npm start`
4. Set environment variables

## API Endpoints

- `GET /api/ping` - Health check
- `GET /api/products` - All products
- `GET /api/products/:slug` - Product detail
- `GET /api/categories` - All categories
- `GET /api/products/:id/comments` - Product comments
- `POST /api/products/:id/comments` - Create comment

Full docs: https://faskids.shop/api-docs

## Security Checklist

- [ ] Environment variables secured
- [ ] MongoDB connection string protected
- [ ] CORS configured properly
- [ ] HTTPS enabled
- [ ] Rate limiting added
- [ ] Error logging configured
- [ ] Database backups enabled

## Monitoring

- API health: `/api/ping`
- Server logs: Check console
- MongoDB Atlas dashboard
- Error tracking (add Sentry)

## Support

- Documentation: See PRODUCTION_DEPLOYMENT.md
- API Docs: https://faskids.shop/api-docs
- Issues: Contact support@faskids.shop

