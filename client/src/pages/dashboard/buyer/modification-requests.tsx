import { BuyerModificationRequests } from "@/components/dashboard/buyer/ModificationRequests";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function BuyerModificationRequestsPage() {
  return (
    <DashboardLayout role="buyer">
      <div className="container py-6">
        <BuyerModificationRequests />
      </div>
    </DashboardLayout>
  );
}