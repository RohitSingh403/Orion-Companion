import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Topbar subtitle="Your productivity command center" />
      <div className="p-10 text-white">
        Dashboard Page
      </div>
    </AppLayout>
  );
}