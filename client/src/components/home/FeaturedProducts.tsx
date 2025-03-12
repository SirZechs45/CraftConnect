import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity_available: number;
  seller_id: number;
  // Add other fields as needed
}

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <Skeleton className="w-full h-56" />
    <div className="p-4">
      <div className="flex items-center mb-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-20 h-4 ml-auto" />
      </div>
      <Skeleton className="w-full h-5 mt-2" />
      <div className="mt-2 flex justify-between items-center">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="mt-4 flex space-x-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-10 h-10" />
      </div>
    </div>
  </div>
);

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-800">Featured Products</h2>
          <Link href="/products" className="text-primary font-medium flex items-center hover:underline">
            View All <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isFeatured={true} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
