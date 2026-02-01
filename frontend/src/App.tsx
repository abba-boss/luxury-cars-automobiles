import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ChatProvider } from "@/contexts/ChatContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GlobalAppLoader from "./components/ui/GlobalAppLoader";
import PageTransitionLoader from "./components/ui/PageTransitionLoader";
import { useState, useEffect } from "react";

// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const CarsPage = lazy(() => import("./pages/CarsPage"));
const CarDetailsPage = lazy(() => import("./pages/CarDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ValuationPage = lazy(() => import("./pages/ValuationPage"));
const FinancingPage = lazy(() => import("./pages/FinancingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Buyer Dashboard Pages (Protected)
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SavedCarsPage = lazy(() => import("./pages/SavedCarsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));

// Admin Pages (Protected)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAddCar = lazy(() => import("./pages/admin/AdminAddCar"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminEditCar = lazy(() => import("./pages/admin/AdminEditCar"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUserPermissions = lazy(() => import("./pages/admin/AdminUserPermissions"));

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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <GlobalAppLoader />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <PageTransitionLoader />
            <AuthProvider>
              <CartProvider>
                <ChatProvider>
                  <PageTransitionLoader />
                  <Routes>
                    {/* Guest Routes - Public pages with top navbar only */}
                    <Route path="/" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <Index />
                      </Suspense>
                    } />
                    <Route path="/cars" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <CarsPage />
                      </Suspense>
                    } />
                    <Route path="/cars/:id" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <CarDetailsPage />
                      </Suspense>
                    } />
                    <Route path="/financing" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <FinancingPage />
                      </Suspense>
                    } />
                    <Route path="/about" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <AboutPage />
                      </Suspense>
                    } />
                    <Route path="/contact" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <ContactPage />
                      </Suspense>
                    } />
                    <Route path="/privacy" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <PrivacyPolicyPage />
                      </Suspense>
                    } />
                    <Route path="/terms" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <TermsOfServicePage />
                      </Suspense>
                    } />
                    <Route path="/cart" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <CartPage />
                      </Suspense>
                    } />
                    <Route path="/auth" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <AuthPage />
                      </Suspense>
                    } />

                    {/* Checkout - Requires login, redirects to auth if not logged in */}
                    <Route path="/checkout" element={
                      <CheckoutProtection>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <CheckoutPage />
                        </Suspense>
                      </CheckoutProtection>
                    } />

                    {/* Buyer Routes - Dashboard with sidebar (after login) - Customer only */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requireCustomer>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <DashboardPage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute requireCustomerOrAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <OrdersPage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/saved" element={
                      <ProtectedRoute requireCustomer>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <SavedCarsPage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute requireCustomer>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <MessagesPage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute requireCustomer>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <ProfilePage />
                        </Suspense>
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes - Separate /admin layout with sidebar */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/add-car" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminAddCar />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/edit-car/:id" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminEditCar />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/cars" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminInventory />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/inventory" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminInventory />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/messages" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminMessages />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminOrders />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminUsers />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/media" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminMedia />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/bookings" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminBookings />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reviews" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminReviews />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/homepage" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminHomepage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/notifications" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminNotifications />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminSettings />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/brands" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminBrands />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/user-permissions" element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<GlobalAppLoader />}>
                          <AdminUserPermissions />
                        </Suspense>
                      </ProtectedRoute>
                    } />

                    <Route path="*" element={
                      <Suspense fallback={<GlobalAppLoader />}>
                        <NotFound />
                      </Suspense>
                    } />
                  </Routes>
                  <LiveChat />
                  <WhatsAppButton />
                </ChatProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
