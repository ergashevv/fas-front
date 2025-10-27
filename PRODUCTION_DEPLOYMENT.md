# FasKids Production Deployment Guide

## 🚀 Production Setup

### Prerequisites
- Node.js 20+ installed
- MongoDB Atlas database configured
- Environment variables set up
- Domain name configured (faskids.shop)

### Environment Variables

Create `.env` file in the project root:

```env
# Database
MONGODB_URI=mongodb+srv://edevzi:edevzi1234@cluster0.cwdvaas.mongodb.net/faskids?retryWrites=true&w=majority&appName=Cluster0

# Server
PORT=8080
NODE_ENV=production

# Client URL
CLIENT_URL=https://faskids.shop

# Domain
DOMAIN=faskids.shop
```

### Database Setup

1. **Seed the database:**
```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Clear existing data
- Insert products, categories, and comments
- Show success confirmation

### Build for Production

1. **Build both client and server:**
```bash
npm run build
```

This creates:
- `dist/spa/` - Frontend static files
- `dist/server/` - Backend server files

### Run in Production

**Option 1: Integrated Server (Current Setup)**
```bash
npm start
```

This runs:
- Express server on port 8080
- Serves API endpoints at `/api/*`
- Serves frontend at `/*`

**Option 2: Standalone Backend**
```bash
npm run start:dev
```

Runs only the API server without frontend.

### Verification

1. **Health Check:**
```bash
curl http://localhost:8080/api/ping
# Should return: {"message":"pong","timestamp":"..."}
```

2. **API Docs:**
Visit: http://localhost:8080/api-docs

3. **Test Products Endpoint:**
```bash
curl http://localhost:8080/api/products
```

### Deployment Options

#### Vercel/Netlify (Frontend) + Railway/Render (Backend)

**Backend on Railway:**
1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm start`
5. Custom domain: `api.faskids.shop`

**Frontend on Vercel:**
1. Connect GitHub repository
2. Build command: `npm run build:client`
3. Output directory: `dist/spa`
4. Environment variable: `VITE_API_BASE_URL=https://api.faskids.shop`

#### Single Server Deployment (Current)

Deploy both frontend and backend on same server:

1. **Build:**
```bash
npm run build
```

2. **Start:**
```bash
npm start
```

3. **Configure Nginx** (if using):
```nginx
server {
    listen 80;
    server_name faskids.shop;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Production Checklist

- [ ] Database seeded with data
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] CORS configured correctly
- [ ] Static files serving correctly
- [ ] Swagger docs accessible
- [ ] HTTPS configured (SSL certificate)
- [ ] Domain DNS configured
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place

### Monitoring

**API Health:**
- Check `/api/ping` endpoint
- Monitor MongoDB connection
- Watch for errors in logs

**Performance:**
- Monitor response times
- Track database query performance
- Monitor server resources

### Security

1. **Environment Variables:**
   - Never commit `.env` file
   - Use secure passwords in MongoDB
   - Rotate keys regularly

2. **CORS:**
   - Configure allowed origins
   - Remove wildcard in production

3. **Rate Limiting:**
   - Add rate limiting for API
   - Implement request throttling

4. **HTTPS:**
   - Configure SSL certificate
   - Force HTTPS redirects

### Troubleshooting

**Database Connection Issues:**
- Verify `MONGODB_URI` is correct
- Check Atlas whitelist IP
- Verify database user credentials

**API Not Working:**
- Check server is running
- Verify port 8080 is accessible
- Check CORS configuration

**Frontend Not Loading:**
- Verify `dist/spa` directory exists
- Check static file serving
- Review browser console errors

### Scaling Considerations

**Current Setup:**
- Single server handles all traffic
- MongoDB Atlas scales automatically

**Future Scaling:**
- Add load balancer
- Implement CDN for static assets
- Add caching layer (Redis)
- Separate read/write operations

---

**Ready for Production!** 🎉

For questions, contact: support@faskids.shop

