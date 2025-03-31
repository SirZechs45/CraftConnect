import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Search,
  ShoppingCart,
  MessageSquare,
  Menu,
  UserCircle,
  LogOut,
  Store,
  Package,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.length;
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Explore" },
    { href: "/products?filter=categories", label: "Categories" },
  ];
  
  // Add seller dashboard link if user is a seller or admin
  if (user && (user.role === "seller" || user.role === "admin")) {
    navLinks.push({ 
      href: "/dashboard/seller", 
      label: "Sell" 
    });
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Store className="text-primary text-2xl mr-2" />
              <span className="font-serif font-semibold text-xl text-primary">
                CraftConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === link.href 
                    ? "text-primary font-medium" 
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
              <Search size={20} />
            </Button>

            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-primary relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Button */}
            {user && <NotificationsPopover />}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full focus:ring-2 focus:ring-primary p-0 h-8 w-8">
                    <span className="sr-only">Open user menu</span>
                    <UserCircle className="h-8 w-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.name}
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Profile option */}
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "seller" ? "/dashboard/seller/profile" : "/dashboard/buyer/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  
                  {/* Seller dashboard */}
                  {(user.role === "seller" || user.role === "admin") && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/seller">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/seller/products">My Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/seller/orders">Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {/* Admin dashboard */}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin/users">Manage Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin/products">Manage Products</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/auth">Login</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Menu size={24} />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-primary">ArtisanBazaar</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-3">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className={`px-3 py-2.5 rounded-md text-sm font-medium ${
                          location === link.href 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    {user && (
                      <Link 
                        href={user.role === "seller" ? "/dashboard/seller/profile" : "/dashboard/buyer/profile"}
                        className="px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                    
                    {!user && (
                      <Button asChild className="mt-4">
                        <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Login / Register
                        </Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
