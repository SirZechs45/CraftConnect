import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useParams } from "wouter";

// Schema for the modification request form
const modificationRequestSchema = z.object({
  requestDetails: z.string().min(10, {
    message: "Request details must be at least 10 characters.",
  }),
});

type ModificationRequestFormValues = z.infer<typeof modificationRequestSchema>;

interface ModificationRequestFormProps {
  productId: number;
  sellerId: number;
  onRequestSuccess?: () => void;
}

export function ModificationRequestForm({ productId, sellerId, onRequestSuccess }: ModificationRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Define form
  const form = useForm<ModificationRequestFormValues>({
    resolver: zodResolver(modificationRequestSchema),
    defaultValues: {
      requestDetails: "",
    },
  });

  // Submit handler
  const onSubmit = async (values: ModificationRequestFormValues) => {
    setIsSubmitting(true);
    try {
      // Send the modification request to the API
      await apiRequest('POST', '/api/product-modification-requests', {
        productId,
        sellerId,
        requestDetails: values.requestDetails,
      });
      
      // Show success message
      toast({
        title: "Request Submitted",
        description: "Your modification request has been sent to the seller.",
      });
      
      // Reset form
      form.reset();
      
      // Call the success callback if provided
      if (onRequestSuccess) {
        onRequestSuccess();
      }
    } catch (error) {
      console.error("Error submitting modification request:", error);
      toast({
        title: "Failed to Submit",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-medium mb-4">Request Product Modification</h3>
      <p className="text-muted-foreground mb-4">
        Need a change to this product? Describe what you'd like modified and the seller will respond to your request.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="requestDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the modifications you'd like (e.g., different color, size, material, or design changes)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}