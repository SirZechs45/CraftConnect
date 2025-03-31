import { SellerModificationRequests } from "@/components/dashboard/seller/ModificationRequests";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function SellerModificationRequestsPage() {
  return (
    <DashboardLayout role="seller">
      <div className="container py-6">
        <SellerModificationRequests />
      </div>
    </DashboardLayout>
  );
}