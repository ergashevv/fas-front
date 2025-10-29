export interface Product {
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
  reviewCount?: number;
  available: boolean;
  description: string;
  material: string;
  care: string;
  tags?: string[];
  recommendedProducts?: string[];
  similarProducts?: string[];
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  icon?: string;
}

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
  image: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: "pending" | "confirmed" | "preparing" | "ready_for_delivery" | "in_transit" | "delivered" | "cancelled";
  address: Address;
  delivery: DeliveryInfo;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod?: "cash" | "card" | "payme" | "click";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: "admin" | "moderator" | "user";
  addresses: Address[];
  wishlist: string[];
  recentlyViewed: string[];
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

export interface Comment {
  id: string;
  productId: string | { slug: string; title: string; images: string[]; price: number };
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  size?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryInfo {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address: Address;
  estimatedTime?: number;
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  instructions?: string;
  distance?: number;
  deliveryCost?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: "admin" | "moderator" | "user";
  isActive: boolean;
  lastLogin?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalComments: number;
  totalRevenue: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
}

export interface OrderTracking {
  order: {
    id: string;
    status: string;
    total: number;
    estimatedTime?: number;
  };
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    timestamp?: string;
    completed: boolean;
  }>;
  courier?: {
    name: string;
    phone: string;
  };
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: "admin" | "moderator" | "user";
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

// Advanced Admin Stats
export interface AdvancedStats {
  period: string;
  userStats: Array<{
    _id: string;
    newUsers: number;
    activeUsers: number;
  }>;
  orderStats: Array<{
    _id: {
      date: string;
      status: string;
    };
    count: number;
    totalAmount: number;
  }>;
  revenueStats: Array<{
    _id: string;
    revenue: number;
    orderCount: number;
    avgOrderValue: number;
  }>;
  topProducts: Array<{
    _id: string;
    title: string;
    price: number;
    salesCount: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    _id: string;
    name: string;
    phone: string;
    orderCount: number;
    totalSpent: number;
    avgOrderValue: number;
  }>;
  activityStats: Array<{
    _id: {
      action: string;
      resource: string;
      userRole: string;
    };
    count: number;
  }>;
  recentActivity: AuditLog[];
}

// System Health
export interface SystemHealth {
  status: string;
  timestamp: string;
  database: {
    connected: boolean;
    collections: {
      users: number;
      products: number;
      orders: number;
      comments: number;
      auditLogs: number;
    };
  };
  activity: {
    last24Hours: number;
  };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  uptime: number;
}

// Permission Types
export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  admin: Record<string, string[]>;
  moderator: Record<string, string[]>;
  user: Record<string, string[]>;
}
