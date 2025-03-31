import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

export function SellerModificationRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for the response dialog
  const [isOpen, setIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ModificationRequest | null>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<string>("approved");
  
  // Query to fetch modification requests
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['/api/product-modification-requests/seller'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Mutation to update a request
  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, sellerResponse }: { id: number, status: string, sellerResponse: string }) => {
      return apiRequest('PATCH', `/api/product-modification-requests/${id}`, { 
        status, 
        sellerResponse 
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/product-modification-requests/seller'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      
      // Show success toast
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the buyer.",
      });
      
      // Close dialog and reset state
      setIsOpen(false);
      setCurrentRequest(null);
      setResponse("");
    },
    onError: (error) => {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to send your response. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handler to open the response dialog
  const handleRespond = (request: ModificationRequest) => {
    setCurrentRequest(request);
    setResponse(request.sellerResponse || "");
    setStatus(request.status || "pending");
    setIsOpen(true);
  };
  
  // Handler to submit the response
  const handleSubmitResponse = () => {
    if (!currentRequest) return;
    
    updateRequestMutation.mutate({
      id: currentRequest.id,
      status,
      sellerResponse: response,
    });
  };
  
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
  
  if (isLoading) {
    return <div className="p-4">Loading modification requests...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">Error loading modification requests</div>;
  }
  
  if (!requests || requests.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">You don't have any product modification requests yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Product Modification Requests</h2>
      
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
          <CardContent className="pb-2">
            <div className="mb-2">
              <h4 className="font-medium">Request Details:</h4>
              <p className="whitespace-pre-line">{request.requestDetails}</p>
            </div>
            
            {request.sellerResponse && (
              <div className="mt-4">
                <h4 className="font-medium">Your Response:</h4>
                <p className="whitespace-pre-line">{request.sellerResponse}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleRespond(request)}
              variant={request.status === 'pending' ? "default" : "secondary"}
            >
              {request.status === 'pending' ? 'Respond' : 'Update Response'}
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      {/* Response Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Respond to Modification Request</DialogTitle>
            <DialogDescription>
              Provide your response to the buyer's request for product modification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="denied">Deny</SelectItem>
                  <SelectItem value="pending">Keep Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="response" className="text-sm font-medium">Your Response</label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Explain your decision or ask for more details..."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitResponse} 
              disabled={updateRequestMutation.isPending}
            >
              {updateRequestMutation.isPending ? "Sending..." : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}