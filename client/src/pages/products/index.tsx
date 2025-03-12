import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [location, params] = useLocation();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(params);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [params]);

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, searchQuery],
  });

  // Filter products based on filters
  const filteredProducts = products
    .filter(product => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price filter
      const price = Number(product.price);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort products
      switch (sortBy) {
        case "priceAsc":
          return Number(a.price) - Number(b.price);
        case "priceDesc":
          return Number(b.price) - Number(a.price);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0; // Featured or default
      }
    });

  // Categories for filtering
  const categories = [
    { value: "art", label: "Art & Paintings" },
    { value: "jewelry", label: "Jewelry" },
    { value: "clothing", label: "Clothing" },
    { value: "home_decor", label: "Home Decor" },
    { value: "gifts", label: "Gifts" },
    { value: "accessories", label: "Accessories" },
    { value: "craft_supplies", label: "Craft Supplies" },
    { value: "paper_goods", label: "Paper Goods" },
    { value: "toys", label: "Toys & Games" },
  ];

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search parameters
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("search", searchQuery);
    if (selectedCategory) searchParams.set("category", selectedCategory);
    
    const newUrl = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    setSortBy("featured");
    window.history.pushState({}, "", "/products");
  };

  const FiltersContent = () => (
    <>
      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger className="font-medium">Categories</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.value}`} 
                  checked={selectedCategory === category.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategory(category.value);
                    } else if (selectedCategory === category.value) {
                      setSelectedCategory("");
                    }
                  }}
                />
                <label 
                  htmlFor={`category-${category.value}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Price Range */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price">
          <AccordionTrigger className="font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between">
                <div className="border rounded-md p-2 w-24">
                  <div className="text-xs text-gray-500">Min</div>
                  <div>${priceRange[0]}</div>
                </div>
                <div className="border rounded-md p-2 w-24">
                  <div className="text-xs text-gray-500">Max</div>
                  <div>${priceRange[1]}</div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pb-12 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-serif font-bold text-gray-800">
              Explore Handcrafted Products
            </h1>
            <p className="mt-2 text-gray-600">
              Discover unique handicrafts created by artisans around the world
            </p>
            
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white p-6 rounded-lg shadow-sm divide-y">
                  <div className="pb-6">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary text-sm mt-1"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  </div>
                  
                  <div className="pt-6 space-y-6">
                    <FiltersContent />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="mt-6 lg:mt-0 lg:col-span-3">
              {/* Mobile Filters Toggle & Sort */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex items-center mb-3 sm:mb-0">
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="lg:hidden mr-2 flex items-center"
                      >
                        <SlidersHorizontal size={16} className="mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                        <SheetDescription>
                          Narrow down products by applying filters
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4 divide-y">
                        <FiltersContent />
                      </div>
                      <SheetFooter>
                        <Button 
                          onClick={() => {
                            handleSearch({preventDefault: () => {}} as React.FormEvent);
                            setMobileFiltersOpen(false);
                          }}
                        >
                          Apply Filters
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                      <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Selected Filters */}
              {(selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {selectedCategory && (
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                      <span className="mr-1">Category: {selectedCategory}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedCategory("")}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  
                  {searchQuery && (
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                      <span className="mr-1">Search: {searchQuery}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setSearchQuery("")}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                      <span className="mr-1">Price: ${priceRange[0]} - ${priceRange[1]}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setPriceRange([0, 1000])}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary text-sm"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}
              
              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-80 animate-pulse">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
