import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminAuthGate } from "@/components/admin/admin-auth-gate";

export default function AdminPage() {
  return <AdminAuthGate><AdminDashboard /></AdminAuthGate>;
}
