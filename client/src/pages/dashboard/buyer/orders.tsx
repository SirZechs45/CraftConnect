import { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Order } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Clock, 
  Package, 
  TruckIcon, 
  CheckCircle, 
  XCircle,
  ShoppingBag
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

// Order tracking component
const OrderTracking = ({ status }: { status: string }) => {
  let progressValue = 0;
  
  switch (status) {
    case "pending":
      progressValue = 10;
      break;
    case "processing":
      progressValue = 30;
      break;
    case "shipped":
      progressValue = 70;
      break;
    case "delivered":
      progressValue = 100;
      break;
    case "cancelled":
      progressValue = 0;
      break;
    default:
      progressValue = 0;
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Order Progress</h3>
      <Progress value={progressValue} className="h-2" />
      
      <div className="grid grid-cols-4 mt-2">
        <div className={`text-xs text-center ${status !== "cancelled" && progressValue >= 10 ? "text-primary" : "text-gray-400"}`}>
          <span className="block">Confirmed</span>
        </div>
        <div className={`text-xs text-center ${status !== "cancelled" && progressValue >= 30 ? "text-primary" : "text-gray-400"}`}>
          <span className="block">Processing</span>
        </div>
        <div className={`text-xs text-center ${status !== "cancelled" && progressValue >= 70 ? "text-primary" : "text-gray-400"}`}>
          <span className="block">Shipped</span>
        </div>
        <div className={`text-xs text-center ${status !== "cancelled" && progressValue >= 100 ? "text-primary" : "text-gray-400"}`}>
          <span className="block">Delivered</span>
        </div>
      </div>
    </div>
  );
};

export default function BuyerOrders() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // Redirect if not authenticated or not a buyer
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "buyer" && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/buyer/orders");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Fetch buyer orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/buyer"],
    enabled: !!user && isAuthenticated,
  });

  // Filter orders based on tab and search
  const filteredOrders = orders.filter(order => {
    // Filter by status tab
    if (activeTab !== "all" && order.orderStatus !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !order.id.toString().includes(searchQuery)) {
      return false;
    }
    
    return true;
  });
  
  // Group orders by status for counting
  const orderCounts = orders.reduce((acc, order) => {
    const status = order.orderStatus;
    if (!acc[status]) acc[status] = 0;
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your purchase history</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <a href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </a>
            </Button>
          </div>
          
          {/* Tabs for quick filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">
                All Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({orderCounts.pending || 0})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({orderCounts.processing || 0})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                Shipped ({orderCounts.shipped || 0})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({orderCounts.delivered || 0})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Search by order number" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchQuery && (
                  <Button 
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {/* Orders List */}
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-4 px-4">
                            <span className="font-medium">#{order.id}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {formatPrice(Number(order.totalAmount))}
                          </td>
                          <td className="py-4 px-4">
                            <OrderStatusBadge status={order.orderStatus} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              size="sm" 
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex rounded-full bg-gray-100 p-4 mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery || activeTab !== "all"
                      ? "No orders match your search criteria. Try adjusting your filters."
                      : "You haven't placed any orders yet."}
                  </p>
                  {(searchQuery || activeTab !== "all") && (
                    <Button 
                      className="mt-6"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveTab("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Order Detail Modal */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                    <p>
                      <span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className="ml-2">
                        <OrderStatusBadge status={selectedOrder.orderStatus} />
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Payment Method:</span> Credit Card</p>
                    <p><span className="font-medium">Payment Status:</span> Paid</p>
                    <p><span className="font-medium">Total Amount:</span> {formatPrice(Number(selectedOrder.totalAmount))}</p>
                  </div>
                </div>
              </div>
              
              {/* Order tracking */}
              <OrderTracking status={selectedOrder.orderStatus} />
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
                <div className="border rounded-md">
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2 text-right">Subtotal</div>
                    </div>
                  </div>
                  
                  {/* This would ideally show actual order items */}
                  <div className="px-4 py-3 text-center text-gray-500">
                    Order items will appear here
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  If you have any questions or concerns about your order, please don't hesitate to contact us. 
                  Our customer service team is available to assist you.
                </p>
                <div className="mt-4 flex space-x-4">
                  <Button variant="outline">Contact Support</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}