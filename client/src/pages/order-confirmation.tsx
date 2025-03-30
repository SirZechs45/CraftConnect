import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderConfirmation() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { clearCart } = useCart();

  // When component mounts, ensure the cart is cleared
  useEffect(() => {
    // Attempt to clear the cart to ensure it's empty
    clearCart();
    
    // Show a toast message
    toast({
      title: 'Order Successful',
      description: 'Thank you for your purchase!',
    });
  }, [clearCart, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 h-10 w-10" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
            You'll receive an email confirmation shortly with your order details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/dashboard/buyer/orders">
                View My Orders
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}