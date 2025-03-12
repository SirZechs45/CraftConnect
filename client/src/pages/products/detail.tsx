import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity_available: number;
  seller_id: number;
  category: string;
  bulk_pricing: any;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: number;
  product_id: number;
  buyer_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetailPage = () => {
  const [match, params] = useRoute("/products/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch product details
  const { 
    data: product, 
    isLoading: productLoading,
    error: productError
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: productId > 0
  });

  // Fetch product reviews
  const { 
    data: reviews, 
    isLoading: reviewsLoading,
    error: reviewsError
  } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: productId > 0
  });

  // Increase quantity
  const increaseQuantity = () => {
    if (product && quantity < Number(product.quantity_available)) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: "You've reached the maximum available quantity for this product.",
        variant: "destructive"
      });
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      await apiRequest("POST", "/api/cart", {
        product_id: product.id,
        quantity: quantity
      });
      
      toast({
        title: "Added to Cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
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

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Product not found or error loading product details.
        </div>
        <div className="mt-4">
          <Link href="/products" className="text-primary hover:underline">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  // Placeholder image if no images are available
  const placeholderImage = (
    <svg viewBox="0 0 500 500" className="w-full h-96 object-cover bg-gray-100 rounded-lg">
      <rect width="100%" height="100%" fill="#f3f4f6" />
      <text x="50%" y="50%" fontSize="20" textAnchor="middle" fill="#9ca3af">No image available</text>
    </svg>
  );

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.title}</span>
        </nav>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-96 object-contain"
              />
            ) : (
              placeholderImage
            )}
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded border border-gray-200 overflow-hidden h-20"
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-gray-800">{product.title}</h1>
            
            <div className="flex items-center">
              <Stars rating={averageRating} count={reviews?.length || 0} />
              <span className="ml-4 text-sm text-gray-500">
                {Number(product.quantity_available) <= 5 ? (
                  <span className="text-red-500">Only {product.quantity_available} left!</span>
                ) : (
                  `${product.quantity_available} available`
                )}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            
            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>
            
            {/* Bulk pricing if available */}
            {product.bulk_pricing && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Bulk Pricing Available</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(product.bulk_pricing).map(([quantity, price]) => (
                    <div key={quantity} className="flex justify-between">
                      <span>{quantity}+ items</span>
                      <span className="font-medium">{formatPrice(Number(price))}/each</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex h-10 w-32">
                <button
                  type="button"
                  className="bg-gray-100 border border-gray-300 rounded-l-md px-3 flex items-center justify-center"
                  onClick={decreaseQuantity}
                >
                  <i className="fas fa-minus text-gray-600"></i>
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity_available}
                  className="border-y border-gray-300 p-2 w-full text-center text-gray-900"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0 && val <= Number(product.quantity_available)) {
                      setQuantity(val);
                    }
                  }}
                />
                <button
                  type="button"
                  className="bg-gray-100 border border-gray-300 rounded-r-md px-3 flex items-center justify-center"
                  onClick={increaseQuantity}
                >
                  <i className="fas fa-plus text-gray-600"></i>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                className="flex-1 py-6" 
                onClick={handleAddToCart}
                disabled={Number(product.quantity_available) === 0}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Add to Cart
              </Button>
              <Button variant="outline" className="px-4">
                <i className="far fa-heart"></i>
              </Button>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <i className="fas fa-truck text-primary mr-2"></i>
                Free shipping on orders over $100
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <i className="fas fa-shield-alt text-primary mr-2"></i>
                Secure payment & buyer protection
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <i className="fas fa-undo text-primary mr-2"></i>
                30-day returns policy
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs - Description, Reviews, etc. */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews {reviews?.length ? `(${reviews.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border-b pb-4 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <div>
                          <div className="font-medium">Buyer</div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Stars rating={review.rating} className="mb-2" />
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">
                    <i className="far fa-star"></i>
                  </div>
                  <h3 className="text-lg font-medium">No reviews yet</h3>
                  <p className="text-gray-500 mt-2">Be the first to review this product</p>
                  {user && (
                    <Button className="mt-4">Write a Review</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>We ship to most countries worldwide via standard and express shipping methods.</p>
                <ul>
                  <li>Standard Shipping: 5-10 business days</li>
                  <li>Express Shipping: 2-3 business days</li>
                </ul>
                
                <h3 className="mt-6">Returns Policy</h3>
                <p>If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund.</p>
                <p>Please note that items must be returned in their original condition and packaging.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
