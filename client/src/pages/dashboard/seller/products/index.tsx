// This is a redirect file that simply ensures the route structure is correct
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ProductsIndex() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to the main products page
    setLocation("/dashboard/seller/products");
  }, [setLocation]);
  
  return null;
}