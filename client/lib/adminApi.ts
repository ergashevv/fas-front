import { 
  AdminUser, 
  AdminStats, 
  Product, 
  Category, 
  Order, 
  DeliveryInfo,
  AuditLog,
  AdvancedStats,
  SystemHealth
} from "@shared/api";

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
    getAll: async (params?: { page?: number; limit?: number; role?: string; search?: string; isActive?: string }): Promise<{
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

    toggleStatus: async (userId: string): Promise<{ message: string; data: AdminUser }> => {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to toggle user status");
      return await response.json();
    },

    changeRole: async (userId: string, role: "admin" | "moderator" | "user"): Promise<{ message: string; data: AdminUser }> => {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/change-role`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error("Failed to change user role");
      return await response.json();
    }
  },

  // Audit Logs
  auditLogs: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      resource?: string;
      action?: string;
      userRole?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<{
      data: AuditLog[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }> => {
      const queryString = new URLSearchParams(params as any).toString();
      const response = await fetch(`${API_BASE}/api/admin/audit-logs${queryString ? `?${queryString}` : ""}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      return await response.json();
    }
  },

  // System Management
  system: {
    getAdvancedStats: async (period?: string): Promise<AdvancedStats> => {
      const queryString = period ? `?period=${period}` : '';
      const response = await fetch(`${API_BASE}/api/admin/dashboard/advanced${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch advanced stats");
      const result = await response.json();
      return result.data;
    },

    getHealth: async (): Promise<SystemHealth> => {
      const response = await fetch(`${API_BASE}/api/admin/system/health`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch system health");
      const result = await response.json();
      return result.data;
    }
  },

  // Delivery Management
  delivery: {
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
  }
};