import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'wouter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
// Added useAuth and necessary types.  Assumptions made about their structure.
import { useAuth } from '@/lib/auth';
type User = { id: number; };


export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'failed'>('processing');
  const [orderId, setOrderId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');

    //If paymentIntent exists, use it. Otherwise, fetch most recent order if user is logged in.
    if (paymentIntent) {
      setOrderId(paymentIntent);
      //Simulate checking payment status - replace with actual API call
      setTimeout(() => {
        setPaymentStatus('success'); //Replace with actual status check
      }, 1000);
    } else if (user?.id) {
      fetchMostRecentOrder(user.id);
    } else {
      setPaymentStatus('failed'); //Handle case where no paymentIntent and no user.
    }
  }, [searchParams, user]);

  // Function to fetch the most recent order for the user
  const fetchMostRecentOrder = async (userId: number) => {
    try {
      const response = await fetch('/api/orders?latest=true&userId=' + userId); // Added userId to fetch
      if (response.ok) {
        const orders = await response.json();
        if (orders && orders.length > 0) {
          setOrderId(orders[0].id.toString()); // Assuming id is a number, converting to string
          setPaymentStatus('success');
        } else {
          setPaymentStatus('failed'); // Handle case where no orders found.
        }
      } else {
        setPaymentStatus('failed'); //Handle network error or other issues.
        console.error('Failed to fetch recent order:', response.statusText);
      }
    } catch (error) {
      setPaymentStatus('failed'); // Handle error during fetch.
      console.error('Failed to fetch recent order:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {paymentStatus === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
                {orderId && <span className="block mt-2 text-sm">Order ID: {orderId}</span>}
              </p>
            </>
          )}

          {paymentStatus === 'processing' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h1>
              <p className="text-gray-600 mb-6">
                We're currently processing your order. This may take a moment.
              </p>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please try again or contact customer support.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>

            {paymentStatus !== 'processing' && (
              <Button variant="outline" asChild>
                <Link href="/account/orders">View Orders</Link>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}