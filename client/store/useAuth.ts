import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, User } from "@/lib/api";

type UserRole = 'admin' | 'cashier' | 'user';

interface AuthUser extends User {
  role: UserRole;
}

// Default admin user
const DEFAULT_ADMIN = {
  phone: '+998507266007',
  password: 'faskids6007',
  name: 'Admin User',
  role: 'admin' as const,
};

// Helpers to normalize and format phone numbers
function digitsOnly(input: string): string {
  return (input || '').replace(/[^0-9]/g, '');
}

function normalizePhone(input: string): { ok: boolean; e164: string | null } {
  const digits = digitsOnly(input);
  if (digits.length === 12 && digits.startsWith('998')) {
    return { ok: true, e164: digits }; // 998 + 9 digits
  }
  if (digits.length === 9) {
    return { ok: true, e164: `998${digits}` };
  }
  return { ok: false, e164: null };
}

function formatUzbekDashed(e164: string): string {
  // Expect 12 digits starting with 998
  const d = e164.startsWith('998') ? e164.slice(3) : e164;
  if (d.length !== 9) return e164;
  // XX-XXX-XX-XX
  return `+998-${d.slice(0,2)}-${d.slice(2,5)}-${d.slice(5,7)}-${d.slice(7,9)}`;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (phone: string, password: string) => Promise<void>;
  signup: (userData: { name: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearError: () => void;
  fetchUser: () => Promise<void>;
  
  // Helpers
  validatePhone: (phone: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Validate phone number in a flexible way; accept common inputs and check length
      validatePhone: (phone: string): boolean => {
        const { ok } = normalizePhone(phone);
        return ok;
      },
      
      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Handle default admin login (accept any formatting of admin phone)
        const normalizedAdmin = normalizePhone(DEFAULT_ADMIN.phone).e164;
        const normalizedInput = normalizePhone(phone).e164;
        if (normalizedInput && normalizedAdmin && normalizedInput === normalizedAdmin && password === DEFAULT_ADMIN.password) {
          const adminUser = {
            id: 'admin-1',
            name: DEFAULT_ADMIN.name,
            email: 'admin@faskids.uz',
            phone: formatUzbekDashed(normalizedInput),
            role: DEFAULT_ADMIN.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            addresses: [],
            wishlist: [],
            recentlyViewed: []
          };
          
          const token = 'admin-token-' + Date.now();
          localStorage.setItem('auth_token', token);
          
          set({ 
            user: adminUser, 
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return;
        }

        try {
          // Pass through original; API will sanitize, but we also accept flexible inputs
          const { user, token } = await api.auth.login(phone, password);
          localStorage.setItem('auth_token', token);
          set({ 
            user: user as AuthUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          // Clear any invalid token on error
          localStorage.removeItem('auth_token');
          
          const errorMessage = error.message || 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        
        // Validate and normalize phone number
        const norm = normalizePhone(userData.phone);
        if (!norm.ok || !norm.e164) {
          const error = 'Iltimos, to‘g‘ri telefon raqamini kiriting (masalan, +998 XX XXX XX XX)';
          set({ error, isLoading: false });
          throw new Error(error);
        }
        
        try {
          const e164 = norm.e164; // 998XXXXXXXXX
          
          const { user, token } = await api.auth.signup({
            ...userData,
            phone: e164, // backend will derive email; we keep digits
          });
          
          // Store token in localStorage for persistence
          localStorage.setItem('auth_token', token);
          
          set({ 
            user: { ...user, phone: formatUzbekDashed(e164) } as AuthUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          // Clear any invalid token on error
          localStorage.removeItem('auth_token');
          
          const errorMessage = error.message || 'Signup failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem('auth_token');
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      fetchUser: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await api.auth.getMe();
          set({ 
            user: user as AuthUser, 
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Clear invalid token on error
          localStorage.removeItem('auth_token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Role-based access control helpers
      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },
      
      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return roles.some(role => user?.role === role);
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields to prevent hydration issues
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);
