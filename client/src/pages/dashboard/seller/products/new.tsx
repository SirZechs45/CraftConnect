import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import ProductForm from "@/components/seller/ProductForm";
import { useToast } from "@/hooks/use-toast";

export default function NewProduct() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || user.role !== "seller")) {
      toast({
        title: "Access Denied",
        description: "You need to be logged in as a seller to access this page.",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [user, loading, setLocation, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new handcrafted product to showcase in your store.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <ProductForm 
          onSuccess={() => {
            toast({
              title: "Product Added",
              description: "Your product has been successfully added.",
            });
            setLocation("/dashboard/seller/products");
          }}
        />
      </div>
    </div>
  );
}