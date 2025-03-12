
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useAuth } from "@/lib/auth";
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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    title: string;
    price: string;
    images: string[];
  };
}

interface OrderDetails {
  id: number;
  buyerId: number;
  totalAmount: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=/orders/" + id);
    }
  }, [isAuthenticated, loading, navigate, id]);

  // Fetch order details
  const { data: order, isLoading } = useQuery<OrderDetails>({
    queryKey: [`/api/orders/${id}`],
    enabled: !!user && !!id,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Order not found</h2>
              <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button asChild className="mt-6">
                <Link href="/profile">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Profile
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStepStatus = (status: string, step: string) => {
    const steps = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
      'cancelled': -1
    };

    const stepNumbers = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3
    };

    if (order.orderStatus === 'cancelled') {
      return 'cancelled';
    }

    const orderStep = steps[order.orderStatus as keyof typeof steps];
    const currentStep = stepNumbers[step as keyof typeof stepNumbers];

    if (currentStep < orderStep) {
      return 'completed';
    } else if (currentStep === orderStep) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

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
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-gray-500">
                  Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
              <Badge className={
                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800 text-sm px-3 py-1 mt-2 md:mt-0' :
                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800 text-sm px-3 py-1 mt-2 md:mt-0' :
                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800 text-sm px-3 py-1 mt-2 md:mt-0' :
                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800 text-sm px-3 py-1 mt-2 md:mt-0' :
                'bg-gray-100 text-gray-800 text-sm px-3 py-1 mt-2 md:mt-0'
              }>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </Badge>
            </div>
            
            {/* Order status timeline */}
            {order.orderStatus !== 'cancelled' && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Order Status</h2>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {/* Pending step */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                        getStepStatus(order.orderStatus, 'pending') === 'completed' ? 'bg-primary text-white' :
                        getStepStatus(order.orderStatus, 'pending') === 'current' ? 'bg-blue-100 border-2 border-primary text-primary' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {getStepStatus(order.orderStatus, 'pending') === 'completed' ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Package className="h-6 w-6" />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">Pending</p>
                    </div>
                    
                    {/* Processing step */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                        getStepStatus(order.orderStatus, 'processing') === 'completed' ? 'bg-primary text-white' :
                        getStepStatus(order.orderStatus, 'processing') === 'current' ? 'bg-blue-100 border-2 border-primary text-primary' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {getStepStatus(order.orderStatus, 'processing') === 'completed' ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Package className="h-6 w-6" />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">Processing</p>
                    </div>
                    
                    {/* Shipped step */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                        getStepStatus(order.orderStatus, 'shipped') === 'completed' ? 'bg-primary text-white' :
                        getStepStatus(order.orderStatus, 'shipped') === 'current' ? 'bg-blue-100 border-2 border-primary text-primary' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {getStepStatus(order.orderStatus, 'shipped') === 'completed' ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Truck className="h-6 w-6" />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">Shipped</p>
                    </div>
                    
                    {/* Delivered step */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                        getStepStatus(order.orderStatus, 'delivered') === 'completed' ? 'bg-primary text-white' :
                        getStepStatus(order.orderStatus, 'delivered') === 'current' ? 'bg-blue-100 border-2 border-primary text-primary' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {getStepStatus(order.orderStatus, 'delivered') === 'completed' ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <CheckCircle className="h-6 w-6" />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order details */}
            <div>
              <h2 className="text-lg font-medium mb-4">Order Items</h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center p-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">
                          <Link href={`/products/${item.productId}`} className="hover:text-primary">
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${parseFloat(String(item.unitPrice)).toFixed(2)}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-medium">
                          ${(parseFloat(String(item.unitPrice)) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order summary */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2">
                  <p>Subtotal</p>
                  <p className="font-medium">${parseFloat(String(order.totalAmount)).toFixed(2)}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p>Shipping</p>
                  <p className="font-medium">$0.00</p>
                </div>
                <div className="flex justify-between py-2">
                  <p>Tax</p>
                  <p className="font-medium">$0.00</p>
                </div>
                <div className="flex justify-between py-2 border-t mt-2 pt-2">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">${parseFloat(String(order.totalAmount)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/contact">
                Need Help?
              </Link>
            </Button>
            {order.orderStatus === 'delivered' && (
              <Button asChild>
                <Link href={`/products/${order.items[0]?.productId}/review`}>
                  Write a Review
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
