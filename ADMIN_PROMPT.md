# Admin Panel Development Prompt

## Project Overview
You are building an admin panel for **FAS KIDS** - a children's clothing e-commerce platform. The current client application is a React SPA with Express backend, featuring multi-language support (Uzbek/Russian), modern UI components, and comprehensive e-commerce functionality.

## Current Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Backend**: Express.js
- **Styling**: TailwindCSS 3 + Framer Motion
- **Icons**: Lucide React
- **Language Support**: Uzbek (uz) + Russian (ru)

## Data Types & Models

### Core Data Structures

```typescript
// Product Management
interface Product {
  id: string;
  slug: string;
  title: string;
  gender: "boy" | "girl" | "unisex";
  ageRange: "0-3m" | "3-6m" | "6-12m" | "1-3y" | "3-5y" | "5-7y" | "7-10y";
  categorySlug: string;
  price: number;
  oldPrice?: number;
  colors: string[];
  sizes: string[];
  images: string[];
  rating?: number;
  available: boolean;
  description: string;
  material: string;
  care: string;
}

// Category Management
interface Category {
  id: string;
  slug: string;
  title: string;
  icon?: string;
}

// Order Management
interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: "pending" | "processing" | "in_transit" | "delivered" | "cancelled";
  address: Address;
}

// User Management
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  wishlist: string[];
  recentlyViewed: string[];
}

// Cart Item (for orders)
interface CartItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
  image: string;
}

// Address
interface Address {
  id?: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  isDefault?: boolean;
}
```

## Admin Panel Requirements

### 1. Authentication & Authorization
- **Login System**: Secure admin authentication
- **Role-based Access**: Different permission levels
- **Session Management**: JWT-based authentication
- **Multi-language Support**: Uzbek/Russian interface

### 2. Dashboard Overview
- **Key Metrics**: Total orders, revenue, products, customers
- **Recent Orders**: Latest 10 orders with status
- **Low Stock Alerts**: Products running out of stock
- **Sales Analytics**: Charts showing sales trends
- **Quick Actions**: Common admin tasks shortcuts

### 3. Product Management
- **Product CRUD**: Create, read, update, delete products
- **Bulk Operations**: Import/export products, bulk price updates
- **Image Management**: Upload, organize, and optimize product images
- **Inventory Tracking**: Stock levels, low stock alerts
- **Product Variants**: Manage colors, sizes, and combinations
- **SEO Management**: Meta titles, descriptions, slugs
- **Multi-language Content**: Uzbek and Russian product descriptions

### 4. Category Management
- **Category CRUD**: Manage product categories
- **Hierarchical Categories**: Parent-child relationships
- **Category Icons**: Upload and manage category icons
- **Category Ordering**: Drag-and-drop category sorting

### 5. Order Management
- **Order List**: Filterable and searchable order list
- **Order Details**: Complete order information view
- **Status Management**: Update order status (pending → processing → in_transit → delivered)
- **Order Tracking**: Track order progress
- **Customer Communication**: Send order updates to customers
- **Refund Management**: Process refunds and returns

### 6. Customer Management
- **Customer List**: View all registered customers
- **Customer Details**: Individual customer profiles
- **Order History**: Customer's order history
- **Address Management**: Manage customer addresses
- **Communication**: Send notifications to customers

### 7. Inventory Management
- **Stock Levels**: Real-time inventory tracking
- **Low Stock Alerts**: Automatic notifications for low stock
- **Stock Adjustments**: Manual stock corrections
- **Supplier Management**: Track suppliers and purchase orders
- **MoySklad Integration**: Sync with external inventory system

### 8. Analytics & Reports
- **Sales Reports**: Daily, weekly, monthly sales reports
- **Product Performance**: Best/worst selling products
- **Customer Analytics**: Customer behavior and preferences
- **Revenue Tracking**: Financial reports and insights
- **Export Functionality**: Export reports to CSV/Excel

### 9. Content Management
- **Hero Banners**: Manage homepage carousel banners
- **Promotional Content**: Create and manage promotions
- **Blog/News**: Content management for announcements
- **SEO Settings**: Meta tags, site settings

### 10. System Settings
- **General Settings**: Site name, contact info, etc.
- **Payment Settings**: Configure payment methods
- **Shipping Settings**: Shipping rates and zones
- **Tax Settings**: Tax rates and calculations
- **Email Templates**: Customize email notifications
- **Language Settings**: Manage translations

