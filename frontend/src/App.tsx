import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import CarsPage from "./pages/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ValuationPage from "./pages/ValuationPage";
import FinancingPage from "./pages/FinancingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Buyer Dashboard Pages (Protected)
import ProfilePage from "./pages/ProfilePage";
import SavedCarsPage from "./pages/SavedCarsPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import MessagesPage from "./pages/MessagesPage";

// Admin Pages (Protected)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddCar from "./pages/admin/AdminAddCar";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminHomepage from "./pages/admin/AdminHomepage";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminEditCar from "./pages/admin/AdminEditCar";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminBrands from "./pages/admin/AdminBrands";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import CheckoutProtection from "./components/auth/CheckoutProtection";
import LiveChat from "./components/chat/LiveChat";
import WhatsAppButton from "./components/chat/WhatsAppButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Routes>
              {/* Guest Routes - Public pages with top navbar only */}
              <Route path="/" element={<Index />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/cars/:id" element={<CarDetailsPage />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/financing" element={<FinancingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Checkout - Requires login, redirects to auth if not logged in */}
              <Route path="/checkout" element={
                <CheckoutProtection>
                  <CheckoutPage />
                </CheckoutProtection>
              } />

              {/* Buyer Routes - Dashboard with sidebar (after login) - Customer only */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireCustomer>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute requireCustomer>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute requireCustomer>
                  <SavedCarsPage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute requireCustomer>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute requireCustomer>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Admin Routes - Separate /admin layout with sidebar */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-car" element={
                <ProtectedRoute requireAdmin>
                  <AdminAddCar />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-car/:id" element={
                <ProtectedRoute requireAdmin>
                  <AdminEditCar />
                </ProtectedRoute>
              } />
              <Route path="/admin/cars" element={
                <ProtectedRoute requireAdmin>
                  <AdminInventory />
                </ProtectedRoute>
              } />
              <Route path="/admin/inventory" element={
                <ProtectedRoute requireAdmin>
                  <AdminInventory />
                </ProtectedRoute>
              } />
              <Route path="/admin/messages" element={
                <ProtectedRoute requireAdmin>
                  <AdminMessages />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/media" element={
                <ProtectedRoute requireAdmin>
                  <AdminMedia />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requireAdmin>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/reviews" element={
                <ProtectedRoute requireAdmin>
                  <AdminReviews />
                </ProtectedRoute>
              } />
              <Route path="/admin/homepage" element={
                <ProtectedRoute requireAdmin>
                  <AdminHomepage />
                </ProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <ProtectedRoute requireAdmin>
                  <AdminNotifications />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/brands" element={
                <ProtectedRoute requireAdmin>
                  <AdminBrands />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <LiveChat />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
