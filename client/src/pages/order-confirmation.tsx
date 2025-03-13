
import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@/lib/useQuery";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Clock, ChevronLeft, ShoppingBag } from "lucide-react";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "processing" | "failed"
  >("processing");
  
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Fetch order details if available
  const { data: orderDetails, isLoading } = useQuery<any>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId && isAuthenticated,
  });

  useEffect(() => {
    // Check for payment intent status in URL
    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");
    const orderIdParam = searchParams.get("order_id");

    if (paymentIntent) {
      setPaymentIntentId(paymentIntent);
    }

    if (orderIdParam) {
      setOrderId(Number(orderIdParam));
    }

    if (redirectStatus === "succeeded") {
      setPaymentStatus("success");
    } else if (redirectStatus === "failed") {
      setPaymentStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {paymentStatus === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
                {paymentIntentId && (
                  <span className="block mt-2 text-sm">
                    Payment ID: {paymentIntentId}
                  </span>
                )}
              </p>

              {/* Order details section */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : orderDetails ? (
                <div className="mt-8 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 text-left border-b">
                    <h2 className="font-semibold text-gray-800">Order #{orderDetails.id}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {orderDetails.items?.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center text-left">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0] && (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4 flex-grow">
                            <p className="font-medium text-gray-800 truncate">{item.product.title}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${Number(item.unitPrice) * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      
                      {orderDetails.items?.length > 3 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          + {orderDetails.items.length - 3} more items
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">${orderDetails.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href={orderId ? `/orders/${orderId}` : "/profile"}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {orderId ? "View Order Details" : "My Profile"}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </>
          )}

          {paymentStatus === "processing" && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Your Order
              </h1>
              <p className="text-gray-600 mb-6">
                We're currently processing your order. This may take a moment.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </>
          )}

          {paymentStatus === "failed" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please try again or contact customer support.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button asChild variant="destructive">
                  <Link href="/checkout">
                    Try Again
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { CheckCircle, XCircle, Clock, ChevronLeft, ShoppingBag } from "lucide-react";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "processing" | "failed"
  >("processing");
  
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Fetch order details from the order ID if available
  const { data: orderDetailsByOrderId, isLoading: isLoadingOrderDetails } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId && orderId > 0 && isAuthenticated,
  });

  // Fetch order details using payment intent ID if order ID is not available
  const { data: orderDetailsByPaymentIntent, isLoading: isLoadingPaymentIntent } = useQuery({
    queryKey: [`/api/payment/${paymentIntentId}/order`],
    enabled: !!paymentIntentId && !orderId && isAuthenticated,
  });

  // Combine the two possible sources of order details
  const orderDetails = orderDetailsByOrderId || orderDetailsByPaymentIntent;
  const isLoading = isLoadingOrderDetails || isLoadingPaymentIntent;

  // Set the orderId if we find it from the payment intent query
  useEffect(() => {
    if (orderDetailsByPaymentIntent && !orderId) {
      setOrderId(orderDetailsByPaymentIntent.id);
    }
  }, [orderDetailsByPaymentIntent, orderId]);

  useEffect(() => {
    // Check for payment intent status in URL
    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");
    const orderIdParam = searchParams.get("order_id");

    if (paymentIntent) {
      setPaymentIntentId(paymentIntent);
    }

    if (orderIdParam && orderIdParam !== "null" && orderIdParam !== "undefined") {
      setOrderId(Number(orderIdParam));
    }

    if (redirectStatus === "succeeded") {
      setPaymentStatus("success");
    } else if (redirectStatus === "failed") {
      setPaymentStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {paymentStatus === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
                {paymentIntentId && (
                  <span className="block mt-2 text-sm">
                    Payment ID: {paymentIntentId}
                  </span>
                )}
              </p>
              
              {orderDetails ? (
                <div className="mb-6">
                  <p className="font-medium text-gray-900">
                    Order number: #{orderDetails.id}
                  </p>
                  <p className="text-gray-600">
                    We've sent a confirmation to your email.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  Your order has been processed. You can view your orders in your profile.
                </p>
              )}
            </>
          )}

          {paymentStatus === "processing" && (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Your Order
              </h1>
              <p className="text-gray-600 mb-6">
                Your payment is being processed. Please wait a moment.
              </p>
            </>
          )}

          {paymentStatus === "failed" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again.
              </p>
              <Button variant="outline" asChild className="mr-4">
                <Link href="/cart">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Return to Cart
                </Link>
              </Button>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            
            {paymentStatus === "success" && (
              <Button asChild>
                <Link href="/profile">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View My Orders
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
