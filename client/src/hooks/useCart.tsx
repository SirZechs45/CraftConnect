import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Types
interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantityAvailable: number;
  images: string[];
}

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: CartProduct;
}

interface AddToCartInput {
  productId: number;
  quantity: number;
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (item: AddToCartInput) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

// Create context
const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartTotal: 0,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  loading: false,
});

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  // Fetch cart items when user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !user) {
        setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const response = await apiRequest("GET", "/api/cart");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user, toast]);

  // Add item to cart
  const addToCart = async (item: AddToCartInput) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/cart", {
        ...item,
        userId: user.id,
      });
      const newItem = await response.json();
      
      // Check if the item already exists in the cart
      const existingItemIndex = cartItems.findIndex(
        (i) => i.productId === item.productId
      );
      
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = newItem;
        setCartItems(updatedItems);
      } else {
        // Add new item
        setCartItems([...cartItems, newItem]);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, {
        quantity,
      });
      const updatedItem = await response.json();
      
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? updatedItem : item
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: number) => {
    setLoading(true);
    try {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      await apiRequest("DELETE", "/api/cart");
      setCartItems([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
