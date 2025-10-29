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

export interface User {
  id: string;
  name: string;
  phone: string;
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
}
