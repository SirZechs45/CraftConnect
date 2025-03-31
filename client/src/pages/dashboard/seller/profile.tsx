import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ShoppingBag, Star, Users } from "lucide-react";

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }).optional(),
  businessDescription: z.string().max(500, {
    message: "Business description cannot exceed 500 characters.",
  }).optional(),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Please enter a valid GSTIN number.",
  }).optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Please enter a valid PAN number.",
  }).optional(),
  birthday: z.date().optional(),
  profileImage: z.string().optional(),
  mobileNumber: z.string().regex(/^\d{10}$/, {
    message: "Mobile number must be 10 digits.",
  }).optional(),
  address: z.string().min(10, {
    message: "Address should be at least 10 characters long."
  }).optional(),
  city: z.string().min(2, {
    message: "City name should be at least 2 characters long."
  }).optional(),
  state: z.string().min(2, {
    message: "State name should be at least 2 characters long."
  }).optional(),
  pincode: z.string().regex(/^\d{6}$/, {
    message: "Pincode must be 6 digits."
  }).optional(),
  bankAccountName: z.string().min(2, {
    message: "Account holder name must be at least 2 characters."
  }).optional(),
  bankAccountNumber: z.string().min(9, {
    message: "Account number must be at least 9 characters."
  }).optional(),
  bankIfscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "Please enter a valid IFSC code."
  }).optional(),
  bankName: z.string().min(2, {
    message: "Bank name must be at least 2 characters."
  }).optional(),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, {
    message: "Please enter a valid UPI ID."
  }).optional(),
  receivePromotions: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SellerProfile() {
  const { user, isAuthenticated, loading, updateUserProfile } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "seller" && user.role !== "admin"))) {
      navigate("/auth?redirect=/dashboard/seller/profile");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Set up form with user data as default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      businessName: "",
      businessDescription: "",
      gstin: "",
      panNumber: "",
      birthday: undefined,
      mobileNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankName: "",
      upiId: "",
      receivePromotions: false,
    }
  });

  // Update form with user data when available
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        businessName: user.businessName || "",
        businessDescription: user.businessDescription || "",
        gstin: user.gstin || "",
        panNumber: user.panNumber || "",
        birthday: user.birthday ? new Date(user.birthday) : undefined,
        profileImage: user.profileImage || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        bankAccountName: user.bankAccountName || "",
        bankAccountNumber: user.bankAccountNumber || "",
        bankIfscCode: user.bankIfscCode || "",
        bankName: user.bankName || "",
        upiId: user.upiId || "",
        receivePromotions: user.receivePromotions || false,
      };
      
      // Reset form with user data
      form.reset(userData);
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      // Convert Date objects to ISO strings for API compatibility
      const formattedValues = {
        ...values,
        // Convert birthday from Date to ISO string if it exists
        birthday: values.birthday ? values.birthday.toISOString() : undefined,
      };
      
      // Use the auth context's updateUserProfile function
      const updatedUser = await updateUserProfile(formattedValues);
      
      if (updatedUser) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 md:py-10 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Seller Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your seller profile, business information, and payment details
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile summary card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm hover:shadow transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-center md:justify-start gap-2">
                    <span>Your Profile</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </CardTitle>
                  <CardDescription className="text-center md:text-left">Summary of your seller account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-5">
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-primary/10">
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback className="text-2xl bg-primary/5">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-1 text-center w-full">
                    <h3 className="font-semibold text-xl">{user?.name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">@{user?.username || "username"}</p>
                    <p className="text-sm text-muted-foreground break-all">{user?.email || "email@example.com"}</p>
                    {user?.businessName && (
                      <p className="font-medium text-primary mt-2 border-t border-primary/10 pt-2">{user.businessName}</p>
                    )}
                  </div>
                  <Separator className="w-full" />
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Account Type</span>
                      <span className="text-sm font-semibold capitalize bg-primary/10 px-2.5 py-1 rounded-full">{user?.role || "seller"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">
                        {user?.city ? `${user.city}, ${user.state}` : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">
                        {user?.created_at ? format(new Date(user.created_at), "MMM yyyy") : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller stats card */}
              <Card className="shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/20 to-primary/5">
                  <CardTitle>Seller Statistics</CardTitle>
                  <CardDescription>Overview of your seller performance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center hover:bg-primary/20 transition-colors cursor-default">
                      <ShoppingBag className="h-6 w-6 text-primary mb-2" />
                      <span className="text-2xl font-bold">0</span>
                      <span className="text-sm text-muted-foreground">Products</span>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center hover:bg-primary/20 transition-colors cursor-default">
                      <Star className="h-6 w-6 text-primary mb-2" />
                      <span className="text-2xl font-bold">-</span>
                      <span className="text-sm text-muted-foreground">Rating</span>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center hover:bg-primary/20 transition-colors cursor-default">
                      <Users className="h-6 w-6 text-primary mb-2" />
                      <span className="text-2xl font-bold">0</span>
                      <span className="text-sm text-muted-foreground">Customers</span>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center hover:bg-primary/20 transition-colors cursor-default">
                      <ShoppingBag className="h-6 w-6 text-primary mb-2" />
                      <span className="text-2xl font-bold">0</span>
                      <span className="text-sm text-muted-foreground">Orders</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit profile form */}
            <Card className="lg:col-span-2 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-4 bg-gradient-to-r from-transparent to-primary/5">
                <CardTitle>Edit Seller Profile</CardTitle>
                <CardDescription>
                  Update your profile, business information, and payment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <div className="ml-3 h-px bg-primary/20 flex-grow"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} className="focus:border-primary" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} className="focus:border-primary" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email address" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your 10-digit mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                  >
                                    {field.value ? format(field.value, "PPP") : "Select your date of birth"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Used for account verification purposes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Business Information</h3>
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your business name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This will be displayed to customers when they view your products.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell customers about your business, products, and craftsmanship" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum 500 characters. This will appear on your seller profile page.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gstin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GSTIN</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your GSTIN" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your Goods and Services Tax Identification Number.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="panNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your PAN number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your Permanent Account Number.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Address Information</h3>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input placeholder="6-digit pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Information</h3>
                      <p className="text-sm text-muted-foreground">
                        This information is required to process payments for your sales.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bankAccountName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Holder's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account holder's name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankAccountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bank account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bankIfscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IFSC Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter IFSC code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bank name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your UPI ID" {...field} />
                            </FormControl>
                            <FormDescription>
                              Example: yourname@bankname
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <FormField
                      control={form.control}
                      name="receivePromotions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Promotional emails</FormLabel>
                            <FormDescription>
                              Receive emails about seller tools, promotions, and platform updates.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Profile
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}