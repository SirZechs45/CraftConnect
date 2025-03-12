import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductForm from "@/components/seller/ProductForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  FileEdit,
  AlertCircle,
  Pencil,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SellerProducts() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "seller" && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/seller/products");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Fetch seller products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await apiRequest("GET", `/api/products?sellerId=${user.id}`);
      const data = await response.json();
      return data;
    },
    enabled: !!user,
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products", user?.id] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600">Manage your product listings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsNewProductModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  disabled={!searchQuery}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                You have {products.length} product{products.length !== 1 ? 's' : ''} in your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="max-w-xs truncate">{product.title}</div>
                          </TableCell>
                          <TableCell>
                            ${Number(product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {Number(product.quantityAvailable) > 0 ? (
                                <>
                                  {Number(product.quantityAvailable) < 5 ? (
                                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                                      Low Stock: {product.quantityAvailable}
                                    </Badge>
                                  ) : (
                                    <span>{product.quantityAvailable}</span>
                                  )}
                                </>
                              ) : (
                                <Badge variant="destructive">Out of Stock</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/products/${product.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteProduct(product)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery
                      ? "No products match your search criteria. Try adjusting your search."
                      : "You haven't added any products yet. Add your first product to start selling!"}
                  </p>
                  <Button 
                    className="mt-6"
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                      } else {
                        setIsNewProductModalOpen(true);
                      }
                    }}
                  >
                    {searchQuery ? "Clear Search" : "Add Product"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* New Product Modal */}
      <Dialog open={isNewProductModalOpen} onOpenChange={setIsNewProductModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your store. Fill in all the details to create a new listing.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSuccess={() => {
              setIsNewProductModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/products", user?.id] });
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product listing.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              onSuccess={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
                queryClient.invalidateQueries({ queryKey: ["/api/products", user?.id] });
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{selectedProduct?.title}" and remove it from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}
