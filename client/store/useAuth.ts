import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/login", { phone, password });
          const { token, user } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          throw new Error(errorMessage);
        }
      },

      signup: async (name: string, email: string, phone: string, password: string) => {
        console.log("🔐 Signup called with:", { name, email, phone, password: "***" });
        set({ isLoading: true, error: null });
        try {
          console.log("📡 Sending signup request to /api/auth/signup");
          const response = await axios.post("/api/auth/signup", { 
            name, 
            email, 
            phone, 
            password 
          });
          console.log("✅ Signup response:", response.data);
          const { token, user } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          console.error("❌ Signup error:", error);
          console.error("❌ Error response:", error.response?.data);
          const errorMessage = error.response?.data?.message || "Signup failed";
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      clearError: () => set({ error: null }),

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          // Token is invalid, clear auth state
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);