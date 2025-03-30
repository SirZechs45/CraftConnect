import { useEffect } from 'react';
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@shared/schema";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Package, 
  TruckIcon, 
  CheckCircle, 
  XCircle,
  ShoppingBag,
  ExternalLink
} from "lucide-react";

// Order status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          <span>Processing</span>
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-blue-600">
          <TruckIcon className="h-3 w-3" />
          <span>Shipped</span>
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Delivered</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          <span>Cancelled</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">{status}</Badge>
      );
  }
};

export default function BuyerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect if not authenticated or not a buyer
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "buyer" && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/buyer");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Fetch buyer orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/buyer"],
    enabled: !!user && isAuthenticated,
  });

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Count orders by status
  const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
  const processingOrders = orders.filter(o => o.orderStatus === "processing").length;
  const shippedOrders = orders.filter(o => o.orderStatus === "shipped").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Manage your orders and account</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Pending</h3>
                  <p className="text-3xl font-bold mt-1">{pendingOrders}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Processing</h3>
                  <p className="text-3xl font-bold mt-1">{processingOrders}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-3">
                    <TruckIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Shipped</h3>
                  <p className="text-3xl font-bold mt-1">{shippedOrders}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Delivered</h3>
                  <p className="text-3xl font-bold mt-1">{deliveredOrders}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Your most recent orders and their status
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/buyer/orders">
                    View All
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-4 px-4"># {order.id}</td>
                          <td className="py-4 px-4">
                            {formatDate(new Date(order.createdAt))}
                          </td>
                          <td className="py-4 px-4">{formatPrice(Number(order.totalAmount))}</td>
                          <td className="py-4 px-4">
                            <OrderStatusBadge status={order.orderStatus} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/dashboard/buyer/orders?id=${order.id}`}>
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                      
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">{formatPrice(totalSpent)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Since</span>
                    <span className="font-medium">{user && formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}