# 🚀 Complete CRUD API Documentation

## ✅ **All CRUD Operations Implemented**

Your API now has complete CRUD operations for all resources with full Swagger documentation.

---

## 📊 **Complete API Endpoints**

### **Products - Full CRUD**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/products` | List all products (with filters) |
| **POST** | `/api/products` | Create new product |
| **GET** | `/api/products/:slug` | Get single product |
| **PUT** | `/api/products/:slug` | Full update product |
| **PATCH** | `/api/products/:slug` | Partial update product |
| **DELETE** | `/api/products/:slug` | Delete product |

#### **GET /api/products** - Query Parameters
- `search` - Search term
- `gender` - Filter by gender (boy/girl/unisex)
- `age` - Filter by age range
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `available` - Filter by availability
- `page` - Page number
- `limit` - Items per page

---

### **Categories - Full CRUD**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/categories` | List all categories |
| **POST** | `/api/categories` | Create new category |
| **GET** | `/api/categories/:slug` | Get single category |
| **PUT** | `/api/categories/:slug` | Full update category |
| **PATCH** | `/api/categories/:slug` | Partial update category |
| **DELETE** | `/api/categories/:slug` | Delete category |

---

### **Comments - Full CRUD**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/products/:productId/comments` | Get product comments |
| **POST** | `/api/products/:productId/comments` | Create comment |
| **PUT** | `/api/comments/:commentId` | Full update comment |
| **PATCH** | `/api/comments/:commentId` | Partial update comment |
| **DELETE** | `/api/comments/:commentId` | Delete comment |
| **POST** | `/api/comments/:commentId/helpful` | Mark helpful |

#### **GET /api/products/:productId/comments** - Query Parameters
- `sort` - Sort by (newest/helpful/rating)
- `filter` - Filter (all/verified/withImages)

---

### **Health Check**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/ping` | Health check |

---

## 🎯 **CRUD Operations Explained**

### **GET - Read**
- Retrieve data
- Can use filters and pagination
- Returns list or single item

### **POST - Create**
- Create new resources
- Requires full data in request body
- Returns created resource

### **PUT - Full Update**
- Update entire resource
- Replaces all fields
- Must send complete data

### **PATCH - Partial Update**
- Update specific fields
- Send only fields to update
- More flexible than PUT

### **DELETE - Remove**
- Delete resource
- Returns success message
- Resource removed from database

---

## 🔧 **Swagger UI Features**

### **Access Swagger UI**
- **Local**: `http://localhost:8080/api-docs`
- **Production**: `https://api.faskids.shop/api-docs`

### **Try It Out**
1. Click any endpoint
2. Click **"Try it out"**
3. Fill in parameters/body
4. Click **"Execute"**
5. See response

### **Documentation Includes**
- ✅ Request body examples
- ✅ Response schemas
- ✅ Query parameters
- ✅ Path parameters
- ✅ Error responses
- ✅ Status codes

---

## 📝 **Example Requests**

### **Create Product**
```bash
POST /api/products
Content-Type: application/json

{
  "slug": "test-product",
  "title": "Test Product",
  "gender": "boy",
  "ageRange": "3-5y",
  "categorySlug": "tops",
  "price": 50000,
  "colors": ["qizil", "ko'k"],
  "sizes": ["98", "104"],
  "images": ["/placeholder.svg"],
  "available": true,
  "description": "Test description",
  "material": "100% paxta",
  "care": "30° da yuvish"
}
```

### **Update Product (Partial)**
```bash
PATCH /api/products/test-product
Content-Type: application/json

{
  "price": 55000,
  "available": false
}
```

### **Update Product (Full)**
```bash
PUT /api/products/test-product
Content-Type: application/json

{
  "slug": "test-product",
  "title": "Updated Product",
  "gender": "boy",
  "ageRange": "3-5y",
  "categorySlug": "tops",
  "price": 60000,
  "colors": ["qora", "oq"],
  "sizes": ["98", "104", "110"],
  "images": ["/updated.svg"],
  "available": true,
  "description": "Updated description",
  "material": "100% synthetic",
  "care": "Hand wash"
}
```

### **Delete Product**
```bash
DELETE /api/products/test-product
```

### **Update Comment (Partial)**
```bash
PATCH /api/comments/comment-id
Content-Type: application/json

{
  "verified": true
}
```

### **Update Category**
```bash
PATCH /api/categories/tops
Content-Type: application/json

{
  "title": "Updated Tops",
  "icon": "👕"
}
```

---

## 🎉 **All Available Operations**

### **Products (6 operations)**
- ✅ GET (List) - `/api/products`
- ✅ POST (Create) - `/api/products`
- ✅ GET (Read) - `/api/products/:slug`
- ✅ PUT (Full Update) - `/api/products/:slug`
- ✅ PATCH (Partial Update) - `/api/products/:slug`
- ✅ DELETE (Delete) - `/api/products/:slug`

### **Categories (6 operations)**
- ✅ GET (List) - `/api/categories`
- ✅ POST (Create) - `/api/categories`
- ✅ GET (Read) - `/api/categories/:slug`
- ✅ PUT (Full Update) - `/api/categories/:slug`
- ✅ PATCH (Partial Update) - `/api/categories/:slug`
- ✅ DELETE (Delete) - `/api/categories/:slug`

### **Comments (6 operations)**
- ✅ GET (Read) - `/api/products/:id/comments`
- ✅ POST (Create) - `/api/products/:id/comments`
- ✅ PUT (Update) - `/api/comments/:id`
- ✅ PATCH (Partial) - `/api/comments/:id`
- ✅ DELETE (Delete) - `/api/comments/:id`
- ✅ POST (Helpful) - `/api/comments/:id/helpful`

### **Health (1 operation)**
- ✅ GET - `/api/ping`

**Total: 19 API Endpoints** 🎯

---

## ✅ **Status: Complete**

Your API now has:
- ✅ Full CRUD for all resources
- ✅ GET, POST, PUT, PATCH, DELETE
- ✅ Complete Swagger documentation
- ✅ Request/Response examples
- ✅ Try It Out functionality

**Test all operations at `https://api.faskids.shop/api-docs`!** 🚀
