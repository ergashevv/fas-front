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

      // Validate phone number format: +998-XX-XXX-XX-XX
      validatePhone: (phone: string): boolean => {
        const phoneRegex = /^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
      },
      
      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Handle default admin login
        if (phone === DEFAULT_ADMIN.phone && password === DEFAULT_ADMIN.password) {
          const adminUser = {
            id: 'admin-1',
            name: DEFAULT_ADMIN.name,
            email: 'admin@faskids.uz',
            phone: DEFAULT_ADMIN.phone,
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
        
        // Validate phone number format
        if (!get().validatePhone(userData.phone)) {
          const error = 'Iltimos, telefon raqamingizni +998-XX-XXX-XX-XX formatida kiriting';
          set({ error, isLoading: false });
          throw new Error(error);
        }
        
        try {
          // Format phone to remove dashes for backend
          const formattedPhone = userData.phone.replace(/-/g, '');
          
          const { user, token } = await api.auth.signup({
            ...userData,
            phone: formattedPhone,
          });
          
          // Store token in localStorage for persistence
          localStorage.setItem('auth_token', token);
          
          set({ 
            user: { ...user, phone: userData.phone } as AuthUser, // Keep formatted phone with dashes
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
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);