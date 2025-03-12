import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";

export default function Auth() {
  const [_, params] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Parse URL params
  const searchParams = new URLSearchParams(params);
  const defaultTab = searchParams.get("tab") || "login";
  const isSeller = searchParams.get("seller") === "true";
  const redirectTo = searchParams.get("redirect") || "/";
  
  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "seller") {
        navigate("/dashboard/seller");
      } else {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, user, navigate, redirectTo]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="max-w-md w-full px-4">
          <AuthForm 
            defaultTab={defaultTab} 
            defaultRole={isSeller ? "seller" : "buyer"} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
