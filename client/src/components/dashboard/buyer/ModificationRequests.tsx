import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type ModificationRequest = {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  requestDetails: string;
  status: string;
  sellerResponse: string | null;
  createdAt: string;
  updatedAt: string;
};

export function BuyerModificationRequests() {
  const [_, setLocation] = useLocation();
  
  // Query to fetch the buyer's modification requests
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['/api/product-modification-requests/buyer'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-500">Denied</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };
  
  // Handle click to navigate to product
  const handleViewProduct = (productId: number) => {
    setLocation(`/products/${productId}`);
  };
  
  if (isLoading) {
    return <div className="p-4">Loading your modification requests...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">Error loading your modification requests</div>;
  }
  
  if (!requests || requests.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">You haven't made any product modification requests yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          When viewing a product, you can request modifications such as color changes or custom designs.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Modification Requests</h2>
      
      {requests.map((request: ModificationRequest) => (
        <Card key={request.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Request #{request.id}</CardTitle>
              {getStatusBadge(request.status)}
            </div>
            <CardDescription>
              Submitted {format(new Date(request.createdAt), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium">Your Request:</h4>
              <p className="whitespace-pre-line">{request.requestDetails}</p>
            </div>
            
            {request.sellerResponse && (
              <div className="mb-4">
                <h4 className="font-medium">Seller's Response:</h4>
                <p className="whitespace-pre-line">{request.sellerResponse}</p>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => handleViewProduct(request.productId)}
              >
                View Product
              </Button>
              
              {request.status === 'approved' && (
                <Button className="ml-2">
                  Add to Cart
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}