import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDatabase from "./config/database";
import { getProducts, getProductBySlug, createProduct, updateProduct, patchProduct, deleteProduct } from "./routes/products";
import { getCategories, getCategoryBySlug, createCategory, updateCategory, patchCategory, deleteCategory } from "./routes/categories";
import { getProductComments, createComment, updateComment, patchComment, deleteComment, markHelpful } from "./routes/comments";
import { signup, login, getMe, updateProfile, authMiddleware } from "./routes/demo"; // Will be renamed to auth.ts

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:8080",
    "https://faskids.shop",
    "https://www.faskids.shop",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FasKids API",
      version: "1.0.0",
      description: "API documentation for FasKids children's clothing e-commerce platform",
      contact: {
        name: "FasKids Support",
        email: "support@faskids.shop",
        url: "https://faskids.shop"
      },
      servers: [
        {
          url: "https://api.faskids.shop",
          description: "Production API server"
        },
        {
          url: "http://localhost:8080/api",
          description: "Development server"
        }
      ]
    },
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["slug", "title", "gender", "ageRange", "categorySlug", "price", "available", "description", "material", "care"],
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            title: { type: "string" },
            gender: { type: "string", enum: ["boy", "girl", "unisex"] },
            ageRange: { type: "string", enum: ["0-3m", "3-6m", "6-12m", "1-3y", "3-5y", "5-7y", "7-10y"] },
            categorySlug: { type: "string" },
            price: { type: "number" },
            oldPrice: { type: "number" },
            colors: { type: "array", items: { type: "string" } },
            sizes: { type: "array", items: { type: "string" } },
            images: { type: "array", items: { type: "string" } },
            rating: { type: "number", minimum: 0, maximum: 5 },
            reviewCount: { type: "number" },
            available: { type: "boolean" },
            description: { type: "string" },
            material: { type: "string" },
            care: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            recommendedProducts: { type: "array", items: { type: "string" } },
            similarProducts: { type: "array", items: { type: "string" } }
          }
        },
        Category: {
          type: "object",
          required: ["slug", "title"],
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            title: { type: "string" },
            icon: { type: "string" }
          }
        },
        Comment: {
          type: "object",
          required: ["productId", "userId", "userName", "rating", "title", "content"],
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            userId: { type: "string" },
            userName: { type: "string" },
            userAvatar: { type: "string" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            title: { type: "string" },
            content: { type: "string" },
            date: { type: "string" },
            verified: { type: "boolean" },
            helpful: { type: "number" },
            images: { type: "array", items: { type: "string" } },
            size: { type: "string" },
            color: { type: "string" }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      }
    }
  },
  apis: ["./server/routes/*.ts", "./server/index.ts"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Health check
app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

app.get("/api/debug/routes", (_req, res) => {
  res.json({
    message: "Auth routes are registered",
    routes: [
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "PUT /api/auth/update-profile"
    ],
    database: "Connected to MongoDB"
  });
});

// API Routes
// Products - Full CRUD
app.get("/api/products", getProducts);
app.post("/api/products", createProduct);
app.get("/api/products/:slug", getProductBySlug);
app.put("/api/products/:slug", updateProduct);
app.patch("/api/products/:slug", patchProduct);
app.delete("/api/products/:slug", deleteProduct);

// Categories - Full CRUD
app.get("/api/categories", getCategories);
app.post("/api/categories", createCategory);
app.get("/api/categories/:slug", getCategoryBySlug);
app.put("/api/categories/:slug", updateCategory);
app.patch("/api/categories/:slug", patchCategory);
app.delete("/api/categories/:slug", deleteCategory);

// Auth Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.get("/api/auth/me", getMe);
app.put("/api/auth/update-profile", authMiddleware, updateProfile);

// Comments - Full CRUD (protected routes require auth)
app.get("/api/products/:productId/comments", getProductComments);
app.post("/api/products/:productId/comments", authMiddleware, createComment);
app.put("/api/comments/:commentId", authMiddleware, updateComment);
app.patch("/api/comments/:commentId", authMiddleware, patchComment);
app.delete("/api/comments/:commentId", authMiddleware, deleteComment);
app.post("/api/comments/:commentId/helpful", markHelpful);

// Swagger JSON endpoint
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export function createServer(): express.Application {
  // Connect to database
  connectDatabase();
  
  return app;
}
