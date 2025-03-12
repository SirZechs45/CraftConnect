
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Order } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Settings,
  User,
  ShoppingBag,
  Clock,
  Calendar,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=/profile");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch user orders
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile sidebar */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold">{user?.name}</h2>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                      <Badge variant="outline" className="mt-1">
                        {user?.role === 'seller' ? 'Seller' : 'Buyer'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/orders">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </Button>
                    {user?.role === 'seller' && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/seller">
                          <Package className="mr-2 h-4 w-4" />
                          Seller Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        View and manage your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Username</label>
                          <p className="font-medium">@{user?.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Account Type</label>
                          <p className="font-medium capitalize">{user?.role}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Member Since</label>
                          <p className="font-medium">
                            {user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button asChild>
                          <Link href="/settings">
                            Edit Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>
                        View your recent orders and their status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Order #{order.id}</h3>
                                  <p className="text-sm text-gray-500">
                                    {order.createdAt ? format(new Date(order.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                  </p>
                                </div>
                                <Badge className={
                                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {order.orderStatus}
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm">Total: <span className="font-medium">${parseFloat(String(order.totalAmount)).toFixed(2)}</span></p>
                              </div>
                              <div className="mt-4">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/orders/${order.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You haven't placed any orders yet.
                          </p>
                          <div className="mt-6">
                            <Button asChild>
                              <Link href="/products">
                                Browse Products
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
                            <Input value={user?.name} readOnly />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">Email</label>
                            <Input value={user?.email} readOnly />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          To update your personal information, please contact support.
                        </p>
                      </div>
                      
                      {user?.role === 'buyer' && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Become a Seller</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Want to sell your handcrafted items? Upgrade your account to a seller account.
                          </p>
                          <Button variant="outline">Request Seller Account</Button>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Change your password to keep your account secure.
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Permanently delete your account and all of your data.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
