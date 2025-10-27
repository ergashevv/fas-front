import { Product, Category, Comment } from "@shared/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "https://api.faskids.shop" : "/api");

export const api = {
  products: {
    getAll: async (params?: Record<string, any>): Promise<{ products: Product[]; total: number; page: number; limit: number }> => {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const response = await fetch(`${API_BASE}/products${queryString ? `?${queryString}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    },
    getBySlug: async (slug: string): Promise<Product> => {
      const response = await fetch(`${API_BASE}/products/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return await response.json();
    }
  },
  
  categories: {
    getAll: async (): Promise<Category[]> => {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    },
    getBySlug: async (slug: string): Promise<Category> => {
      const response = await fetch(`${API_BASE}/categories/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return await response.json();
    }
  },
  
  comments: {
    getByProduct: async (productId: string, params?: { sort?: string; filter?: string }): Promise<Comment[]> => {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const response = await fetch(`${API_BASE}/products/${productId}/comments${queryString ? `?${queryString}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return await response.json();
    },
    create: async (productId: string, commentData: Partial<Comment>): Promise<Comment> => {
      const response = await fetch(`${API_BASE}/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return await response.json();
    },
    markHelpful: async (commentId: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/comments/${commentId}/helpful`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to mark comment as helpful");
    }
  }
};

