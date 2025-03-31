import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { 
  Paintbrush, 
  Gem, 
  Shirt, 
  HomeIcon, 
  Gift, 
  MoreHorizontal,
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Store,
  BarChart2,
  Package,
  DollarSign,
  Tag
} from "lucide-react";

// Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import CategoryItem from "@/components/category/CategoryItem";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Get featured products (limited to 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 leading-tight">
                Discover Unique <span className="text-primary">Handicrafts</span> from Around the World
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Browse thousands of handmade products created by passionate artisans. Support small businesses and find treasures that tell a story.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/products">
                    Shop Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth?seller=true">
                    Become a Seller
                  </Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-500 flex-wrap">
                <div className="flex items-center mr-3">
                  <ShieldCheck className="mr-2 text-primary h-4 w-4" />
                  <span>Secure payments</span>
                </div>
                <span className="mx-3 hidden sm:block">•</span>
                <div className="flex items-center mr-3">
                  <Truck className="mr-2 text-primary h-4 w-4" />
                  <span>Global shipping</span>
                </div>
                <span className="mx-3 hidden sm:block">•</span>
                <div className="flex items-center">
                  <RotateCcw className="mr-2 text-primary h-4 w-4" />
                  <span>Easy returns</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -left-6 -top-6 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Handcrafted pottery" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1610374792793-f016b77ca51a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Handmade jewelry" 
                    className="rounded-lg shadow-lg h-56 w-full object-cover" 
                  />
                </div>
                <div className="space-y-4 mt-10">
                  <img 
                    src="https://media.istockphoto.com/id/2160842223/photo/many-wicker-baskets-on-handicraft-market-new-wickerwork-hand-made-basket-bamboo-containers.webp?a=1&b=1&s=612x612&w=0&k=20&c=dnP6x0Yp-te5ukLwPr6xE8SW88tGMCxGcmzgyLzUh1E=&auto=format&fit=crop&w=500&q=80" 
                    alt="Weaved basket" 
                    className="rounded-lg shadow-lg h-56 w-full object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Hand-painted art" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Shop by Category</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Discover amazing handcrafted items organized by category</p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategoryItem 
              icon={<Paintbrush className="text-2xl text-primary" />} 
              name="Art & Paintings" 
              href="/products?category=art" 
            />
            <CategoryItem 
              icon={<Gem className="text-2xl text-primary" />} 
              name="Jewelry" 
              href="/products?category=jewelry" 
            />
            <CategoryItem 
              icon={<Shirt className="text-2xl text-primary" />} 
              name="Clothing" 
              href="/products?category=clothing" 
            />
            <CategoryItem 
              icon={<HomeIcon className="text-2xl text-primary" />} 
              name="Home Decor" 
              href="/products?category=home_decor" 
            />
            <CategoryItem 
              icon={<Gift className="text-2xl text-primary" />} 
              name="Gifts" 
              href="/products?category=gifts" 
            />
            <CategoryItem 
              icon={<MoreHorizontal className="text-2xl text-primary" />} 
              name="More" 
              href="/products" 
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Featured Products</h2>
            <Link href="/products" className="text-primary font-medium flex items-center hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Seller Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800">Start Selling Your Handicrafts</h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands of artisans who have turned their passion into a thriving business. Our platform makes it easy to reach customers around the world.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Easy to Get Started</h3>
                    <p className="text-gray-600">Create your shop in minutes and start listing your products right away.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Global Reach</h3>
                    <p className="text-gray-600">Connect with customers from around the world interested in your crafts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Secure Payments</h3>
                    <p className="text-gray-600">Receive payments securely with our integrated payment system.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/auth?seller=true">Become a Seller</Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-start-2">
              <div className="relative">
                <div className="absolute -left-6 -top-6 w-28 h-28 bg-amber-500/20 rounded-full blur-xl"></div>
                <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-primary/10 rounded-full blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" 
                  alt="Artisan working on crafts" 
                  className="rounded-lg shadow-lg relative z-10" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-800">What Our Community Says</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied creators and shoppers on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="Customer Avatar" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h3 className="font-medium text-gray-800">Amelia Thompson</h3>
                  <p className="text-sm text-gray-600">Jewelry Seller</p>
                </div>
              </div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700">
                "Since joining ArtisanBazaar, my sales have increased by 300%. The platform makes it easy to manage my inventory and connect with customers who truly appreciate handmade jewelry."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="Customer Avatar" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h3 className="font-medium text-gray-800">Marco Rodriguez</h3>
                  <p className="text-sm text-gray-600">Buyer</p>
                </div>
              </div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(4)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" strokeWidth="1" />
                </svg>
              </div>
              <p className="text-gray-700">
                "I love being able to find unique, handcrafted items that tell a story. The customer service is excellent, and I always feel good knowing I'm supporting individual artisans and small businesses."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="Customer Avatar" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h3 className="font-medium text-gray-800">Sophia Chen</h3>
                  <p className="text-sm text-gray-600">Pottery Seller</p>
                </div>
              </div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700">
                "As a ceramics artist, I needed a platform that understood the value of handmade goods. ArtisanBazaar has been perfect - their tools make it easy to manage my shop while I focus on creating."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seller Dashboard Preview */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800">Powerful Tools for Sellers</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our seller dashboard gives you everything you need to manage your products, track orders, and grow your business.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-1 bg-primary text-white">
                      <BarChart2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Analytics Dashboard</h3>
                    <p className="text-gray-600">Track your sales, views, and customer engagement with detailed analytics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-1 bg-primary text-white">
                      <Package className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Inventory Management</h3>
                    <p className="text-gray-600">Easily update your product listings, prices, and stock levels.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-1 bg-primary text-white">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Order Processing</h3>
                    <p className="text-gray-600">Manage orders, update shipping status, and communicate with buyers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-1 bg-primary text-white">
                      <Tag className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Bulk Order Options</h3>
                    <p className="text-gray-600">Set special pricing and terms for wholesale buyers and large orders.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative lg:ml-10">
                <div className="rounded-xl bg-white shadow-xl overflow-hidden border border-gray-200">
                  <div className="p-4 bg-gray-800 text-white flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 font-medium">Seller Dashboard</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-gray-500">Sales Today</h3>
                          <Store className="text-primary h-4 w-4" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">$234</p>
                        <span className="text-xs text-green-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          12% from yesterday
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-gray-500">New Orders</h3>
                          <Package className="text-primary h-4 w-4" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">8</p>
                        <span className="text-xs text-green-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          3 more than yesterday
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
                          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">143</p>
                        <span className="text-xs text-green-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          24% increase
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Recent Orders</h3>
                        <a href="#" className="text-xs text-primary">View All</a>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <img 
                              src="https://images.unsplash.com/photo-1610374792793-f016b77ca51a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80" 
                              alt="Product thumbnail" 
                              className="w-10 h-10 rounded object-cover" 
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-800">Handmade Earrings</div>
                              <div className="text-xs text-gray-500">Order #5782 - John Smith</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">$48.99</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <img 
                              src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80" 
                              alt="Product thumbnail" 
                              className="w-10 h-10 rounded object-cover" 
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-800">Painted Canvas</div>
                              <div className="text-xs text-gray-500">Order #5781 - Amanda Lee</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">$129.00</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Shipped</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <img 
                              src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80" 
                              alt="Product thumbnail" 
                              className="w-10 h-10 rounded object-cover" 
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-800">Ceramic Bowl Set</div>
                              <div className="text-xs text-gray-500">Order #5780 - Michael Wong</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">$89.50</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Ready to Join Our Creative Community?</h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Start buying or selling unique handcrafted items today. It takes just a few minutes to get started.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="secondary" size="lg">
              <Link href="/auth">
                Create an Account
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/products">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
