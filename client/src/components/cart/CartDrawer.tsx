import { useState } from "react";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import { ShoppingCart, AlertCircle } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [_, navigate] = useLocation();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
    navigate("/products");
  };

  // Format price
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cartTotal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center text-xl font-bold">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shopping Cart
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-700">Your cart is empty</h3>
              <p className="text-gray-500 mt-1">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={handleContinueShopping}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  productId={item.product.id}
                  title={item.product.title}
                  price={Number(item.product.price)}
                  quantity={item.quantity}
                  image={item.product.images[0]}
                  maxQuantity={Number(item.product.quantityAvailable)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="mt-auto pt-4">
            <Separator />
            <div className="py-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formattedTotal}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-800 font-medium">Total</span>
                <span className="text-xl font-bold">{formattedTotal}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => clearCart()}
                  className="w-full"
                >
                  Clear Cart
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
