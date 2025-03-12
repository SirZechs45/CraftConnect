import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { cartTotal, cartItems, clearCart } = useCart();
  const { user } = useAuth();
  
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
    },
  });

  const handleSubmit = async (values: CheckoutFormValues) => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Create order in database
      const orderData = {
        order: {
          buyerId: user?.id || 0, // Get user ID from auth context
          totalAmount: cartTotal,
          orderStatus: "pending",
        },
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: Number(item.product.price),
        })),
      };

      // Create order
      await apiRequest("POST", "/api/orders", orderData);
      
      // Process payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/order-confirmation",
        },
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      }

      // Clear cart on successful payment
      clearCart();
      
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
      });
      
      navigate("/order-confirmation");
    } catch (error: any) {
      toast({
        title: "Checkout Failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Apt 4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP / Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            <div className="bg-yellow-50 p-3 mb-4 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium">Test Mode Instructions</p>
              <ul className="text-xs text-yellow-700 list-disc pl-4 mt-1">
                <li>Use card number: <span className="font-mono">4242 4242 4242 4242</span></li>
                <li>Any future expiration date (MM/YY)</li>
                <li>Any 3 digits for CVC</li>
                <li>Any 5 digits for postal code</li>
              </ul>
            </div>
            <PaymentElement />
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          disabled={isLoading || !stripe || !elements} 
          className="w-full"
        >
          {isLoading ? "Processing..." : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal)}`}
        </Button>
      </form>
    </Form>
  );
}
