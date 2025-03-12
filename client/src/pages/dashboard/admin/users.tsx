import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  Store,
  Users,
  Filter,
  UserCheck,
  UserX,
  CircleSlash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-600">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    case "seller":
      return (
        <Badge className="bg-blue-600">
          <Store className="mr-1 h-3 w-3" />
          Seller
        </Badge>
      );
    case "buyer":
      return (
        <Badge variant="secondary">
          <UserCircle className="mr-1 h-3 w-3" />
          Buyer
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default function AdminUsers() {
  const { user, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/admin/users");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}`, { role });
    },
    onSuccess: () => {
      toast({
        title: "User Role Updated",
        description: "User role has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsChangeRoleDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const handleOpenChangeRoleDialog = (user: User, defaultRole: string) => {
    setSelectedUser(user);
    setNewRole(defaultRole);
    setIsChangeRoleDialogOpen(true);
  };

  const handleChangeRole = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    }
  };

  // Filter users based on search query and role
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = searchQuery 
      ? (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Role filter from dropdown
    const roleMatch = roleFilter 
      ? user.role === roleFilter
      : true;
    
    // Tab filter
    const tabMatch = activeTab === "all" 
      ? true 
      : user.role === activeTab;
    
    return searchMatch && roleMatch && tabMatch;
  });

  // User count by role
  const buyerCount = users.filter(u => u.role === "buyer").length;
  const sellerCount = users.filter(u => u.role === "seller").length;
  const adminCount = users.filter(u => u.role === "admin").length;

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
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all users on your platform</p>
            </div>
          </div>
          
          {/* Tabs for quick filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">
                All Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="buyer">
                Buyers ({buyerCount})
              </TabsTrigger>
              <TabsTrigger value="seller">
                Sellers ({sellerCount})
              </TabsTrigger>
              <TabsTrigger value="admin">
                Admins ({adminCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search users by name, email or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={roleFilter || ""} 
                  onValueChange={(value) => setRoleFilter(value || null)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="buyer">Buyers</SelectItem>
                    <SelectItem value="seller">Sellers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter(null);
                    setActiveTab("all");
                  }}
                  disabled={!searchQuery && !roleFilter && activeTab === "all"}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenChangeRoleDialog(user, "buyer")}>
                                  <UserCircle className="mr-2 h-4 w-4" />
                                  Make Buyer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenChangeRoleDialog(user, "seller")}>
                                  <Store className="mr-2 h-4 w-4" />
                                  Make Seller
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenChangeRoleDialog(user, "admin")}>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Make Admin
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
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery || roleFilter || activeTab !== "all"
                      ? "No users match your search criteria. Try adjusting your filters."
                      : "There are no users registered on the platform yet."}
                  </p>
                  {(searchQuery || roleFilter || activeTab !== "all") && (
                    <Button 
                      className="mt-6"
                      onClick={() => {
                        setSearchQuery("");
                        setRoleFilter(null);
                        setActiveTab("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Change Role Dialog */}
      <AlertDialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the role for <span className="font-medium">{selectedUser?.name}</span>.
              This will affect what this user can do on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="font-medium">New Role</div>
              <Select
                value={newRole}
                onValueChange={setNewRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">
                    <div className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Buyer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="seller">
                    <div className="flex items-center">
                      <Store className="mr-2 h-4 w-4" />
                      <span>Seller</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleChangeRole}
              disabled={!newRole || (selectedUser && newRole === selectedUser.role)}
            >
              Update Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}
