import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Order } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  MoreVertical,
  Eye,
  Package,
  TruckIcon,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Status badge helper
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

export default function SellerOrders() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "seller" && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/seller/orders");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Fetch seller orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Order Updated",
        description: "Order status has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchMatch = searchQuery 
      ? `Order #${order.id}`.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Status filter from dropdown
    const statusMatch = statusFilter 
      ? order.orderStatus === statusFilter
      : true;
    
    // Tab filter
    const tabMatch = activeTab === "all" 
      ? true 
      : order.orderStatus === activeTab;
    
    return searchMatch && statusMatch && tabMatch;
  });

  // Group orders by status for counting
  const orderCounts = orders.reduce((acc, order) => {
    const status = order.orderStatus;
    if (!acc[status]) acc[status] = 0;
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
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
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">View and manage your customer orders</p>
            </div>
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search orders by ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={statusFilter || ""} 
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter(null);
                    setActiveTab("all");
                  }}
                  disabled={!searchQuery && !statusFilter && activeTab === "all"}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            Customer #{order.buyerId}
                          </TableCell>
                          <TableCell>
                            ${Number(order.totalAmount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.orderStatus} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Update Status
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(order.id, "pending")}
                                    disabled={order.orderStatus === "pending"}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(order.id, "processing")}
                                    disabled={order.orderStatus === "processing"}
                                  >
                                    <Package className="mr-2 h-4 w-4" />
                                    Mark as Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(order.id, "shipped")}
                                    disabled={order.orderStatus === "shipped"}
                                  >
                                    <TruckIcon className="mr-2 h-4 w-4" />
                                    Mark as Shipped
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(order.id, "delivered")}
                                    disabled={order.orderStatus === "delivered"}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Delivered
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(order.id, "cancelled")}
                                    disabled={order.orderStatus === "cancelled"}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Mark as Cancelled
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery || statusFilter || activeTab !== "all"
                      ? "No orders match your search criteria. Try adjusting your filters."
                      : "You don't have any orders yet."}
                  </p>
                  {(searchQuery || statusFilter || activeTab !== "all") && (
                    <Button 
                      className="mt-6"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter(null);
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
                    <p><span className="font-medium">Customer:</span> #{selectedOrder.buyerId}</p>
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
                    <p><span className="font-medium">Total Amount:</span> ${Number(selectedOrder.totalAmount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
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
                  
                  <div className="divide-y">
                    {/* This would normally show actual order items, using placeholder for now */}
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-6 flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Product from this order</p>
                            <p className="text-sm text-gray-500">SKU: 123456</p>
                          </div>
                        </div>
                        <div className="col-span-2">$45.00</div>
                        <div className="col-span-2">2</div>
                        <div className="col-span-2 text-right font-medium">$90.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Update Status</h3>
                  <Select 
                    value={selectedOrder.orderStatus}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setIsOrderDetailOpen(false)}
                  >
                    Close
                  </Button>
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
