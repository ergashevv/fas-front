import { Product, Category, Comment, Order, User } from "@shared/api";

export type { User }; // Re-export the User type

// Always use same-origin base so CORS never triggers; Vercel/NGINX rewrites handle /api → backend
const API_BASE = "";

// Helper function to get auth headers
function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  // Auth endpoints
  auth: {
    signup: async (userData: { name: string; phone: string; password: string }): Promise<{ user: User; token: string }> => {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    login: async (phone: string, password: string): Promise<{ user: User; token: string }> => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      return handleResponse(response);
    },
    getMe: async (): Promise<User> => {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      const data = await handleResponse<{ user: User }>(response);
      return data.user;
    },
  },

  // Order endpoints
  orders: {
    create: async (orderData: any): Promise<Order> => {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(orderData),
      });
      return handleResponse(response);
    },
    getMyOrders: async (): Promise<Order[]> => {
      const response = await fetch(`${API_BASE}/api/orders/my`, {
        headers: { ...getAuthHeader() },
      });
      const data = await handleResponse<{ orders: Order[] }>(response);
      return data.orders;
    },
    getAllOrders: async (): Promise<Order[]> => {
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: { ...getAuthHeader() },
      });
      const data = await handleResponse<{ orders: Order[] }>(response);
      return data.orders;
    },
    updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
  },

  // Existing product endpoints
  products: {
    getAll: async (params?: Record<string, any>): Promise<{ products: Product[]; total: number; page: number; limit: number }> => {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const response = await fetch(`${API_BASE}/api/products${queryString ? `?${queryString}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    },
    getBySlug: async (slug: string): Promise<Product> => {
      const response = await fetch(`${API_BASE}/api/products/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return await response.json();
    }
  },
  
  shipping: {
    quote: async (region: string, method: string, weight: number): Promise<{ fee: number; etaDays: number }> => {
      const params = new URLSearchParams({ region, method, weight: String(weight) });
      const response = await fetch(`${API_BASE}/api/shipping/quote?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to get quote");
      return await response.json();
    }
  },

  payments: {
    createPayme: async (orderId: string, amount: number): Promise<{ intentId: string; redirectUrl: string }> => {
      const response = await fetch(`${API_BASE}/api/payments/payme/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ orderId, amount })
      });
      return handleResponse(response);
    },
    createClick: async (orderId: string, amount: number): Promise<{ intentId: string; redirectUrl: string }> => {
      const response = await fetch(`${API_BASE}/api/payments/click/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ orderId, amount })
      });
      return handleResponse(response);
    }
  },
  
  categories: {
    getAll: async (): Promise<Category[]> => {
      const response = await fetch(`${API_BASE}/api/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    },
    getBySlug: async (slug: string): Promise<Category> => {
      const response = await fetch(`${API_BASE}/api/categories/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return await response.json();
    }
  },
  
  comments: {
    getByProduct: async (productId: string, params?: { sort?: string; filter?: string }): Promise<Comment[]> => {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const response = await fetch(`${API_BASE}/api/products/${productId}/comments${queryString ? `?${queryString}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return await response.json();
    },
    create: async (productId: string, commentData: Partial<Comment>): Promise<Comment> => {
      const response = await fetch(`${API_BASE}/api/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return await response.json();
    },
    markHelpful: async (commentId: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/api/comments/${commentId}/helpful`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to mark comment as helpful");
    }
  }
};

