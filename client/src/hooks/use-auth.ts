import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";

// Define the User type
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  profileImage?: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [location, setLocation] = useLocation();
  
  // Query the current user
  const { 
    data: user, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string, { credentials: 'include' })
      .then(res => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Redirect to login for certain protected routes when not authenticated
  useEffect(() => {
    const protectedRoutes = [
      '/dashboard',
      '/checkout',
    ];
    
    const currentRoute = location;
    const needsAuth = protectedRoutes.some(route => currentRoute.startsWith(route));
    
    if (needsAuth && isError && !isLoading) {
      setLocation('/login');
    }
    
    // Role-based route protection
    if (user) {
      if (currentRoute.startsWith('/dashboard/seller') && user.role !== 'seller') {
        setLocation('/');
      } else if (currentRoute.startsWith('/dashboard/admin') && user.role !== 'admin') {
        setLocation('/');
      } else if (currentRoute.startsWith('/dashboard/buyer') && user.role !== 'buyer') {
        setLocation('/');
      }
    }
  }, [location, isError, isLoading, user, setLocation]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError,
    error,
    refetch
  };
}