## Technical Requirements

### Frontend Architecture
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS 3 (match existing design system)
- **UI Components**: Use shadcn/ui components for consistency
- **State Management**: Zustand for admin state
- **Routing**: React Router 6 for admin routes
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics visualization
- **Tables**: Advanced data tables with sorting, filtering, pagination

### Backend API Requirements
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based admin authentication
- **File Upload**: Image upload and management
- **Data Validation**: Zod schemas for API validation
- **Error Handling**: Comprehensive error handling
- **Logging**: Admin action logging and audit trails

### Database Schema Extensions
```sql
-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Sessions
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product Images (separate table for better management)
CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory Tracking
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  change_type VARCHAR(50) NOT NULL, -- 'sale', 'adjustment', 'restock'
  quantity_change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  admin_id UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints Structure
```
Authentication:
POST /api/admin/auth/login
POST /api/admin/auth/logout
GET /api/admin/auth/me

Products:
GET /api/admin/products
POST /api/admin/products
GET /api/admin/products/:id
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
POST /api/admin/products/bulk-import
GET /api/admin/products/export

Categories:
GET /api/admin/categories
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id

Orders:
GET /api/admin/orders
GET /api/admin/orders/:id
PUT /api/admin/orders/:id/status
GET /api/admin/orders/analytics

Customers:
GET /api/admin/customers
GET /api/admin/customers/:id
PUT /api/admin/customers/:id

Analytics:
GET /api/admin/analytics/dashboard
GET /api/admin/analytics/sales
GET /api/admin/analytics/products
GET /api/admin/analytics/customers

Files:
POST /api/admin/upload/images
DELETE /api/admin/files/:id
```

## Design Requirements

### Visual Design
- **Consistent Branding**: Use FAS KIDS purple theme (#8B5CF6)
- **Professional Layout**: Clean, modern admin interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Accessibility**: WCAG 2.1 AA compliance

### User Experience
- **Intuitive Navigation**: Clear menu structure and breadcrumbs
- **Quick Actions**: Common tasks easily accessible
- **Bulk Operations**: Efficient mass operations
- **Real-time Updates**: Live data updates where appropriate
- **Keyboard Shortcuts**: Power user features

## Security Requirements
- **Authentication**: Secure admin login with strong passwords
- **Authorization**: Role-based access control
- **CSRF Protection**: Cross-site request forgery protection
- **XSS Prevention**: Input sanitization and validation
- **Rate Limiting**: API rate limiting for security
- **Audit Logging**: Track all admin actions

## Integration Requirements
- **MoySklad Integration**: Sync inventory with external system
- **Email Notifications**: Send order updates to customers
- **Payment Gateway**: Integrate with payment providers
- **Analytics**: Google Analytics integration
- **Backup System**: Automated data backups

## Performance Requirements
- **Fast Loading**: Optimized bundle size and lazy loading
- **Efficient Queries**: Optimized database queries
- **Caching**: Redis caching for frequently accessed data
- **Image Optimization**: Compressed and optimized images
- **Pagination**: Efficient data pagination

## Deployment Requirements
- **Environment Variables**: Secure configuration management
- **Docker Support**: Containerized deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance monitoring
- **Error Tracking**: Comprehensive error tracking

## Success Metrics
- **Admin Efficiency**: Reduced time for common tasks
- **Data Accuracy**: Improved data quality and consistency
- **User Satisfaction**: Positive admin user feedback
- **System Reliability**: 99.9% uptime
- **Security**: Zero security breaches

## Deliverables
1. **Complete Admin Panel**: Full-featured admin interface
2. **API Documentation**: Comprehensive API documentation
3. **User Manual**: Admin user guide and training materials
4. **Deployment Guide**: Step-by-step deployment instructions
5. **Security Audit**: Security assessment and recommendations

## Timeline Expectations
- **Phase 1** (2-3 weeks): Core admin functionality (products, orders, users)
- **Phase 2** (1-2 weeks): Analytics and reporting features
- **Phase 3** (1 week): Advanced features and integrations
- **Phase 4** (1 week): Testing, security audit, and deployment

This admin panel should provide comprehensive management capabilities for the FAS KIDS e-commerce platform while maintaining consistency with the existing client application's design and functionality.
