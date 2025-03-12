
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Order } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { ChevronLeft, ShoppingBag, Search } from "lucide-react";

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=/orders");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch user orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchQuery
      ? `Order #${order.id}`.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesStatus = statusFilter
      ? order.orderStatus === statusFilter
      : true;
      
    return matchesSearch && matchesStatus;
  });

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/profile">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-gray-500">View and track all your purchases</p>
          </div>
          
          {/* Filters */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Orders list */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="p-4 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {order.createdAt ? format(new Date(order.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge className={
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800 mt-2 sm:mt-0' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800 mt-2 sm:mt-0' :
                        order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800 mt-2 sm:mt-0' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800 mt-2 sm:mt-0' :
                        'bg-gray-100 text-gray-800 mt-2 sm:mt-0'
                      }>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        Total: <span className="font-medium">${parseFloat(String(order.totalAmount)).toFixed(2)}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              {searchQuery || statusFilter ? (
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filter criteria.
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  You haven't placed any orders yet.
                </p>
              )}
              <div className="mt-6">
                <Button asChild>
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
