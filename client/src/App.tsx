import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "./hooks/useCart";
import { NotificationProvider } from "./hooks/useNotifications";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import ProductsPage from "@/pages/products/index";
import ProductDetail from "@/pages/products/[id]";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import SellerDashboard from "@/pages/dashboard/seller/index";
import SellerProducts from "@/pages/dashboard/seller/products";
import NewProduct from "@/pages/dashboard/seller/products/new";
import SellerOrders from "@/pages/dashboard/seller/orders";
import BuyerDashboard from "@/pages/dashboard/buyer/index";
import BuyerOrders from "@/pages/dashboard/buyer/orders";
import BuyerProfile from "@/pages/dashboard/buyer/profile";
import SellerProfile from "@/pages/dashboard/seller/profile";
import AdminDashboard from "@/pages/dashboard/admin/index";
import AdminUsers from "@/pages/dashboard/admin/users";
import AdminProducts from "@/pages/dashboard/admin/products";
import NotificationsPage from "@/pages/dashboard/notifications";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetail} />
      
      {/* Protected Routes */}
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/dashboard/notifications" component={NotificationsPage} />
      
      {/* Buyer Routes */}
      <Route path="/dashboard/buyer" component={BuyerDashboard} />
      <Route path="/dashboard/buyer/orders" component={BuyerOrders} />
      <Route path="/dashboard/buyer/profile" component={BuyerProfile} />
      
      {/* Seller Routes */}
      <Route path="/dashboard/seller" component={SellerDashboard} />
      <Route path="/dashboard/seller/products" component={SellerProducts} />
      <Route path="/dashboard/seller/products/new" component={NewProduct} />
      <Route path="/dashboard/seller/orders" component={SellerOrders} />
      <Route path="/dashboard/seller/profile" component={SellerProfile} />
      
      {/* Admin Routes */}
      <Route path="/dashboard/admin" component={AdminDashboard} />
      <Route path="/dashboard/admin/users" component={AdminUsers} />
      <Route path="/dashboard/admin/products" component={AdminProducts} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Router />
            <Toaster />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
