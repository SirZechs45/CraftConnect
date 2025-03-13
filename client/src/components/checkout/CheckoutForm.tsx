import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
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
import { CardElement } from "@stripe/react-stripe-js";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { cartTotal, cartItems, clearCart } = useCart();
  const [orderId, setOrderId] = useState<number | null>(null); // Added state for order ID

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
          buyerId: cartItems[0]?.userId || 0, // Get user ID from cart item
          totalAmount: cartTotal.toString(), // Convert to string
          orderStatus: "pending",
        },
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: Number(item.product.price),
        })),
      };

      // Create order and get order ID
      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      setOrderId(orderResponse.id); // Assuming the API returns an object with an 'id' property

      // Process payment with Stripe
      const {error, paymentIntent} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          //return_url: window.location.origin + "/order-confirmation",
        },
        redirect: "if_required",
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

      navigate(`/order-confirmation?order_id=${orderResponse.id}`); // Redirect with order ID

    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during checkout");
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
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP/Postal Code</FormLabel>
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

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="p-4 border rounded-md bg-card mb-4">
          <PaymentElement />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="w-full"
        >
          {isLoading
            ? "Processing..."
            : `Pay ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cartTotal)}`}
        </Button>
      </form>
    </Form>
  );
}

//Order Confirmation Page
// Remove the duplicate OrderConfirmationPage component from CheckoutForm.tsx
// since it's already defined in client/src/pages/order-confirmation.tsx