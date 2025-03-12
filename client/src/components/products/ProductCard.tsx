import { Link } from "wouter";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity_available: number;
  seller_id: number;
  // Add other fields as needed
}

interface ProductCardProps {
  product: Product;
  isFeatured?: boolean;
  isLowStock?: boolean;
}

const ProductCard = ({ product, isFeatured = false, isLowStock = false }: ProductCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const isLow = isLowStock || Number(product.quantity_available) <= 3;
  
  // Placeholder image if no images are available
  const placeholderImage = (
    <svg viewBox="0 0 500 500" className="w-full h-56 object-cover bg-gray-100">
      <rect width="100%" height="100%" fill="#f3f4f6" />
      <text x="50%" y="50%" fontSize="20" textAnchor="middle" fill="#9ca3af">No image available</text>
    </svg>
  );

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/cart", { 
        product_id: product.id,
        quantity: 1
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart.`,
      });
      
      // Invalidate cart cache
      await queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-56 object-cover"
          />
        ) : (
          placeholderImage
        )}
        
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        
        {isLow && (
          <span className="absolute top-2 left-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded">
            Last {product.quantity_available} items
          </span>
        )}
        
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
          onClick={toggleFavorite}
        >
          <i className={`${isFavorite ? 'fas text-danger' : 'far text-gray-400 hover:text-danger'} fa-heart`}></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-500 font-medium mr-2">Seller name</span>
          <Stars rating={4.5} count={42} size="sm" />
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-800 hover:text-primary">{product.title}</h3>
        </Link>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          <span className={`text-xs ${isLow ? 'text-danger font-medium' : 'text-gray-500'}`}>
            {isLow ? 
              `Only ${product.quantity_available} left!` : 
              `${product.quantity_available} available`
            }
          </span>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={handleAddToCart}
            className="bg-primary text-white px-4 py-2 rounded-lg flex-grow text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
          <Link 
            href={`/products/${product.id}`}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <i className="fas fa-eye"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
