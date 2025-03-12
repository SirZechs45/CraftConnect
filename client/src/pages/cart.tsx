import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CartItem {
  cart: {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
  };
  product: {
    id: number;
    title: string;
    price: number;
    images: string[];
    quantity_available: number;
  };
}

const CartPage = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const [removingItems, setRemovingItems] = useState<number[]>([]);

  // Fetch cart data
  const { 
    data: cartItems, 
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart
  } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    enabled: !!user,
  });

  // Calculate subtotal
  const subtotal = cartItems?.reduce(
    (total, item) => total + Number(item.product.price) * item.cart.quantity,
    0
  ) || 0;

  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 ? 0 : 10;

  // Calculate total
  const total = subtotal + shipping;

  // Remove an item from cart
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setRemovingItems([...removingItems, cartItemId]);
      await apiRequest("DELETE", `/api/cart/${cartItemId}`);
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
      
      await queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRemovingItems(removingItems.filter(id => id !== cartItemId));
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await apiRequest("PATCH", `/api/cart/${cartItemId}`, { quantity });
      await queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    
    setLocation("/checkout");
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-5xl text-gray-300 mb-4">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Please log in to view your cart</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        {cartLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex space-x-4 border-b pb-6">
                  <Skeleton className="h-24 w-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : cartError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            Failed to load cart items. Please try again later.
            <Button variant="outline" className="mt-4" onClick={() => refetchCart()}>
              Try Again
            </Button>
          </div>
        ) : cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.cart.id} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pb-6 border-b">
                      {/* Product image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <i className="fas fa-image text-gray-400 text-2xl"></i>
                          </div>
                        )}
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-medium text-gray-800 hover:text-primary">
                            {item.product.title}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>Price: {formatPrice(item.product.price)}</span>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                          {/* Quantity selector */}
                          <div className="flex h-9 w-28">
                            <button
                              type="button"
                              className="bg-gray-100 border border-gray-300 rounded-l-md px-3 flex items-center justify-center"
                              onClick={() => {
                                if (item.cart.quantity > 1) {
                                  handleUpdateQuantity(item.cart.id, item.cart.quantity - 1);
                                }
                              }}
                            >
                              <i className="fas fa-minus text-gray-600"></i>
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.product.quantity_available}
                              className="border-y border-gray-300 p-2 w-full text-center text-gray-900"
                              value={item.cart.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val > 0 && val <= Number(item.product.quantity_available)) {
                                  handleUpdateQuantity(item.cart.id, val);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="bg-gray-100 border border-gray-300 rounded-r-md px-3 flex items-center justify-center"
                              onClick={() => {
                                if (item.cart.quantity < Number(item.product.quantity_available)) {
                                  handleUpdateQuantity(item.cart.id, item.cart.quantity + 1);
                                }
                              }}
                            >
                              <i className="fas fa-plus text-gray-600"></i>
                            </button>
                          </div>
                          
                          {/* Item total and remove button */}
                          <div className="flex items-center space-x-4">
                            <div className="font-bold text-gray-900">
                              {formatPrice(Number(item.product.price) * item.cart.quantity)}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.cart.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                              disabled={removingItems.includes(item.cart.id)}
                            >
                              {removingItems.includes(item.cart.id) ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4">
                  <Link 
                    href="/products" 
                    className="text-primary text-sm hover:underline flex items-center justify-center"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Continue Shopping
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t text-xs text-gray-500 space-y-2">
                  <div className="flex items-center">
                    <i className="fas fa-lock text-green-500 mr-2"></i>
                    Secure checkout
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-truck text-primary mr-2"></i>
                    Free shipping on orders over $100
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-primary mr-2"></i>
                    Buyer protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Explore our products and find something you like</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
