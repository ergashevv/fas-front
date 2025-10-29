import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/store/useAuth";
import { ReactNode, useEffect } from "react";

// Core Layout
import { Header } from "@/components/core/Header";
import { Footer } from "@/components/core/Footer";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { ScrollToTopOnRouteChange } from "@/components/common/ScrollToTopOnRouteChange";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Gender from "./pages/Gender";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, token, fetchUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Try to fetch user if we have a token but no user data
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, [token, isAuthenticated, fetchUser]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Global auth bootstrapper to load user from /me when token exists
const AuthInit = () => {
  const { token, user, fetchUser, isLoading } = useAuth();
  useEffect(() => {
    if (token && !user && !isLoading) {
      fetchUser();
    }
  }, [token, user, isLoading, fetchUser]);
  return null;
};

// Guest Route Component - Only for non-authenticated users
const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}



const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <AuthInit />
          <Header />
          <main className="flex-grow">
            <ScrollToTop />
            <ScrollToTopOnRouteChange />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/gender/:gender" element={<Gender />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={<Checkout />}
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/*"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Guest Only Routes */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                }
              />
              
              <Route path="/payment/success" element={<div className="p-10 text-center">To‘lov muvaffaqiyatli! Rahmat.</div>} />
              <Route path="/payment/fail" element={<div className="p-10 text-center">To‘lov bekor qilindi yoki xatolik yuz berdi.</div>} />
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
