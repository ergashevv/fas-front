import { AdminUser, AdminStats, Product, Category, Order, DeliveryInfo } from "@shared/api";
import { api as baseApi } from "./api";

const API_BASE = "";

export const adminApi = {
  // Dashboard Stats
  getStats: async (): Promise<AdminStats> => {
    const response = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch admin stats");
    return await response.json();
  },

  // User Management
  users: {
    getAll: async (params?: { page?: number; limit?: number; role?: string }): Promise<{
      users: AdminUser[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }> => {
      const queryString = new URLSearchParams(params as any).toString();
      const response = await fetch(`${API_BASE}/api/admin/users${queryString ? `?${queryString}` : ""}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    },

    create: async (userData: {
      name: string;
      phone: string;
      password: string;
      role: "admin" | "moderator" | "user";
    }): Promise<{ message: string; user: AdminUser }> => {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error("Failed to create user");
      return await response.json();
    },

    update: async (id: string, userData: Partial<AdminUser>): Promise<{ message: string; user: AdminUser }> => {
      const response = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error("Failed to update user");
      return await response.json();
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return await response.json();
    }
  },

  // Product Management
  products: {
    create: async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<{ message: string; product: Product }> => {
      const response = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error("Failed to create product");
      return await response.json();
    },

    update: async (id: string, productData: Partial<Product>): Promise<{ message: string; product: Product }> => {
      const response = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error("Failed to update product");
      return await response.json();
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return await response.json();
    }
  },

  // Category Management
  categories: {
    create: async (categoryData: Omit<Category, 'id'>): Promise<{ message: string; category: Category }> => {
      const response = await fetch(`${API_BASE}/api/admin/categories`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error("Failed to create category");
      return await response.json();
    },

    update: async (id: string, categoryData: Partial<Category>): Promise<{ message: string; category: Category }> => {
      const response = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error("Failed to update category");
      return await response.json();
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return await response.json();
    }
  },

  // Order Management
  orders: {
    getAll: async (params?: { page?: number; limit?: number; status?: string }): Promise<{
      orders: Order[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }> => {
      const queryString = new URLSearchParams(params as any).toString();
      const response = await fetch(`${API_BASE}/api/admin/orders${queryString ? `?${queryString}` : ""}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    },

    updateStatus: async (id: string, status: string): Promise<{ message: string; order: Order }> => {
      const response = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return await response.json();
    },

    assignCourier: async (id: string, courierData: {
      courierId: string;
      courierName: string;
      courierPhone: string;
      estimatedTime?: number;
    }): Promise<{ message: string; order: Order }> => {
      const response = await fetch(`${API_BASE}/api/admin/orders/${id}/courier`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courierData)
      });
      if (!response.ok) throw new Error("Failed to assign courier");
      return await response.json();
    }
  }
};

// Delivery API
export const deliveryApi = {
  calculate: async (locationData: {
    latitude: number;
    longitude: number;
    address: any;
  }): Promise<DeliveryInfo> => {
    const response = await fetch(`${API_BASE}/api/delivery/calculate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
    if (!response.ok) throw new Error("Failed to calculate delivery");
    return await response.json();
  },

  track: async (orderId: string) => {
    const response = await fetch(`${API_BASE}/api/delivery/track/${orderId}`);
    if (!response.ok) throw new Error("Failed to track order");
    return await response.json();
  }
};