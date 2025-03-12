
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<{ paymentId?: string; paymentClientSecret?: string }>();
  
  useEffect(() => {
    // Get payment info from location state
    const state = location.state as { paymentId?: string; paymentClientSecret?: string } | null;
    if (state?.paymentId) {
      setPaymentInfo(state);
    } else {
      // If no payment info in state, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Your order has been successfully placed and will be processed soon. You will receive an email confirmation shortly.
            </p>
            {paymentInfo?.paymentId && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium">Payment ID:</p>
                <p className="font-mono text-xs break-all">{paymentInfo.paymentId}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => navigate('/dashboard/orders')}
            >
              View My Orders
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
