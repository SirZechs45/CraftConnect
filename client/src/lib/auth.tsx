import React, { createContext, useState, useContext, useEffect, ReactNode, FC } from "react";
import { apiRequest, queryClient } from "./queryClient";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "buyer" | "seller" | "admin";
  profileImage?: string;
  birthday?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  receivePromotions?: boolean;
  // Seller specific fields
  businessName?: string;
  businessDescription?: string;
  gstin?: string;
  panNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  upiId?: string;
  // System fields
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUserProfile: (updatedData: Partial<User>) => Promise<User | null>;
  isAuthenticated: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  updateUserProfile: async () => null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const updateUserProfile = async (updatedData: Partial<User>): Promise<User | null> => {
    try {
      const response = await apiRequest("PATCH", "/api/users/profile", updatedData);
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);