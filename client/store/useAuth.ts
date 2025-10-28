import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, User } from "@/lib/api";

type UserRole = 'admin' | 'cashier' | 'user';

interface AuthUser extends User {
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; phone?: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearError: () => void;
  fetchUser: () => Promise<void>;
  
  // Helpers
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

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.auth.login(email, password);
          
          // Store token in localStorage for persistence
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
          throw error;
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.auth.signup(userData);
          
          // Store token in localStorage for persistence
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
            error: null 
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