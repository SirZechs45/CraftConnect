import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';

import { 
  ShoppingBag, 
  Package, 
  User, 
  Store, 
  LayoutDashboard, 
  LogOut, 
  ShoppingCart,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Define sidebar links based on user role
  const sidebarLinks: SidebarLink[] = [];
  
  if (user.role === 'buyer') {
    sidebarLinks.push(
      { href: '/dashboard/buyer', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { href: '/dashboard/buyer/orders', label: 'My Orders', icon: <Package className="h-5 w-5" /> }
    );
  } else if (user.role === 'seller') {
    sidebarLinks.push(
      { href: '/dashboard/seller', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { href: '/dashboard/seller/products', label: 'My Products', icon: <Store className="h-5 w-5" /> },
      { href: '/dashboard/seller/orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> }
    );
  } else if (user.role === 'admin') {
    sidebarLinks.push(
      { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { href: '/dashboard/admin/users', label: 'Users', icon: <User className="h-5 w-5" /> },
      { href: '/dashboard/admin/products', label: 'Products', icon: <Store className="h-5 w-5" /> }
    );
  }
  
  // Add shared links
  sidebarLinks.push(
    { href: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> }
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col border-r bg-white">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-4 border-b flex items-center justify-center">
              <Link href="/" className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ArtisanBazaar</span>
              </Link>
            </div>
            <div className="px-4 py-6">
              <div className="flex flex-col justify-center items-center mb-6">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a className={`flex items-center px-4 py-3 rounded-md text-sm ${location.startsWith(link.href) ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}>
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ArtisanBazaar</span>
            </Link>
          </div>
          <div className="flex items-center ml-auto space-x-3">
            <NotificationsPopover />
            <Link href="/">
              <a className="text-sm text-gray-600 hover:text-primary">Go to Store</a>
            </Link>
            <div className="md:hidden">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}