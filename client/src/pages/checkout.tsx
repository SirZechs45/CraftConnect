import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CartItem from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
// Environment variables should be prefixed with VITE_ to be accessible in the frontend
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('VITE_STRIPE_PUBLIC_KEY is not set. Stripe payments will not work correctly.');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Add some items before checkout.',
        variant: 'destructive',
      });
      navigate('/products');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to proceed with checkout',
        variant: 'destructive',
      });
      navigate('/auth?redirect=/checkout');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: cartTotal,
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: 'Payment Error',
          description: 'There was a problem setting up the payment. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cartItems, cartTotal, isAuthenticated, navigate, toast]);

  // Format price
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cartTotal);

  // Estimate tax (e.g., 8%)
  const estimatedTax = cartTotal * 0.08;
  const formattedTax = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(estimatedTax);

  // Shipping cost (free for orders over $50)
  const shippingCost = cartTotal > 50 ? 0 : 5.99;
  const formattedShipping = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(shippingCost);

  // Total with tax and shipping
  const orderTotal = cartTotal + estimatedTax + shippingCost;
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(orderTotal);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-800">Checkout</h1>
            <p className="mt-2 text-gray-600">Complete your purchase</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-5 lg:order-2">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="max-h-[300px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 border-b last:border-0">
                      <div className="flex items-center">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {item.product.title}
                          </h3>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pricing Breakdown */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span>{formattedTax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingCost === 0 
                        ? <span className="text-green-600">Free</span> 
                        : formattedShipping
                      }
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{formattedTotal}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t text-sm text-gray-500">
                  <p className="flex items-center mb-2">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping on orders over $50
                  </p>
                  <p className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30-day easy returns
                  </p>
                </div>
              </div>
            </div>
            
            {/* Checkout Form */}
            <div className="lg:col-span-7 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Payment Setup Failed</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't set up the payment process. Please try again later or contact support.
                    </p>
                    <Button asChild>
                      <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
